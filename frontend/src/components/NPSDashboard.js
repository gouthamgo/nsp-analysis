import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
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
    feedbackSamples 
  } = data;
  
  const getNpsColorClass = (score) => {
    if (score >= 50) return 'text-green';
    if (score >= 0) return 'text-yellow';
    return 'text-red';
  };
  
  const pieColors = ['#10B981', '#94A3B8', '#EF4444']; // green, gray, red
  
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
      
      {/* NEW: Location Volume instead of Location NPS */}
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
      
      {/* NEW: Promoter vs Detractor Keywords */}
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