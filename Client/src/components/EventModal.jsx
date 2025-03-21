import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createEvent, updateEvent } from '../redux/slices/eventCalendarSlice';

const EventModal = ({ show, onClose, event, onSave }) => {
    const dispatch = useDispatch();
    const [imagePreview, setImagePreview] = useState(null);

    const [formData, setFormData] = useState({
        eventType: 'Public',
        name: '',
        start: '',
        end: '',
        location: '',
        description: '',
        status: 'Draft',
        organizer: '',
        image: null,
        tickets: [],
    });

    const formatDateTimeLocal = (date) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toISOString().slice(0, 16);
    };

    useEffect(() => {
        
        // Reset form data if no event is passed (creating a new event)
       // if (!event) {
        if (show && !event) {
            setFormData({
                eventType: 'Public',
                name: '',
                start: '',
                end: '',
                location: '',
                description: '',
                status: 'Draft',
                organizer: '',
                image: null,
                tickets: [],
            });
            setImagePreview(null); // Reset image preview
       // } else {
    } else if (show && event) {
            // Set form data from the passed event when editing
            setFormData({
                eventType: event.extendedProps?.eventType || 'Public',
                name: event.extendedProps?.name || '',
                start: formatDateTimeLocal(event.start) || '',
                end: formatDateTimeLocal(event.end) || '',
                location: event.extendedProps?.location || '',
                description: event.extendedProps?.description || '',
                status: event.extendedProps?.status || 'Draft',
                organizer: event.extendedProps?.organizer || '',
                image: event.extendedProps?.image || null,
                tickets: event.extendedProps?.tickets || [],
            });
            // Handle image preview for existing event image
            if (event.extendedProps?.image) {
                const imageSrc = typeof event.extendedProps.image === 'string'
                    ? event.extendedProps.image
                    : URL.createObjectURL(event.extendedProps.image);
                setImagePreview(imageSrc);
            } else {
                setImagePreview(null);
            }
        }
    }, [show, event]); // Only re-run when event changes

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file' && files && files[0]) {
            setFormData({ ...formData, [name]: files[0] });
            setImagePreview(URL.createObjectURL(files[0]));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleArrayChange = (index, field, value, key) => {
        const updatedArray = [...formData[key]];
        updatedArray[index] = { ...updatedArray[index], [field]: value }; // Create a new object
        setFormData({ ...formData, [key]: updatedArray });
    };

    const handleAddItem = (key, newItem) => {
        setFormData({ ...formData, [key]: [...formData[key], newItem] });
    };

    const handleRemoveItem = (key, index) => {
        const updatedArray = [...formData[key]];
        updatedArray.splice(index, 1);
        setFormData({ ...formData, [key]: updatedArray });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.start && formData.end && new Date(formData.end) < new Date(formData.start)) {
            alert("End date cannot be earlier than start date!");
            return;
        }


        const data = new FormData();

        for (const key in formData) {
            if (key === 'image' && formData.image) {
                data.append('image', formData.image);
            } else if (Array.isArray(formData[key])) {
                data.append(key, JSON.stringify(formData[key]));
            } else {
                data.append(key, formData[key]);
            }
        }

        if (event?.id) {
            const updatedEvent = await dispatch(updateEvent({ id: event.id, eventData: data })).unwrap();
            onSave(updatedEvent);
        } else {
            const newEvent = await dispatch(createEvent(data)).unwrap();
            onSave(newEvent);
        }
        onClose(); // Close the modal after saving
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-semibold mb-6">{event?.id ? 'Edit Event' : 'Add New Event'}</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {[{ label: 'Event Name', name: 'name', type: 'text' },
                    { label: 'Image', name: 'image', type: 'file' },
                    { label: 'Location', name: 'location', type: 'text' },
                    { label: 'Start Date & Time', name: 'start', type: 'datetime-local', min: new Date().toISOString().slice(0, 16) },
                    { label: 'End Date & Time', name: 'end', type: 'datetime-local', min: formData.start || new Date().toISOString().slice(0, 16) },
                    { label: 'Description', name: 'description', type: 'textarea' }].map((field, idx) => (
                        <div key={idx} className="flex flex-col space-y-2">
                            <label className="font-bold">{field.label}</label>
                            {field.type === 'textarea' ? (
                                <textarea name={field.name} value={formData[field.name] || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                            ) : field.type === 'file' ? (
                                <div>
                                    <input type="file" name={field.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                                    {imagePreview && (
                                        <div className="mt-4">
                                            <p className="text-sm text-gray-500">Image Preview:</p>
                                            <img src={imagePreview} alt="Preview" className="mt-2 max-h-40 rounded-md border" />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <input type={field.type} name={field.name} value={field.type !== 'file' ? formData[field.name] : undefined} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                            )}
                        </div>
                    ))}

                    {/* Event Type */}
                    <div className="flex flex-col space-y-2">
                        <label className="font-bold">Event Type</label>
                        <select
                            name="eventType"
                            value={formData.eventType || 'Public'}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md">
                            {['Corporate', 'Social', 'Public','Virtual'].map((type, idx) => (
                                <option key={idx} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    {/* Status */}
                    <div className="flex flex-col space-y-2">
                        <label className="font-bold">Status</label>
                        <select
                            name="status"
                            value={formData.status || 'Draft'}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md">
                            {['Draft', 'Published', 'Closed'].map((status, idx) => (
                                <option key={idx} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <h3 className="font-bold">Tickets</h3>
                        {formData.tickets.map((item, index) => (
                            <div key={index} className="space-y-2">
                                <input type="text" placeholder="Type" value={item.type} onChange={(e) => handleArrayChange(index, 'type', e.target.value, 'tickets')} className="w-full px-3 py-2 border rounded-md" />
                                <input type="number" placeholder="Price" value={item.price} onChange={(e) => handleArrayChange(index, 'price', e.target.value, 'tickets')} className="w-full px-3 py-2 border rounded-md" />
                                <input type="number" placeholder="Quantity" value={item.quantity} onChange={(e) => handleArrayChange(index, 'quantity', e.target.value, 'tickets')} className="w-full px-3 py-2 border rounded-md" />
                                <button type="button" onClick={() => handleRemoveItem('tickets', index)} className="text-red-500">Remove</button>
                            </div>
                        ))}
                        <button type="button" onClick={() => handleAddItem('tickets', { type: '', price: 0, quantity: 0 })} className="text-blue-500">Add Ticket</button>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded-md">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EventModal;
