export interface User {
  id: string;
  email: string;
  name?: string;
  farm?: string;
  location?: string;
  role?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const auth = {
  async signIn(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to sign in');
    }

    return response.json();
  },

  async signUp(
    email: string,
    password: string,
    name?: string,
    farm?: string,
    location?: string
  ): Promise<AuthResponse> {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name, farm, location }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to sign up');
    }

    return response.json();
  },

  async verifyToken(token: string): Promise<{ user: User }> {
    const response = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Invalid token');
    }

    return response.json();
  },
};