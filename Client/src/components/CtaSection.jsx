import React from 'react';
import { Link } from 'react-router-dom';

const CtaSection = () => {
  return (
    <section className=" py-16 bg-gradient-to-r from-purple-500 ...">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Plan Your Next Event?</h2>
        <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
          Let our experienced team help you create memorable experiences for your guests.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/contact" className="bg-white text-blue-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-400 transition duration-300">
            Contact Us
          </Link>
          
        </div>
      </div>
    </section>
  );
};

export default CtaSection;