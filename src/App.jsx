import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PostList from './components/PostList';
import Profil from './components/Profil';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PostList />} />
        {/* Add routes for other components if needed */}
       
      </Routes> 

    </Router>
   
  );
};

export default App;
