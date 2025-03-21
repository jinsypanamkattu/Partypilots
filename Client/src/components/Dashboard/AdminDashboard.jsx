
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';
import Footer from '../Footer';




const AdminDashboard = () => {
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

        <Sidebar onLogout={handleLogout} />

        <div className="flex-1 p-16 overflow-auto ">
    {loading && <p className="text-gray-500 animate-pulse">Loading dashboard...</p>}
    {error && (
        <div className="text-center">
        <p className="text-red-500 text-3xl font-bold mb-6 mt-19">
            {error}
        </p>
        <div className="flex justify-center gap-4">
            <button
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
                onClick={() => window.location.reload()}
            >
                Refresh Page
            </button>
           
        </div>
    </div>
        
    )}
    {!loading && !error && <Outlet />}
</div>


      </div>
      <div>
        
      </div>
      <Footer />
    </>
  );
};

export default AdminDashboard;
