import { useState } from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  Button,
  IconButton,
  AppBar,
  Toolbar
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { FaBars, FaUsers, FaCalendarAlt, FaTicketAlt, FaCreditCard, FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import { MdEvent } from 'react-icons/md';
import { useMediaQuery } from '@mui/material';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <FaChartBar size={20} />, path: '/dashboard/admin' },
  { id: 'users', label: 'Manage Users', icon: <FaUsers size={20} />, path: '/dashboard/admin/users' },
  { id: 'events', label: 'Manage Events', icon: <MdEvent size={20} />, path: '/dashboard/admin/events' },
  { id: 'bookings', label: 'Manage Bookings', icon: <FaTicketAlt size={20} />, path: '/dashboard/admin/bookings' },
  { id: 'payments', label: 'Manage Payments', icon: <FaCreditCard size={20} />, path: '/dashboard/admin/payments' },
  { id: 'reports', label: 'Reports', icon: <FaChartBar size={20} />, path: '/dashboard/admin/reports' },
  { id: 'calendar', label: 'Calendar', icon: <FaCalendarAlt size={20} />, path: '/dashboard/admin/calendar' },
];

const Sidebar = ({ onLogout }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(location.pathname);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 900px)');

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <Box sx={{ width: 240, backgroundColor: '#1e293b', height: '100vh', color: 'white' }}>
      <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.id}
            component={Link}
            to={item.path}
            selected={activeTab === item.path}
            onClick={() => {
              setActiveTab(item.path);
              setMobileOpen(false);
            }}
            sx={{
              color: 'white',
              '&.Mui-selected': { backgroundColor: '#6366F1', color: 'white' },
              '&:hover': { backgroundColor: '#4F46E5' },
            }}
          >
            <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ position: 'absolute', bottom: 20, width: '100%', textAlign: 'center' }}>
        <Button
          variant="contained"
          color="error"
          startIcon={<FaSignOutAlt />}
          onClick={handleLogout}
          sx={{ width: '80%', mx: 'auto' }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={toggleDrawer}
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            backgroundColor: '#1e293b',
            color: '#ffffff',
            height: '100vh',
          },
        }}
      >
        {drawerContent}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {isMobile && (
          <AppBar position="fixed" sx={{ backgroundColor: '#1e293b', zIndex: 1201 }}>
            <Toolbar>
              <IconButton onClick={toggleDrawer} sx={{ color: 'white' }}>
                <FaBars size={24} />
              </IconButton>
            </Toolbar>
          </AppBar>
        )}
      </Box>
    </Box>
  );
};


export default Sidebar;
