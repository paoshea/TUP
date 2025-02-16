interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

class MockStore {
  private currentUser: User | null = null;
  private authToken: string | null = null;

  async register(data: { name: string; email: string; password: string }): Promise<AuthResponse> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create mock user
    const user: User = {
      id: Math.random().toString(36).substring(7),
      name: data.name,
      email: data.email,
      role: 'user'
    };

    // Store user data
    this.currentUser = user;
    this.authToken = Math.random().toString(36).substring(7);

    return {
      user,
      token: this.authToken
    };
  }

  async signIn(data: { email: string; password: string }): Promise<AuthResponse> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create mock user
    const user: User = {
      id: Math.random().toString(36).substring(7),
      name: 'John Doe',
      email: data.email,
      role: 'user'
    };

    // Store user data
    this.currentUser = user;
    this.authToken = Math.random().toString(36).substring(7);

    return {
      user,
      token: this.authToken
    };
  }

  async signInWithProvider(provider: 'google' | 'apple'): Promise<AuthResponse> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create mock user
    const user: User = {
      id: Math.random().toString(36).substring(7),
      name: 'John Doe',
      email: `john.doe@${provider}.com`,
      role: 'user'
    };

    // Store user data
    this.currentUser = user;
    this.authToken = Math.random().toString(36).substring(7);

    return {
      user,
      token: this.authToken
    };
  }

  async signOut(): Promise<void> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Clear user data
    this.currentUser = null;
    this.authToken = null;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getAuthToken(): string | null {
    return this.authToken;
  }

  // Mock data methods
  getAnimals() {
    return [];
  }

  getEvaluations() {
    return [];
  }

  getShows() {
    return [];
  }

  getStatistics() {
    return {
      totalAnimals: 0,
      totalEvaluations: 0,
      averageScores: {},
      regionalBreakdown: {},
      breedDistribution: {}
    };
  }

  async loadDemoData() {
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

export const mockStore = new MockStore();