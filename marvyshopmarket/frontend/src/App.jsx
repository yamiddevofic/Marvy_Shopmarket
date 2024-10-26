// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Home from './pages/Home';
import SignUp from './pages/SignUp'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/registrarse" element={<SignUp />} />
      </Routes>
    </Router>
  );
};

export default App;
