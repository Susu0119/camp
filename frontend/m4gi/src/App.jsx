import React from 'react';
import './App.css';
import CustomerSupport from './components/CS/CS_Main';
import StarryHeader from './components/Header';
import CampingSiteCard from './components/Main/Card';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from './components/CS/LoginPage';

function App() {
  // CampingSiteCard에 전달할 샘플 데이터

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/starry" element={<StarryHeader />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}


export default App;