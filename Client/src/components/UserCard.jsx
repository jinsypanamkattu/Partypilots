import { Button } from "./ui/button";

const UserCard = ({ user, onEdit, onToggleActive, onDelete, index }) => {
    return (
        <div className="p-4 bg-white shadow rounded-md flex justify-between items-center mb-2">
            {/* Serial Number */}
            <div className="text-center w-12">
                <p className="text-lg font-semibold">{index + 1}</p>
            </div>

            {/* User Details and Profile Image */}
            <div className="flex items-center justify-center gap-4 flex-1">
                {/* Profile Image */}
                <div className="w-16 h-16">
                    <img
                        src={user.profileImage || '/placeholder.png'}
                        alt={user.name}
                        className="w-full h-full object-cover rounded-full border"
                    />
                </div>

                {/* User Info */}
                <div className="text-center">
                    <p className="text-lg font-semibold">{user.name}</p>
                    <p className="text-gray-500">{user.email}</p>
                    <p className={`mt-2 ${user.status === 'active' ? 'text-blue-500' : 'text-red-500'}`}>
                        Status: {user.status === 'active' ? 'Active' : 'Inactive'}
                    </p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
                <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    onClick={onEdit}
                >
                    Edit
                </button>
                {/* Toggle Active/Inactive Button */}
                <button
                    onClick={() => onToggleActive(user)}
                    className={`px-4 py-2 rounded ${user.status === 'active' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'
                        } text-white`}
                >
                    {user.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>

            </div>
        </div>
    );
};

export default UserCard;
