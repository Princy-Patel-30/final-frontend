import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  register,
  login,
  activateAccount,
  forgotPassword,
  resetPassword,
  logout,
  refreshToken,
} from '../../Services/Auth.Service';

// Async Thunks
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await register(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await login(credentials);
      return response.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const activateUserAccount = createAsyncThunk(
  'auth/activateUserAccount',
  async (token, { rejectWithValue }) => {
    try {
      const response = await activateAccount(token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const forgotPasswordRequest = createAsyncThunk(
  'auth/forgotPasswordRequest',
  async (email, { rejectWithValue }) => {
    try {
      const response = await forgotPassword(email);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const resetUserPassword = createAsyncThunk(
  'auth/resetUserPassword',
  async ({ token, passwords }, { rejectWithValue }) => {
    try {
      const response = await resetPassword(token, passwords);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await logout();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const refreshAccessToken = createAsyncThunk(
  'auth/refreshAccessToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await refreshToken();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Helper functions for localStorage
const saveUserToStorage = (user) => {
  try {
    localStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Failed to save user to localStorage:', error);
  }
};

const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Failed to get user from localStorage:', error);
    return null;
  }
};

const removeUserFromStorage = () => {
  try {
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Failed to remove user from localStorage:', error);
  }
};

const initialState = {
  user: getUserFromStorage(), // Load user from localStorage on init
  isAuthenticated: !!getUserFromStorage(), // Set based on stored user
  loading: false,
  error: null,
  successMessage: null,
  authChecked: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    // Add action to set auth as checked without changing other state
    setAuthChecked: (state) => {
      state.authChecked = true;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.authChecked = true;
        state.successMessage = 'Login successful';
        // Save user to localStorage
        saveUserToStorage(action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.authChecked = true;
      });

    // Activate Account
    builder
      .addCase(activateUserAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(activateUserAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(activateUserAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Forgot Password
    builder
      .addCase(forgotPasswordRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(forgotPasswordRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(forgotPasswordRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Reset Password
    builder
      .addCase(resetUserPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(resetUserPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(resetUserPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.successMessage = 'Logout successful';
        // Remove user from localStorage
        removeUserFromStorage();
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Refresh Token
    builder
      .addCase(refreshAccessToken.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.successMessage = action.payload.message;
        state.authChecked = true;
        // If user data is included in refresh response, update it
        if (action.payload.user) {
          state.user = action.payload.user;
          saveUserToStorage(action.payload.user);
        }
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.authChecked = true;
        state.user = null;
        // Clear user from localStorage on refresh failure
        removeUserFromStorage();
      });
  },
});

export const { clearError, clearSuccessMessage, setAuthChecked, setUser } =
  authSlice.actions;
export default authSlice.reducer;
