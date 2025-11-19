
import type { UserData } from '../types';

const USER_DATA_PREFIX = 'smart_good_data_';

export const saveUserData = (email: string, data: UserData): void => {
    localStorage.setItem(`${USER_DATA_PREFIX}${email.toLowerCase()}`, JSON.stringify(data));
};

export const getUserData = (email: string): UserData | null => {
    const dataJson = localStorage.getItem(`${USER_DATA_PREFIX}${email.toLowerCase()}`);
    return dataJson ? JSON.parse(dataJson) : null;
};

export const hasCompletedQuiz = (email: string): boolean => {
    const data = getUserData(email);
    return !!data && !!data.quizData;
};

export const deleteUserData = (email: string): void => {
    localStorage.removeItem(`${USER_DATA_PREFIX}${email.toLowerCase()}`);
};