// components/NPSDrivers.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';

const NPSDrivers = ({ driversData }) => {
  if (!driversData || !driversData.keyword_impact || 
      (!driversData.keyword_impact.positive || driversData.keyword_impact.positive.length === 0) && 
      (!driversData.keyword_impact.negative || driversData.keyword_impact.negative.length === 0)) {
    return null;
  }
  
  // Prepare positive impact data
  const positiveImpact = driversData.keyword_impact.positive || [];
  const positiveData = positiveImpact.map(item => ({
    keyword: item.keyword,
    impact: item.impact,
    count: item.count,
    color: '#10B981'
  }));
  
  // Prepare negative impact data
  const negativeImpact = driversData.keyword_impact.negative || [];
  const negativeData = negativeImpact.map(item => ({
    keyword: item.keyword,
    impact: item.impact,
    count: item.count,
    color: '#EF4444'
  }));
  
  return (
    <div className="card">
      <h3 className="card-title">NPS Score Drivers</h3>
      <p className="chart-subtitle">Keywords with the strongest impact on NPS scores</p>
      
      <div className="grid grid-cols-1 grid-cols-2 gap-4">
        {/* Positive Drivers */}
        {positiveData.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2">Positive Impact Keywords</h4>
            <div style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={positiveData.slice(0, 5)}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    type="number" 
                    domain={[0, Math.ceil(Math.max(...positiveData.map(d => d.impact)) * 1.2)]}
                  />
                  <YAxis dataKey="keyword" type="category" width={80} />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'impact' ? `+${value.toFixed(2)} points` : value.toLocaleString(),
                      name === 'impact' ? 'NPS Impact' : 'Mentions'
                    ]}
                  />
                  <Bar dataKey="impact" name="impact" fill="#10B981">
                    {positiveData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#10B981" />
                    ))}
                    <LabelList 
                      dataKey="impact" 
                      position="right" 
                      formatter={(value) => `+${value.toFixed(2)}`}
                      style={{ fill: '#333', fontSize: '12px' }} 
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Positive Impact Phrases */}
            {driversData.high_impact_phrases.positive && 
             driversData.high_impact_phrases.positive.length > 0 && (
              <div className="impact-phrases">
                <h5 className="text-xs font-semibold mb-1">Representative Quotes</h5>
                <div className="impact-phrase-item positive">
                  "{driversData.high_impact_phrases.positive[0].phrase}"
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Negative Drivers */}
        {negativeData.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2">Negative Impact Keywords</h4>
            <div style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={negativeData.slice(0, 5)}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    type="number" 
                    domain={[Math.floor(Math.min(...negativeData.map(d => d.impact)) * 1.2), 0]}
                  />
                  <YAxis dataKey="keyword" type="category" width={80} />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'impact' ? `${value.toFixed(2)} points` : value.toLocaleString(),
                      name === 'impact' ? 'NPS Impact' : 'Mentions'
                    ]}
                  />
                  <Bar dataKey="impact" name="impact" fill="#EF4444">
                    {negativeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#EF4444" />
                    ))}
                    <LabelList 
                      dataKey="impact" 
                      position="right" 
                      formatter={(value) => `${value.toFixed(2)}`}
                      style={{ fill: '#333', fontSize: '12px' }} 
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Negative Impact Phrases */}
            {driversData.high_impact_phrases.negative && 
             driversData.high_impact_phrases.negative.length > 0 && (
              <div className="impact-phrases">
                <h5 className="text-xs font-semibold mb-1">Representative Quotes</h5>
                <div className="impact-phrase-item negative">
                  "{driversData.high_impact_phrases.negative[0].phrase}"
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="drivers-insight">
        <div className="insight-title">NPS Driver Analysis</div>
        <div className="insight-content">
          {positiveData.length > 0 && negativeData.length > 0 && (
            `Customers mentioning "${positiveData[0].keyword}" rate you +${positiveData[0].impact.toFixed(2)} points higher than average, 
            while those mentioning "${negativeData[0].keyword}" rate you ${negativeData[0].impact.toFixed(2)} points lower. 
            Focus on addressing "${negativeData[0].keyword}" issues to improve your overall NPS score.`
          )}
        </div>
      </div>
    </div>
  );
};

export default NPSDrivers;