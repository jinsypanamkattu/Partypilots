import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { fetchUsers, addUser, updateUser, deleteUser, updateUserStatus } from "../../services/manageUserService";

export const fetchUsersThunk = createAsyncThunk("users/fetchUsers", async (_, thunkAPI) => {
  try {
    return await fetchUsers();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch users");
  }
});

export const addUserThunk = createAsyncThunk("users/addUser", async (userData, thunkAPI) => {
  //console.log("data",userData);
  try {
    return await addUser(userData);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to add user");
  }
});

export const updateUserThunk = createAsyncThunk("users/updateUser", async ({ id, userData }, thunkAPI) => {
  try {
    //alert(id);
    return await updateUser(id, userData);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update user");
  }
});
export const updateUserStatusThunk = createAsyncThunk(
  'users/updateStatus',
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      //const response = await axios.patch(`/users/${id}/status`, { status });
      //return response.data;  // Returning the updated user data
      return await updateUserStatus(id, userData);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteUserThunk = createAsyncThunk("users/deleteUser", async (id, thunkAPI) => {
  try {
    return await deleteUser(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to delete user");
  }
});

const usersSlice = createSlice({
  name: "users",
  initialState: { users: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.users = action.payload;
        state.status = "succeeded";
      })
      .addCase(addUserThunk.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        const index = state.users.findIndex((user) => user.id === action.payload.id);
        if (index !== -1) state.users[index] = action.payload;
      })
      .addCase(updateUserStatusThunk.fulfilled, (state, action) => {
        const index = state.users.findIndex((user) => user._id === action.payload._id);
        if (index !== -1) {
          // Update only the status of the user
          state.users[index].status = action.payload.status; 
        }
      })
      .addCase(deleteUserThunk.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.meta.arg);
      })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.status = "loading";
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        }
      );
  },
});

export default usersSlice.reducer;
