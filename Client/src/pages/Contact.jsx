// ContactPage.jsx
import { useState } from 'react';
import userService from '../services/userService';

import GoogleMapComponent from '@/components/GoogleMapComponent';
const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await userService.contactFormSubmit(formData);
      //
      // console.log(response,"resppp");
      setStatus(response.message);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setStatus('Message sent successfully.');
    } catch (error) {
      setStatus('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center mt-10 mb-10 ml-10 gap-8">
      {/* Left Side - Google Map */}
      <div className="w-full md:w-1/2 h-[550px] rounded-2xl shadow-lg overflow-hidden">
        <GoogleMapComponent />
      </div>
      {/* Right Side - Contact Form */}
      <div className="p-8 bg-white rounded-3xl shadow-2xl w-full md:w-1/2 animate-slide-in mr-5">
    {/* Title with Sage Green and Soft Shadow */}
    <h2 className="text-5xl font-bold mb-6 text-center drop-shadow-md" style={{ color: '#789972' }}>
        Enquiry
    </h2>

    {/* Status Message */}
    {status && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md shadow-sm">
            {status}
        </div>
    )}

    {/* Form */}
    <form onSubmit={handleSubmit} className="space-y-6">
        {/* Input Fields */}
        <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            value={formData.name}
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow shadow-sm"
        />
        <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={formData.email}
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow shadow-sm"
        />
        <input
            type="text"
            name="subject"
            placeholder="Subject"
            onChange={handleChange}
            value={formData.subject}
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow shadow-sm"
        />
        <textarea
            name="message"
            placeholder="Message"
            onChange={handleChange}
            value={formData.message}
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow shadow-sm"
            rows="5"
        ></textarea>

        {/* Button with Gradient from Turquoise to Sage Green */}
        <button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-500 to-green-600 text-white p-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-lg"
        >
            Send Message
        </button>
    </form>
</div>

    </div>
  );
};

export default ContactPage;


