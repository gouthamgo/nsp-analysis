// components/NPSDashboard.js
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, RadarChart, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LabelList
} from 'recharts';

// Add imports for the new components
import FeedbackCategories from './FeedbackCategories';
import AspectSentiment from './AspectSentiment';
import NPSDrivers from './NPSDrivers';


const NPSDashboard = ({ data }) => {
  const { 
    summary, 
    scoreDistribution, 
    locationVolumes, 
    topLocations, 
    bottomLocations,
    keywordAnalysis, 
    promoterKeywords,
    detractorKeywords,
    feedbackSentiment, 
    feedbackSamples,
    topics,
    advancedSentiment
  } = data;
  
  const getNpsColorClass = (score) => {
    if (score >= 50) return 'text-green';
    if (score >= 0) return 'text-yellow';
    return 'text-red';
  };
  
  const getNpsLabel = (score) => {
    if (score >= 70) return 'Excellent';
    if (score >= 50) return 'Great';
    if (score >= 30) return 'Good';
    if (score >= 0) return 'Needs Improvement';
    return 'Critical Attention Required';
  };
  
  const pieColors = ['#10B981', '#94A3B8', '#EF4444']; // green, gray, red
  const emotionColors = ['#10B981', '#3B82F6', '#EF4444', '#F59E0B', '#8B5CF6']; // green, blue, red, amber, purple
  
  return (
    <div>
      {/* NPS Summary and Respondent Breakdown */}
      <div className="grid grid-cols-1 grid-cols-3">
        <div className="card">
          <h3 className="card-title">NPS Score</h3>
          <div className="nps-score-container">
            <span className={`nps-score ${getNpsColorClass(summary.nps)}`}>
              {summary.nps}
            </span>
            <div className="nps-context">
              <div className="nps-label">{getNpsLabel(summary.nps)}</div>
              <p className="text-sm text-gray mt-1">
                Based on {summary.responses.toLocaleString()} responses
              </p>
              <p className="nps-calculation">
                {summary.promoters}% Promoters − {summary.detractors}% Detractors = {summary.nps} NPS
              </p>
            </div>
          </div>
        </div>
        
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <h3 className="card-title">Respondent Breakdown</h3>
          <div className="progress-container">
            <div 
              className="progress-segment bg-green" 
              style={{ width: `${summary.promoters}%` }}
            >
              {summary.promoters}%
            </div>
            <div 
              className="progress-segment bg-yellow" 
              style={{ width: `${summary.passives}%` }}
            >
              {summary.passives}%
            </div>
            <div 
              className="progress-segment bg-red" 
              style={{ width: `${summary.detractors}%` }}
            >
              {summary.detractors}%
            </div>
          </div>
          <div className="legend">
            <div className="legend-item">
              <span className="legend-color bg-green"></span>
              <div>
                <div>Promoters (9-10)</div>
                <div className="legend-count">
                  {Math.round(summary.responses * summary.promoters / 100).toLocaleString()} respondents
                </div>
              </div>
            </div>
            <div className="legend-item">
              <span className="legend-color bg-yellow"></span>
              <div>
                <div>Passives (7-8)</div>
                <div className="legend-count">
                  {Math.round(summary.responses * summary.passives / 100).toLocaleString()} respondents
                </div>
              </div>
            </div>
            <div className="legend-item">
              <span className="legend-color bg-red"></span>
              <div>
                <div>Detractors (0-6)</div>
                <div className="legend-count">
                  {Math.round(summary.responses * summary.detractors / 100).toLocaleString()} respondents
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Score Distribution */}
      <div className="card">
        <h3 className="card-title">Score Distribution</h3>
        <p className="chart-subtitle">
          Distribution of {summary.responses.toLocaleString()} responses across score range 0-10
        </p>
        
        <div style={{ height: '250px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scoreDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="score" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value.toLocaleString()} responses`, 'Count']} />
              <Bar dataKey="count" name="Responses">
                {scoreDistribution.map((entry, index) => {
                  let color = '#EF4444'; // red for 0-6
                  if (entry.score >= 9) color = '#10B981'; // green for 9-10
                  else if (entry.score >= 7) color = '#F59E0B'; // amber for 7-8
                  
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
                <LabelList 
                  dataKey="count" 
                  position="top" 
                  formatter={(value) => value.toLocaleString()} 
                  style={{ fill: '#333', fontSize: '12px' }} 
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-summary">
          <div className="summary-stat">
            <span className="stat-label">Total:</span>
            <span className="stat-value">
              {scoreDistribution.reduce((sum, item) => sum + item.count, 0).toLocaleString()} responses
            </span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Most common:</span>
            <span className="stat-value">
              Score {scoreDistribution.sort((a, b) => b.count - a.count)[0].score} 
              ({scoreDistribution.sort((a, b) => b.count - a.count)[0].count.toLocaleString()} responses)
            </span>
          </div>
        </div>
      </div>
      
      {/* Topic Analysis Section */}
      {topics && topics.length > 0 && (
        <div className="card">
          <h3 className="card-title">Topic Analysis</h3>
          <p className="chart-subtitle">Key themes identified in customer feedback</p>
          
          <div className="grid grid-cols-1 grid-cols-2">
            <div style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topics}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({name, percent}) => `${name.split(':')[0]}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {topics.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={`#${Math.floor((index * 4311 + 5437) % 16777215).toString(16)}`} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `${value.toLocaleString()} (${((value / summary.responses) * 100).toFixed(1)}%)`, 
                      props.payload.name
                    ]} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-2">Topic Details</h4>
              <div className="topic-details">
                {topics.map((topic, index) => (
                  <div key={index} className="topic-item">
                    <div className="topic-header">
                      <div className="topic-name">{topic.name}</div>
                      <div className="topic-stats">
                        <span className="topic-count">{topic.count.toLocaleString()} responses</span>
                        <span className="topic-percent">
                          ({((topic.count / summary.responses) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                    <div className="topic-words">
                      {topic.top_words.slice(0, 5).map((word, wordIndex) => (
                        <span key={wordIndex} className="topic-word">{word}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="topic-insight">
            <div className="insight-title">Key Topic Insight</div>
            <div className="insight-content">
              {topics.length > 0 && `"${topics[0].name}" is the most discussed topic, representing 
              ${((topics[0].count / summary.responses) * 100).toFixed(1)}% of all responses. 
              The top 3 topics cover ${((topics.slice(0, 3).reduce((sum, t) => sum + t.count, 0) / summary.responses) * 100).toFixed(1)}% 
              of all customer feedback.`}
            </div>
          </div>
        </div>
      )}

      {/* Feedback Categories */}
{data.categoryDistribution && data.categoryDistribution.length > 0 && (
  <FeedbackCategories 
    categoryData={data.categoryDistribution} 
    categorizedFeedback={data.categorizedFeedback || []} 
  />
)}

{/* Aspect-Based Sentiment Analysis */}
{data.aspectSentiment && data.aspectSentiment.sorted_aspects && 
 data.aspectSentiment.sorted_aspects.length > 0 && (
  <AspectSentiment aspectData={data.aspectSentiment} />
)}

{/* NPS Drivers Analysis */}
{data.npsDrivers && ((data.npsDrivers.keyword_impact.positive && 
                    data.npsDrivers.keyword_impact.positive.length > 0) || 
                   (data.npsDrivers.keyword_impact.negative && 
                    data.npsDrivers.keyword_impact.negative.length > 0)) && (
  <NPSDrivers driversData={data.npsDrivers} />
)}
      
      {/* Advanced Sentiment Analysis */}
      {advancedSentiment && (
        <div className="card">
          <h3 className="card-title">Advanced Sentiment Analysis</h3>
          <p className="chart-subtitle">Analysis of emotional tone and intensity in customer feedback</p>
          
          <div className="grid grid-cols-1 grid-cols-2">
            {/* Emotion Distribution Chart */}
            <div>
              <h4 className="text-sm font-semibold mb-2">Emotion Distribution</h4>
              <div style={{ height: '250px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart 
                    outerRadius={90} 
                    data={[
                      {
                        emotion: 'Joy',
                        value: advancedSentiment.emotions.joy,
                        fullMark: 100
                      },
                      {
                        emotion: 'Sadness',
                        value: advancedSentiment.emotions.sadness,
                        fullMark: 100
                      },
                      {
                        emotion: 'Anger',
                        value: advancedSentiment.emotions.anger,
                        fullMark: 100
                      },
                      {
                        emotion: 'Surprise',
                        value: advancedSentiment.emotions.surprise,
                        fullMark: 100
                      },
                      {
                        emotion: 'Fear',
                        value: advancedSentiment.emotions.fear,
                        fullMark: 100
                      }
                    ]}
                  >
                    <PolarGrid />
                    <PolarAngleAxis dataKey="emotion" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
                    <Radar 
                      name="Emotions" 
                      dataKey="value" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.6} 
                    />
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="emotion-summary">
                <div className="stat-item">
                  <span className="stat-label">Primary emotion:</span>
                  <span className="stat-value">
                    {Object.entries(advancedSentiment.emotions)
                      .sort(([,a], [,b]) => b - a)[0][0].charAt(0).toUpperCase() + 
                      Object.entries(advancedSentiment.emotions)
                        .sort(([,a], [,b]) => b - a)[0][0].slice(1)} 
                    ({Object.entries(advancedSentiment.emotions)
                      .sort(([,a], [,b]) => b - a)[0][1]}%)
                  </span>
                </div>
              </div>
            </div>
            
            {/* Sentiment Intensity Chart */}
            <div>
              <h4 className="text-sm font-semibold mb-2">Sentiment Intensity</h4>
              <div style={{ height: '250px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={[
                      { name: "Strong Positive", value: advancedSentiment.intensity_distribution.strong_positive, color: "#10B981" },
                      { name: "Moderate Positive", value: advancedSentiment.intensity_distribution.moderate_positive, color: "#34D399" },
                      { name: "Neutral", value: advancedSentiment.intensity_distribution.neutral, color: "#94A3B8" },
                      { name: "Moderate Negative", value: advancedSentiment.intensity_distribution.moderate_negative, color: "#F87171" },
                      { name: "Strong Negative", value: advancedSentiment.intensity_distribution.strong_negative, color: "#EF4444" }
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={120} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                    <Bar dataKey="value" name="Percentage">
                      {[0, 1, 2, 3, 4].map((index) => (
                        <Cell key={`cell-${index}`} fill={[
                          "#10B981", "#34D399", "#94A3B8", "#F87171", "#EF4444"
                        ][index]} />
                      ))}
                      {/* Add label list to show percentages on bars */}
                      <LabelList 
                        dataKey="value" 
                        position="right" 
                        formatter={(value) => `${value}%`} 
                        style={{ fill: '#333', fontSize: '12px', fontWeight: 500 }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="sentiment-summary">
                <div className="stat-item">
                  <span className="stat-label">Positive sentiment:</span>
                  <span className="stat-value">
                    {advancedSentiment.intensity_distribution.strong_positive + 
                     advancedSentiment.intensity_distribution.moderate_positive}%
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Negative sentiment:</span>
                  <span className="stat-value">
                    {advancedSentiment.intensity_distribution.strong_negative + 
                     advancedSentiment.intensity_distribution.moderate_negative}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="sentiment-insight-box">
            <h4 className="insight-title">Key Insight</h4>
            <p className="insight-content">
              {(() => {
                const positiveSentiment = advancedSentiment.intensity_distribution.strong_positive + 
                                         advancedSentiment.intensity_distribution.moderate_positive;
                const negativeSentiment = advancedSentiment.intensity_distribution.strong_negative + 
                                         advancedSentiment.intensity_distribution.moderate_negative;
                const primaryEmotion = Object.entries(advancedSentiment.emotions)
                                      .sort(([,a], [,b]) => b - a)[0][0];
                
                if (positiveSentiment > 60) {
                  return `Customer feedback is predominantly positive (${positiveSentiment}%), with '${primaryEmotion}' being the most detected emotion. This indicates strong customer satisfaction with your products/services.`;
                } else if (positiveSentiment > negativeSentiment) {
                  return `Customer feedback leans positive (${positiveSentiment}% vs ${negativeSentiment}% negative), with '${primaryEmotion}' being the most detected emotion. There's room for improvement while maintaining current strengths.`;
                } else if (negativeSentiment > positiveSentiment) {
                  return `Customer feedback leans negative (${negativeSentiment}% vs ${positiveSentiment}% positive), with '${primaryEmotion}' being the most detected emotion. Consider addressing key issues mentioned in the detractor feedback.`;
                } else {
                  return `Customer feedback is mixed, with '${primaryEmotion}' being the most detected emotion. Focus on converting neutral sentiment (${advancedSentiment.intensity_distribution.neutral}%) to positive by addressing common feedback themes.`;
                }
              })()}
            </p>
          </div>
        </div>
      )}

      {/* Location Analysis */}
      <div className="grid grid-cols-1 grid-cols-2">
        {locationVolumes && locationVolumes.length > 0 && (
          <div className="card">
            <h3 className="card-title">Response Volume by Location</h3>
            <p className="chart-subtitle">Total of {locationVolumes.length} locations with responses</p>
            
            <div style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={locationVolumes.slice(0, 7)} 
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip formatter={(value) => [`${value.toLocaleString()}`, 'Responses']} />
                  <Bar dataKey="responses" fill="#3B82F6" name="Responses">
                    <LabelList 
                      dataKey="responses" 
                      position="right" 
                      formatter={(value) => value.toLocaleString()} 
                      style={{ fill: '#333', fontSize: '12px' }} 
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="chart-summary">
              <div className="summary-stat">
                <span className="stat-label">Total:</span>
                <span className="stat-value">
                  {locationVolumes.reduce((sum, loc) => sum + loc.responses, 0).toLocaleString()} responses
                </span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">Highest:</span>
                <span className="stat-value">
                  {locationVolumes.length > 0 ? 
                    `${locationVolumes[0].name}: ${locationVolumes[0].responses.toLocaleString()}` : '-'}
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* Top vs Bottom Locations */}
        {topLocations && topLocations.length > 0 && bottomLocations && bottomLocations.length > 0 && (
          <div className="card">
            <h3 className="card-title">Top vs Bottom Locations by NPS</h3>
            <p className="chart-subtitle">Highest and lowest performing locations</p>
            
            <div style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={[...topLocations, ...bottomLocations]} 
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[-100, 100]} />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip formatter={(value) => [`${value}`, 'NPS Score']} />
                  <Bar dataKey="nps" name="NPS Score">
                    {[...topLocations, ...bottomLocations].map((entry, index) => {
                      let color = '#EF4444'; // red
                      if (entry.nps >= 50) color = '#10B981'; // green
                      else if (entry.nps >= 0) color = '#F59E0B'; // amber
                      
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                    <LabelList 
                      dataKey="nps" 
                      position="right" 
                      formatter={(value) => `${value}%`} 
                      style={{ fill: '#333', fontSize: '12px' }} 
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="chart-summary">
              <div className="summary-stat">
                <span className="stat-label">Total:</span>
                <span className="stat-value">
                  {[...topLocations, ...bottomLocations].reduce((sum, loc) => sum + loc.responses, 0).toLocaleString()} responses
                </span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">Highest NPS:</span>
                <span className="stat-value">
                  {topLocations.length > 0 ? `${topLocations[0].name}: ${topLocations[0].nps}%` : '-'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Promoter vs Detractor Keywords */}
      <div className="grid grid-cols-1 grid-cols-2">
        {promoterKeywords && promoterKeywords.length > 0 && (
          <div className="card">
            <h3 className="card-title">What Promoters Talk About</h3>
            <p className="chart-subtitle">Most mentioned keywords in positive feedback</p>
            
            <div style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  layout="vertical" 
                  data={promoterKeywords}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="keyword" type="category" width={80} />
                  <Tooltip formatter={(value) => [`${value.toLocaleString()}`, 'Mentions']} />
                  <Bar dataKey="count" fill="#10B981" name="Mentions">
                    <LabelList 
                      dataKey="count" 
                      position="right" 
                      formatter={(value) => value.toLocaleString()} 
                      style={{ fill: '#333', fontSize: '12px' }} 
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="chart-summary">
              <div className="summary-stat">
                <span className="stat-label">Total mentions:</span>
                <span className="stat-value">
                  {promoterKeywords.reduce((sum, kw) => sum + kw.count, 0).toLocaleString()}
                </span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">Top keyword:</span>
                <span className="stat-value">
                  {promoterKeywords.length > 0 ? 
                    `"${promoterKeywords[0].keyword}": ${promoterKeywords[0].count.toLocaleString()} mentions` : '-'}
                </span>
              </div>
            </div>
          </div>
        )}
        
        {detractorKeywords && detractorKeywords.length > 0 && (
          <div className="card">
            <h3 className="card-title">What Detractors Talk About</h3>
            <p className="chart-subtitle">Most mentioned keywords in negative feedback</p>
            
            <div style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  layout="vertical" 
                  data={detractorKeywords}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="keyword" type="category" width={80} />
                  <Tooltip formatter={(value) => [`${value.toLocaleString()}`, 'Mentions']} />
                  <Bar dataKey="count" fill="#EF4444" name="Mentions">
                    <LabelList 
                      dataKey="count" 
                      position="right" 
                      formatter={(value) => value.toLocaleString()} 
                      style={{ fill: '#333', fontSize: '12px' }} 
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="chart-summary">
              <div className="summary-stat">
                <span className="stat-label">Total mentions:</span>
                <span className="stat-value">
                  {detractorKeywords.reduce((sum, kw) => sum + kw.count, 0).toLocaleString()}
                </span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">Top keyword:</span>
                <span className="stat-value">
                  {detractorKeywords.length > 0 ? 
                    `"${detractorKeywords[0].keyword}": ${detractorKeywords[0].count.toLocaleString()} mentions` : '-'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Sentiment Analysis & Feedback Samples */}
      <div className="grid grid-cols-1 grid-cols-2">
        <div className="card">
          <h3 className="card-title">Feedback Sentiment</h3>
          <p className="chart-subtitle">Overall emotional tone of customer feedback</p>
          
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Positive', value: feedbackSentiment.positive },
                    { name: 'Neutral', value: feedbackSentiment.neutral },
                    { name: 'Negative', value: feedbackSentiment.negative }
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {[0, 1, 2].map((index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="chart-summary">
            <div className="summary-stat">
              <span className="stat-label">Sentiment ratio:</span>
              <span className="stat-value">
                {feedbackSentiment.positive}% positive : {feedbackSentiment.neutral}% neutral : {feedbackSentiment.negative}% negative
              </span>
            </div>
          </div>
        </div>
        
        {feedbackSamples && feedbackSamples.length > 0 && (
  <div className="card">
    <h3 className="card-title">Notable Feedback</h3>
    <p className="chart-subtitle">Representative samples from customers</p>
    
    {/* Remove the max-height constraint */}
    <div className="feedback-list-no-scroll">
      {feedbackSamples.map((feedback, index) => {
        let feedbackClass = 'feedback-item-detractor';
        let scoreLabel = 'Detractor';
        
        if (feedback.score >= 9) {
          feedbackClass = 'feedback-item-promoter';
          scoreLabel = 'Promoter';
        } else if (feedback.score >= 7) {
          feedbackClass = 'feedback-item-passive';
          scoreLabel = 'Passive';
        }
        
        return (
          <div key={index} className={`feedback-item ${feedbackClass}`}>
            <p className="text-sm">"{feedback.text}"</p>
            <div className="feedback-meta">
              <span>Score: {feedback.score} ({scoreLabel})</span>
              <span>{feedback.location}</span>
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}
      </div>
    </div>
  );
};

export default NPSDashboard;