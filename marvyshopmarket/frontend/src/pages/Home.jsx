import React from 'react';
import Header from '../components/Header/Header';
import StatsGrid from '../components/Stats/StatsGrid';
import OptionsGrid from '../components/Options/OptionsGrid';

const Home = () => {
  const userName = localStorage.getItem('userName') || 'Administrador';
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header userName={userName.toString()} />
      <main className="container mx-auto h-full p-6 space-y-6 flex flex-col justify-center">
        <StatsGrid />
        <OptionsGrid />
      </main>
    </div>
  );
};

export default Home;
