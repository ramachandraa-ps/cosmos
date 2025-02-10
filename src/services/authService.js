// Utility function to hash passwords (basic security)
const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
};

export const authService = {
    // Register a new user
    async signup(userData) {
        try {
            // Get existing users or initialize empty array
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            // Check if email already exists
            if (users.some(user => user.email === userData.email)) {
                throw new Error('Email already registered');
            }

            // Hash the password before storing
            const hashedPassword = await hashPassword(userData.password);
            
            // Create new user object
            const newUser = {
                id: Date.now().toString(),
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                password: hashedPassword,
                createdAt: new Date().toISOString()
            };

            // Add to users array
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            // Store current user session (without password)
            const { password, ...userSession } = newUser;
            localStorage.setItem('currentUser', JSON.stringify(userSession));

            return userSession;
        } catch (error) {
            throw error;
        }
    },

    // Login user
    async login(email, password) {
        try {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const hashedPassword = await hashPassword(password);
            
            // Find user with matching email and password
            const user = users.find(u => 
                u.email === email && u.password === hashedPassword
            );

            if (!user) {
                throw new Error('Invalid email or password');
            }

            // Store current user session (without password)
            const { password: _, ...userSession } = user;
            localStorage.setItem('currentUser', JSON.stringify(userSession));

            return userSession;
        } catch (error) {
            throw error;
        }
    },

    // Logout user
    logout() {
        localStorage.removeItem('currentUser');
    },

    // Check if user is logged in
    isLoggedIn() {
        return !!localStorage.getItem('currentUser');
    },

    // Get current user data
    getCurrentUser() {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    }
};
