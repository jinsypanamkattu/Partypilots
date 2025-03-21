import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrganizerDashboardData } from '../../../redux/slices/dashboardSlice';
import { FaUsers, FaCalendarAlt, FaTicketAlt, FaCreditCard, FaChartBar, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { MdEvent } from 'react-icons/md';
const OrganizerDashboardOverview = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    //alert("hii");
    dispatch(fetchOrganizerDashboardData());
  }, [dispatch]);


  const { dashboardStats, loading, error } = useSelector((state) => state.dashboard);
  //console.log("dashboardStats:", dashboardStats);
    return (
      <div>
          <div className="dashboard-overview mt-19">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              
              <div className="stat-card bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-purple-800">Total Events</h3>
                    <p className="text-4xl font-bold mt-2">{dashboardStats?.totalEvents ?? 0}</p>
                  </div>
                  <MdEvent size={40} className="text-purple-500" />
                </div>
              </div>
              
              <div className="stat-card bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">Total Bookings</h3>
                    <p className="text-4xl font-bold mt-2">{dashboardStats?.totalBookings ?? 0}</p>
                  </div>
                  <FaTicketAlt size={40} className="text-green-500" />
                </div>
              </div>
              
              <div className="stat-card bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-800">Total Revenue</h3>
                    <p className="text-4xl font-bold mt-2">${dashboardStats?.totalRevenue.toLocaleString() ?? 0}</p>
                  </div>
                  <FaCreditCard size={40} className="text-yellow-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  };
  
  export default OrganizerDashboardOverview;
  