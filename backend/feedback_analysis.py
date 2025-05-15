# feedback_analysis.py

def categorize_feedback(feedback_texts):
    """
    Categorize feedback into predefined categories using a rule-based approach.
    
    Args:
        feedback_texts: List of feedback text strings to categorize
        
    Returns:
        List of dictionaries with categorized feedback
    """
    # Define categories and their associated keywords
    categories = {
        "Product Quality": ["quality", "material", "fabric", "broke", "damaged", "poor", "excellent", 
                          "great", "terrible", "durability", "durable", "flimsy", "sturdy", "well made"],
        
        "Customer Service": ["service", "staff", "helpful", "rude", "polite", "responsive", "assistance",
                           "support", "representative", "agent", "manager", "helped", "call", "center", 
                           "phone", "email", "chat", "contact"],
        
        "Delivery & Shipping": ["delivery", "shipping", "late", "delay", "arrived", "package", "box", 
                              "damaged", "courier", "shipment", "tracking", "waiting", "received", 
                              "dispatched", "post", "mail", "quick", "slow", "fast"],
        
        "Price & Value": ["price", "expensive", "cheap", "value", "worth", "cost", "affordable", 
                        "overpriced", "discount", "sale", "deal", "bargain", "money", "paid", 
                        "refund", "return", "policy"],
        
        "Product Fit & Size": ["size", "fit", "tight", "loose", "large", "small", "big", "petite", 
                             "measurement", "dimension", "length", "width", "height", "tall", "short"],
        
        "Website & App": ["website", "app", "site", "online", "login", "account", "password", "interface", 
                        "navigate", "search", "filter", "checkout", "cart", "payment", "transaction", 
                        "user", "experience"]
    }
    
    # Process and categorize each feedback
    results = []
    
    for text in feedback_texts:
        if not isinstance(text, str) or len(text) < 5:
            # Skip invalid texts
            results.append({"text": text, "primary_category": "Uncategorized", "secondary_category": None, 
                        "categories": [], "category_scores": {}})
            continue
            
        # Convert to lowercase
        processed_text = text.lower()
        
        # Count category keyword matches
        category_scores = {}
        for category, keywords in categories.items():
            score = 0
            for keyword in keywords:
                if keyword in processed_text:
                    # Add 1 for each matching keyword
                    score += 1
            
            if score > 0:
                category_scores[category] = score
        
        # Sort categories by score
        sorted_categories = sorted(category_scores.items(), key=lambda x: x[1], reverse=True)
        all_categories = [cat for cat, score in sorted_categories]
        
        # Determine primary and secondary categories
        primary_category = all_categories[0] if all_categories else "General Feedback"
        secondary_category = all_categories[1] if len(all_categories) > 1 else None
        
        # Add result
        results.append({
            "text": text,
            "primary_category": primary_category,
            "secondary_category": secondary_category,
            "categories": all_categories,
            "category_scores": category_scores
        })
    
    return results

def analyze_aspect_sentiment(feedback_texts):
    """
    Extract sentiment related to specific aspects in customer feedback.
    
    Args:
        feedback_texts: List of feedback text strings
        
    Returns:
        Dictionary with aspect-based sentiment analysis results
    """
    import re
    from nltk.sentiment import SentimentIntensityAnalyzer
    
    # Define common aspects for retail/product feedback
    aspects = {
        "product": ["product", "item", "quality", "material", "fabric"],
        "price": ["price", "cost", "expensive", "cheap", "value", "worth", "affordable"],
        "service": ["service", "staff", "support", "representative", "helpful", "assistance"],
        "delivery": ["delivery", "shipping", "arrive", "arrived", "package", "shipment"],
        "website": ["website", "app", "online", "site", "checkout", "cart"],
        "returns": ["return", "refund", "exchange", "policy"]
    }
    
    # Initialize results structure
    results = {
        "aspect_sentiments": {aspect: {"positive": 0, "neutral": 0, "negative": 0, "total": 0} 
                            for aspect in aspects},
        "aspect_mentions": {aspect: 0 for aspect in aspects},
        "samples": {aspect: [] for aspect in aspects},
        "sorted_aspects": []
    }
    
    try:
        # Initialize sentiment analyzer
        sid = SentimentIntensityAnalyzer()
        
        # Process each feedback text
        for text in feedback_texts:
            if not isinstance(text, str) or len(text) < 5:
                continue
                
            # Convert to lowercase for analysis
            text_lower = text.lower()
            
            # Split into sentences for more accurate aspect-level sentiment
            sentences = re.split(r'(?<=[.!?])\s+', text)
            
            # Check each aspect in each sentence
            for aspect, keywords in aspects.items():
                for sentence in sentences:
                    # Check if any aspect keyword is in the sentence
                    if any(keyword in sentence.lower() for keyword in keywords):
                        # Analyze sentiment of this sentence
                        sentiment = sid.polarity_scores(sentence)
                        
                        # Classify sentiment
                        if sentiment['compound'] >= 0.05:
                            sentiment_category = "positive"
                        elif sentiment['compound'] <= -0.05:
                            sentiment_category = "negative"
                        else:
                            sentiment_category = "neutral"
                        
                        # Update counts
                        results["aspect_mentions"][aspect] += 1
                        results["aspect_sentiments"][aspect][sentiment_category] += 1
                        results["aspect_sentiments"][aspect]["total"] += 1
                        
                        # Store sample (up to 3 per aspect)
                        if len(results["samples"][aspect]) < 3:
                            results["samples"][aspect].append({
                                "text": sentence,
                                "sentiment": sentiment_category,
                                "score": sentiment['compound']
                            })
                        break  # Count each aspect only once per sentence
        
        # Calculate sentiment percentages for each aspect
        for aspect, counts in results["aspect_sentiments"].items():
            total = counts["total"]
            if total > 0:
                results["aspect_sentiments"][aspect]["positive_pct"] = round((counts["positive"] / total) * 100)
                results["aspect_sentiments"][aspect]["neutral_pct"] = round((counts["neutral"] / total) * 100)
                results["aspect_sentiments"][aspect]["negative_pct"] = round((counts["negative"] / total) * 100)
                # Calculate net sentiment (-100 to 100 scale)
                results["aspect_sentiments"][aspect]["net_sentiment"] = round(
                    ((counts["positive"] - counts["negative"]) / total) * 100
                )
            else:
                results["aspect_sentiments"][aspect]["positive_pct"] = 0
                results["aspect_sentiments"][aspect]["neutral_pct"] = 0
                results["aspect_sentiments"][aspect]["negative_pct"] = 0
                results["aspect_sentiments"][aspect]["net_sentiment"] = 0
        
        # Sort aspects by mention count for presentation
        results["sorted_aspects"] = sorted(
            aspects.keys(), 
            key=lambda x: results["aspect_mentions"][x], 
            reverse=True
        )
        
    except Exception as e:
        print(f"Error in aspect-based sentiment analysis: {str(e)}")
    
    return results

