import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import CostsPage from './CostsPage';
import UploadPage from './UploadPage'
import SandBox from './SandBox';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/costs" element={<CostsPage />} />

        <Route path="/upload" element={<UploadPage />} />

        <Route path="/sandbox" element={<SandBox />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);