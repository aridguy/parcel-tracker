const TOKEN_KEY = 'pt_token';
const USER_KEY = 'pt_user';
const ATTEMPTS_KEY = 'pt_login_attempts';

// -------- Notify app when auth state changes --------
function broadcastAuthChange() {
  window.dispatchEvent(new Event('auth-change'));
}

// -------- Token / user --------
export function saveAuth(user) {
  const token = generateToken();
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  broadcastAuthChange();
  return token;
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getToken());
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  broadcastAuthChange();
}

function generateToken() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return (
    Math.random().toString(36).slice(2) +
    Date.now().toString(36) +
    Math.random().toString(36).slice(2)
  );
}

// -------- Rate limiting --------
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

function readAttempts() {
  try {
    return JSON.parse(
      localStorage.getItem(ATTEMPTS_KEY) || '{"count":0,"lockedUntil":0}'
    );
  } catch {
    return { count: 0, lockedUntil: 0 };
  }
}

function writeAttempts(state) {
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(state));
}

export function getLockoutStatus() {
  const state = readAttempts();
  if (state.lockedUntil && Date.now() < state.lockedUntil) {
    return {
      locked: true,
      minutesLeft: Math.ceil((state.lockedUntil - Date.now()) / 60000),
      attemptsLeft: 0,
    };
  }
  return {
    locked: false,
    minutesLeft: 0,
    attemptsLeft: Math.max(0, MAX_ATTEMPTS - state.count),
  };
}

export function registerFailedAttempt() {
  const state = readAttempts();
  const next = { count: state.count + 1, lockedUntil: 0 };
  if (next.count >= MAX_ATTEMPTS) {
    next.lockedUntil = Date.now() + LOCKOUT_MS;
  }
  writeAttempts(next);
  return getLockoutStatus();
}

export function clearAttempts() {
  writeAttempts({ count: 0, lockedUntil: 0 });
}

// -------- Credentials --------
export const VALID_EMAIL = 'nehorail209@gmail.com';
export const VALID_PASSWORD = 'Tracker001';