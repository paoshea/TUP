# Frontend Implementation Guide - Part 3: Context, Services, Hooks, and Testing

This guide covers the implementation of context providers, services, hooks, and testing setup for the LiveStock Show Assistant.

## Context Implementation

### 1. Create Authentication Context

```bash
# Create AuthContext
cat > src/context/AuthContext.tsx << 'EOL'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and subscribe to auth changes
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
EOL
```

### 2. Create Livestock Context

```bash
# Create LivestockContext
cat > src/context/LivestockContext.tsx << 'EOL'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import type { Animal } from '../types';

interface LivestockContextType {
  animals: Animal[];
  loading: boolean;
  error: Error | null;
  addAnimal: (animal: Omit<Animal, 'id'>) => Promise<void>;
  updateAnimal: (id: string, updates: Partial<Animal>) => Promise<void>;
  getAnimal: (id: string) => Animal | undefined;
}

const LivestockContext = createContext<LivestockContextType | undefined>(undefined);

export function LivestockProvider({ children }: { children: React.ReactNode }) {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      const { data, error } = await supabase
        .from('animals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnimals(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const addAnimal = async (animal: Omit<Animal, 'id'>) => {
    const { data, error } = await supabase
      .from('animals')
      .insert([animal])
      .select()
      .single();

    if (error) throw error;
    setAnimals(prev => [data, ...prev]);
  };

  const updateAnimal = async (id: string, updates: Partial<Animal>) => {
    const { data, error } = await supabase
      .from('animals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    setAnimals(prev => prev.map(animal => 
      animal.id === id ? { ...animal, ...data } : animal
    ));
  };

  const getAnimal = (id: string) => animals.find(animal => animal.id === id);

  return (
    <LivestockContext.Provider value={{
      animals,
      loading,
      error,
      addAnimal,
      updateAnimal,
      getAnimal,
    }}>
      {children}
    </LivestockContext.Provider>
  );
}

export const useLivestock = () => {
  const context = useContext(LivestockContext);
  if (context === undefined) {
    throw new Error('useLivestock must be used within a LivestockProvider');
  }
  return context;
};
EOL
```

### 3. Create UI Context

```bash
# Create UIContext
cat > src/context/UIContext.tsx << 'EOL'
import React, { createContext, useContext, useState } from 'react';

interface UIContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };
    setNotifications(prev => [...prev, newNotification]);

    if (notification.duration) {
      setTimeout(() => removeNotification(id), notification.duration);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <UIContext.Provider value={{
      sidebarOpen,
      toggleSidebar,
      theme,
      toggleTheme,
      notifications,
      addNotification,
      removeNotification,
    }}>
      {children}
    </UIContext.Provider>
  );
}

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
EOL
```

## Services Implementation

### 1. Create API Service

```bash
# Create API service
cat > src/services/api.ts << 'EOL'
import { supabase } from './supabase';
import type { Animal, EvaluationCriteria } from '../types';

export const api = {
  animals: {
    list: async () => {
      const { data, error } = await supabase
        .from('animals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },

    get: async (id: string) => {
      const { data, error } = await supabase
        .from('animals')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },

    create: async (animal: Omit<Animal, 'id'>) => {
      const { data, error } = await supabase
        .from('animals')
        .insert([animal])
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    update: async (id: string, updates: Partial<Animal>) => {
      const { data, error } = await supabase
        .from('animals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  },

  evaluations: {
    getCriteria: async (): Promise<EvaluationCriteria[]> => {
      const { data, error } = await supabase
        .from('evaluation_criteria')
        .select('*')
        .order('category');

      if (error) throw error;
      return data;
    },
  },
};
EOL
```

### 2. Create Storage Service

```bash
# Create storage service
cat > src/services/storage.ts << 'EOL'
import { supabase } from './supabase';

export const storage = {
  uploadPhoto: async (file: File, path: string) => {
    const { data, error } = await supabase.storage
      .from('photos')
      .upload(path, file);

    if (error) throw error;
    return data;
  },

  getPhotoUrl: (path: string) => {
    const { data } = supabase.storage
      .from('photos')
      .getPublicUrl(path);

    return data.publicUrl;
  },

  deletePhoto: async (path: string) => {
    const { error } = await supabase.storage
      .from('photos')
      .remove([path]);

    if (error) throw error;
  },
};
EOL
```

### 3. Create AI Service

