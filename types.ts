
export enum Goal {
    LOSE_WEIGHT = 'perder peso',
    GAIN_MUSCLE = 'ganhar massa muscular',
}

export enum ActivityLevel {
    SEDENTARY = 'sedentário',
    LIGHT = 'leve',
    MODERATE = 'moderado',
    INTENSE = 'intenso',
}

export interface User {
    fullName: string;
    email: string;
}

export interface QuizData {
    fullName:string;
    age: number;
    height: number;
    currentWeight: number;
    goal: Goal;
    measurements: string;
    intolerances: string;

    // Weight Loss specific
    weightLossMedication?: string;
    medicationFrequency?: string; // Novo campo
    medicalRestrictions?: string;
    activityLevel?: ActivityLevel;
    sleepQuality?: string;
    yoYoEffect?: string;
    eatingOutFrequency?: string;
    weightLossChallenge?: string;
    dailyReminders?: boolean;

    // Muscle Gain specific
    supplements?: string;
    controlledMedication?: string;
    trainingFrequency?: string;
    mealsPerDay?: string;
    difficultyGainingWeight?: string;
    injuries?: string;
    muscleGainChallenge?: string;
}

export interface Exercise {
    name: string;
    sets: string;
    reps: string;
    description: string;
    detailedInstructions?: string[]; // Novo campo para o passo a passo
}

export interface WorkoutPlan {
    monday: Exercise[];
    tuesday: Exercise[];
    wednesday: Exercise[];
    thursday: Exercise[];
    friday: Exercise[];
    saturday: Exercise[];
    sunday: Exercise[];
}

export interface Meal {
    name: string;
    description: string;
    calories: number;
}

export interface MealPlan {
    monday: Meal[];
    tuesday: Meal[];
    wednesday: Meal[];
    thursday: Meal[];
    friday: Meal[];
    saturday: Meal[];
    sunday: Meal[];
}

export interface WeightEntry {
    date: string; // ISO string
    weight: number;
}

export interface PhotoEntry {
    date: string; // ISO string
    photoUrl: string; // base64 string
}

export interface DailyProgress {
    date: string; // YYYY-MM-DD
    waterConsumed: number; // in ml
    completedExercises?: string[];
    completedMeals?: string[];
}

export interface UserData {
    quizData: QuizData;
    workoutPlan?: WorkoutPlan;
    mealPlan?: MealPlan;
    weightHistory: WeightEntry[];
    photoHistory: PhotoEntry[];
    dailyProgress?: DailyProgress;
    points: number; // Gamification System
}
