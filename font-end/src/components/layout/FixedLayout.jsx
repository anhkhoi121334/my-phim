import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

// This component ensures that Header and Footer are only rendered once
const FixedLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-white">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default FixedLayout; 