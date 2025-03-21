import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../redux/slices/authSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, UserPlus } from 'lucide-react';
import UpcomimgEvents from "../components/UpcomingEvents";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState(null);
    const [role, setRole] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const loginMessage = location.state?.message;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg(null); // Reset error message on new login attempt
        if (!email || !password || !role) {
            setErrorMsg('Please enter email, password, and select a role');
        } else {
            try {
                // Dispatch the login action
                // console.log("details lo",email,password,role);
                const resultAction = await dispatch(loginUser({ email, password, role }));
                //console.log('resultAction', resultAction);

                if (loginUser.fulfilled.match(resultAction)) {
                    const { user } = resultAction.payload;

                    if (user?.role === 'admin') {
                        navigate('/dashboard/admin');
                    } else if (user?.role === 'organizer') {
                        navigate('/dashboard/organizer');
                    } else if (user?.role === 'attendee') {
                        navigate('/profile');
                    } else {
                        setErrorMsg('Invalid role, please try again.');
                    }
                } else {
                    // Handle errors
                    const error = resultAction?.payload?.error;
                    if (error) {
                        // If the error is an object, extract the message or use JSON.stringify for debugging
                        const errorMessage = error.message || 'Unknown error occurred';
                        setErrorMsg(errorMessage);
                    } else {
                        setErrorMsg('Login failed. Please try again.');
                    }
                }
            } catch (err) {
                // Check if the error is an object, otherwise display the string message
                const errorMessage = err?.message || JSON.stringify(err);
                setErrorMsg(errorMessage);
                console.error('Login failed:', err);
            }
        }
    };

    return (

        <div className="flex flex-col md:flex-row items-center justify-center p-6 mt-10 mb-10">
            {/* Left Side: Upcoming Events */}
            <div className="hidden md:flex w-full md:w-1/2 justify-center">
                <UpcomimgEvents />
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full md:w-1/2 flex justify-center">
                <div className="w-full max-w-md bg-white shadow-2xl rounded-xl p-8 space-y-6 border border-gray-100">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
                        <p className="text-gray-500 mb-6">Sign in to continue</p>
                    </div>

                    {errorMsg && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-center">
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                            />
                        </div>

                        <div className="relative">
                            <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                            >
                                <option value="">Select Role</option>
                                <option value="admin">Admin</option>
                                <option value="organizer">Organizer</option>
                                <option value="attendee">Attendee</option>
                            </select>
                        </div>

                        <div className="flex justify-between items-center">
                            <a href="/forgot-password" className="text-sm text-[#789972] hover:text-[#5F7A64] transition duration-300">
                                Forgot Password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-[#40E0D0] to-[#8FBC8F] text-white p-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-[1.02] shadow-md hover:from-[#36CFC9] hover:to-[#76A77D]"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="text-center mt-6">
                        <div className="flex items-center justify-center space-x-2">
                            <div className="h-px bg-gray-300 w-full"></div>
                            <span className="text-gray-500 text-sm">or</span>
                            <div className="h-px bg-gray-300 w-full"></div>
                        </div>

                        <a href="/register" className="flex items-center justify-center w-full mt-4 p-3 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition duration-300">
                            <UserPlus className="mr-2" />
                            Create New Account
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
