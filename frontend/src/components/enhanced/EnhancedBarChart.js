// components/enhanced/EnhancedBarChart.js
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LabelList, Cell
} from 'recharts';

const EnhancedBarChart = ({ 
  data, 
  dataKey, 
  barColor = "#3B82F6", 
  layout = "horizontal", 
  valueFormatter = (value) => value,
  nameKey = "name",
  title,
  subtitle,
  minHeight = 300,
  dynamicHeight = true,
  maxItems = 20,
  itemHeight = 40
}) => {
  
  const isVertical = layout === "vertical";
  
  // Calculate appropriate height based on number of items
  // This ensures all items are visible without scrolling
  const calculatedHeight = dynamicHeight && isVertical 
    ? Math.max(minHeight, Math.min(data.length, maxItems) * itemHeight) 
    : minHeight;
  
  // Format for axis labels
  const axisFormatter = (value) => {
    if (typeof value === 'number' && value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value;
  };
  
  // Format for tooltips - more detailed
  const tooltipFormatter = (value, name) => {
    if (typeof value === 'number') {
      // Show both raw value and percentage of total if applicable
      const total = data.reduce((sum, item) => sum + (item[dataKey] || 0), 0);
      const percentage = ((value / total) * 100).toFixed(1);
      return [`${valueFormatter(value)} (${percentage}%)`, name];
    }
    return [valueFormatter(value), name];
  };
  
  return (
    <div className="chart-container">
      {title && <h4 className="chart-title">{title}</h4>}
      {subtitle && <p className="chart-subtitle">{subtitle}</p>}
      
      <div style={{ height: calculatedHeight, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout={layout}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            
            {isVertical ? (
              <>
                <XAxis type="number" tickFormatter={axisFormatter} />
                <YAxis 
                  dataKey={nameKey} 
                  type="category" 
                  width={120}
                  tick={{ fontSize: 12 }} 
                />
              </>
            ) : (
              <>
                <XAxis 
                  dataKey={nameKey}
                  tick={{ fontSize: 12, angle: data.length > 10 ? -45 : 0, textAnchor: data.length > 10 ? 'end' : 'middle' }}
                  height={data.length > 10 ? 60 : 30}
                />
                <YAxis tickFormatter={axisFormatter} />
              </>
            )}
            
            <Tooltip
              formatter={tooltipFormatter}
              labelFormatter={(label) => `${label}`}
            />
            <Legend />
            
            <Bar dataKey={dataKey} fill={barColor} name={dataKey}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color || barColor} 
                />
              ))}
              
              <LabelList 
                dataKey={dataKey} 
                position={isVertical ? "right" : "top"} 
                formatter={valueFormatter}
                style={{ fill: '#333', fontSize: 12, fontWeight: 500 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {data.length > 0 && (
        <div className="chart-insights">
          <div className="insight-grid">
            <div className="insight-item">
              <span className="insight-label">Total:</span>
              <span className="insight-value">
                {valueFormatter(data.reduce((sum, item) => sum + (item[dataKey] || 0), 0))}
              </span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Highest:</span>
              <span className="insight-value">
                {data.length > 0 ? `${data.sort((a, b) => b[dataKey] - a[dataKey])[0][nameKey]}: ${valueFormatter(data.sort((a, b) => b[dataKey] - a[dataKey])[0][dataKey])}` : '-'}
              </span>
            </div>
            {isVertical && data.length > 10 && (
              <div className="insight-item insight-full">
                <span className="insight-note">
                  Showing {data.length} items. The chart height adapts to display all items without scrolling.
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedBarChart;