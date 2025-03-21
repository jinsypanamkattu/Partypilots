import React from 'react';

const TestimonialCard = ({ rating, quote, author, position }) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fas fa-star"></i>);
    }
    
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }
    
    return stars;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center mb-4">
        <div className="text-yellow-400 flex">
          {renderStars(rating)}
        </div>
        <span className="ml-2 text-gray-600">{rating.toFixed(1)}</span>
      </div>
      <p className="text-gray-600 mb-4">{quote}</p>
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
        <div className="ml-3">
          <p className="font-medium">{author}</p>
          <p className="text-gray-500 text-sm">{position}</p>
        </div>
      </div>
    </div>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      rating: 5.0,
      quote: "Partypilot transformed our company's annual meeting into an unforgettable experience. Their attention to detail was impeccable.",
      author: "Sarah Johnson",
      position: "Marketing Director, TechCorp"
    },
    {
      id: 2,
      rating: 5.0,
      quote: "Our wedding day was absolutely perfect thanks to the Partypilot team. They handled everything professionally and with such care.",
      author: "Michael & Emma",
      position: "Newlyweds"
    },
    {
      id: 3,
      rating: 4.5,
      quote: "The music festival we organized with Partypilot exceeded our expectations. They handled the logistics flawlessly despite the scale.",
      author: "David Wilson",
      position: "Event Coordinator, SoundWaves"
    }
  ];

  return (
    <section className="py-16 container mx-auto px-4">
      <h2 className="text-3xl font-bold mx-auto mb-12 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-fit p-2 px-6 rounded-2xl border-2 border-pink-200 shadow-md whitespace-nowrap">
  What Our Clients Say
</h2>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map(testimonial => (
          <TestimonialCard
            key={testimonial.id}
            rating={testimonial.rating}
            quote={testimonial.quote}
            author={testimonial.author}
            position={testimonial.position}
          />
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;