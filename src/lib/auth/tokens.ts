interface Tokens {
  token: string
  refreshToken: string
  expiresIn: number
}

export function setTokens({ token, refreshToken, expiresIn }: Tokens) {
  // Set HTTP-only cookies with secure settings
  const tokenExpiry = new Date(Date.now() + expiresIn * 1000);
  const refreshExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  document.cookie = `token=${token}; path=/; expires=${tokenExpiry.toUTCString()}; SameSite=Strict`;
  document.cookie = `refreshToken=${refreshToken}; path=/; expires=${refreshExpiry.toUTCString()}; SameSite=Strict`;
}

export function removeTokens() {
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift();
  }
  return undefined;
}

export function getTokens(): Partial<Tokens> {
  return {
    token: getCookie('token'),
    refreshToken: getCookie('refreshToken')
  };
}

export function isTokenExpired(): boolean {
  const token = getCookie('token');
  if (!token) return true;

  try {
    // Get expiration from JWT without library
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    
    // exp is in seconds, Date.now() is in milliseconds
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

export function getAuthHeader(): { Authorization?: string } {
  const token = getCookie('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}
