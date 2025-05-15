// components/AspectSentiment.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

const AspectSentiment = ({ aspectData }) => {
  if (!aspectData || !aspectData.sorted_aspects || aspectData.sorted_aspects.length === 0) {
    return null;
  }
  
  // Prepare data for visualization
  const aspectBarData = aspectData.sorted_aspects.filter(aspect => 
    aspectData.aspect_mentions[aspect] > 0
  ).map(aspect => ({
    name: aspect.charAt(0).toUpperCase() + aspect.slice(1),
    value: aspectData.aspect_sentiments[aspect].net_sentiment,
    mentions: aspectData.aspect_mentions[aspect],
    positive: aspectData.aspect_sentiments[aspect].positive_pct,
    neutral: aspectData.aspect_sentiments[aspect].neutral_pct,
    negative: aspectData.aspect_sentiments[aspect].negative_pct
  }));
  
  return (
    <div className="card">
      <h3 className="card-title">Aspect-Based Sentiment Analysis</h3>
      <p className="chart-subtitle">How customers feel about specific aspects of your business</p>
      
      <div style={{ height: '300px', marginBottom: '20px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={aspectBarData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              domain={[-100, 100]} 
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={100}
            />
            <Tooltip 
              formatter={(value, name, props) => {
                if (name === 'value') {
                  return [`${value}% Net Sentiment`, 'Sentiment Score'];
                }
                return [value, name];
              }}
              labelFormatter={(value) => `${value} (${aspectBarData.find(d => d.name === value).mentions} mentions)`}
            />
            <Bar dataKey="value" name="Net Sentiment">
              {aspectBarData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.value >= 50 ? '#10B981' : 
                        entry.value >= 0 ? '#60A5FA' : 
                        entry.value >= -50 ? '#F97316' : '#EF4444'} 
                />
              ))}
              <LabelList 
                dataKey="value" 
                position="right" 
                formatter={(value) => `${value}%`} 
                style={{ fill: '#333', fontSize: '12px' }} 
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* <div className="aspect-samples">
        <h4 className="text-sm font-semibold mb-2">Representative Feedback by Aspect</h4>
        <div className="aspect-samples-grid">
          {aspectData.sorted_aspects.slice(0, 3).map((aspect, index) => {
            if (aspectData.samples[aspect].length === 0) return null;
            
            return (
              <div key={index} className="aspect-sample-card">
                <div className="aspect-sample-header">
                  <span className="aspect-name">{aspect.charAt(0).toUpperCase() + aspect.slice(1)}</span>
                  <span className={`aspect-sentiment ${
                    aspectData.aspect_sentiments[aspect].net_sentiment >= 0 ? 'positive' : 'negative'
                  }`}>
                    {aspectData.aspect_sentiments[aspect].net_sentiment}% Net Sentiment
                  </span>
                </div>
                
                <div className="aspect-sample-distribution">
                  <div 
                    className="aspect-positive" 
                    style={{ width: `${aspectData.aspect_sentiments[aspect].positive_pct}%` }}
                  >
                    {aspectData.aspect_sentiments[aspect].positive_pct > 10 && 
                      `${aspectData.aspect_sentiments[aspect].positive_pct}%`}
                  </div>
                  <div 
                    className="aspect-neutral" 
                    style={{ width: `${aspectData.aspect_sentiments[aspect].neutral_pct}%` }}
                  >
                    {aspectData.aspect_sentiments[aspect].neutral_pct > 10 && 
                      `${aspectData.aspect_sentiments[aspect].neutral_pct}%`}
                  </div>
                  <div 
                    className="aspect-negative" 
                    style={{ width: `${aspectData.aspect_sentiments[aspect].negative_pct}%` }}
                  >
                    {aspectData.aspect_sentiments[aspect].negative_pct > 10 && 
                      `${aspectData.aspect_sentiments[aspect].negative_pct}%`}
                  </div>
                </div>
                
                <div className="aspect-sample-quotes">
                  {aspectData.samples[aspect].slice(0, 2).map((sample, i) => (
                    <div 
                      key={i} 
                      className={`aspect-quote ${
                        sample.sentiment === 'positive' ? 'aspect-quote-positive' : 
                        sample.sentiment === 'negative' ? 'aspect-quote-negative' : 
                        'aspect-quote-neutral'
                      }`}
                    >
                      "{sample.text}"
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div> */}
      
      <div className="aspect-insight">
        <div className="insight-title">Key Aspect Insight</div>
        <div className="insight-content">
          {aspectBarData.length > 0 && (() => {
            const bestAspect = [...aspectBarData].sort((a, b) => b.value - a.value)[0];
            const worstAspect = [...aspectBarData].sort((a, b) => a.value - b.value)[0];
            
            return `Customers are most satisfied with your "${bestAspect.name.toLowerCase()}" (${bestAspect.value}% sentiment) 
            and most dissatisfied with the  "${worstAspect.name.toLowerCase()}" (${worstAspect.value}% sentiment). 
            Focus on improving the ${worstAspect.name.toLowerCase()} experience while maintaining the  strengths in ${bestAspect.name.toLowerCase()}.`;
          })()}
        </div>
      </div>
    </div>
  );
};

export default AspectSentiment;