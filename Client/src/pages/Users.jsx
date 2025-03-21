import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import userService from '../services/userService';
import { logout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Users = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await userService.getUserProfile(token);
        setUserData(data);
      } catch (err) {
        setError(err);
      }
    };

    if (token) fetchUserData();
    else navigate('/'); // Redirect to login if no token
  }, [token, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>User Dashboard</h1>
      {userData ? (
        <div>
          <p>Welcome, {userData.name}!</p>
          <p>Email: {userData.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Users;

