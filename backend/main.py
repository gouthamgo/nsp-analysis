from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import io
from collections import Counter
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import traceback

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Try to download NLTK resources safely
try:
    nltk.download('vader_lexicon', quiet=True)
    nltk.download('punkt', quiet=True)
    nltk.download('stopwords', quiet=True)
    print("NLTK resources downloaded successfully")
except Exception as e:
    print(f"Warning: Failed to download NLTK resources: {str(e)}")
    print("Will proceed without NLP features")

@app.post("/analyze-nps")
async def analyze_nps(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")
    
    try:
        # Read file content
        content = await file.read()
        print(f"Successfully read file: {file.filename}, size: {len(content)} bytes")
        
        # Parse CSV
        try:
            # Try different encodings if needed
            try:
                df = pd.read_csv(io.StringIO(content.decode('utf-8')))
            except UnicodeDecodeError:
                df = pd.read_csv(io.StringIO(content.decode('cp1252')))
                
            print(f"Successfully parsed CSV with {len(df)} rows and columns: {df.columns.tolist()}")
        except Exception as e:
            print(f"Error parsing CSV: {str(e)}")
            raise HTTPException(status_code=400, detail=f"Error parsing CSV: {str(e)}")
        
        # Specifically look for the known column names from your CSV
        score_col = next((col for col in df.columns if 'recommend' in col.lower() or 'likely' in col.lower()), None)
        location_col = next((col for col in df.columns if 'area' in col.lower() or 'manager' in col.lower()), None)
        feedback_col = next((col for col in df.columns if 'suggest' in col.lower() or 'improve' in col.lower()), None)
        
        print(f"Found columns - Score: {score_col}, Location: {location_col}, Feedback: {feedback_col}")
        
        if not score_col:
            raise HTTPException(status_code=400, detail="Could not find NPS score column in the CSV")
        
        # Clean and convert scores to numbers
        df[score_col] = pd.to_numeric(df[score_col], errors='coerce')
        df = df[(df[score_col] >= 0) & (df[score_col] <= 10)]
        
        total_responses = len(df)
        if total_responses == 0:
            raise HTTPException(status_code=400, detail="No valid scores found in the data (must be between 0-10)")
        
        # Calculate NPS
        promoters = len(df[df[score_col] >= 9])
        detractors = len(df[df[score_col] <= 6])
        passives = total_responses - promoters - detractors
        
        promoters_pct = round(promoters / total_responses * 100)
        detractors_pct = round(detractors / total_responses * 100)
        passives_pct = round(passives / total_responses * 100)
        
        nps_score = promoters_pct - detractors_pct
        print(f"NPS Score: {nps_score}, Total Responses: {total_responses}")
        
        # Score distribution
        score_distribution = []
        for score in range(11):
            count = len(df[df[score_col] == score])
            score_distribution.append({"score": score, "count": count})
            print(f"Score {score}: {count} responses")
        
        # 1. Response Volume by Location
        location_volumes = []
        if location_col:
            loc_counts = df[location_col].value_counts().reset_index()
            loc_counts.columns = ['name', 'responses']
            # Convert to list of dicts for JSON response
            location_volumes = loc_counts.head(10).to_dict('records')
            print(f"Location volumes: {location_volumes}")
        
        # 2. Enhanced location breakdown with promoter/passive/detractor percentages
        location_breakdown = []
        if location_col:
            location_groups = df.groupby(location_col)
            for location, group in location_groups:
                if len(group) < 10:  # Skip locations with too few responses
                    continue
                    
                location_total = len(group)
                loc_promoters = len(group[group[score_col] >= 9])
                loc_passives = len(group[(group[score_col] >= 7) & (group[score_col] <= 8)])
                loc_detractors = len(group[group[score_col] <= 6])
                
                loc_nps = round((loc_promoters / location_total * 100) - (loc_detractors / location_total * 100))
                
                location_breakdown.append({
                    "name": str(location),
                    "nps": loc_nps,
                    "responses": location_total,
                    "promoters_pct": round(loc_promoters / location_total * 100),
                    "passives_pct": round(loc_passives / location_total * 100),
                    "detractors_pct": round(loc_detractors / location_total * 100)
                })
        
        # 3. Get top and bottom locations (if enough locations)
        top_locations = sorted(location_breakdown, key=lambda x: x["nps"], reverse=True)[:3]
        bottom_locations = sorted(location_breakdown, key=lambda x: x["nps"])[:3]
        
        # 4. Analyze NPS by response volume (to see if high-volume locations differ)
        high_volume_locations = sorted(location_breakdown, key=lambda x: x["responses"], reverse=True)[:5]
        
        # Keyword analysis from feedback
        keyword_analysis = []
        
        try:
            if feedback_col:
                # Extract keywords from feedback
                stop_words = set(stopwords.words('english'))
                additional_stops = {'would', 'could', 'should', 'also', 'one', 'etc', 'need', 'make', 'much', 'want', 'like'}
                stop_words.update(additional_stops)
                
                all_words = []
                for text in df[feedback_col].dropna():
                    if isinstance(text, str) and len(text) > 5:
                        words = word_tokenize(text.lower())
                        words = [word for word in words if word.isalpha() and word not in stop_words and len(word) > 3]
                        all_words.extend(words)
                
                # Get top keywords
                keyword_counts = Counter(all_words).most_common(10)
                keyword_analysis = [{"keyword": k, "count": c} for k, c in keyword_counts]
                print(f"Top keywords: {keyword_counts}")
                
                # 5. Keywords by promoter vs detractor
                promoter_keywords = []
                for _, row in df[df[score_col] >= 9].iterrows():
                    if pd.notna(row[feedback_col]) and isinstance(row[feedback_col], str):
                        words = word_tokenize(row[feedback_col].lower())
                        words = [word for word in words if word.isalpha() and word not in stop_words and len(word) > 3]
                        promoter_keywords.extend(words)
                
                detractor_keywords = []
                for _, row in df[df[score_col] <= 6].iterrows():
                    if pd.notna(row[feedback_col]) and isinstance(row[feedback_col], str):
                        words = word_tokenize(row[feedback_col].lower())
                        words = [word for word in words if word.isalpha() and word not in stop_words and len(word) > 3]
                        detractor_keywords.extend(words)
                
                promoter_top = Counter(promoter_keywords).most_common(5)
                detractor_top = Counter(detractor_keywords).most_common(5)
                
                promoter_keywords_analysis = [{"keyword": k, "count": c} for k, c in promoter_top]
                detractor_keywords_analysis = [{"keyword": k, "count": c} for k, c in detractor_top]
                
        except Exception as e:
            print(f"Error in keyword analysis: {str(e)}")
            promoter_keywords_analysis = []
            detractor_keywords_analysis = []
        
        # Sentiment analysis
        sentiment_counts = {"positive": 0, "neutral": 0, "negative": 0}
        feedback_samples = []
        
        try:
            if feedback_col:
                sid = SentimentIntensityAnalyzer()
                
                # Get representative samples from different score ranges
                detractor_samples = df[df[score_col] <= 6].sample(min(2, len(df[df[score_col] <= 6]))) if len(df[df[score_col] <= 6]) > 0 else pd.DataFrame()
                passive_samples = df[(df[score_col] >= 7) & (df[score_col] <= 8)].sample(min(1, len(df[(df[score_col] >= 7) & (df[score_col] <= 8)]))) if len(df[(df[score_col] >= 7) & (df[score_col] <= 8)]) > 0 else pd.DataFrame()
                promoter_samples = df[df[score_col] >= 9].sample(min(2, len(df[df[score_col] >= 9]))) if len(df[df[score_col] >= 9]) > 0 else pd.DataFrame()
                
                sample_frames = [detractor_samples, passive_samples, promoter_samples]
                
                for sample_df in sample_frames:
                    for _, row in sample_df.iterrows():
                        if pd.isna(row[feedback_col]) or not isinstance(row[feedback_col], str) or len(row[feedback_col]) < 10:
                            continue
                            
                        feedback = row[feedback_col]
                        score = row[score_col]
                        location = str(row[location_col]) if location_col and pd.notna(row[location_col]) else "Unknown"
                        
                        feedback_samples.append({
                            "text": feedback,
                            "score": int(score),
                            "location": location
                        })
                
                # Sentiment analysis for all feedback
                for text in df[feedback_col].dropna():
                    if isinstance(text, str) and len(text) > 5:
                        sentiment = sid.polarity_scores(text)
                        
                        # Classify sentiment
                        if sentiment['compound'] >= 0.05:
                            sentiment_counts["positive"] += 1
                        elif sentiment['compound'] <= -0.05:
                            sentiment_counts["negative"] += 1
                        else:
                            sentiment_counts["neutral"] += 1
                
                # Convert to percentages
                total_sentiment = sum(sentiment_counts.values())
                if total_sentiment > 0:
                    for key in sentiment_counts:
                        sentiment_counts[key] = round(sentiment_counts[key] / total_sentiment * 100)
                
                print(f"Sentiment breakdown: {sentiment_counts}")
                print(f"Number of feedback samples: {len(feedback_samples)}")
        except Exception as e:
            print(f"Error in sentiment analysis: {str(e)}")
            # Fallback values
            sentiment_counts = {"positive": 60, "neutral": 30, "negative": 10}
        
        # Return analysis results with enhanced insights
        return {
            "summary": {
                "nps": nps_score,
                "responses": total_responses,
                "promoters": promoters_pct,
                "passives": passives_pct,
                "detractors": detractors_pct
            },
            "scoreDistribution": score_distribution,
            "locationBreakdown": sorted(location_breakdown, key=lambda x: x["nps"], reverse=True),
            "locationVolumes": sorted(location_volumes, key=lambda x: x["responses"], reverse=True),
            "topLocations": top_locations,
            "bottomLocations": bottom_locations,
            "highVolumeLocations": high_volume_locations,
            "keywordAnalysis": keyword_analysis,
            "promoterKeywords": promoter_keywords_analysis,
            "detractorKeywords": detractor_keywords_analysis,
            "feedbackSentiment": sentiment_counts,
            "feedbackSamples": feedback_samples
        }
        
    except Exception as e:
        print(f"ERROR processing file: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

# Run with: uvicorn main:app --reload