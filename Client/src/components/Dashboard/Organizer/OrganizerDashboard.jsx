
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../../redux/slices/authSlice';
import OrganizerSidebar from './OrganizerSideBar';
import Navbar from '../../Navbar';
import Footer from '../../Footer';
//import EventUserChart from '../../components/UserRegistrationForEventStatusChart';



const OrganizerDashboard = () => {
  const { loading, error } = useSelector((state) => state.users);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    navigate('/login');
  };


  return (
    <>
      <Navbar />
      <div className="flex h-[90vh] bg-gray-100">

        <OrganizerSidebar onLogout={handleLogout} />

        <div className="flex-1 p-16 overflow-auto">
          {loading && <p className="text-gray-500 animate-pulse">Loading dashboard...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && <Outlet />}
        </div>

      </div>
      <div>
       
      </div>
      <Footer />
    </>
  );
};

export default OrganizerDashboard;
