import { db } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';

// User Services
export const createUserProfile = async (user) => {
  if (!user) return null;
  
  const userRef = doc(db, "users", user.id);
  const userData = {
    uid: user.id,
    name: user.name || 'Anonymous',
    email: user.email,
    createdAt: serverTimestamp(),
    lastLogin: serverTimestamp()
  };

  await setDoc(userRef, userData, { merge: true });
  return userData;
};

export const getUserProfile = async (uid) => {
  if (!uid) return null;
  
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() : null;
};

// Post Services
export const createPost = async (userId, content) => {
  if (!userId) throw new Error('User must be authenticated to create a post');
  
  const userProfile = await getUserProfile(userId);
  if (!userProfile) throw new Error('User profile not found');

  return await addDoc(collection(db, "posts"), {
    userId,
    content,
    authorName: userProfile.name || 'Anonymous',
    authorEmail: userProfile.email,
    likes: 0,
    comments: [],
    createdAt: serverTimestamp()
  });
};

export const getPosts = async () => {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Message Services
export const sendMessage = async (senderId, receiverId, text) => {
  if (!senderId) throw new Error('User must be authenticated to send a message');
  
  return await addDoc(collection(db, "messages"), {
    senderId,
    receiverId,
    text,
    createdAt: serverTimestamp()
  });
};

export const listenToMessages = (userId, chatPartnerId, callback) => {
  if (!userId || !chatPartnerId) return () => {};

  const q = query(
    collection(db, "messages"),
    where("senderId", "in", [userId, chatPartnerId]),
    where("receiverId", "in", [userId, chatPartnerId]),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(messages);
  });
};

// Forum Services
export const createForumThread = async (userId, topic) => {
  return await addDoc(collection(db, "forums"), {
    userId,
    topic,
    posts: [],
    createdAt: serverTimestamp()
  });
};

export const getForumThreads = async () => {
  const q = query(collection(db, "forums"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};
