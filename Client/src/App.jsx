import React, { Suspense } from 'react';
import './App.css';
import { useSelector } from 'react-redux';
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';

//import { Elements } from '@stripe/react-stripe-js';
//
// import { loadStripe } from '@stripe/stripe-js';
//included to get the state user in profile page

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUser } from './redux/slices/authSlice';


//const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
//console.log(stripePublicKey);

    


import AdminDashboard from './components/Dashboard/AdminDashboard';
import DashboardOverview from './components/Dashboard/DashboardOverview';
import OrganizerDashboard from './components/Dashboard/Organizer/OrganizerDashboard';
import OrganizerDashboardOverview from './components/Dashboard/Organizer/OrganizerDashboardOverview';

import ManageUsers from './pages/ManageUsers';
import ManageEvents from './pages/ManageEvents';

import EventCalendar from './components/EventCalendar';
import HomePage from './pages/HomePage';





import PaymentSuccess from './pages/PaymentSuccess';
import MainLayout from './components/MainLayout';
import EventDetailPage from './pages/EventDetailPage';
import EventListingPage from './pages/EventListingPage';
import Login from './pages/Login';

import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";

import ProfilePage from './pages/ProfilePage';

import RegistrationForm from './pages/RegistrationForm';
import ConfirmPayment from './pages/ConfirmPayment';
import ManageOrganizerEvents from './components/Dashboard/Organizer/ManageOrganizerEvents';
import ManageBookings from './components/Dashboard/ManageBookings';
import EventManagementDashboard from './components/Dashboard/EventManagementDashboard';
import AdminPaymentsDashboard from './components/Dashboard/AdminPaymentsDashboard';
import AboutPage from './pages/About';
import Contact from './pages/Contact';
import ManageOrganizerBookings from './components/Dashboard/Organizer/ManageOrganizerBookings';
import ManageOrganizerPayments from './components/Dashboard/Organizer/ManageOrganizerPayments';
import EventManagementOrganizerDashboard from './components/Dashboard/Organizer/EventManagementOrganizerDashboard';
import OrganizerEventCalendar from './components/Dashboard/Organizer/OrganizerEventCalendar';
import ManageReports from './components/Dashboard/ManageReports'

// Protected route component
const ProtectedRoute = ({ element, allowedRoles }) => {
    const { user, token } = useSelector((state) => state.auth);

    if (!token) return <Navigate to="/login" />;

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/unauthorized" />;
    }

    return element;
};

// Create the router
const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <div className=" flex h-screen">
                <div className="flex-1 flex flex-col">
                    <div className="flex-1 overflow-y-auto">
                        <Suspense fallback={<div>Loading...</div>}>
                            <HomePage />
                        </Suspense>
                    </div>
                    
                </div>
            </div>
        ),
    },
    { path: '/login', element: <MainLayout><Login /></MainLayout> },
    { path: '/register', element: <MainLayout><RegistrationForm /></MainLayout> },
    { path: '/unauthorized', element: <MainLayout><div>Unauthorized Access</div></MainLayout> },
    { path:'/confirmPayment',element:<MainLayout><ConfirmPayment /></MainLayout>},
    { path:'/payment-success',element:<MainLayout><PaymentSuccess/></MainLayout>},
    { path:'/about',element:<MainLayout><AboutPage/></MainLayout>},
    { path: '/contact', element: <MainLayout><Contact/></MainLayout> },

    {
        path: '/dashboard/admin',
        element: <AdminDashboard />,
        children: [
            {
                index: true,
                element: (
                   
                     <div className="flex flex-col gap-4 p-4">
                        <DashboardOverview />
                        <EventManagementDashboard />
                    </div>
                ),
            },
            
            { path: 'users', element: <ManageUsers /> },
            { path: 'events', element: <ManageEvents /> },
            { path: 'bookings', element: <ManageBookings /> },
            { path: 'payments', element: <AdminPaymentsDashboard /> },
            { path: 'calendar', element: <EventCalendar /> },
            { path: 'reports', element: <ManageReports /> },
           
        ],
    },
    {
        path: '/dashboard/organizer',
        element: <OrganizerDashboard />,
        children: [

            {
                index: true,
                element: (
                   
                     <div className="flex flex-col gap-4 p-4">
                        <OrganizerDashboardOverview />
                        <EventManagementOrganizerDashboard />
                    </div>
                ),
            },
           
            { path: 'events', element: <ManageOrganizerEvents /> },
            { path: 'bookings', element: <ManageOrganizerBookings /> },
            { path: 'payments', element: <ManageOrganizerPayments/> },
            { path: 'reports', element: <ManageReports /> },
            { path: 'calendar', element: <OrganizerEventCalendar /> },
           
        ],
    },
    { path: '/events', element: <MainLayout><EventListingPage /></MainLayout> },
    { path: '/events/:eventId', element: <MainLayout><EventDetailPage /></MainLayout> },
    { path: '/profile', element: <MainLayout><ProfilePage /></MainLayout> },
    { path: '/forgot-password', element: <MainLayout><ForgotPassword /></MainLayout> },
    { path: '/verify-otp', element: <MainLayout><VerifyOTP  /></MainLayout> },
    { path: '/reset-password', element: <MainLayout><ResetPassword  /></MainLayout> },
        
    { path: '*', element: <Navigate to="/login" /> },
    
   
       
    
]);

function App() {
    
    const dispatch = useDispatch();
    useEffect(() => {
       

        const token = localStorage.getItem('token');
        if (token) {
            dispatch(fetchUser());
        }
    }, [dispatch]);
 
    return (
        
            <RouterProvider router={router} />
        
    );
}

export default App;
