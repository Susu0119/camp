import React from 'react';
import './App.css';
import CustomerSupport from './components/CS/CS_Main';
import LoginPage from './components/CS/LoginPage';


function App() {
  return (
    <div className="App">
      <LoginPage />   {/*  LoginPage만 보이게 */}
      {/* <CustomerSupport /> */} {/*  잠깐 주석 처리 */}
    </div>
  );
}


export default App;