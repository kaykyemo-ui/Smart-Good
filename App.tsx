
import React, { useState, useEffect, useCallback } from 'react';
import { AuthView } from './components/AuthView';
import Quiz from './components/Quiz';
import Dashboard from './components/Dashboard';
import { getCurrentUser, logout } from './services/authService';
import { getUserData, hasCompletedQuiz } from './services/dataService';
import type { User, UserData } from './types';

// Define a simple loading component to be used inside App
const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent border-solid rounded-full animate-spin"></div>
    </div>
);

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [quizCompleted, setQuizCompleted] = useState(false);

    const checkUserStatus = useCallback(() => {
        setLoading(true);
        const currentUser = getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
            const data = getUserData(currentUser.email);
            setUserData(data);
            setQuizCompleted(hasCompletedQuiz(currentUser.email));
        } else {
            setUser(null);
            setUserData(null);
            setQuizCompleted(false);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        checkUserStatus();
    }, [checkUserStatus]);

    const handleLogin = (loggedInUser: User) => {
        setUser(loggedInUser);
        const data = getUserData(loggedInUser.email);
        setUserData(data);
        setQuizCompleted(hasCompletedQuiz(loggedInUser.email));
    };

    const handleLogout = () => {
        logout();
        setUser(null);
        setUserData(null);
        setQuizCompleted(false);
    };

    const handleQuizComplete = () => {
        if(user){
            setQuizCompleted(true);
            const data = getUserData(user.email);
            setUserData(data);
        }
    };

    const handleEditProfile = () => {
        setQuizCompleted(false);
    };
    
    if (loading) {
        return <LoadingSpinner />;
    }

    const renderContent = () => {
        if (user) {
            if (quizCompleted && userData) {
                return <Dashboard user={user} userData={userData} onLogout={handleLogout} refreshUserData={checkUserStatus} onEditProfile={handleEditProfile} />;
            } else {
                return <Quiz user={user} onComplete={handleQuizComplete} />;
            }
        } else {
            return <AuthView onLogin={handleLogin} />;
        }
    };

    return (
        <div className="min-h-screen bg-background text-on-surface font-sans">
            {renderContent()}
        </div>
    );
};

export default App;
