import { Input } from "./ui/input";
import { Button } from "./ui/button";

const AddUserModal = ({ formData, onChange, onImageChange, imagePreview, onSave, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Add New User</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="font-medium w-1/3">Name:</label>
            <Input name="name" value={formData.name || ''} onChange={onChange} placeholder="Name" className="flex-1" />
          </div>
          <div className="flex items-center gap-4">
            <label className="font-medium w-1/3">Email:</label>
            <Input name="email" value={formData.email || ''} onChange={onChange} placeholder="Email" className="flex-1" />
          </div>
          <div className="flex items-center gap-4">
            <label className="font-medium w-1/3">Password:</label>
            <Input type="password" name="password" value={formData.password || ''} onChange={onChange} placeholder="Password" className="flex-1" />
          </div>
          <div className="flex items-center gap-4">
            <label className="font-medium w-1/3">Role:</label>
            <select name="role" value={formData.role || ''} onChange={onChange} className="p-2 border rounded flex-1">
              <option value="organizer">Organizer</option>
              <option value="attendee">Attendee</option>
            </select>
          </div>
          <div>
            <div className="flex items-center gap-4">
              <label className="font-medium w-1/3">Profile Image:</label>
              <input
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={onImageChange}
                className="input"
              />
            </div>
            {imagePreview && (
              <div className="mt-4 flex justify-center">
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="w-24 h-24 object-cover rounded-full border"
                />
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <label className="font-medium w-1/3">Phone:</label>
            <Input name="phone" value={formData.phone || ''} onChange={onChange} placeholder="Phone" className="flex-1" />
          </div>
          <div className="flex items-center gap-4">
            <label className="font-medium w-1/3">Address:</label>
            <Input name="address" value={formData.address || ''} onChange={onChange} placeholder="Address" className="flex-1" />
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <Button onClick={onSave} className="bg-green-500 hover:bg-green-600 border rounded p-2 text-white">
            Add User
          </Button>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
