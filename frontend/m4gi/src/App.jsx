import React from 'react';
import './App.css';
import routeList from './routes.jsx';
import { Routes, Route } from 'react-router-dom';
import ReviewCard from './components/Main/UI/ReviewCard.jsx';
const defaultReviewData = {
  campName: "햇살 가득 캠핑장",
  score: 4, // StarRating의 rating={score}로 전달됩니다.
  content: "시설도 깔끔하고, 주변 경치도 좋아서 잘 쉬다 왔습니다. 아이들이 특히 좋아했어요!",
  author: "행복한캠퍼",
  date: "2024-05-21",
};
function App() {
  // CampingSiteCard에 전달할 샘플 데이터
  return (
    <>

      <Routes>
        {routeList.map(({ path, element }, idx) => (
          <Route key={idx} path={path} element={element} />
        ))}
      </Routes>


    </>
  );
}

export default App;
