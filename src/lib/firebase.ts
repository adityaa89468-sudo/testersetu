import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
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
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    let errorMessage = 'Failed to sign in with Google. Please try again or use Email & Password below.';
    const code = error?.code || '';
    const msg = error?.message || '';

    if (code === 'auth/unauthorized-domain') {
      const domain = window.location.hostname;
      errorMessage = `Unauthorized Domain: "${domain}" is not listed in Firebase Console -> Authentication -> Settings -> Authorized domains.`;
    } else if (code === 'auth/operation-not-allowed') {
      errorMessage = 'Google Sign-In is disabled in Firebase Console. Please enable Google provider under Authentication -> Sign-in method, or use Email/Password sign-in below.';
    } else if (code === 'auth/popup-closed-by-user') {
      errorMessage = 'Sign-in popup was closed before completing.';
    } else if (code === 'auth/popup-blocked') {
      errorMessage = 'Sign-in popup was blocked by browser/emulator. Please use Email & Password sign-in below.';
    } else if (msg.includes('requested action is invalid') || msg.includes('disallowed_useragent') || code === 'auth/invalid-action-code') {
      errorMessage = 'Google OAuth popup is restricted in Android Emulator/WebView. Please use Email & Password sign-in/up below for instant access.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    return { user: null, error: errorMessage };
  }
};

export const signUpWithEmail = async (email: string, pass: string, name: string) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    if (res.user) {
      await updateProfile(res.user, { displayName: name });
    }
    return { user: res.user, error: null };
  } catch (err: any) {
    console.error('Sign-Up Error:', err);
    let errorMsg = err.message || 'Failed to create account.';
    if (err.code === 'auth/operation-not-allowed') {
      errorMsg = 'Email/Password sign-in is disabled in your Firebase Console -> Authentication -> Sign-in method.';
    } else if (err.code === 'auth/email-already-in-use') {
      errorMsg = 'This email address is already registered. Please sign in instead.';
    } else if (err.code === 'auth/weak-password') {
      errorMsg = 'Password should be at least 6 characters.';
    }
    return { user: null, error: errorMsg };
  }
};

export const signInWithEmail = async (email: string, pass: string) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, pass);
    return { user: res.user, error: null };
  } catch (err: any) {
    console.error('Sign-In Error:', err);
    let errorMsg = err.message || 'Invalid credentials.';
    if (err.code === 'auth/operation-not-allowed') {
      errorMsg = 'Email/Password sign-in is disabled in your Firebase Console -> Authentication -> Sign-in method.';
    } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
      errorMsg = 'Invalid email or password. Please check your credentials or create a new account.';
    }
    return { user: null, error: errorMsg };
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (err: any) {
    return { error: err.message || 'Failed to send password reset email.' };
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
