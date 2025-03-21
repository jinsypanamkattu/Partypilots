import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOrganizerEvents, getEvents, reset } from '../redux/slices/eventCalendarSlice';
import EventModal from '../components/EventModal';
import AdminEventCard from '../components/AdminEventCard';
import axios from "axios";


const ManageOrganizerEvents = () => {
  const dispatch = useDispatch();
  const { events, isLoading, isError, message } = useSelector(state => state.events);
  
  const { user, status } = useSelector(state => state.auth);
  
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default to 5 rows per page
  const [isActive, setIsActive] = useState(events.state);
  
  // Fetch events on component mount
  useEffect(() => {
    dispatch(getOrganizerEvents());
    
  }, [dispatch]);
  //console.log("events",events);
  const handleDelete = (id) => {
    try {
      dispatch(deleteEvents(id));
    } catch (error) {
      setErrorMessage('Error deleting event: ' + error.message);
    }
  };
  
  const handleToggleActive = (eventId) => {
    console.log("Toggle event active status for ID:", eventId);
    // Add your logic to toggle the event's active status here
    try {
        // Toggle the local state first
        setIsActive((prevState) => !prevState);
  
        // Send request to update the event's active status in the backend
        const response =  axios.patch(
          `/api/events/${eventId}/toggle-active`,
          {
            isActive: !isActive, // Update status to the opposite of the current state
          }
        );
  
        // Optionally: Handle any response from the backend here
        if (response.status === 200) {
          console.log("Event status updated successfully");
        }
      } catch (error) {
        // If there was an error, revert the state change
        console.error("Error toggling event active status:", error);
        setIsActive(event.isActive); // Revert to original status in case of error
      }
  };

  // Handle event click
  const handleEventClick = (info) => {
    //console.log(info);
   // setSelectedEvent(null);
    const originalEvent = events.find(e => e._id === info._id);
    
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
    try {
      dispatch(getOrganizerEvents()); // Refetch events to get the latest updates
      setShowModal(false);
      setSelectedEvent(null);
      setSuccessMessage('Event updated successfully!'); // Show success message after save
      setTimeout(() => {
        setSuccessMessage(''); // Clear success message after a few seconds
      }, 3000); // Hide the success message after 3 seconds
    } catch (error) {
      setErrorMessage('Error updating event: ' + error.message); // Show error if saving fails
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6">Manage Events</h2>
      
      {/* Success message display */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}

      {/* Error message display */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {errorMessage}
        </div>
      )}
      
      <div className="mb-4 flex justify-end items-center">
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

      {/* Event Cards with Pagination */}
      {events.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((event, index) => (
        <AdminEventCard 
          key={event._id || index} 
          event={event} 
          onDelete={handleDelete} 
          onEdit={() => handleEventClick(event)} 
          index={index} 
          onToggleActive={handleToggleActive}
        />
      ))}

      <EventModal 
        show={showModal}
        onClose={handleModalClose}
        event={selectedEvent}
        onSave={handleSave}
      />
    </div>
  );
};

export default ManageOrganizerEvents;
