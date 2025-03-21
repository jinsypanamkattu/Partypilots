import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import HeroCarousel from './HeroCarousel';

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-50 via-cyan-50 to-green-50">
     <Navbar />
     <HeroCarousel />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export default MainLayout;