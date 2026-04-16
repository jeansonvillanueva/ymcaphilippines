const AUTH_KEY = 'ymcaAdminAuth';
const AUTH_EXPIRY_KEY = 'ymcaAdminAuthExpiry';
const AUTH_USER_KEY = 'ymcaAdminUsername';
const AUTH_DURATION_MS = 1000 * 60 * 30; // 30 minutes

export function loginAdmin(username: string) {
  const expiry = Date.now() + AUTH_DURATION_MS;
  sessionStorage.setItem(AUTH_KEY, 'true');
  sessionStorage.setItem(AUTH_USER_KEY, username);
  sessionStorage.setItem(AUTH_EXPIRY_KEY, expiry.toString());
}

export function logoutAdmin() {
  sessionStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(AUTH_USER_KEY);
  sessionStorage.removeItem(AUTH_EXPIRY_KEY);
}

export function isAdminAuthenticated() {
  const auth = sessionStorage.getItem(AUTH_KEY);
  const expiry = sessionStorage.getItem(AUTH_EXPIRY_KEY);

  if (auth !== 'true' || !expiry) {
    logoutAdmin();
    return false;
  }

  const expiryTime = Number(expiry);
  if (Number.isNaN(expiryTime) || Date.now() > expiryTime) {
    logoutAdmin();
    return false;
  }

  return true;
}

export function getAdminUsername() {
  return sessionStorage.getItem(AUTH_USER_KEY) || null;
}
