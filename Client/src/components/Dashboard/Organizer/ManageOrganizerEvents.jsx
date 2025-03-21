import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOrganizerEvents, updateEventsStatus, reset } from '../../../redux/slices/eventCalendarSlice';
import EventModal from '../../EventModal';
import AdminEventCard from '../../../components/AdminEventCard';

const ManageOrganizerEvents = () => {
  const dispatch = useDispatch();
  const { events, isLoading, isError, message } = useSelector(state => state.events);

  const { user, status } = useSelector(state => state.auth);

  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Default to 5 rows per page
  const eventsArray = Array.isArray(events) ? events : [];


  // Fetch events on component mount
  useEffect(() => {
    dispatch(getOrganizerEvents());
  }, [dispatch]);

  const handleDelete = (id) => {
    try {
      dispatch(deleteEvents(id));
    } catch (error) {
      setErrorMessage('Error deleting event: ' + error.message);
    }
  };

  // Handle event click
  const handleEventClick = (info) => {
    //console.log(info);
    // setSelectedEvent(null);
    const originalEvent = eventsArray.find(e => e._id === info._id);

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
          start: originalEvent.start,
          end: originalEvent.end,
          eventType: originalEvent.eventType,
          status: originalEvent.status,
          image: originalEvent.image,
          tickets: originalEvent.tickets,
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




  const handleToggleActive = (event) => {
    console.log("user", event);
    // Toggle the status between 'active' and 'inactive'
    const updatedEvent = { ...event, state: event.state === 'active' ? 'inactive' : 'active' };
    console.log("updated", updatedEvent);
    dispatch(updateEventsStatus({ id: event._id, eventData: updatedEvent }))
      .unwrap()
      .then(() => {
        dispatch(getOrganizerEvents()); // Refetch after update
        setSuccessMessage(`Event ${updatedEvent.state === 'active' ? "activated" : "deactivated"} successfully!`);
        setTimeout(() => setSuccessMessage(""), 3000);
      })
      .catch((error) => {
        console.error("Failed to update event state:", error);
        setSuccessMessage("Failed to updated event state. Please try again.");
      });
  };



  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Manage Events</h2>
      {successMessage && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">{successMessage}</div>}
      {errorMessage && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{errorMessage}</div>}

      <div className="mb-4 flex justify-end items-center">
        <button onClick={() => {
          setSelectedEvent(null); // Ensure no event is selected (adding a new event)
          setShowModal(true);
        }} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md">
          Add New Event
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">Image</th>
              <th className="border px-4 py-2">Event Name</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {eventsArray.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No events found.
                </td>
              </tr>
            ) : (
              eventsArray
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((event, index) => (
                  <AdminEventCard
                    key={event._id || index}
                    event={event}
                    onDelete={handleDelete}
                    onEdit={() => handleEventClick(event)}
                    onToggleActive={() => handleToggleActive(event)}
                    index={index}
                  />
                ))
            )}
          </tbody>


        </table>
      </div>
      {/* Pagination controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 0}
          className={`py-2 px-4 rounded ${page === 0 ? 'bg-gray-300' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
        >
          Previous
        </button>

        <span className="text-gray-700">
          Page {page + 1} of {Math.ceil(eventsArray.length / rowsPerPage)}
        </span>

        <button
          onClick={() => setPage(page + 1)}
          disabled={page >= Math.ceil(eventsArray.length / rowsPerPage) - 1}
          className={`py-2 px-4 rounded ${page >= Math.ceil(eventsArray.length / rowsPerPage) - 1 ? 'bg-gray-300' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
        >
          Next
        </button>
      </div>

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
