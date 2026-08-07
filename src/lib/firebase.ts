import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  deleteUser,
  updateProfile,
  type User 
} from 'firebase/auth';
import { 
  getFirestore, 
  initializeFirestore,
  doc, 
  getDoc, 
  getDocFromServer,
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  orderBy, 
  onSnapshot, 
  deleteDoc,
  serverTimestamp,
  runTransaction
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile, CreditTransaction, CreditTransactionType, AppNotification } from '../types';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

// Initialize Firestore with auto-detect long polling for iframe/emulator compatibility
const firestoreDbId = firebaseConfig.firestoreDatabaseId || undefined;
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
}, firestoreDbId);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Non-blocking connection check with silent error handling
export async function testConnection() {
  try {
    await getDoc(doc(db, '_connection_check', 'ping'));
  } catch (error: any) {
    if (error?.code === 'unavailable' || error?.message?.includes('offline')) {
      console.info("Firestore operating with cached/offline capabilities.");
    }
  }
}
testConnection();

// Structured Firestore Error Handler required by skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Authentication Functions
export const checkGoogleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      return { user: result.user, error: null };
    }
  } catch (error: any) {
    console.error('Google Redirect Error:', error);
    return { user: null, error: error.message || 'Google authentication redirect failed.' };
  }
  return { user: null, error: null };
};

export const signInWithGoogle = async (tryRedirectFallback = true) => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    const code = error?.code || '';
    const msg = error?.message || '';

    // If popup is blocked or disallowed in WebView/emulator, attempt redirect as fallback
    if (tryRedirectFallback && (code === 'auth/popup-blocked' || msg.includes('requested action is invalid') || msg.includes('disallowed_useragent'))) {
      try {
        await signInWithRedirect(auth, googleProvider);
        return { user: null, error: null, isRedirecting: true };
      } catch (redirectErr: any) {
        console.error('Redirect Fallback Error:', redirectErr);
      }
    }

    let errorMessage = 'Failed to sign in with Google. Please use Email & Password sign-in below.';

    if (code === 'auth/unauthorized-domain') {
      const domain = window.location.hostname;
      errorMessage = `Unauthorized Domain: "${domain}" is not added under Firebase Console -> Authentication -> Settings -> Authorized domains. Add "${domain}" or use Email & Password below.`;
    } else if (code === 'auth/operation-not-allowed') {
      errorMessage = 'Google Sign-In is not enabled in Firebase Console. Please enable Google provider under Authentication -> Sign-in method, or use Email & Password sign-in below.';
    } else if (code === 'auth/popup-closed-by-user') {
      errorMessage = 'Google Sign-In popup was closed before completing.';
    } else if (code === 'auth/popup-blocked') {
      errorMessage = 'Google Sign-In popup was blocked by browser/emulator. Please use Email & Password sign-in below.';
    } else if (msg.includes('requested action is invalid') || msg.includes('disallowed_useragent') || code === 'auth/invalid-action-code') {
      errorMessage = 'Google OAuth popup is restricted in Android Emulator/WebView. Please use Email & Password sign-in/up below for instant access.';
    } else if (code === 'auth/network-request-failed') {
      errorMessage = 'Network error during authentication. Please check your connection.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    return { user: null, error: errorMessage };
  }
};

export const signUpWithEmail = async (email: string, pass: string, name: string) => {
  const cleanEmail = email.trim().toLowerCase();
  try {
    const res = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
    if (res.user) {
      await updateProfile(res.user, { displayName: name.trim() });
    }
    return { user: res.user, error: null };
  } catch (err: any) {
    console.error('Sign-Up Error:', err);
    let errorMsg = err.message || 'Failed to create account.';
    if (err.code === 'auth/operation-not-allowed') {
      errorMsg = 'Email/Password sign-in is disabled in Firebase Console -> Authentication -> Sign-in method.';
    } else if (err.code === 'auth/email-already-in-use') {
      errorMsg = 'This email address is already registered. Please sign in instead.';
    } else if (err.code === 'auth/weak-password') {
      errorMsg = 'Password should be at least 6 characters.';
    } else if (err.code === 'auth/invalid-email') {
      errorMsg = 'Please enter a valid email address.';
    } else if (err.code === 'auth/network-request-failed') {
      errorMsg = 'Network error. Please check your internet connection.';
    }
    return { user: null, error: errorMsg };
  }
};

