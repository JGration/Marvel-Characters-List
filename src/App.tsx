import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CharacterList from './components/CharacterList';
import CharacterDetails from './components/CharacterDetails';
import './App.css'; // Ensure this file is included if it contains global styles

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CharacterList />} />
        <Route path="/characters/:id" element={<CharacterDetails />} />
      </Routes>
    </Router>
  );
};


export default App;
