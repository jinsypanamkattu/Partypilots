import React, { useState, useEffect } from 'react';
import getUserIdFromToken from '../../../utility/auth';

import axiosInstance from "../../../services/axios";
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from 'recharts';

const cardStyle = {
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    margin: '12px',
    overflow: 'hidden'
};

const cardHeaderStyle = {
    padding: '16px',
    borderBottom: '1px solid #e2e8f0'
};

const cardTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    margin: '0'
};

const cardContentStyle = {
    padding: '16px'
};

const EventManagementOrganizerDashboard = () => {
    const [monthlyData, setMonthlyData] = useState([]);
    const [eventTypeData, setEventTypeData] = useState([]);
    const [attendeeData, setAttendeeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const id = getUserIdFromToken();
                //
                console.log('User ID:', id);
                setLoading(true);

                const [monthlyRes, attendeeRes] = await Promise.all([
                    axiosInstance.get(`/reports/monthly-stats/${id}`),
                    
                    axiosInstance.get(`/reports/attendee-stats/${id}`),
                ]);

               console.log('Monthly Data:', monthlyRes);
               // console.log('Event Types Data:', typesRes.data);
                console.log('Attendee Data:', attendeeRes);

                setMonthlyData(monthlyRes.data);
                
                setAttendeeData(attendeeRes.data);

                setError(null);
            } catch (err) {
                console.error('Error fetching data:', err);
                console.error('Full error response:', err.response); // Log the full error response
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading dashboard data...</div>;
    }

    if (error) {
        return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</div>;
    }

    if (!Array.isArray(eventTypeData)) {
        console.error('eventTypeData is not an array:', eventTypeData);
        return <div>Error: Invalid data format</div>;
    }

    return (
        <div style={{ display: 'flex', gap: '16px', padding: '16px' }}>
        {/* Monthly Events Breakdown */}
        <div style={{ ...cardStyle, flex: 1 }}>
            <div style={cardHeaderStyle}>
                <h3 style={cardTitleStyle}>Monthly Event Distribution</h3>
            </div>
            <div style={cardContentStyle}>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="corporateEvents" stackId="a" fill="#0088FE" />
                        <Bar dataKey="socialEvents" stackId="a" fill="#00C49F" />
                        <Bar dataKey="virtualEvents" stackId="a" fill="#FFBB28" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    
        {/* Event Type Attendance */}
        <div style={{ ...cardStyle, flex: 1 }}>
            <div style={cardHeaderStyle}>
                <h3 style={cardTitleStyle}>Event Type Attendance</h3>
            </div>
            <div style={cardContentStyle}>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={attendeeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="eventType" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="attendeeCount" fill="#36A2EB" name="Total Attendees" barSize={30} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
    
    );
};

export default EventManagementOrganizerDashboard;