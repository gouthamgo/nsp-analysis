import React from 'react';

// Simple word cloud implementation for React without dependencies
const WordCloud = ({ title, words, colors }) => {
  // Sort words by value (highest first)
  const sortedWords = [...words].sort((a, b) => b.value - a.value);
  
  // Calculate sizes based on values
  const maxValue = Math.max(...words.map(w => w.value));
  const minValue = Math.min(...words.map(w => w.value));
  const range = maxValue - minValue;
  
  // Function to calculate font size based on word value
  const getFontSize = (value) => {
    if (range === 0) return 24; // Default size if all words have same value
    const minSize = 14;
    const maxSize = 36;
    return minSize + ((value - minValue) / range) * (maxSize - minSize);
  };
  
  // Function to get a random color from the colors array
  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
      <div style={{ height: '250px', overflow: 'hidden', position: 'relative', textAlign: 'center' }}>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: '100%',
          padding: '10px'
        }}>
          {sortedWords.map((word, index) => (
            <div 
              key={index} 
              style={{ 
                fontSize: `${getFontSize(word.value)}px`,
                fontWeight: word.value > (maxValue * 0.7) ? 'bold' : 'normal',
                padding: '5px 8px',
                color: getRandomColor(),
                transform: `rotate(${Math.random() * 20 - 10}deg)`
              }}
            >
              {word.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WordCloud;