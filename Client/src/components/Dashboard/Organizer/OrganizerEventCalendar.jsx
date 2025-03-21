// src/components/EventCalendar.jsx 
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { getOrganizerEvents , reset } from '../../../redux/slices/eventCalendarSlice';
import EventModal from '../../EventModal';
//import Tooltip from 'react-tooltip';
import '../../../styles/calendar.css'; // If you created this file

const OrganizerEventCalendar = () => {
  const dispatch = useDispatch();
  const { events, isLoading, isError, message } = useSelector(state => state.events);

  const { user, status } = useSelector(state => state.auth);
  
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formattedEvents, setFormattedEvents] = useState([]);

  // Fetch events on component mount
  useEffect(() => {
    dispatch(getOrganizerEvents());
    
    // Cleanup function
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  // Format date for FullCalendar
const formatDateTime = (date) => {
    if (!date) return '';
    return date.slice(0, 16); // Trim seconds and milliseconds if needed
  };

  // Format events for FullCalendar when events state changes
  useEffect(() => {
    if (events.length > 0) {
      const formatted = events.map(event => ({
        id: event._id,
        title: event.name,
        start: formatDateTime(event.start),
        end: formatDateTime(event.end),
        extendedProps: {
          name: event.name,
          description: event.description,
          location: event.location,
          start:event.start,
          end: event.end,
          eventType: event.eventType,
          status:event.status,
          image:event.image,
          tickets:event.tickets,
          // Add other fields from your schema
        }
      }));
      setFormattedEvents(formatted);
    }
  }, [events]);

  // Handle date click
  const handleDateClick = (info) => {
    setSelectedEvent({
      start: info.dateStr,
      end: info.dateStr
    });
    setShowModal(true);
  };

  // Handle event click
  const handleEventClick = (info) => {
    // Find the original event data
    const originalEvent = events.find(e => e._id === info.event.id);
    
    if (originalEvent) {
      setSelectedEvent({
        id: originalEvent._id,
        title: originalEvent.name,
        start: originalEvent.start,
        end: originalEvent.end,
        extendedProps: {
          name: originalEvent.name,
          description: originalEvent.description,
          location: originalEvent.location,
          start:originalEvent.start,
          end: originalEvent.end,
          eventType: originalEvent.eventType,
          status:originalEvent.status,
          image:originalEvent.image,
          tickets:originalEvent.tickets,

         
          // Other properties
        }
      });
      setShowModal(true);
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  // Handle after save
  const handleSave = () => {
    
    // The state will update automatically through Redux
    dispatch(getOrganizerEvents()); // Refetch events to get the latest updates
    setShowModal(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Event Calendar</h2>
        <button 
          onClick={() => {
            setSelectedEvent(null);
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 ease-in-out"
        >
          Add New Event
        </button>
      </div>
      
      {isError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          Error loading events: {message}
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="fc-custom-styles">
          <FullCalendar
  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
  initialView="dayGridMonth"
  headerToolbar={{
    left: 'prev,next today',
    center: 'title',
    right: ''
  }}
  events={formattedEvents}
  editable={true}
  selectable={true}
  selectMirror={true}
  dayMaxEvents={true}
  weekends={true}
  dateClick={handleDateClick}
  eventClick={handleEventClick}
  eventColor="#3B82F6"
  height="auto"
  eventContent={(eventInfo) => (
    <div className="flex items-center">
      <span className="mr-2">📅</span>
      <span>{eventInfo.event.title}</span>
    </div>
  )}
/>
        </div>
      )}
      
      <EventModal 
        show={showModal}
        onClose={handleModalClose}
        event={selectedEvent}
        onSave={handleSave}
      />
    </div>
  );
};

export default OrganizerEventCalendar;
