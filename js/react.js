import React, { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('https://YOUR_API_GATEWAY_ENDPOINT?sensorId=1')
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

  return (
    <div>
      <h1>Temperature Data</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item.timestamp}: {item.temperature}°C</li>
        ))}
      </ul>
    </div>
  );
}

export default App;