```bash
# Create AI service
cat > src/services/ai.ts << 'EOL'
import { supabase } from './supabase';
import type { Animal } from '../types';

interface AIAnalysis {
  score: number;
  recommendations: string[];
  comparisons: {
    flockName: string;
    similarity: number;
    strengths: string[];
    improvements: string[];
  }[];
}

export const ai = {
  analyzeAnimal: async (animal: Animal): Promise<AIAnalysis> => {
    const { data, error } = await supabase.functions.invoke('analyze-animal', {
      body: { animal },
    });

    if (error) throw error;
    return data;
  },

  getRecommendations: async (animalId: string): Promise<string[]> => {
    const { data, error } = await supabase.functions.invoke('get-recommendations', {
      body: { animalId },
    });

    if (error) throw error;
    return data.recommendations;
  },

  compareWithHistorical: async (animalId: string): Promise<{
    similarFlocks: string[];
    analysis: string;
  }> => {
    const { data, error } = await supabase.functions.invoke('historical-comparison', {
      body: { animalId },
    });

    if (error) throw error;
    return data;
  },
};
EOL
```

## Custom Hooks Implementation

### 1. Create Evaluation Hooks

```bash
# Create evaluation hooks
cat > src/hooks/useEvaluation.ts << 'EOL'
import { useState, useCallback } from 'react';
import { api } from '../services/api';
import type { Animal } from '../types';

export function useEvaluation(animalId?: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [evaluation, setEvaluation] = useState<Animal | null>(null);

  const fetchEvaluation = useCallback(async () => {
    if (!animalId) return;
    
    try {
      setLoading(true);
      const data = await api.animals.get(animalId);
      setEvaluation(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch evaluation'));
    } finally {
      setLoading(false);
    }
  }, [animalId]);

  const saveEvaluation = async (data: Partial<Animal>) => {
    try {
      setLoading(true);
      if (animalId) {
        const updated = await api.animals.update(animalId, data);
        setEvaluation(updated);
      } else {
        const created = await api.animals.create(data as Omit<Animal, 'id'>);
        setEvaluation(created);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save evaluation'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    evaluation,
    loading,
    error,
    fetchEvaluation,
    saveEvaluation,
  };
}
EOL
```

### 2. Create Photo Management Hooks

```bash
# Create photo hooks
cat > src/hooks/usePhotos.ts << 'EOL'
import { useState, useCallback } from 'react';
import { storage } from '../services/storage';

export function usePhotos(animalId: string) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadPhoto = async (file: File) => {
    try {
      setUploading(true);
      const path = `${animalId}/${Date.now()}-${file.name}`;
      await storage.uploadPhoto(file, path);
      return storage.getPhotoUrl(path);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to upload photo'));
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const deletePhoto = async (path: string) => {
    try {
      await storage.deletePhoto(path);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete photo'));
      throw err;
    }
  };

  return {
    uploadPhoto,
    deletePhoto,
    uploading,
    error,
  };
}
EOL
```

### 3. Create AI Integration Hooks

```bash
# Create AI hooks
cat > src/hooks/useAI.ts << 'EOL'
import { useState, useCallback } from 'react';
import { ai } from '../services/ai';
import type { Animal } from '../types';

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const analyzeAnimal = async (animal: Animal) => {
    try {
      setLoading(true);
      return await ai.analyzeAnimal(animal);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to analyze animal'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getRecommendations = async (animalId: string) => {
    try {
      setLoading(true);
      return await ai.getRecommendations(animalId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get recommendations'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    analyzeAnimal,
    getRecommendations,
    loading,
    error,
  };
}
EOL
```

## Testing Setup

### 1. Create Test Utils

```bash
# Create test utilities
cat > src/utils/test-utils.tsx << 'EOL'
import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { AuthProvider } from '../context/AuthContext';
import { LivestockProvider } from '../context/LivestockContext';
import { UIProvider } from '../context/UIContext';

function render(ui: React.ReactElement, options = {}) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>
      <LivestockProvider>
        <UIProvider>
          {children}
        </UIProvider>
      </LivestockProvider>
    </AuthProvider>
  );

  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

export * from '@testing-library/react';
export { render };
EOL
```

### 2. Create Component Tests

