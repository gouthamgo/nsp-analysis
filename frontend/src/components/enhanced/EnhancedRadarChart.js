// components/enhanced/EnhancedRadarChart.js
import React from 'react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, Tooltip, ResponsiveContainer
} from 'recharts';

const EnhancedRadarChart = ({
  data,
  dataKey = "value",
  angleKey = "emotion",
  colors = ['#8884d8'],
  title,
  subtitle,
  height = 300,
  domain = [0, 100]
}) => {
  return (
    <div className="chart-container">
      {title && <h4 className="chart-title">{title}</h4>}
      {subtitle && <p className="chart-subtitle">{subtitle}</p>}
      
      <div style={{ height, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey={angleKey} />
            <PolarRadiusAxis angle={30} domain={domain} />
            
            <Radar
              name="Values"
              dataKey={dataKey}
              stroke={colors[0]}
              fill={colors[0]}
              fillOpacity={0.6}
            />
            
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Percentage']}
              labelFormatter={(label) => `${label}`}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="chart-insights">
        <div className="insight-grid">
          <div className="insight-item">
            <span className="insight-label">Highest:</span>
            <span className="insight-value">
              {data.length > 0 ? `${data.sort((a, b) => b[dataKey] - a[dataKey])[0][angleKey]}: ${data.sort((a, b) => b[dataKey] - a[dataKey])[0][dataKey]}%` : '-'}
            </span>
          </div>
          <div className="insight-item">
            <span className="insight-label">Lowest:</span>
            <span className="insight-value">
              {data.length > 0 ? `${data.sort((a, b) => a[dataKey] - b[dataKey])[0][angleKey]}: ${data.sort((a, b) => a[dataKey] - b[dataKey])[0][dataKey]}%` : '-'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedRadarChart;