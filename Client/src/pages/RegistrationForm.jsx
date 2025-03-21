import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, UserPlus, Upload, Lock } from 'lucide-react';
import { addUserThunk } from '../redux/slices/usersSlice';
import UpcomingEvents from '@/components/UpcomingEvents';
const RegistrationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: '',
    password: '',
    profileImage: null
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profileImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, phone, role, password } = formData;
    if (!name || !email || !phone || !role || !password) {
      setErrorMsg('Please fill in all required fields');
      return;
    }

    setErrorMsg('');

    dispatch(addUserThunk(formData))
      .unwrap()
      .then(() => {
        setSuccessMessage("Registered successfully! 🎉 Please log in.");
        setTimeout(() => navigate('/login'), 2000);
      })
      .catch((error) => {
        console.error("Failed to add user:", error);
        setErrorMsg("Registration Failed. Please try again.");
      });
  };
  const handleForgotPassword = (email) => {
    dispatch(requestPasswordResetThunk({ email }))
      .unwrap()
      .then(() => {
        setSuccessMessage("Password reset link sent to your email.");
      })
      .catch(() => {
        setErrorMsg("Failed to send reset link. Please try again.");
      });
  };


  return (
    <div className="flex flex-col md:flex-row items-center justify-center p-6 mt-10 mb-10">
    {/* Left Side: Upcoming Events */}
    <div className="hidden md:flex w-full md:w-1/2 justify-center">
        <UpcomingEvents />
    </div>

    {/* Right Side: Register Form */}
    <div className="w-full md:w-1/2 flex justify-center">
        <div className="w-full max-w-lg bg-white shadow-2xl rounded-xl p-8 space-y-6 border border-gray-100">
            <div className="text-center">
                <h2 className="text-4xl font-extrabold bg-gradient-to-r from-[#40E0D0] to-[#8FBC8F] text-transparent bg-clip-text mb-4">
                    Create Account
                </h2>
                <p className="text-gray-500 mb-6">Register to get started</p>
            </div>

            {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-center">
                    {errorMsg}
                </div>
            )}
            {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-600 p-3 rounded-lg text-center">
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Profile Image Upload */}
                <div className="flex justify-center">
                    <div className="relative">
                        <input type="file" id="profileImage" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        <label htmlFor="profileImage" className="cursor-pointer">
                            {previewImage ? (
                                <img src={previewImage} alt="Profile" className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 shadow-lg" />
                            ) : (
                                <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center shadow-md">
                                    <Upload className="text-gray-500" />
                                    <span className="sr-only">Upload Profile Image</span>
                                </div>
                            )}
                        </label>
                    </div>
                </div>

                {/* Input Fields */}
                <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                    />
                </div>

                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                    />
                </div>

                <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                    />
                </div>

                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                    />
                </div>

                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                    />
                </div>

                <div className="relative">
                    <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 text-gray-600"
                    >
                        <option value="">Select Role</option>
                        <option value="organizer">Organizer</option>
                        <option value="attendee">Attendee</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#40E0D0] to-[#8FBC8F] text-white p-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-[1.02] shadow-md hover:from-[#36CFC9] hover:to-[#76A77D]"
                >
                    Register
                </button>
            </form>
        </div>
    </div>
</div>

  );
};

export default RegistrationForm;

