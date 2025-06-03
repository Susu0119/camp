import React from 'react'; // React.createElement를 사용하기 위해 React import는 필수입니다.
import { MemoryRouter, Routes, Route } from 'react-router-dom'; // React Router 관련 컴포넌트 import
import { AuthProvider } from '../src/utils/Auth.jsx'; // AuthProvider import (경로 확인 필수)
import '../src/index.css'; // 기존 import 유지
import '../src/App.css';   // 기존 import 유지

/** @type { import('@storybook/react').Preview } */

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (StoryComponent) => React.createElement(
      MemoryRouter,
      { initialEntries: ['/'] }, // MemoryRouter에 props 전달
      React.createElement(
        AuthProvider,
        null, // AuthProvider에 전달할 특별한 props가 없다면 null (children은 자동으로 처리됨)
        React.createElement(
          Routes,
          null, // Routes에 전달할 props가 없다면 null
          React.createElement(
            Route,
            { path: '/*', element: React.createElement(StoryComponent) } // Route의 element로 StoryComponent 렌더링
          )
        )
      )
    )
  ],
};

export default preview;