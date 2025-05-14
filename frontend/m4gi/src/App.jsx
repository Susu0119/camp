import React from 'react';
import './App.css';
import routeList from './routes.jsx';
import { Routes, Route } from 'react-router-dom';

function App() {
  // CampingSiteCard에 전달할 샘플 데이터

  return (
    
      <Routes>
        {routeList.map(({ path, element }, idx) => (
          <Route key={idx} path={path} element={element} />
        ))}
      </Routes>
    
  );
}


export default App;
