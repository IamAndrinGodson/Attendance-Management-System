import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

const DEMO_USERS = [
    { email: 'admin@greenwood.edu', password: 'admin123', name: 'John Doe', role: 'Administrator', avatar: 'JD' },
    { email: 'prof.sharma@greenwood.edu', password: 'prof123', name: 'Prof. Sharma', role: 'Faculty', avatar: 'PS' },
    { email: 'student@university.edu', password: 'student123', name: 'Aarav Sharma', role: 'Student', avatar: 'AS' },
];

function getRegisteredUsers() {
    try { return JSON.parse(localStorage.getItem('registered_users') || '[]'); } catch { return []; }
}

function saveRegisteredUsers(users) {
    localStorage.setItem('registered_users', JSON.stringify(users));
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('auth_user');
        return saved ? JSON.parse(saved) : null;
    });
    const [emailVerified, setEmailVerified] = useState(() => {
        return localStorage.getItem('email_verified') === 'true';
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            localStorage.setItem('auth_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('auth_user');
            localStorage.removeItem('email_verified');
            setEmailVerified(false);
        }
    }, [user]);

    useEffect(() => {
        localStorage.setItem('email_verified', emailVerified ? 'true' : 'false');
    }, [emailVerified]);

    const login = async (email, password) => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1200));

        // Check demo users first, then registered users
        const allUsers = [...DEMO_USERS, ...getRegisteredUsers()];
        const found = allUsers.find(
            u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        setIsLoading(false);

        if (found) {
            const { password: _, ...userData } = found;
            setUser(userData);
            setEmailVerified(false);
            return { success: true };
        }
        return { success: false, error: 'Invalid email or password' };
    };

    /**
     * Register a new user via email OTP (no password needed).
     * A random password is set internally — users always sign in via demo or signup flow.
     */
    const register = ({ name, email, role }) => {
        const avatar = name.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        const newUser = {
            email,
            password: Math.random().toString(36).slice(2), // random internal password
            name,
            role,
            avatar,
        };
        const existing = getRegisteredUsers();
        // Update if already exists, else append
        const updated = existing.filter(u => u.email.toLowerCase() !== email.toLowerCase());
        saveRegisteredUsers([...updated, newUser]);

        // Auto-login immediately — email was already verified via OTP in signup
        const { password: _, ...userData } = newUser;
        setUser(userData);
        setEmailVerified(true); // already done OTP
    };

    /**
     * Google Sign-In — decode the JWT credential and auto-register + login.
     */
    const googleLogin = (credentialResponse) => {
        try {
            const decoded = jwtDecode(credentialResponse.credential);
            const { name, email, picture, sub } = decoded;
            const avatar = name
                .trim()
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);

            const newUser = {
                email,
                password: `google_${sub}`, // internal placeholder
                name,
                role: 'Student', // default role for Google sign-ins
                avatar,
                picture, // Google profile picture URL
            };

            const existing = getRegisteredUsers();
            const updated = existing.filter(
                u => u.email.toLowerCase() !== email.toLowerCase()
            );
            saveRegisteredUsers([...updated, newUser]);

            const { password: _, ...userData } = newUser;
            setUser(userData);
            setEmailVerified(true); // Google already verified the email
            return { success: true };
        } catch (err) {
            console.error('Google login failed:', err);
            return { success: false, error: 'Failed to process Google sign-in' };
        }
    };

    const logout = () => {
        setUser(null);
        setEmailVerified(false);
    };

    const markEmailVerified = () => {
        setEmailVerified(true);
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            googleLogin,
            logout,
            register,
            isLoading,
            isAuthenticated: !!user,
            emailVerified,
            markEmailVerified,
            needsVerification: !!user && !emailVerified,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}
