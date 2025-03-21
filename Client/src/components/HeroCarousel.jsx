import React, { useState, useEffect } from 'react';

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      id: 1,
      title: "Corporate Conferences",
      description: "Professional planning for your next business event",
      buttonText: "Book Now",
      buttonColor: "bg-gradient-to-r from-[#40E0D0] to-[#2E8B57] hover:from-[#36CFC9] hover:to-[#228B22]",

    
      image: "./assets/cor.jpg"  // Replace with your image URL
    },
    
    {
      id: 2,
      title: "Wedding Celebrations",
      description: "Create memories that last a lifetime",
      buttonText: "Plan Your Day",
      buttonColor: "bg-pink-600 hover:bg-pink-700",
      
      image: "./assets/wed1.jpg"  // Replace with your image URL
    },
    {
      id: 3,
      title: "Music Festivals",
      description: "From concept to execution, we handle it all",
      buttonText: "Get Started",
      buttonColor: "bg-gradient-to-r from-[#40E0D0]/80 to-[#2E8B57]/80 hover:from-[#40E0D0]/100 hover:to-[#2E8B57]/100",


      
      image: "./assets/music1.jpeg"  // Replace with your image URL
    },
    {
      id: 4,
      title: "Virtual Events",
      description: "Professional planning for your next virtual event",
      buttonText: "Book Now",
      buttonColor: "bg-gradient-to-r from-[#40E0D0]/50 to-[#1E90FF]/50 hover:from-[#36CFC9]/70 hover:to-[#007FFF]/70",

    
      image: "./assets/virtual1.jpg"  // Replace with your image URL
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  };

  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden bg-gray-900 h-140">
      {/* Carousel container */}
      <div className="carousel relative w-full h-full">
        {/* Carousel Slides */}
        {slides.map((slide, index) => (
          <div 
            key={slide.id}
            className={`carousel-slide absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className={`absolute inset-0 ${slide.gradient}`}></div>
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center px-8 md:px-16">
              <div className="max-w-xl mx-auto">
                <h2 className="text-white text-3xl md:text-5xl font-bold mb-4">{slide.title}</h2>
                <p className="text-gray-200 text-lg mb-6">{slide.description}</p>
                <button className={`${slide.buttonColor} text-white font-medium py-2 px-6 rounded-lg transition duration-300`}>
                  {slide.buttonText}
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Carousel Navigation */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {slides.map((_, index) => (
            <button 
              key={index}
              onClick={() => goToSlide(index)}
              className={`carousel-dot w-3 h-3 rounded-full bg-white ${index === currentSlide ? 'opacity-100' : 'opacity-50'}`}
            ></button>
          ))}
        </div>
        
        {/* Carousel Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 focus:outline-none"
        >
          <i className="fas fa-chevron-left text-xl"></i>
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 focus:outline-none"
        >
          <i className="fas fa-chevron-right text-xl"></i>
        </button>
      </div>
    </div>
  );
};

export default HeroCarousel;
