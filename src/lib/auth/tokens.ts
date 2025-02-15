interface Tokens {
  token: string
  refreshToken: string
  expiresIn: number
}

export function setTokens({ token, refreshToken, expiresIn }: Tokens) {
  try {
    const tokenExpiry = new Date(Date.now() + expiresIn * 1000);
    const refreshExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const cookieOptions = `path=/; SameSite=Lax; ${location.protocol === 'https:' ? 'Secure;' : ''}`;
    
    // Set both token and refreshToken
    document.cookie = `token=${token}; expires=${tokenExpiry.toUTCString()}; ${cookieOptions}`;
    document.cookie = `refreshToken=${refreshToken}; expires=${refreshExpiry.toUTCString()}; ${cookieOptions}`;
  } catch (error) {
    console.error('Error setting auth tokens:', error);
    throw new Error('Failed to set authentication tokens');
  }
}

export function removeTokens() {
  try {
    const cookieOptions = `path=/; SameSite=Lax; ${location.protocol === 'https:' ? 'Secure;' : ''}`;
    document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; ${cookieOptions}`;
    document.cookie = `refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; ${cookieOptions}`;
  } catch (error) {
    console.error('Error removing auth tokens:', error);
  }
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
  const token = getCookie('token');
  const refreshToken = getCookie('refreshToken');
  
  return {
    token,
    refreshToken
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
