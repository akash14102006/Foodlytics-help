import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

// Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nutrivision_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors gracefully without forcing a login redirect since authentication is disabled
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Instead of forcing a redirect and dropping the token, we just let the error pass through
    // so the UI can handle it or safely ignore it without causing a redirect loop.
    return Promise.reject(err);
  }
);

export default api;

// Auth
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  me: () => api.get('/api/auth/me'),
};

// Food Analysis
export const foodAPI = {
  analyzeImage: (formData) => api.post('/api/food/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000, // Increased to 60s for Gemini + Potential cold starts
  }),
  analyzeByName: (name) => api.post(`/api/food/analyze-name?food_name=${encodeURIComponent(name)}`),
  search: (q) => api.get(`/api/food/search?q=${encodeURIComponent(q)}`),
  categories: () => api.get('/api/food/categories'),
};

// Tracker
export const trackerAPI = {
  logFood: async (entry) => {
    const today = new Date().toISOString().split('T')[0];
    const key = `nv_tracker_${today}`;
    let data = JSON.parse(localStorage.getItem(key)) || { date: today, total_calories: 0, daily_goal: 2000, entries: [] };
    const profile = JSON.parse(localStorage.getItem('nv_profile'));
    if (profile && profile.daily_calorie_goal) data.daily_goal = profile.daily_calorie_goal;

    const newEntry = { ...entry, id: Date.now().toString(), logged_at: new Date().toISOString() };
    data.entries.unshift(newEntry);
    data.total_calories += (entry.calories || 0);
    localStorage.setItem(key, JSON.stringify(data));
    return { data: newEntry };
  },
  getToday: async () => {
    const today = new Date().toISOString().split('T')[0];
    let data = JSON.parse(localStorage.getItem(`nv_tracker_${today}`)) || { date: today, total_calories: 0, daily_goal: 2000, entries: [] };
    const profile = JSON.parse(localStorage.getItem('nv_profile'));
    if (profile && profile.daily_calorie_goal) data.daily_goal = profile.daily_calorie_goal;
    return { data };
  },
  getHistory: async (days = 7) => {
    const history = [];
    for(let i=0; i<days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const data = JSON.parse(localStorage.getItem(`nv_tracker_${dateStr}`));
        if(data) history.push(data);
    }
    return { data: history };
  },
  deleteLog: async (id) => {
    const today = new Date().toISOString().split('T')[0];
    const key = `nv_tracker_${today}`;
    let data = JSON.parse(localStorage.getItem(key));
    if (data) {
       const entry = data.entries.find(e => e.id === id);
       if (entry) {
          data.total_calories -= entry.calories;
          data.entries = data.entries.filter(e => e.id !== id);
          localStorage.setItem(key, JSON.stringify(data));
       }
    }
    return { data: { success: true } };
  },
  addictionAnalysis: async () => ({
    data: { message: "No dominant junk food triggers detected.", suggestion: "Keep up the balanced eating! You're making great choices.", categories: {} }
  }),
};

// User
export const userAPI = {
  getProfile: async () => ({
    data: { profile: JSON.parse(localStorage.getItem('nv_profile')) || { fitness_goal: 'maintain', daily_calorie_goal: 2000, health_conditions: [] } }
  }),
  updateProfile: async (data) => {
    const goal = data.daily_calorie_goal || 2000;
    localStorage.setItem('nv_profile', JSON.stringify({ ...data, calculated_calorie_goal: goal, daily_calorie_goal: goal }));
    
    // Update today's tracker goal
    const today = new Date().toISOString().split('T')[0];
    const key = `nv_tracker_${today}`;
    let trackerData = JSON.parse(localStorage.getItem(key));
    if (trackerData) {
       trackerData.daily_goal = goal;
       localStorage.setItem(key, JSON.stringify(trackerData));
    }
    return { data: { calculated_calorie_goal: goal } };
  },
  getRecommendations: async () => ({
    data: {
      calculated_calorie_goal: JSON.parse(localStorage.getItem('nv_profile'))?.daily_calorie_goal || 2000,
      recommended_foods: ['chicken breast', 'spinach', 'quinoa', 'salmon', 'broccoli'],
      foods_to_avoid: ['sugary drinks', 'deep fried foods', 'processed meats'],
      tips: ['Drink plenty of water', 'Get 7-8 hours of sleep', 'Eat more fiber'],
      condition_specific_advice: []
    }
  }),
  getDashboardStats: async () => ({
    data: {
       health_score: 8.5,
       streak: 3,
       calories_avg: 1850,
       recommendation: "You are consistent!"
    }
  }),
};
