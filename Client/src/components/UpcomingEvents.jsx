import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axios';

export default function UpcomingEvents() {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch latest 5 events from backend
        axiosInstance.get("/event/latest")
            .then((response) => {
                setEvents(response.data); // Assuming API returns latest events
            })
            .catch((error) => console.error("Error fetching events:", error));
    }, []);

    // Handle navigation to event details
    const handleEventClick = (eventId) => {
        navigate(`/events/${eventId}`);
    };

    // Create a unique key for each duplicated event
    const duplicatedEvents = events.length > 0 
        ? [...events, ...events].map((event, index) => ({
            ...event,
            uniqueKey: `${event._id || 'event'}-${index}`
        }))
        : [];

    return (
        <div className="relative w-full max-w-md mx-auto overflow-hidden">
            <h2 className="text-4xl font-extrabold text-center bg-gradient-to-r from-[#40E0D0] to-[#8FBC8F] text-transparent bg-clip-text drop-shadow-md mb-6">
                Upcoming Events
            </h2>

            <div className="h-[500px] overflow-hidden relative">
                <motion.div
                    className="space-y-6"
                    initial={{ y: "0%" }}
                    animate={{ y: "-100%" }}
                    transition={{
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 20, // Adjust speed of scroll
                        ease: "linear",
                    }}
                >
                    {duplicatedEvents.map((event) => (
                        <div 
                            key={event.uniqueKey} 
                            className="flex flex-col items-center p-4 bg-white shadow-lg rounded-lg"
                        >
                            <div 
                                onClick={() => handleEventClick(event._id)}
                                className="w-full cursor-pointer hover:opacity-80 transition-opacity duration-300"
                            >
                                <img
                                    src={event.image}
                                    alt={event.name}
                                    className="w-full h-64 object-cover rounded-md"
                                />
                            </div>
                            <h3 className="mt-3 text-xl font-bold text-[#789972] text-center">
                                {event.title}
                            </h3>
                            <p className="text-gray-600 text-sm text-center">
                                {event.name}
                            </p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}