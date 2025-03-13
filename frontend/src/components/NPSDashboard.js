import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, RadarChart, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

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
    // New data props
    topics,
    advancedSentiment
  } = data;
  
  const getNpsColorClass = (score) => {
    if (score >= 50) return 'text-green';
    if (score >= 0) return 'text-yellow';
    return 'text-red';
  };
  
  const pieColors = ['#10B981', '#94A3B8', '#EF4444']; // green, gray, red
  const emotionColors = ['#10B981', '#3B82F6', '#EF4444', '#F59E0B', '#8B5CF6']; // green, blue, red, amber, purple
  
  return (
    <div>
      {/* NPS Summary and Respondent Breakdown - Keep as is */}
      <div className="grid grid-cols-1 grid-cols-3">
        <div className="card">
          <h3 className="card-title">NPS Score</h3>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span className={`nps-score ${getNpsColorClass(summary.nps)}`}>
              {summary.nps}
            </span>
            <span className="ml-2 text-gray">/ 100</span>
          </div>
          <p className="text-sm text-gray mt-1">
            Based on {summary.responses} responses
          </p>
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
              Promoters (9-10)
            </div>
            <div className="legend-item">
              <span className="legend-color bg-yellow"></span>
              Passives (7-8)
            </div>
            <div className="legend-item">
              <span className="legend-color bg-red"></span>
              Detractors (0-6)
            </div>
          </div>
        </div>
      </div>
      
      {/* Score Distribution - Keep as is */}
      <div className="card">
        <h3 className="card-title">Score Distribution</h3>
        <div style={{ height: '250px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scoreDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="score" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} responses`, 'Count']} />
              <Bar dataKey="count" name="Responses">
                {scoreDistribution.map((entry, index) => {
                  let color = '#EF4444'; // red for 0-6
                  if (entry.score >= 9) color = '#10B981'; // green for 9-10
                  else if (entry.score >= 7) color = '#F59E0B'; // amber for 7-8
                  
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* NEW: Topic Analysis Section */}
      {topics && topics.length > 0 && (
        <div className="card">
          <h3 className="card-title">Topic Analysis</h3>
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
                      <Cell key={`cell-${index}`} fill={`#${Math.floor((index * 4311 + 5437) % 16777215).toString(16)}`} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [value, props.payload.name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2">Topic Details</h4>
              <div className="overflow-y-auto" style={{ maxHeight: '220px' }}>
                {topics.map((topic, index) => (
                  <div key={index} className="mb-3">
                    <p className="font-medium">{topic.name}</p>
                    <p className="text-sm text-gray">
                      Top words: {topic.top_words.slice(0, 5).join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* NEW: Advanced Sentiment Analysis */}
      {advancedSentiment && (
        <div className="card">
          <h3 className="card-title">Advanced Sentiment Analysis</h3>
          <div className="grid grid-cols-1 grid-cols-2">
            {/* Emotion Distribution */}
            <div>
              <h4 className="text-sm font-semibold mb-2">Emotion Distribution</h4>
              <div style={{ height: '250px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} data={[
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
                  ]}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="emotion" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Emotions" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Sentiment Intensity */}
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
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                    <Bar dataKey="value" name="Percentage">
                      {[0, 1, 2, 3, 4].map((index) => (
                        <Cell key={`cell-${index}`} fill={[
                          "#10B981", "#34D399", "#94A3B8", "#F87171", "#EF4444"
                        ][index]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Location Analysis - Keep as is */}
      <div className="grid grid-cols-1 grid-cols-2">
        {locationVolumes && locationVolumes.length > 0 && (
          <div className="card">
            <h3 className="card-title">Response Volume by Location</h3>
            <div style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={locationVolumes.slice(0, 7)} 
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip formatter={(value) => [`${value}`, 'Responses']} />
                  <Bar dataKey="responses" fill="#3B82F6" name="Responses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        
        {/* NEW: Top vs Bottom Locations */}
        {topLocations && topLocations.length > 0 && bottomLocations && bottomLocations.length > 0 && (
          <div className="card">
            <h3 className="card-title">Top vs Bottom Locations by NPS</h3>
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
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
      
      {/* Promoter vs Detractor Keywords */}
      <div className="grid grid-cols-1 grid-cols-2">
        {promoterKeywords && promoterKeywords.length > 0 && (
          <div className="card">
            <h3 className="card-title">What Promoters Talk About</h3>
            <div style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  layout="vertical" 
                  data={promoterKeywords}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="keyword" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10B981" name="Mentions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        
        {detractorKeywords && detractorKeywords.length > 0 && (
          <div className="card">
            <h3 className="card-title">What Detractors Talk About</h3>
            <div style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  layout="vertical" 
                  data={detractorKeywords}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="keyword" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#EF4444" name="Mentions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
      
      {/* Sentiment Analysis & Feedback Samples - Keep as is */}
      <div className="grid grid-cols-1 grid-cols-2">
        <div className="card">
          <h3 className="card-title">Feedback Sentiment</h3>
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
        </div>
        
        {feedbackSamples && feedbackSamples.length > 0 && (
          <div className="card">
            <h3 className="card-title">Notable Feedback</h3>
            <div className="feedback-list">
              {feedbackSamples.map((feedback, index) => {
                let feedbackClass = 'feedback-item-detractor';
                
                if (feedback.score >= 9) {
                  feedbackClass = 'feedback-item-promoter';
                } else if (feedback.score >= 7) {
                  feedbackClass = 'feedback-item-passive';
                }
                
                return (
                  <div key={index} className={`feedback-item ${feedbackClass}`}>
                    <p className="text-sm">"{feedback.text}"</p>
                    <div className="feedback-meta">
                      <span>Score: {feedback.score}</span>
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