import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import BookPage from './pages/BookPage'; // Keep this import if needed

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search/:query" element={<Home />} />
        <Route path="/book/:id" element={<BookPage />} /> {/* Example route for BookPage */}
      </Routes>
    </Router>
  );
};

export default App;
