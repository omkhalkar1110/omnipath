import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, where, onSnapshot, updateDoc, serverTimestamp, Timestamp, getDocFromServer, deleteDoc, getDocs, orderBy } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { College } from './types';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();

// Types
export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  phone?: string;
  role: 'super_admin' | 'institute_admin' | 'student';
  requestedRole?: string;
  instituteId?: string;
  isBlocked?: boolean;
}

export interface Institute {
  id: string;
  name: string;
  adminUid: string;
  adminEmail: string;
  adminName: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Timestamp;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  instituteId: string;
  addedBy: string;
  createdAt: Timestamp;
}

export interface Review {
  id: string;
  collegeName: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Timestamp;
}

export interface VibeVideo {
  id: string;
  collegeName: string;
  videoUrl: string;
  thumbnailUrl?: string;
  description: string;
  creatorName: string;
  creatorUid: string;
  createdAt: Timestamp;
}

// Error Handling
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
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
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
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Auth Functions
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    if (error.code === 'auth/popup-closed-by-user') {
      console.log('Login popup closed by user');
    } else {
      console.error('Login Error:', error);
    }
    throw error;
  }
};

export const logout = () => signOut(auth);

// User Profile Functions
export const createUserProfile = async (
  user: FirebaseUser, 
  role: 'institute_admin' | 'student' = 'student',
  extraData?: { phone?: string; requestedRole?: string; name?: string }
) => {
  console.log('Creating/Updating profile for:', user.uid, { role, extraData });
  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);

  const isSuperAdmin = user.email === 'omkhalkar9995@gmail.com' && user.emailVerified;
  const assignedRole = extraData?.requestedRole || role;

  if (!userDoc.exists()) {
    console.log('User document does not exist, creating new profile...');
    const profile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      name: extraData?.name || user.displayName || 'Anonymous',
      phone: extraData?.phone || '',
      role: isSuperAdmin ? 'super_admin' : (assignedRole as any),
      requestedRole: extraData?.requestedRole || role,
      isBlocked: false
    };
    try {
      await setDoc(userRef, profile);
      console.log('Profile created successfully');
    } catch (error) {
      console.error('Error creating profile:', error);
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    }
    return profile;
  } else {
    console.log('User document exists, checking for updates...');
    const existingData = userDoc.data() as UserProfile;
    
    // If extraData is provided, update the existing profile
    if (extraData) {
      const updates: Partial<UserProfile> = {};
      
      if (extraData.name && extraData.name !== existingData.name && (existingData.name === 'Anonymous' || !existingData.name)) {
        updates.name = extraData.name;
      }
      if (extraData.phone && extraData.phone !== existingData.phone) {
        updates.phone = extraData.phone;
      }
      if (extraData.requestedRole && extraData.requestedRole !== existingData.requestedRole) {
        updates.requestedRole = extraData.requestedRole;
      }
      
      if (Object.keys(updates).length > 0) {
        console.log('Updating profile with:', updates);
        try {
          await updateDoc(userRef, updates);
          console.log('Profile updated successfully');
          return { ...existingData, ...updates };
        } catch (error) {
          console.error('Error updating profile:', error);
          handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
        }
      }
    }
    return existingData;
  }
};

