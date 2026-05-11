import { create } from 'zustand';
import { AuthState, User } from '@/types';

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    set({ token });
  },
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
}));

// Course store
interface CourseStore {
  courses: any[];
  selectedCourse: any | null;
  setCourses: (courses: any[]) => void;
  setSelectedCourse: (course: any | null) => void;
}

export const useCourseStore = create<CourseStore>((set) => ({
  courses: [],
  selectedCourse: null,
  setCourses: (courses) => set({ courses }),
  setSelectedCourse: (course) => set({ selectedCourse: course }),
}));

// Lab store
interface LabStore {
  labs: any[];
  selectedLab: any | null;
  setLabs: (labs: any[]) => void;
  setSelectedLab: (lab: any | null) => void;
}

export const useLabStore = create<LabStore>((set) => ({
  labs: [],
  selectedLab: null,
  setLabs: (labs) => set({ labs }),
  setSelectedLab: (lab) => set({ selectedLab: lab }),
}));
