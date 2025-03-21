import axiosInstance from './axios.jsx';


export const fetchUsers = async () => {
    try {
        const response = await axiosInstance.get('/user/list');
        return response.data;
    } catch (error) {
        console.error('Listing User error response:', error.response);
        throw error.response?.data?.message || 'User Listing failed';
    }

};

export const addUser = async (userData) => {
    try {
        const formData = new FormData();

        // Append all user data to formData
        for (const key in userData) {
            formData.append(key, userData[key]);
        }

        // Send data to your backend
        const response = await axiosInstance.post('/user/register', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        //const response = await axiosInstance.post('/user/register', userData);
        //console.log(response);
        return response.data;
    } catch (error) {
        console.error('Add user error response:', error.response);
        throw error.response?.data?.message || 'User creation failed';
    }

};

export const updateUser = async (id, userData) => {
    try {
        
        const response = await axiosInstance.put(`/user/update/${id}`, userData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        console.error('Update error response:', error.response);
        throw error.response?.data?.message || 'Updation unsuccessful';
    }

};


export const updateUserStatus = async (id, userData) => {
    try {
        //console.log("service",userData);
        const response = await axiosInstance.patch(`/user/update/${id}/status`, userData);
        return response.data;
    } catch (error) {
        console.error('Update error response:', error.response);
        throw error.response?.data?.message || 'Updation unsuccessful';
    }

};

export const deleteUser = async (id) => {
    try {
        const response = await axiosInstance.delete(`/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error('Delete error response:', error.response);
        throw error.response?.data?.message || 'Deletion unsuccessful';
    }

};
