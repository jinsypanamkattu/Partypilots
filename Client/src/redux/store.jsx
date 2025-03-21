import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import usersReducer from "./slices/usersSlice";
import eventsReducer from "./slices/eventCalendarSlice";
import homeReducer from "./slices/eventsSlice"
import bookingsReducer from "./slices/bookingsSlice";

import reportsReducer from "./slices/reportsSlice";
import dashboardReducer  from "./slices/dashboardSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    events: eventsReducer,
    bookings: bookingsReducer,
    reports: reportsReducer,
    dashboard: dashboardReducer,
    upcomingevents: homeReducer,
  },
});

export default store;
