
import type { User } from '../types';

const USERS_KEY = 'smart_good_users';
const CURRENT_USER_KEY = 'smart_good_current_user';

interface StoredUser extends User {
    passwordHash: string; // In a real app, this would be a securely hashed password
}

const getUsers = (): StoredUser[] => {
    const usersJson = localStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
};

const saveUsers = (users: StoredUser[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const signup = (fullName: string, email: string, password: string): User => {
    if (!fullName || !email || !password) {
        throw new Error("Todos os campos são obrigatórios.");
    }
    if (password.length < 6) {
        throw new Error("A senha deve ter no mínimo 6 caracteres.");
    }
    const users = getUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("Este e-mail já está cadastrado.");
    }

    const newUser: StoredUser = {
        fullName,
        email,
        passwordHash: password, // Storing password directly for mock purposes
    };
    users.push(newUser);
    saveUsers(users);
    
    return { fullName, email };
};

export const login = (email: string, password: string): User => {
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user || user.passwordHash !== password) {
        throw new Error("E-mail ou senha inválidos.");
    }
    
    const currentUser = { fullName: user.fullName, email: user.email };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    return currentUser;
};

export const logout = (): void => {
    localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = (): User | null => {
    const userJson = localStorage.getItem(CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
};

export const resetPassword = (email: string, newPassword: string): void => {
    if (!email || !newPassword) {
        throw new Error("Todos os campos são obrigatórios.");
    }
    if (newPassword.length < 6) {
        throw new Error("A nova senha deve ter no mínimo 6 caracteres.");
    }
    const users = getUsers();
    const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

    if (userIndex === -1) {
        throw new Error("E-mail não encontrado.");
    }

    users[userIndex].passwordHash = newPassword;
    saveUsers(users);
};

export const deleteAccount = (email: string): void => {
    let users = getUsers();
    const updatedUsers = users.filter(u => u.email.toLowerCase() !== email.toLowerCase());
    saveUsers(updatedUsers);
    logout(); // Ensures current user is cleared
};