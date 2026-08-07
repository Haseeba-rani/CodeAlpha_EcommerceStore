// firebase-init.js
// Initializes the Firebase app + Auth client, and exposes a small set of
// helpers (as the global `FirebaseAuth` object) that every page's *-app.js
// file uses instead of talking to `firebase.auth()` directly. Requires
// firebase-app-compat.js, firebase-auth-compat.js, and firebase-config.js
// to be loaded first (see the <script> order in each .html file).

firebase.initializeApp(firebaseConfig);
const firebaseAuth = firebase.auth();

/**
 * Maps common Firebase Auth error codes to short, friendly messages instead
 * of showing raw "Firebase: Error (auth/...)" strings to shoppers.
 */
function mapFirebaseAuthError(error) {
  const messages = {
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/weak-password': 'Password must be at least 6 characters long.',
    'auth/user-not-found': 'Invalid email or password.',
    'auth/wrong-password': 'Invalid email or password.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
    'auth/network-request-failed': 'Network error — please check your connection.',
  };
  return messages[error.code] || error.message || 'Something went wrong. Please try again.';
}

const FirebaseAuth = {
  /** Creates a new Firebase Auth user and sets their display name. */
  async signUp(name, email, password) {
    try {
      const credential = await firebaseAuth.createUserWithEmailAndPassword(email, password);
      await credential.user.updateProfile({ displayName: name });
      return credential.user;
    } catch (error) {
      throw new Error(mapFirebaseAuthError(error));
    }
  },

  async signIn(email, password) {
    try {
      const credential = await firebaseAuth.signInWithEmailAndPassword(email, password);
      return credential.user;
    } catch (error) {
      throw new Error(mapFirebaseAuthError(error));
    }
  },

  async signOutUser() {
    return firebaseAuth.signOut();
  },

  /** Returns the current ID token (force-refreshed), or null if signed out. */
  async getIdToken(forceRefresh = false) {
    const user = firebaseAuth.currentUser;
    if (!user) return null;
    return user.getIdToken(forceRefresh);
  },

  getCurrentFirebaseUser() {
    return firebaseAuth.currentUser;
  },

  /** Subscribes to auth state changes. Returns an unsubscribe function. */
  onAuthStateChanged(callback) {
    return firebaseAuth.onAuthStateChanged(callback);
  },
};
