// components/enhanced/EnhancedPieChart.js
import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  Label
} from 'recharts';

const EnhancedPieChart = ({
  data,
  dataKey = "value",
  nameKey = "name",
  colors = ['#10B981', '#94A3B8', '#EF4444', '#3B82F6', '#F59E0B', '#8B5CF6'],
  title,
  subtitle,
  height = 300,
  showLabels = true,
  showLegend = true,
  donut = false,
  centerLabel = null
}) => {
  
  // If no data or empty data, return placeholder
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        {title && <h4 className="chart-title">{title}</h4>}
        {subtitle && <p className="chart-subtitle">{subtitle}</p>}
        <div className="empty-chart" style={{ height }}>
          <p>No data available</p>
        </div>
      </div>
    );
  }
  
  // Calculate total for percentages
  const total = data.reduce((sum, item) => sum + (item[dataKey] || 0), 0);
  
  // Custom label 
  const renderCustomizedLabel = (props) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, index, name } = props;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    if (percent < 0.05) return null; // Don't show labels for small slices
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight={500}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  // Enhanced tooltip formatter
  const tooltipFormatter = (value) => {
    return [`${value} (${((value / total) * 100).toFixed(1)}%)`, ''];
  };
  
  // Prepare an array of cumulative percentages for legend
  const dataWithPercentage = data.map(item => ({
    ...item,
    percentage: ((item[dataKey] / total) * 100).toFixed(0) + '%'
  }));
  
  // Custom legend content with percentages
  const renderLegendContent = (props) => {
    const { payload } = props;
    
    return (
      <ul className="custom-legend">
        {payload.map((entry, index) => {
          const item = dataWithPercentage.find(d => d[nameKey] === entry.value);
          const percentage = item ? item.percentage : '';
          
          return (
            <li key={`item-${index}`} className="legend-item">
              <div className="legend-color" style={{ backgroundColor: entry.color }}></div>
              <span className="legend-text">{entry.value}</span>
              <span className="legend-percentage">{percentage}</span>
            </li>
          );
        })}
      </ul>
    );
  };
  
  return (
    <div className="chart-container">
      {title && <h4 className="chart-title">{title}</h4>}
      {subtitle && <p className="chart-subtitle">{subtitle}</p>}
      
      <div style={{ height, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={height / 3}
              innerRadius={donut ? height / 6 : 0}
              fill="#8884d8"
              dataKey={dataKey}
              nameKey={nameKey}
              label={showLabels ? renderCustomizedLabel : false}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color || colors[index % colors.length]} 
                />
              ))}
              
              {donut && centerLabel && (
                <Label
                  value={centerLabel.value}
                  position="center"
                  fill={centerLabel.color || "#333"}
                  style={{
                    fontSize: centerLabel.fontSize || 24,
                    fontWeight: centerLabel.fontWeight || 'bold',
                    fill: centerLabel.color || '#333'
                  }}
                />
              )}
            </Pie>
            <Tooltip formatter={tooltipFormatter} />
            {showLegend && (
              <Legend 
                content={renderLegendContent}
                layout="vertical" 
                verticalAlign="middle" 
                align="right"
                wrapperStyle={{ paddingLeft: '20px' }}
              />
            )}
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="chart-insights">
        <div className="insight-grid">
          <div className="insight-item">
            <span className="insight-label">Total:</span>
            <span className="insight-value">{total}</span>
          </div>
          <div className="insight-item">
            <span className="insight-label">Top:</span>
            <span className="insight-value">
              {data.length > 0 ? `${data.sort((a, b) => b[dataKey] - a[dataKey])[0][nameKey]}: ${data.sort((a, b) => b[dataKey] - a[dataKey])[0][dataKey]}` : '-'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedPieChart;