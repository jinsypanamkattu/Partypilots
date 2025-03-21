import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  updateUserThunk,
  fetchUsersThunk,
  deleteUserThunk,
  addUserThunk,
  updateUserStatusThunk,
} from "../redux/slices/usersSlice";
import UserCard from "../components/UserCard";
import AddUserModal from "../components/AddUserModal";
import EditUserModal from "../components/EditUserModal";
import { TablePagination } from "@mui/material";

const ManageUsers = () => {
  const dispatch = useDispatch();
  const { users, status } = useSelector((state) => state.users);
  const loggedInUser = useSelector((state) => state.auth.user); // Get the logged-in user
  //console.log("user",loggedInUser);

  const filteredUsers = users.filter(user => user._id !== loggedInUser?._id); // Exclude logged-in user

  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default to 5 rows per page
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [newUserData, setNewUserData] = useState({ name: "", email: "", role: "attendee" });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editUserData, setEditUserData] = useState({ name: "", email: "", role: "attendee" });
  const [imagePreview, setImagePreview] = useState("");


  useEffect(() => {
    dispatch(fetchUsersThunk());
  }, [dispatch]);

  // Pagination Handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page when rows per page change
  };

  const handleDelete = (id) => dispatch(deleteUserThunk(id));

  const handleAddUser = () => {
    dispatch(addUserThunk(newUserData))
      .unwrap()
      .then(() => {
        dispatch(fetchUsersThunk());
        setIsAddModalOpen(false);
        
        setNewUserData({ name: "", email: "", password: "", role: "attendee", profileImage: "", phone: "", address: "" });
        setSuccessMessage("User added successfully! 🎉");
        setTimeout(() => setSuccessMessage(""), 3000);
      })
      .catch((error) => {
        console.error("Failed to add user:", error);
        setSuccessMessage("Failed to add user. Please try again.");
      });
  };

  const handleImageChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      if (isEdit) {
        setEditUserData((prev) => ({ ...prev, profileImage: file }));
        setImagePreview(previewURL);
      } else {
        setNewUserData((prev) => ({ ...prev, profileImage: file }));
        setImagePreview(previewURL);
      }
    }
  };
  
  const handleEditClick = (user) => {
    setEditUserData(user); // Load user data into state
    setIsEditModalOpen(true); // Open the modal
  };

  const handleSaveEdit = () => {
    const formData = new FormData();
    Object.entries(editUserData).forEach(([key, value]) => {
      if (key === "profileImage" && value instanceof File) {
        formData.append("profileImage", value); // Only append if it's a File
      } else {
        formData.append(key, value);
      }
    });

    dispatch(updateUserThunk({ id: editUserData._id, userData: formData }))
      .unwrap()
      .then((updatedUser) => {
        dispatch(fetchUsersThunk()); // Refetch the list to get fresh data
        setIsEditModalOpen(false);
        setEditUserData(updatedUser); // Update local state with fresh data
        setSuccessMessage("User updated successfully! 🎉");

        setTimeout(() => setSuccessMessage(""), 3000);
      })
      .catch((error) => {
        console.error("Failed to update user:", error);
        setSuccessMessage("Failed to update user. Please try again."); // Handle error case
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUserData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleToggleActive = (user) => {
   // console.log("user",user);
    // Toggle the status between 'active' and 'inactive'
    const updatedUser = { ...user, status: user.status === 'active' ? 'inactive' : 'active' };
  //console.log("updated",updatedUser);
    dispatch(updateUserStatusThunk({ id: user._id, userData: updatedUser }))
      .unwrap()
      .then(() => {
        dispatch(fetchUsersThunk()); // Refetch after update
        setSuccessMessage(`User ${updatedUser.status === 'active' ? "activated" : "deactivated"} successfully! 🎉`);
        setTimeout(() => setSuccessMessage(""), 3000);
      })
      .catch((error) => {
        console.error("Failed to update user status:", error);
        setSuccessMessage("Failed to update user status. Please try again.");
      });
  };

  const handleOpenAddUserModal = () => {
    setNewUserData({ name: "", email: "", password: "", role: "attendee", profileImage: "", phone: "", address: "" });
    setImagePreview(""); // Reset image preview as well
    setIsAddModalOpen(true);
  };
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 border border-green-400 rounded">
          {successMessage}
        </div>
      )}

      <div className="flex justify-end mb-6">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleOpenAddUserModal}
        >
          + Add New User
        </button>
      </div>

      {/* User Cards with Pagination */}
      {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (
        <UserCard key={user._id || index} user={user} onDelete={handleDelete} onToggleActive={handleToggleActive} onEdit={() => handleEditClick(user)} index={index}/>
      ))}

      {/* Add User Modal */}
      {isAddModalOpen && (
        <AddUserModal
          formData={newUserData}
          onChange={handleInputChange}
          onImageChange={(e) => handleImageChange(e, false)}
          imagePreview={imagePreview} // Pass 
          onSave={handleAddUser}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && (
        <EditUserModal
          user={editUserData}
          formData={editUserData}
          onChange={(e) => setEditUserData({ ...editUserData, [e.target.name]: e.target.value })}
          onImageChange={(e) => handleImageChange(e, true)}
          
          onSave={handleSaveEdit}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {/* Pagination Controls */}
      <TablePagination
        component="div"
        count={users.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
};

export default ManageUsers;
