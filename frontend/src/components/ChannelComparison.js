import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const ChannelComparison = ({ channelData }) => {
  const { online, store } = channelData;
  
  const hasOnlineData = online.responses > 0;
  const hasStoreData = store.responses > 0;
  
  // Skip rendering if no data
  if (!hasOnlineData && !hasStoreData) {
    return null;
  }
  
  // Combined NPS data for comparison
  const npsData = [
    { name: 'Online', nps: online.nps, responses: online.responses },
    { name: 'In-Store', nps: store.nps, responses: store.responses }
  ];
  
  // Prepare respondent type data for both channels
  const respondentData = [
    { 
      name: 'Online', 
      promoters: online.promoters,
      passives: online.passives,
      detractors: online.detractors 
    },
    { 
      name: 'In-Store', 
      promoters: store.promoters,
      passives: store.passives,
      detractors: store.detractors 
    }
  ];
  
  // Prepare keyword data if available
  const hasKeywords = channelData.keywords && 
                     channelData.keywords.online && 
                     channelData.keywords.store;
  
  return (
    <div className="card">
      <h3 className="card-title">Online vs In-Store Comparison</h3>
      
      <div className="grid grid-cols-1 grid-cols-2">
        {/* NPS Score Comparison */}
        <div>
          <h4 className="text-sm font-semibold mb-2">NPS Comparison</h4>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={npsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[-100, 100]} />
                <Tooltip
                  formatter={(value, name) => [
                    name === 'nps' ? `${value}` : value.toLocaleString(),
                    name === 'nps' ? 'NPS Score' : 'Responses'
                  ]}
                />
                <Bar dataKey="nps" name="NPS Score" fill="#3B82F6">
                  {npsData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.nps >= 50 ? '#10B981' : entry.nps >= 0 ? '#F59E0B' : '#EF4444'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center text-sm text-gray">
            <span>Online: {online.responses.toLocaleString()} responses</span>
            <span className="mx-2">|</span>
            <span>In-Store: {store.responses.toLocaleString()} responses</span>
          </div>
        </div>
        
        {/* Respondent Type Comparison */}
        <div>
          <h4 className="text-sm font-semibold mb-2">Respondent Breakdown</h4>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={respondentData}
                layout="vertical"
                stackOffset="expand"
                barSize={40}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(value) => `${value}%`} />
                <YAxis dataKey="name" type="category" />
                <Tooltip formatter={(value) => [`${value}%`, '']} />
                <Legend />
                <Bar dataKey="promoters" name="Promoters" stackId="a" fill="#10B981" />
                <Bar dataKey="passives" name="Passives" stackId="a" fill="#94A3B8" />
                <Bar dataKey="detractors" name="Detractors" stackId="a" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Keywords by Channel */}
      {hasKeywords && (
        <div className="grid grid-cols-1 grid-cols-2 mt-4">
          <div>
            <h4 className="text-sm font-semibold mb-2">Online Keywords</h4>
            <div style={{ height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={channelData.keywords.online.slice(0, 5)}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="keyword" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="count" name="Mentions" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-2">In-Store Keywords</h4>
            <div style={{ height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={channelData.keywords.store.slice(0, 5)}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="keyword" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="count" name="Mentions" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelComparison;