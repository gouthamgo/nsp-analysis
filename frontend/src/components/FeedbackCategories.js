// components/FeedbackCategories.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';

const FeedbackCategories = ({ categoryData, categorizedFeedback }) => {
  if (!categoryData || categoryData.length === 0) {
    return null;
  }
  
  // Prepare data for chart
  const chartData = categoryData.map((item, index) => ({
    ...item,
    color: getColorForIndex(index)
  }));
  
  // Generate colors for categories
  function getColorForIndex(index) {
    const colors = [
      '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', 
      '#6366F1', '#14B8A6', '#F97316', '#A855F7', '#D946EF'
    ];
    return colors[index % colors.length];
  }
  
  return (
    <div className="card">
      <h3 className="card-title">Feedback Categories</h3>
      <p className="chart-subtitle">Distribution of feedback by category topic</p>
      
      <div className="grid grid-cols-1 grid-cols-2">
        {/* Category Distribution Chart */}
        <div>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={150}
                />
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value.toLocaleString()} (${((value / chartData.reduce((sum, item) => sum + item.count, 0)) * 100).toFixed(1)}%)`, 
                    'Count'
                  ]} 
                />
                <Bar dataKey="count" name="Feedback Count">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
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
              <span className="stat-label">Total categorized:</span>
              <span className="stat-value">
                {chartData.reduce((sum, item) => sum + item.count, 0).toLocaleString()}
              </span>
            </div>
            <div className="summary-stat">
              <span className="stat-label">Primary category:</span>
              <span className="stat-value">
                {chartData.length > 0 ? `${chartData[0].name} (${((chartData[0].count / chartData.reduce((sum, item) => sum + item.count, 0)) * 100).toFixed(1)}%)` : '-'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Categorized Feedback Samples */}
        <div>
          <h4 className="text-sm font-semibold mb-2">Categorized Feedback Samples</h4>
          <div className="categorized-feedback-list">
            {categorizedFeedback.slice(0, 5).map((item, index) => (
              <div key={index} className="categorized-feedback-item">
                <div className="categorized-feedback-header">
                  <span 
                    className="category-tag"
                    style={{ backgroundColor: getColorForIndex(chartData.findIndex(cat => cat.name === item.primary_category)) }}
                  >
                    {item.primary_category}
                  </span>
                  {item.secondary_category && (
                    <span className="secondary-category-tag">
                      + {item.secondary_category}
                    </span>
                  )}
                </div>
                <p className="categorized-feedback-text">"{item.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="category-insight">
        <div className="insight-title">Key Category Insight</div>
        <div className="insight-content">
          {chartData.length > 0 && `The most common feedback category is "${chartData[0].name}" representing 
          ${((chartData[0].count / chartData.reduce((sum, item) => sum + item.count, 0)) * 100).toFixed(1)}% of all feedback. 
          This suggests customers are most concerned about ${chartData[0].name.toLowerCase()} related issues or experiences.`}
        </div>
      </div>
    </div>
  );
};

export default FeedbackCategories;