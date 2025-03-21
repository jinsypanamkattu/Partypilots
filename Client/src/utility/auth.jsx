import { jwtDecode } from 'jwt-decode';

const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decoded = jwtDecode(token);
           
            return decoded.id; // Return the user ID
        } catch (error) {
            console.error('Failed to decode token:', error);
        }
    }
    return null;
};
export default  getUserIdFromToken;
