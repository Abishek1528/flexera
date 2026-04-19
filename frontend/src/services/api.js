const API_BASE_URL = 'https://flexera-backend.onrender.com/api';

const api = {
  async getStates() {
    const response = await fetch(`${API_BASE_URL}/schools/states`);
    return response.json();
  },

  async getYears() {
    const response = await fetch(`${API_BASE_URL}/schools/years`);
    return response.json();
  },

  async getPrioritySchools(filters) {
    const params = new URLSearchParams();
    if (filters.State) params.append('State', filters.State);
    if (filters.Year) params.append('Year', filters.Year);

    const response = await fetch(`${API_BASE_URL}/schools/priority?${params}`);
    return response.json();
  },

  async getSchools(filters) {
    const params = new URLSearchParams();
    if (filters.State) params.append('State', filters.State);
    if (filters.Year) params.append('Year', filters.Year);

    const response = await fetch(`${API_BASE_URL}/schools?${params}`);
    return response.json();
  },

  async getSchoolWeakAreas(schoolKey) {
    const response = await fetch(`${API_BASE_URL}/schools/${schoolKey}/weak-areas`);
    return response.json();
  },

  async getSchoolRecommendations(schoolKey) {
    const response = await fetch(`${API_BASE_URL}/schools/${schoolKey}/recommendations`);
    return response.json();
  },

  async getSchoolHistory(schoolKey) {
    const response = await fetch(`${API_BASE_URL}/schools/${schoolKey}/history`);
    return response.json();
  },

  async getSchoolInterventions(schoolKey) {
    const response = await fetch(`${API_BASE_URL}/schools/${schoolKey}/interventions`);
    return response.json();
  },

  async addIntervention(intervention) {
    const response = await fetch(`${API_BASE_URL}/schools/interventions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(intervention)
    });
    return response.json();
  }
};

export default api;