```bash
# Create component tests
cat > src/__tests__/components/FlockAnalyzer.test.tsx << 'EOL'
import { render, screen, fireEvent } from '../../utils/test-utils';
import { FlockAnalyzer } from '../../components/FlockAnalyzer';

describe('FlockAnalyzer', () => {
  it('renders historical flocks', () => {
    render(<FlockAnalyzer />);
    expect(screen.getByText("Queen Mother's Caithness Flock")).toBeInTheDocument();
  });

  it('allows flock selection', () => {
    render(<FlockAnalyzer />);
    const flock = screen.getByText("Queen Mother's Caithness Flock");
    fireEvent.click(flock);
    expect(screen.getByText('Selected:')).toBeInTheDocument();
  });
});
EOL

cat > src/__tests__/components/EvaluationForm.test.tsx << 'EOL'
import { render, screen, fireEvent } from '../../utils/test-utils';
import { EvaluationForm } from '../../components/EvaluationForm';

describe('EvaluationForm', () => {
  const mockOnSave = jest.fn();

  beforeEach(() => {
    mockOnSave.mockClear();
  });

  it('renders all score categories', () => {
    render(<EvaluationForm onSave={mockOnSave} />);
    expect(screen.getByText('Movement')).toBeInTheDocument();
    expect(screen.getByText('Conformation')).toBeInTheDocument();
    expect(screen.getByText('Muscle Development')).toBeInTheDocument();
    expect(screen.getByText('Breed Characteristics')).toBeInTheDocument();
  });

  it('handles form submission', () => {
    render(<EvaluationForm onSave={mockOnSave} />);
    fireEvent.click(screen.getByText('Save Evaluation'));
    expect(mockOnSave).toHaveBeenCalled();
  });
});
EOL
```

### 3. Create Hook Tests

```bash
# Create hook tests
cat > src/__tests__/hooks/useEvaluation.test.ts << 'EOL'
import { renderHook, act } from '@testing-library/react';
import { useEvaluation } from '../../hooks/useEvaluation';

describe('useEvaluation', () => {
  it('initializes with null evaluation', () => {
    const { result } = renderHook(() => useEvaluation());
    expect(result.current.evaluation).toBeNull();
  });

  it('handles evaluation saving', async () => {
    const { result } = renderHook(() => useEvaluation());
    
    await act(async () => {
      await result.current.saveEvaluation({
        scores: {
          movement: 8,
          conformation: 7,
          muscleDevelopment: 9,
          breedCharacteristics: 8,
        },
        notes: 'Test evaluation',
      });
    });

    expect(result.current.error).toBeNull();
  });
});
EOL

cat > src/__tests__/hooks/usePhotos.test.ts << 'EOL'
import { renderHook, act } from '@testing-library/react';
import { usePhotos } from '../../hooks/usePhotos';

describe('usePhotos', () => {
  it('handles photo upload', async () => {
    const { result } = renderHook(() => usePhotos('test-animal-id'));
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    await act(async () => {
      await result.current.uploadPhoto(file);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.uploading).toBeFalse();
  });
});
EOL
```

### 4. Create Integration Tests

```bash
# Create integration tests
cat > src/__tests__/integration/evaluation.test.tsx << 'EOL'
import { render, screen, fireEvent, waitFor } from '../../utils/test-utils';
import { FlockAnalyzer } from '../../components/FlockAnalyzer';
import { EvaluationForm } from '../../components/EvaluationForm';

describe('Evaluation Flow', () => {
  it('completes full evaluation process', async () => {
    render(
      <>
        <FlockAnalyzer />
        <EvaluationForm onSave={jest.fn()} />
      </>
    );

    // Select a flock
    fireEvent.click(screen.getByText("Queen Mother's Caithness Flock"));

    // Fill evaluation form
    const movementInput = screen.getByLabelText('Movement');
    fireEvent.change(movementInput, { target: { value: '8' } });

    // Submit evaluation
    fireEvent.click(screen.getByText('Save Evaluation'));

    await waitFor(() => {
      expect(screen.getByText('Evaluation saved successfully')).toBeInTheDocument();
    });
  });
});
EOL
```

## Notes

1. This implementation covers:
   - Context providers for authentication, livestock data, and UI state
   - Services for API, storage, and AI integration
   - Custom hooks for evaluation, photos, and AI features
   - Comprehensive testing setup

2. Key features:
   - Type-safe context implementations
   - Secure authentication flow
   - Efficient data management
   - Real-time updates
   - Error handling
   - Test coverage

3. Remember to:
   - Update environment variables
   - Configure Supabase connection
   - Run tests before deployment
   - Document API changes
   - Monitor error rates

4. Next steps:
   - Implement additional services
   - Add more test coverage
   - Set up CI/CD pipeline
   - Add error boundaries
   - Implement caching