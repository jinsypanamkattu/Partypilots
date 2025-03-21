const AdminEventCard = ({ event, onEdit, onDelete, index, onToggleActive }) => {
    return (
        <tr>
            <td className="border px-4 py-2 text-center">{index + 1}</td>
            <td className="border px-4 py-2">
                <img src={event.image || '/placeholder.png'} alt={event.name} className="w-20 h-20 object-cover rounded-md border" />
            </td>
            <td className="border px-4 py-2">
                <p className="text-lg font-semibold">{event.name}</p>
            </td>
            <td className="border px-4 py-2 text-center">
                <span className={`px-3 py-1 text-sm font-semibold border rounded-lg ${event.status === 'Published' ? 'bg-green-100 text-green-700 border-green-500' : 'bg-yellow-100 text-yellow-700 border-yellow-500'}`}>
                    {event.status}
                </span>
            </td>
            <td className="border px-4 py-2 text-center">
                <div className="flex items-center gap-2">
                    <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"  onClick={onEdit}>Edit</button>
                    


                    <button onClick={() => onToggleActive(event)} className={`px-3 py-1 rounded ${event.state === 'active' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'} text-white`}>
                        {event.state === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default AdminEventCard;

