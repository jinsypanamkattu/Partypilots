import React, { useState, useEffect } from 'react';
//import axios from 'axios';
import axiosInstance from "../../services/axios";
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

const EventManagementDashboard = () => {
    const [monthlyData, setMonthlyData] = useState([]);
    const [eventTypeData, setEventTypeData] = useState([]);
    const [attendeeData, setAttendeeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [monthlyRes, typesRes, attendeeRes] = await Promise.all([
                    axiosInstance.get('/reports/monthly-stats'),
                    axiosInstance.get('/reports/event-types'),
                    axiosInstance.get('/reports/attendee-stats'),
                ]);

               // console.log('Monthly Data:', monthlyRes.data);
                //console.log('Event Types Data:', typesRes.data);
                //console.log('Attendee Data:', attendeeRes.data);

                setMonthlyData(monthlyRes.data);
                setEventTypeData(typesRes.data);
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px', padding: '16px' }}>
            {/* Monthly Events Breakdown */}
            <div style={cardStyle}>
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

            {/* Event Types Pie Chart */}
            <div style={cardStyle}>
                <div style={cardHeaderStyle}>
                    <h3 style={cardTitleStyle}>Event Types Composition</h3>
                </div>
                <div style={cardContentStyle}>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={eventTypeData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                activeIndex={activeIndex}
                                activeShape={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                                    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

                                    return (
                                        <g>
                                            <text x={x} y={y} textAnchor="middle" fill="white">
                                                {`${(percent * 100).toFixed(0)}%`}
                                            </text>
                                        </g>
                                    );
                                }}
                                onMouseEnter={onPieEnter}
                            >
                                {eventTypeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div style={{ ...cardStyle, gridColumn: '1 / -1' }}>
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
                            <Bar dataKey="attendeeCount" fill="#36A2EB" name="Total Attendees"/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default EventManagementDashboard;