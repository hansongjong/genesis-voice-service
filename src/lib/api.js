const API_BASE = 'https://0gqxz2ps31.execute-api.ap-northeast-2.amazonaws.com/prod/v1/gendao/tts';

export const api = {
  // 사용자 회원가입
  async register(email, password, name) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    return res.json();
  },

  // 사용자 로그인
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  // 플랜 목록
  async getPlans() {
    const res = await fetch(`${API_BASE}/plans`);
    return res.json();
  },

  // 내 구독 정보
  async getSubscription(token) {
    const res = await fetch(`${API_BASE}/subscription`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  // Voice 목록 조회
  async getVoices(language = null) {
    const url = language ? `${API_BASE}/voices?language=${language}` : `${API_BASE}/voices`;
    const res = await fetch(url);
    return res.json();
  },

  // 음성 샘플 오디오 URL
  async getVoiceAudioUrl(voiceId) {
    const res = await fetch(`${API_BASE}/voices/${voiceId}/audio`);
    return res.json();
  },

  // 음성 생성 요청
  async generateVoice(text, voiceId, language, token) {
    const res = await fetch(`${API_BASE}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ text, voice_id: voiceId, language })
    });
    return res.json();
  },

  // 작업 상태 조회
  async getJob(jobId) {
    const res = await fetch(`${API_BASE}/jobs/${jobId}`);
    return res.json();
  }
};

// 토큰 관리
export const auth = {
  getToken() {
    return localStorage.getItem('tts_token');
  },

  setToken(token) {
    localStorage.setItem('tts_token', token);
  },

  getUser() {
    const userStr = localStorage.getItem('tts_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  setUser(user) {
    localStorage.setItem('tts_user', JSON.stringify(user));
  },

  logout() {
    localStorage.removeItem('tts_token');
    localStorage.removeItem('tts_user');
  },

  isLoggedIn() {
    return !!this.getToken();
  }
};
