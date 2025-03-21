import React from 'react';
import { Link } from 'react-router-dom';

const ServiceCard = ({ image, title, description }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <Link to="/events" className="text-blue-600 hover:underline">Learn more →</Link>
      </div>
    </div>
  );
};

const ServicesSection = () => {
  const services = [
    {
      id: 1,
      image: "/assets/service.jpg",
      title: "Corporate Events",
      description: "Conferences, meetings, team buildings, and product launches tailored to your company's needs."
    },
    {
      id: 2,
      image: "/assets/so.jpg",
      title: "Social Gatherings",
      description: "Weddings, birthdays, anniversaries, and all special moments worth celebrating."
    },
    {
      id: 3,
      image: "/assets/cor.jpg",
      title: "Public Events",
      description: "Festivals, concerts, exhibitions, and community events that bring people together."
    }
  ];

  return (
    <section className="py-16 container mx-auto px-4">
      <h2 className="text-3xl font-bold mx-auto mb-12 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-1/5 p-4 rounded-2xl border-4 border-pink-200 shadow-lg">
  Our Services
</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map(service => (
          <ServiceCard
            key={service.id}
            image={service.image}
            title={service.title}
            description={service.description}
          />
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;