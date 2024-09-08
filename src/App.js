import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import BookPage from './pages/BookPage'; // Keep this import if needed
import Footer from './pages/Footer';
import './App.css'; // Add a CSS file to control layout

const App = () => {
  return (
    <div className="app-wrapper">
      <Router>
        <div className="content-wrap">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search/:query" element={<Home />} />
            <Route path="/book/:id" element={<BookPage />} /> {/* Example route for BookPage */}
          </Routes>
        </div>
        <Footer /> {/* Footer is added here */}
      </Router>
    </div>
  );
};

export default App;
