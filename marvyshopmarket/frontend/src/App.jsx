// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import SignUp from './pages/SignUp'
import Register_Shop from './pages/RegisterShopForm'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/registrarse" element={<SignUp />} />
        <Route path="/tenderos" element={<Register_Shop />} />
      </Routes>
    </Router>
  );
};

export default App;
