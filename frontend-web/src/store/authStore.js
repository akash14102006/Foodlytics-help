import { create } from 'zustand';
import { authAPI, userAPI } from '../api/client';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('nutrivision_user')) || { _id: "local_id", name: "Guest User", email: "guest@nutrivision.ai", role: "guest" },
  token: localStorage.getItem('nutrivision_token') || "guest_token_123",
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    // Mock bypass for Demo user so Mongo DB connection is not required
    if (email === 'demo@nutrivision.ai' && password === 'demo123') {
      const demoUser = { _id: "demo_user_id_123", email, name: "NutriVision Demo" };
      const demoToken = "demo_token_123456789";
      localStorage.setItem('nutrivision_token', demoToken);
      localStorage.setItem('nutrivision_user', JSON.stringify(demoUser));
      setTimeout(() => set({ token: demoToken, user: demoUser, isLoading: false }), 500); // add slight delay for effect
      return true;
    }

    try {
      const res = await authAPI.login({ email, password });
      const { access_token, user } = res.data;
      localStorage.setItem('nutrivision_token', access_token);
      localStorage.setItem('nutrivision_user', JSON.stringify(user));
      set({ token: access_token, user, isLoading: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.detail || 'Login failed', isLoading: false });
      return false;
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authAPI.register({ name, email, password });
      const { access_token, user } = res.data;
      localStorage.setItem('nutrivision_token', access_token);
      localStorage.setItem('nutrivision_user', JSON.stringify(user));
      set({ token: access_token, user, isLoading: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.detail || 'Registration failed', isLoading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('nutrivision_token');
    localStorage.removeItem('nutrivision_user');
    set({ user: null, token: null });
  },

  refreshUser: async () => {
    // Skip remote check if it's the demo logic
    if (get().token === "demo_token_123456789") {
       return;
    }
    try {
      const res = await authAPI.me();
      const user = res.data;
      localStorage.setItem('nutrivision_user', JSON.stringify(user));
      set({ user });
    } catch (err) {
      // Token expired
      get().logout();
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