export const getUserProfile = async (uid: string) => {
  const userRef = doc(db, 'users', uid);
  try {
    const userDoc = await getDoc(userRef);
    return userDoc.exists() ? (userDoc.data() as UserProfile) : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${uid}`);
  }
};

// Institute Functions
export const requestInstitute = async (name: string, adminUid: string, adminEmail: string, adminName: string) => {
  try {
    const docRef = doc(collection(db, 'institutes'));
    await setDoc(docRef, {
      id: docRef.id,
      name,
      adminUid,
      adminEmail,
      adminName,
      status: 'pending',
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'institutes');
  }
};

export const approveInstitute = async (instituteId: string, adminUid: string) => {
  try {
    const instRef = doc(db, 'institutes', instituteId);
    await updateDoc(instRef, { status: 'approved' });

    // Update user role and instituteId
    const userRef = doc(db, 'users', adminUid);
    await updateDoc(userRef, { 
      role: 'institute_admin',
      instituteId: instituteId 
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `institutes/${instituteId}`);
  }
};

export const rejectInstitute = async (instituteId: string) => {
  try {
    const instRef = doc(db, 'institutes', instituteId);
    await updateDoc(instRef, { status: 'rejected' });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `institutes/${instituteId}`);
  }
};

// Student Functions
export const addStudent = async (instituteId: string, name: string, email: string, addedBy: string) => {
  try {
    const docRef = await addDoc(collection(db, 'institutes', instituteId, 'students'), {
      name,
      email,
      instituteId,
      addedBy,
      createdAt: serverTimestamp(),
    });
    // Update the ID field
    await updateDoc(docRef, { id: docRef.id });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `institutes/${instituteId}/students`);
  }
};

export const getInstituteStudents = (instituteId: string, callback: (students: Student[]) => void) => {
  const q = query(collection(db, 'institutes', instituteId, 'students'));
  return onSnapshot(q, (snapshot) => {
    const students = snapshot.docs.map(doc => doc.data() as Student);
    callback(students);
  }, (error) => handleFirestoreError(error, OperationType.LIST, `institutes/${instituteId}/students`));
};

// College Functions
export const addCollege = async (college: College) => {
  try {
    const docRef = await addDoc(collection(db, 'colleges'), {
      ...college,
      createdAt: serverTimestamp(),
    });
    // Update the ID field
    await updateDoc(docRef, { id: docRef.id });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'colleges');
  }
};

export const getAllColleges = (callback: (colleges: College[]) => void) => {
  const q = query(collection(db, 'colleges'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const colleges = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as College));
    callback(colleges);
  }, (error) => handleFirestoreError(error, OperationType.LIST, 'colleges'));
};

export const deleteCollege = async (collegeId: string) => {
  try {
    const docRef = doc(db, 'colleges', collegeId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `colleges/${collegeId}`);
  }
};

// Review Functions
export const addReview = async (review: Omit<Review, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'reviews'), {
      ...review,
      createdAt: serverTimestamp(),
    });
    await updateDoc(docRef, { id: docRef.id });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'reviews');
  }
};

export const getCollegeReviews = (collegeName: string, callback: (reviews: Review[]) => void) => {
  const q = query(collection(db, 'reviews'), where('collegeName', '==', collegeName), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
    callback(reviews);
  }, (error) => handleFirestoreError(error, OperationType.LIST, 'reviews'));
};

// Vibe Video Functions
export const addVibeVideo = async (video: Omit<VibeVideo, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'vibe_videos'), {
      ...video,
      createdAt: serverTimestamp(),
    });
    await updateDoc(docRef, { id: docRef.id });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'vibe_videos');
  }
};

export const getCollegeVibeVideos = (collegeName: string, callback: (videos: VibeVideo[]) => void) => {
  const q = query(collection(db, 'vibe_videos'), where('collegeName', '==', collegeName), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const videos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VibeVideo));
    callback(videos);
  }, (error) => handleFirestoreError(error, OperationType.LIST, 'vibe_videos'));
};

export const deleteVibeVideo = async (videoId: string) => {
  try {
    const docRef = doc(db, 'vibe_videos', videoId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `vibe_videos/${videoId}`);
  }
};

// Super Admin Functions
export const getAllUsers = (callback: (users: UserProfile[]) => void) => {
  const q = query(collection(db, 'users'));
  return onSnapshot(q, (snapshot) => {
    const users = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile));
    callback(users);
  }, (error) => handleFirestoreError(error, OperationType.LIST, 'users'));
};

export const getAllInstituteRequests = (callback: (requests: Institute[]) => void) => {
  const q = query(collection(db, 'institutes'), where('status', '==', 'pending'));
  return onSnapshot(q, (snapshot) => {
    const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Institute));
    callback(requests);
  }, (error) => handleFirestoreError(error, OperationType.LIST, 'institutes'));
};

export const getAllApprovedInstitutes = (callback: (institutes: Institute[]) => void) => {
  const q = query(collection(db, 'institutes'), where('status', '==', 'approved'));
  return onSnapshot(q, (snapshot) => {
    const institutes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Institute));
    callback(institutes);
  }, (error) => handleFirestoreError(error, OperationType.LIST, 'institutes'));
};

// Connection Test
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. ");
    }
  }
}
testConnection();
