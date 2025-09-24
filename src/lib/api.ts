import axios from 'axios';
import { BACKEND_BASE_URL, LOGIN_API, REGISTER_API } from './constants';
import { getToken } from './auth';

// Create an Axios instance with baseURL set to your backend URL
const apiClient = axios.create({
  baseURL: BACKEND_BASE_URL,
  timeout: 5000,
});

// Add a request interceptor to inject JWT token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export async function login(username: string, password: string): Promise<string> {
  try {
    const response = await apiClient.post(LOGIN_API, { username, password });
    return response.data; // assuming backend sends just the token string
  } catch (error: any) {
    console.error('Login API error:', error.response?.data || error.message || error);
    throw new Error(error.response?.data?.message || 'Login failed');
  }
}


export async function signup(username: string, fullname: string, email: string, password: string) {
  try {
    const response = await apiClient.post(REGISTER_API, { username, fullname, email, password });
    console.log("Signup successful:", response.data);
    return response.data; // could return a success message
  } catch (error: any) {
    console.error("Signup error:", error.response?.data || error.message || error);
    throw new Error(error.response?.data?.message || "Signup failed");
  }
}


export interface TradeDetails {
  tradeServer: string;
  username: string;
  password: string;
}

// GET: Fetch trade details for the logged-in user
export async function getTradeDetails(): Promise<TradeDetails> {
  try {
    const response = await apiClient.get('/trade-details');
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      // No trade details exist yet — that's okay
      return {
        tradeServer: '',
        username: '',
        password: '',
      };
    }

    console.error('Fetch trade details error:', error.response?.data || error.message || error);
    throw new Error('Failed to load trade details');
  }
}

// POST: Save or update trade details
export async function saveTradeDetails(data: TradeDetails): Promise<void> {
  try {
    await apiClient.post('/trade-details', data);
  } catch (error: any) {
    console.error('Save trade details error:', error.response?.data || error.message || error);
    throw new Error('Failed to save trade details');
  }
}

// ---------- USER PROFILE ----------

export interface UserProfile {
  username: string;
  email: string;
  subscriptionStatus: string;
}

// GET: Fetch user profile
export async function getProfile(): Promise<UserProfile> {
  try {
    const response = await apiClient.get<UserProfile>('/profile');
    return response.data;
  } catch (error: any) {
    console.error('Profile fetch error:', error.response?.data || error.message || error);
    throw new Error('Failed to fetch profile');
  }
}

// PUT: Update allowed profile fields
export async function updateProfile(dto: Partial<Omit<UserProfile, 'subscriptionStatus'>>): Promise<UserProfile> {
  // Only allow updating username and email
  try {
    const response = await apiClient.put<UserProfile>('/profile', dto);
    return response.data;
  } catch (error: any) {
    console.error('Profile update error:', error.response?.data || error.message || error);
    throw new Error('Failed to update profile');
  }
}

// POST: Change user password
export async function changePassword(newPassword: string): Promise<void> {
  try {
    await apiClient.post('/profile/change-password', { newPassword });
  } catch (error: any) {
    console.error('Password change error:', error.response?.data || error.message || error);
    throw new Error('Failed to change password');
  }
}

// ---------- TRADE HISTORY ----------

export interface Trade {
  id: number;
  pair: string;
  amount: string;
  type: string;
  percentage: string;
  status: string;
  timestamp: string;
}

// GET: Fetch trade history for logged-in user
export async function getTrades(): Promise<Trade[]> {
  try {
    const response = await apiClient.get<Trade[]>('/trades');
    return response.data;
  } catch (error: any) {
    console.error('Fetch trades error:', error.response?.data || error.message || error);
    throw new Error('Failed to fetch trades');
  }
}


// ---------- BANK DETAILS ----------

export interface BankDetails {
  accountName: string;
  accountNumber: string;
  bankName: string;
}

// GET: Fetch bank details (for all users)
export async function getBankDetails(): Promise<BankDetails | null> {
  try {
    const response = await apiClient.get<BankDetails>('/bank-details');
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) return null; // not set yet
    console.error('Fetch bank details error:', error.response?.data || error.message || error);
    throw new Error('Failed to fetch bank details');
  }
}