export const signInWithEmail = async (email: string, pass: string) => {
  const cleanEmail = email.trim().toLowerCase();
  try {
    const res = await signInWithEmailAndPassword(auth, cleanEmail, pass);
    return { user: res.user, error: null };
  } catch (err: any) {
    console.error('Sign-In Error:', err);
    let errorMsg = err.message || 'Invalid credentials.';
    if (err.code === 'auth/operation-not-allowed') {
      errorMsg = 'Email/Password sign-in is disabled in Firebase Console -> Authentication -> Sign-in method.';
    } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
      errorMsg = 'Invalid email or password. Check your credentials or click "Sign Up" to create an account.';
    } else if (err.code === 'auth/invalid-email') {
      errorMsg = 'Please enter a valid email address.';
    } else if (err.code === 'auth/too-many-requests') {
      errorMsg = 'Too many failed login attempts. Please reset password or try again later.';
    } else if (err.code === 'auth/network-request-failed') {
      errorMsg = 'Network error. Please check your internet connection.';
    }
    return { user: null, error: errorMsg };
  }
};

export const resetPassword = async (email: string) => {
  const cleanEmail = email.trim().toLowerCase();
  try {
    await sendPasswordResetEmail(auth, cleanEmail);
    return { error: null };
  } catch (err: any) {
    let msg = err.message || 'Failed to send password reset email.';
    if (err.code === 'auth/user-not-found') {
      msg = 'No user account found with this email address.';
    } else if (err.code === 'auth/invalid-email') {
      msg = 'Please enter a valid email address.';
    }
    return { error: msg };
  }
};

export const logoutUser = async () => {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error: any) {
    console.error('Sign-Out Error:', error);
    return { error: error.message || 'Failed to sign out.' };
  }
};

export const deleteAccount = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      // Clean profile record
      const userRef = doc(db, 'users', user.uid);
      await deleteDoc(userRef);
      await deleteUser(user);
    }
    return { error: null };
  } catch (err: any) {
    return { error: err.message || 'Failed to delete account. You may need to re-authenticate first.' };
  }
};

// Helper to send in-app notification
export const sendNotification = async (
  userId: string, 
  title: string, 
  message: string, 
  type: AppNotification['type'], 
  relatedId?: string
) => {
  try {
    await addDoc(collection(db, 'notifications'), {
      userId,
      title,
      message,
      type,
      relatedId: relatedId || '',
      read: false,
      createdAt: Date.now()
    });
  } catch (err) {
    console.error("Error sending notification:", err);
  }
};

// Helper for credit transactions
export const recordCreditTransaction = async (
  userId: string,
  amount: number,
  type: CreditTransactionType,
  description: string,
  relatedAppId?: string,
  relatedAssignmentId?: string
) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return;

    const currentData = userSnap.data() as UserProfile;
    const prevBalance = currentData.credits || 0;
    const newBalance = Math.max(0, prevBalance + amount);

    await updateDoc(userRef, {
      credits: newBalance,
      updatedAt: Date.now()
    });

    await addDoc(collection(db, 'creditTransactions'), {
      userId,
      amount,
      type,
      previousBalance: prevBalance,
      newBalance,
      description,
      relatedAppId: relatedAppId || '',
      relatedAssignmentId: relatedAssignmentId || '',
      createdAt: Date.now()
    });
  } catch (err) {
    console.error("Error recording credit transaction:", err);
  }
};

export { 
  onAuthStateChanged, 
  type User,
  doc, 
  getDoc, 
  getDocFromServer,
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  orderBy, 
  onSnapshot, 
  deleteDoc,
  serverTimestamp,
  runTransaction 
};
