import api, { TOKEN_KEY, USER_KEY } from "./api";

/**
 * Helper to derive roleTitle if missing
 */
export const getRoleTitle = (role, fallbackRole = null) => {
  const r = (role || fallbackRole || 'customer').toLowerCase();
  if (r.includes('owner')) return 'Store Owner';
  if (r.includes('kitchen')) return 'Kitchen Staff';
  if (r.includes('support')) return 'Customer Support';
  if (r.includes('manager')) return 'Store Manager';
  return 'Customer';
};

/**
 * Completely purges all auth session data from both localStorage and sessionStorage
 */
export const clearAuthSession = () => {
  const keysToRemove = [
    TOKEN_KEY,
    USER_KEY,
    "token",
    "user",
    "role",
    "adminToken",
    "adminUser",
    "cravecrust_token",
    "cravecrust_user",
    "cravecrust_auth_token",
    "cravecrust_user_session",
  ];

  keysToRemove.forEach((key) => {
    try {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    } catch (e) {
      // ignore
    }
  });

  try {
    sessionStorage.clear();
  } catch (e) {
    // ignore
  }
};

/**
 * Register a new user
 * @param {Object} userData
 * @returns {Promise<Object>}
 */
export const register = async (userData) => {
  try {
    clearAuthSession();

    const payload = {
      name: userData.name || userData.fullName || "Pizza Enthusiast",
      email: userData.email,
      password: userData.password,
      phone: userData.phone || "",
    };

    const response = await api.post("/auth/register", payload);
    const data = response.data;

    if (data.user && !data.user.roleTitle) {
      data.user.roleTitle = getRoleTitle(data.user.role);
    }

    // Store JWT token and user info
    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
    }

    if (data.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    clearAuthSession();
    const message =
      error.customMessage ||
      error.response?.data?.message ||
      error.message ||
      "Registration failed.";

    const err = new Error(message);
    err.response = error.response;
    err.status = error.response?.status;
    err.isNetworkError = !error.response || !!error.request;
    throw err;
  }
};

/**
 * Login user
 * @param {Object|string} emailOrCredentials
 * @param {string} password
 * @param {string} role
 * @returns {Promise<Object>}
 */
export const login = async (
  emailOrCredentials,
  password = null,
  role = null
) => {
  try {
    clearAuthSession();

    let payload;

    if (
      typeof emailOrCredentials === "object" &&
      emailOrCredentials !== null
    ) {
      payload = emailOrCredentials;
    } else {
      payload = {
        email: emailOrCredentials,
        password,
        role,
      };
    }

    const response = await api.post("/auth/login", payload);
    const data = response.data;

    if (data.user && !data.user.roleTitle) {
      data.user.roleTitle = getRoleTitle(data.user.role, role);
    }

    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
    }

    if (data.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    clearAuthSession();
    const message =
      error.customMessage ||
      error.response?.data?.message ||
      error.message ||
      "Login failed.";

    const err = new Error(message);
    err.response = error.response;
    err.status = error.response?.status;
    err.isNetworkError = !error.response || !!error.request;
    throw err;
  }
};

/**
 * Logout user (Stateless JWT token cleanup)
 */
export const logout = async () => {
  clearAuthSession();
  return { success: true };
};

/**
 * Get current authenticated user
 * @returns {Promise<Object|null>}
 */
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem(TOKEN_KEY) || localStorage.getItem('token');

    if (!token) {
      clearAuthSession();
      return null;
    }

    // Try backend first
    try {
      const response = await api.get("/auth/me");

      if (response.data?.user) {
        if (!response.data.user.roleTitle) {
          response.data.user.roleTitle = getRoleTitle(response.data.user.role);
        }
        localStorage.setItem(
          USER_KEY,
          JSON.stringify(response.data.user)
        );

        return response.data.user;
      }
    } catch (err) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        clearAuthSession();
        return null;
      }
    }

    const storedUser = localStorage.getItem(USER_KEY) || localStorage.getItem('user');
    if (!storedUser) {
      clearAuthSession();
      return null;
    }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser && !parsedUser.roleTitle) {
      parsedUser.roleTitle = getRoleTitle(parsedUser.role);
    }
    return parsedUser;
  } catch {
    clearAuthSession();
    return null;
  }
};

/**
 * Verify email address with 6-digit OTP
 */
export const verifyOtp = async (email, otp) => {
  const response = await api.post("/auth/verify-otp", { email, otp });
  return response.data;
};

/**
 * Resend 6-digit verification OTP email
 */
export const resendOtp = async (email) => {
  const response = await api.post("/auth/resend-otp", { email });
  return response.data;
};

/**
 * Verify email address with token
 */
export const verifyEmail = async (token) => {
  const response = await api.post("/auth/verify-email", { token });
  return response.data;
};

/**
 * Request password reset email link
 */
export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

/**
 * Reset password using token and new password
 */
export const resetPassword = async (token, newPassword) => {
  const response = await api.post("/auth/reset-password", { token, newPassword });
  return response.data;
};

/**
 * Update authenticated user profile
 */
export const updateProfile = async (profileData) => {
  const response = await api.put("/users/profile", profileData);
  if (response.data?.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
  }
  return response.data;
};

export const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  verifyOtp,
  resendOtp,
  verifyEmail,
  forgotPassword,
  resetPassword,
  updateProfile,
};

export default authService;