import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  auth, 
  db, 
  type User, 
  sendNotification 
} from '../lib/firebase';
import { doc, getDoc, setDoc, onSnapshot, collection, query, where } from 'firebase/firestore';
import { UserProfile, AppNotification } from '../types';
import { DEFAULT_PLATFORM_CONFIG } from '../lib/seedData';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  unreadNotificationsCount: number;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onboardingCompleted: boolean;
  completeOnboarding: () => void;
  refreshUserProfile: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  unreadNotificationsCount: 0,
  theme: 'light',
  toggleTheme: () => {},
  onboardingCompleted: false,
  completeOnboarding: () => {},
  refreshUserProfile: async () => {},
  isAdmin: false
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  // Local storage flags for theme & onboarding
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('testcircle_theme') as 'light' | 'dark') || 'light';
  });

  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(() => {
    return localStorage.getItem('testcircle_onboarding_done') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('testcircle_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const completeOnboarding = () => {
    localStorage.setItem('testcircle_onboarding_done', 'true');
    setOnboardingCompleted(true);
  };

  // Sync user profile from Firestore or create initial record
  const fetchOrCreateProfile = async (currentUser: User) => {
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        setUserProfile(docSnap.data() as UserProfile);
      } else {
        // Create initial profile with welcome bonus
        const newProfile: UserProfile = {
          uid: currentUser.uid,
          email: currentUser.email || '',
          displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Android Developer',
          developerName: `${currentUser.displayName || 'Dev'} Studio`,
          country: 'United States',
          experience: 'intermediate',
          photoURL: currentUser.photoURL || '',
          playStoreDevLink: '',
          agreedToManualTesting: true,
          credits: DEFAULT_PLATFORM_CONFIG.welcomeBonusCredits,
          testingStreak: 1,
          reliabilityScore: 100,
          completedTestsCount: 0,
          submittedAppsCount: 0,
          role: currentUser.email === 'adityaa89468@gmail.com' ? 'admin' : 'user', // Bootstrapped admin
          createdAt: Date.now(),
          updatedAt: Date.now(),
          notificationPreferences: {
            emailReminders: true,
            pushNotifications: true,
            proofUpdates: true
          }
        };

        await setDoc(userDocRef, newProfile);
        setUserProfile(newProfile);

        // Welcome notification
        await sendNotification(
          currentUser.uid,
          'Welcome to TestCircle!',
          `You have received ${DEFAULT_PLATFORM_CONFIG.welcomeBonusCredits} welcome credits to start your mutual Android testing journey.`,
          'admin'
        );
      }
    } catch (err) {
      console.error("Error fetching or creating user profile:", err);
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchOrCreateProfile(currentUser);
        // Realtime user profile listener
        const userDocRef = doc(db, 'users', currentUser.uid);
        const unsubProfile = onSnapshot(
          userDocRef, 
          (snap) => {
            if (snap.exists()) {
              setUserProfile(snap.data() as UserProfile);
            }
          },
          (err) => {
            console.warn("User profile snapshot warning:", err.message);
          }
        );

        // Notifications listener
        const notifQuery = query(
          collection(db, 'notifications'), 
          where('userId', '==', currentUser.uid)
        );
        const unsubNotifs = onSnapshot(
          notifQuery, 
          (snapshot) => {
            const unread = snapshot.docs.filter(d => !d.data().read).length;
            setUnreadNotificationsCount(unread);
          },
          (err) => {
            console.warn("Notifications snapshot warning:", err.message);
          }
        );

        setLoading(false);
        return () => {
          unsubProfile();
          unsubNotifs();
        };
      } else {
        setUserProfile(null);
        setUnreadNotificationsCount(0);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const refreshUserProfile = async () => {
    if (user) {
      await fetchOrCreateProfile(user);
    }
  };

  const isAdmin = userProfile?.role === 'admin' || user?.email === 'adityaa89468@gmail.com';

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      loading,
      unreadNotificationsCount,
      theme,
      toggleTheme,
      onboardingCompleted,
      completeOnboarding,
      refreshUserProfile,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
