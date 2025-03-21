// Reports Slice (redux/slices/reportsSlice.js)
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../services/axios";

export const fetchReports = createAsyncThunk("reports/fetchReports", async () => {
  const response = await axios.get("/api/reports");
  return response.data;
});

const reportsSlice = createSlice({
  name: "reports",
  initialState: { reports: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.reports = action.payload;
        state.loading = false;
      });
  },
});

export default reportsSlice.reducer;
