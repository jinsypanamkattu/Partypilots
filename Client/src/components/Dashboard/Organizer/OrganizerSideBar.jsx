import { useState } from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Button,
  IconButton,
  useMediaQuery
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../../redux/slices/authSlice';
import { FaUsers, FaCalendarAlt, FaTicketAlt, FaCreditCard, FaChartBar, FaCog, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { MdEvent } from 'react-icons/md';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <FaChartBar size={20} />, path: '/dashboard/organizer' },
  { id: 'events', label: 'Manage Events', icon: <MdEvent size={20} />, path: '/dashboard/organizer/events' },
  { id: 'bookings', label: 'Manage Bookings', icon: <FaTicketAlt size={20} />, path: '/dashboard/organizer/bookings' },
  { id: 'payments', label: 'Manage Payments', icon: <FaCreditCard size={20} />, path: '/dashboard/organizer/payments' },
  { id: 'reports', label: 'Reports', icon: <FaChartBar size={20} />, path: '/dashboard/organizer/reports' },
  { id: 'calendar', label: 'Calendar', icon: <FaCalendarAlt size={20} />, path: '/dashboard/organizer/calendar' },
];

const OrganizerSidebar = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:900px)');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    navigate('/login');
  };

  const drawerContent = (
    <Box
      sx={{
        width: 240,
        backgroundColor: '#1e293b',
        color: '#ffffff',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Sidebar Header */}
      <Box sx={{ textAlign: 'center', my: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Admin Panel
        </Typography>
      </Box>
      <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />

      {/* Sidebar Menu */}
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.id}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            onClick={handleDrawerToggle}
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

      {/* Logout Button */}
      <Box sx={{ mt: 'auto', textAlign: 'center', mb: 2 }}>
        <Button
          variant="contained"
          color="error"
          startIcon={<FaSignOutAlt />}
          onClick={handleLogout}
          sx={{ width: '80%' }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Menu Icon */}
      {isMobile && (
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleDrawerToggle}
          sx={{ position: 'absolute', top: 10, left: 10, zIndex: 1300 }}
        >
          <FaBars size={24} />
        </IconButton>
      )}

      {/* Permanent Sidebar for Desktop */}
      {!isMobile ? (
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 240,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export default OrganizerSidebar;
