import { 
    getAuth, 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';

export const authService = {
    // Register a new user
    async signup(userData) {
        try {
            const auth = getAuth();
            const { user } = await createUserWithEmailAndPassword(
                auth,
                userData.email,
                userData.password
            );

            // Update user profile with additional info
            await updateProfile(user, {
                displayName: userData.name,
                phoneNumber: userData.phone
            });

            return {
                id: user.uid,
                name: user.displayName,
                email: user.email,
                phone: userData.phone,
                createdAt: user.metadata.creationTime
            };
        } catch (error) {
            throw new Error(error.message);
        }
    },

    // Login user with email and password
    async login(email, password) {
        try {
            const auth = getAuth();
            const { user } = await signInWithEmailAndPassword(auth, email, password);

            return {
                id: user.uid,
                name: user.displayName,
                email: user.email,
                phone: user.phoneNumber,
                createdAt: user.metadata.creationTime
            };
        } catch (error) {
            throw new Error(error.message);
        }
    },

    // Sign in with Google
    async signInWithGoogle() {
        try {
            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            const { user } = await signInWithPopup(auth, provider);

            return {
                id: user.uid,
                name: user.displayName,
                email: user.email,
                phone: user.phoneNumber,
                createdAt: user.metadata.creationTime
            };
        } catch (error) {
            throw new Error(error.message);
        }
    },

    // Logout user
    async logout() {
        const auth = getAuth();
        await signOut(auth);
    },

    // Get current user data
    getCurrentUser() {
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (!user) return null;

        return {
            id: user.uid,
            name: user.displayName,
            email: user.email,
            phone: user.phoneNumber,
            createdAt: user.metadata.creationTime
        };
    }
};
