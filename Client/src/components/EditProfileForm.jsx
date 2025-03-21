// userService.js


export const updateUserProfileTest = async (formData) => {
    try {
        const response = await axios.put('/api/users/profile', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
};

// EditProfileForm.js
import { useState } from "react";
import { updateUser } from '../services/manageUserService';

export function EditProfileForm({ user, onProfileUpdate }) {
    //console.log("edit",user);
    const [formData, setFormData] = useState({

        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        profileImage: user?.profileImage || '',
    });
    //console.log(formData);
    const [imagePreview, setImagePreview] = useState(user?.profileImage || '');
    const [loading, setLoading] = useState(false); // Loading state

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
            setFormData({ ...formData, profileImage: file });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading

        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("phone", formData.phone);
        formDataToSend.append("address", formData.address);
        if (formData.profileImage instanceof File) {
            formDataToSend.append("profileImage", formData.profileImage);
        }

        try {
            await updateUser(user?._id || '', formDataToSend);
            onProfileUpdate(); // Trigger success message
        } catch (error) {
            alert("Failed to update profile");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            {imagePreview && (
                <img
                    src={imagePreview}
                    alt="Profile Preview"
                    className="w-32 h-32 mx-auto rounded-full border-4 border-blue-300"
                />
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full p-2 border rounded" />
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full p-2 border rounded" />
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" />
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="w-full p-2 border rounded" />
            <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="w-full p-2 border rounded" />
            <button
                type="submit"
                className="bg-gradient-to-r from-teal-400 to-green-500 text-white p-2 rounded font-semibold transition-all duration-300 disabled:opacity-50"
                disabled={loading}
            >
                {loading ? "Saving..." : "Save Changes"}
            </button>

        </form>
    );
}

