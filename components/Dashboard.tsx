
import React, { useState, useMemo, useEffect } from 'react';
import type { User, UserData, Meal, Exercise, WeightEntry, PhotoEntry } from '../types';
import { MOTIVATIONAL_NOTIFICATIONS, USER_LEVELS } from '../constants';
import { saveUserData, deleteUserData } from '../services/dataService';
import { deleteAccount } from '../services/authService';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface DashboardProps {
    user: User;
    userData: UserData;
    onLogout: () => void;
    refreshUserData: () => void;
    onEditProfile: () => void;
}

type DashboardView = 'home' | 'workout' | 'mealplan' | 'progress' | 'profile';

const Dashboard: React.FC<DashboardProps> = ({ user, userData, onLogout, refreshUserData, onEditProfile }) => {
    const [currentView, setCurrentView] = useState<DashboardView>('home');
    const [isWeightModalOpen, setWeightModalOpen] = useState(false);
    const [newWeight, setNewWeight] = useState<number | ''>('');
    const [isPhotoModalOpen, setPhotoModalOpen] = useState(false);
    const [newPhoto, setNewPhoto] = useState<string | null>(null);
    const [notification, setNotification] = useState('');
    const [consumedWater, setConsumedWater] = useState(0); // in ml
    const [showHydrationCongrats, setShowHydrationCongrats] = useState(false);
    const [showLevelUp, setShowLevelUp] = useState<{oldLevel: string, newLevel: string} | null>(null);
    
    // Estado para exclusão de foto
    const [photoToDeleteIndex, setPhotoToDeleteIndex] = useState<number | null>(null);

    useEffect(() => {
        if (sessionStorage.getItem('showWelcomeNotification') === 'true') {
            setNotification(`Bem-vindo(a)! Agradecemos por escolher a Smart Good!`);
            const timeoutId = setTimeout(() => setNotification(''), 6000);
            sessionStorage.removeItem('showWelcomeNotification');
            return () => clearTimeout(timeoutId);
        }
    }, []);

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        if (userData.dailyProgress && userData.dailyProgress.date === today) {
            setConsumedWater(userData.dailyProgress.waterConsumed);
        } else {
            setConsumedWater(0);
        }
    }, [userData.dailyProgress]);
    
    // Timer de notificação motivacional a cada 5 minutos (300.000 ms)
    useEffect(() => {
        const interval = setInterval(() => {
            const randomMessage = MOTIVATIONAL_NOTIFICATIONS[Math.floor(Math.random() * MOTIVATIONAL_NOTIFICATIONS.length)];
            setNotification(randomMessage);
            const timeoutId = setTimeout(() => setNotification(''), 5000);
            return () => clearTimeout(timeoutId);
        }, 300000); // 5 minutos
        return () => clearInterval(interval);
    }, []);
    
    const waterIntake = useMemo(() => {
        const water = userData.quizData.currentWeight * 35;
        return (water / 1000).toFixed(1);
    }, [userData.quizData.currentWeight]);
    
    // --- Sistema de Pontuação ---
    const getCurrentLevel = (points: number) => {
        for (let i = USER_LEVELS.length - 1; i >= 0; i--) {
            if (points >= USER_LEVELS[i].minPoints) {
                return USER_LEVELS[i];
            }
        }
        return USER_LEVELS[0];
    };

    const getNextLevel = (points: number) => {
        for (let i = 0; i < USER_LEVELS.length; i++) {
            if (USER_LEVELS[i].minPoints > points) {
                return USER_LEVELS[i];
            }
        }
        return null; // Já está no nível máximo
    };

    const handleAwardPoints = (amount: number, reason: string, currentData: UserData) => {
        const currentPoints = currentData.points || 0;
        const newPoints = currentPoints + amount;
        
        const oldLevel = getCurrentLevel(currentPoints);
        const newLevel = getCurrentLevel(newPoints);

        const updatedData = { ...currentData, points: newPoints };
        
        // Verifica se subiu de nível
        if (newLevel.name !== oldLevel.name) {
            setShowLevelUp({ oldLevel: oldLevel.name, newLevel: newLevel.name });
            setNotification(`🎉 Level Up! Você agora é ${newLevel.name}!`);
        } else {
            setNotification(`+${amount} pts: ${reason}`);
            setTimeout(() => setNotification(''), 3000);
        }

        return updatedData;
    };
    // --------------------------

    const handleWaterChange = (amountToAdd: number) => {
        const goalInMl = parseFloat(waterIntake) * 1000;
        const previousWaterAmount = consumedWater;
        
        // Calcula o novo total, mas não permite que seja menor que 0
        let newTotal = Math.max(0, consumedWater + amountToAdd);
        
        // Limita o total à meta diária
        if (newTotal > goalInMl) {
            newTotal = goalInMl;
        }

        // Se tentar adicionar e já estiver cheio, ou se a mudança não alterar o valor, não faz nada
        if (previousWaterAmount === goalInMl && amountToAdd > 0) {
             return;
        }

        let currentData = { ...userData };

        // Bônus por bater a meta
        if (previousWaterAmount < goalInMl && newTotal >= goalInMl) {
            setShowHydrationCongrats(true);
            setTimeout(() => setShowHydrationCongrats(false), 5000);
            
            // Ganha pontos ao atingir a meta
            currentData = handleAwardPoints(50, "Meta de Hidratação!", currentData);
        }

        const today = new Date().toISOString().split('T')[0];
        const updatedUserData: UserData = {
            ...currentData,
            dailyProgress: {
                ...userData.dailyProgress,
                date: today,
                waterConsumed: newTotal,
                completedExercises: userData.dailyProgress?.completedExercises || [],
                completedMeals: userData.dailyProgress?.completedMeals || [],
            }
        };
        saveUserData(user.email, updatedUserData);
        refreshUserData();
    };

    const handleWeightSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newWeight === '' || isNaN(Number(newWeight))) return;

        const weightVal = Number(newWeight);
        const newEntry: WeightEntry = {
            date: new Date().toISOString(),
            weight: weightVal
        };

        let currentData = { ...userData };
        // Ganha pontos por atualizar peso
        currentData = handleAwardPoints(30, "Registro de Peso", currentData);

        const updatedUserData: UserData = {
            ...currentData,
            quizData: {
                ...userData.quizData,
                currentWeight: weightVal // Atualiza o peso atual
            },
            weightHistory: [...userData.weightHistory, newEntry]
        };

        saveUserData(user.email, updatedUserData);
        refreshUserData();
        setWeightModalOpen(false);
        setNewWeight('');
    };
    
    const handlePhotoSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPhoto) return;

        const newEntry: PhotoEntry = {
            date: new Date().toISOString(),
            photoUrl: newPhoto
        };

        let currentData = { ...userData };
        // Ganha pontos por foto
        currentData = handleAwardPoints(30, "Upload de Foto", currentData);

        const updatedUserData: UserData = {
            ...currentData,
            photoHistory: [...userData.photoHistory, newEntry]
        };

        saveUserData(user.email, updatedUserData);
        refreshUserData();
        setPhotoModalOpen(false);
        setNewPhoto(null);
    };

    const initiateDeletePhoto = (index: number) => {
        setPhotoToDeleteIndex(index);
    };

    const confirmDeletePhoto = () => {
        if (photoToDeleteIndex === null) return;

        const updatedPhotoHistory = [...userData.photoHistory];
        // Remove o item no índice especificado
        updatedPhotoHistory.splice(photoToDeleteIndex, 1);
        
        const updatedUserData: UserData = {
            ...userData,
            photoHistory: updatedPhotoHistory
        };

        saveUserData(user.email, updatedUserData);
        refreshUserData();
        setPhotoToDeleteIndex(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => setNewPhoto(event.target?.result as string);
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    
     const handleDeleteAccount = () => {
        if (window.confirm("Você tem certeza que deseja excluir sua conta? Esta ação é permanente e não pode ser desfeita.")) {
            deleteUserData(user.email);
            deleteAccount(user.email);
            onLogout();
        }
    };

    // Função wrapper para passar a lógica de pontos para as views filhas
    const onPointsEarned = (amount: number, reason: string) => {
        const updated = handleAwardPoints(amount, reason, userData);
        saveUserData(user.email, updated);
        refreshUserData();
        return updated; // Retorna para uso imediato se necessário
    };

    const renderView = () => {
        const backButton = <button onClick={() => setCurrentView('home')} className="mb-6 bg-gray-700 hover:bg-gray-600 text-on-surface px-4 py-2 rounded-lg transition-colors">← Voltar ao Painel</button>;
        
        switch (currentView) {
            case 'workout':
                return <div>{backButton}<WorkoutView user={user} userData={userData} refreshUserData={refreshUserData} onPointsEarned={onPointsEarned} /></div>;
            case 'mealplan':
                return <div>{backButton}<MealView user={user} userData={userData} refreshUserData={refreshUserData} onPointsEarned={onPointsEarned} /></div>;
            case 'progress':
                return <div>{backButton}<ProgressView weightHistory={userData.weightHistory} photoHistory={userData.photoHistory} onDeletePhoto={initiateDeletePhoto} /></div>;
            case 'profile':
                return <div>{backButton}<ProfileView user={user} quizData={userData.quizData} onEditProfile={onEditProfile} onDeleteAccount={handleDeleteAccount} /></div>;
            case 'home':
            default:
                return <DashboardHome 
                            user={user}
                            userData={userData} 
                            onNavigate={setCurrentView} 
                            waterIntake={waterIntake}
                            consumedWater={consumedWater}
                            onWaterChange={handleWaterChange}
                            onUpdateWeight={() => setWeightModalOpen(true)}
                            onUploadPhoto={() => setPhotoModalOpen(true)}
                            currentLevel={getCurrentLevel(userData.points || 0)}
                            nextLevel={getNextLevel(userData.points || 0)}
                        />;
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="bg-surface p-4 flex justify-between items-center shadow-md sticky top-0 z-10">
                <h1 className="text-xl md:text-2xl font-bold text-primary">Smart Good</h1>
                <div>
                    <span className="hidden sm:inline mr-4 text-on-surface-secondary">Olá, {user.fullName.split(' ')[0]}</span>
                    <button onClick={onLogout} className="text-on-surface-secondary hover:text-primary transition-colors">Sair</button>
                </div>
            </header>
            
            <main className="p-4 md:p-8 max-w-7xl mx-auto">
                {renderView()}
            </main>
            
            {isWeightModalOpen && <WeightModal currentWeight={userData.quizData.currentWeight} newWeight={newWeight} setNewWeight={setNewWeight} onClose={() => setWeightModalOpen(false)} onSubmit={handleWeightSubmit} />}
            {isPhotoModalOpen && <PhotoModal newPhoto={newPhoto} onFileChange={handleFileChange} onClose={() => setPhotoModalOpen(false)} onSubmit={handlePhotoSubmit} />}
            
            {photoToDeleteIndex !== null && (
                <ConfirmModal 
                    title="Excluir Foto" 
                    message="Tem certeza que deseja excluir esta foto permanentemente? Esta ação não pode ser desfeita."
                    onConfirm={confirmDeletePhoto}
                    onCancel={() => setPhotoToDeleteIndex(null)}
                />
            )}
            
            {showLevelUp && (
                <Modal title="LEVEL UP! 🚀" onClose={() => setShowLevelUp(null)}>
                    <div className="text-center py-6">
                        <p className="text-lg text-on-surface-secondary">Parabéns! Você evoluiu de</p>
                        <p className="text-xl text-gray-400 font-bold mb-2">{showLevelUp.oldLevel}</p>
                        <div className="text-3xl my-2">⬇️</div>
                        <p className="text-lg text-on-surface-secondary">para</p>
                        <h3 className="text-4xl font-extrabold text-primary mt-2">{showLevelUp.newLevel}</h3>
                        <p className="mt-6 text-sm text-gray-300">Continue focado para alcançar o próximo nível!</p>
                        <button onClick={() => setShowLevelUp(null)} className="mt-8 bg-primary text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:bg-primary-focus transition-transform hover:scale-105">
                            VAMOS NESSA!
                        </button>
                    </div>
                </Modal>
            )}

            {notification && <div className="fixed bottom-5 right-5 bg-primary text-white py-2 px-4 rounded-lg shadow-lg animate-bounce z-50">{notification}</div>}
            {showHydrationCongrats && <div className="fixed bottom-5 left-5 bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg animate-bounce z-50">Parabéns! Meta de hidratação atingida! 🎉</div>}
        </div>
    );
};

const DashboardHome: React.FC<{
    user: User;
    userData: UserData;
    onNavigate: (view: DashboardView) => void;
    waterIntake: string;
    consumedWater: number;
    onWaterChange: (amount: number) => void;
    onUpdateWeight: () => void;
    onUploadPhoto: () => void;
    currentLevel: { name: string, minPoints: number };
    nextLevel: { name: string, minPoints: number } | null;
}> = ({ user, userData, onNavigate, waterIntake, consumedWater, onWaterChange, onUpdateWeight, onUploadPhoto, currentLevel, nextLevel }) => {
    const goalInMl = parseFloat(waterIntake) * 1000;
    const isMaxed = consumedWater >= goalInMl;

    // Calculo da barra de XP
    const currentPoints = userData.points || 0;
    const prevLevelPoints = currentLevel.minPoints;
    const nextLevelPoints = nextLevel ? nextLevel.minPoints : currentPoints; // Se max level, full bar
    
    const pointsInLevel = currentPoints - prevLevelPoints;
    const pointsToNext = nextLevel ? (nextLevelPoints - prevLevelPoints) : 1;
    const percentage = nextLevel ? Math.min((pointsInLevel / pointsToNext) * 100, 100) : 100;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                 <h2 className="text-3xl font-bold text-on-surface">Seu Painel, {user.fullName.split(' ')[0]}</h2>
            </div>

            {/* Card de Gamificação */}
            <div className="bg-gradient-to-r from-surface to-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 relative overflow-hidden">
                <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-center sm:text-left">
                        <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Nível Atual</p>
                        <h3 className="text-3xl font-extrabold text-primary">{currentLevel.name}</h3>
                    </div>
                    <div className="flex-1 w-full sm:max-w-md">
                        <div className="flex justify-between text-xs text-gray-300 mb-1 font-medium">
                            <span>{currentPoints} XP</span>
                            {nextLevel ? <span>Próximo: {nextLevel.name} ({nextLevel.minPoints} XP)</span> : <span>Nível Máximo!</span>}
                        </div>
                        <div className="w-full bg-gray-900 rounded-full h-4 border border-gray-600">
                            <div 
                                className="bg-gradient-to-r from-primary to-green-300 h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                                style={{ width: `${percentage}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
                {/* Decoração de fundo */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ActionCard title="Atualizar Peso (+30 XP)" onClick={onUpdateWeight} />
                <ActionCard title="Upload de Foto (+30 XP)" onClick={onUploadPhoto} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <NavCard title="💪 Treino do Dia" description="Ganhe 15 XP por exercício." onClick={() => onNavigate('workout')} />
                    <NavCard title="🥗 Alimentação de Hoje" description="Ganhe 10 XP por refeição." onClick={() => onNavigate('mealplan')} />
                    <NavCard title="📊 Meu Progresso" description="Acompanhe sua evolução." onClick={() => onNavigate('progress')} />
                    <NavCard title="👤 Perfil e Dados" description="Veja e edite suas informações." onClick={() => onNavigate('profile')} />
                </div>
                <div className="space-y-6">
                    <InfoCard title="Hidratação (+50 XP na meta)">
                        <p className="text-4xl font-bold">{waterIntake} L</p>
                        <p className="text-on-surface-secondary">Meta diária de água.</p>
                        <div className="mt-4 space-y-2">
                            <div className="w-full bg-gray-700 rounded-full h-4">
                                <div 
                                    className="bg-primary h-4 rounded-full transition-all duration-300" 
                                    style={{ width: `${Math.min((consumedWater / goalInMl) * 100, 100)}%` }}
                                ></div>
                            </div>
                            <p className="text-sm text-on-surface-secondary">
                                {(consumedWater / 1000).toFixed(1)}L / {waterIntake}L
                            </p>
                            <div className="flex justify-center gap-4 pt-2">
                                <button onClick={() => onWaterChange(-250)} aria-label="Remover 250ml de água" className="w-12 h-12 flex items-center justify-center bg-gray-600 hover:bg-gray-500 rounded-full font-bold text-xl transition-colors">-</button>
                                <button 
                                    onClick={() => onWaterChange(250)} 
                                    disabled={isMaxed}
                                    aria-label="Adicionar 250ml de água" 
                                    className={`w-12 h-12 flex items-center justify-center rounded-full font-bold text-xl transition-colors ${isMaxed ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-primary hover:bg-primary-focus'}`}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </InfoCard>
                </div>
            </div>
        </div>
    );
};

// --- Reusable Components ---
const Card: React.FC<{title: string, children: React.ReactNode, className?: string}> = ({title, children, className}) => (
    <div className={`bg-surface p-6 rounded-xl shadow-lg ${className}`}>
        <h3 className="text-xl font-bold mb-4 text-primary">{title}</h3>
        {children}
    </div>
);
const InfoCard: React.FC<{title: string, children: React.ReactNode, className?: string}> = ({title, children, className}) => (
    <div className={`bg-surface p-6 rounded-xl shadow-lg text-center ${className}`}>
        <h3 className="text-lg font-bold mb-2 text-on-surface-secondary">{title}</h3>
        {children}
    </div>
);
const NavCard: React.FC<{title: string, description: string, onClick: () => void}> = ({title, description, onClick}) => (
    <button onClick={onClick} className="bg-surface p-6 rounded-xl shadow-lg text-left hover:bg-gray-700 hover:ring-2 hover:ring-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary w-full h-full">
        <h3 className="text-xl font-bold text-primary">{title}</h3>
        <p className="text-on-surface-secondary mt-2">{description}</p>
    </button>
);
const ActionCard: React.FC<{title: string, onClick: () => void}> = ({ title, onClick }) => (
    <button onClick={onClick} className="w-full bg-primary/20 text-primary font-semibold py-4 rounded-lg hover:bg-primary/30 transition-colors text-lg border border-primary/30 hover:border-primary">
        {title}
    </button>
);

// --- Modal Components ---
const Modal: React.FC<{ title: string; children: React.ReactNode; onClose: () => void }> = ({ title, children, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={onClose}>
        <div className="bg-surface p-8 rounded-lg shadow-2xl w-full max-w-md relative max-h-[90vh] overflow-y-auto border border-gray-700" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-white pr-8">{title}</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl font-bold absolute top-4 right-4">&times;</button>
            </div>
            <div className="text-on-surface">
                {children}
            </div>
        </div>
    </div>
);

const ConfirmModal: React.FC<{ title: string; message: string; onConfirm: () => void; onCancel: () => void }> = ({ title, message, onConfirm, onCancel }) => (
    <Modal title={title} onClose={onCancel}>
        <p className="text-on-surface-secondary mb-6">{message}</p>
        <div className="flex justify-end gap-4">
            <button onClick={onCancel} className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors text-white">Cancelar</button>
            <button onClick={onConfirm} className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors text-white font-bold">Excluir</button>
        </div>
    </Modal>
);

const ExerciseHelpModal: React.FC<{ exercise: Exercise; onClose: () => void }> = ({ exercise, onClose }) => (
    <Modal title={`Como fazer: ${exercise.name}`} onClose={onClose}>
        <div className="space-y-4">
            <p className="text-on-surface-secondary mb-2">
                <strong>Descrição Geral:</strong> {exercise.description}
            </p>
            
            {exercise.detailedInstructions && exercise.detailedInstructions.length > 0 ? (
                 <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                    <h4 className="text-primary font-bold mb-3 uppercase text-sm tracking-wider">Passo a Passo</h4>
                    <ol className="list-decimal list-inside space-y-3 text-on-surface text-left">
                        {exercise.detailedInstructions.map((step, index) => (
                            <li key={index} className="leading-relaxed pl-2">{step}</li>
                        ))}
                    </ol>
                </div>
            ) : (
                 <p className="text-lg leading-relaxed bg-gray-700 p-4 rounded-lg border-l-4 border-primary">
                    {exercise.description}
                </p>
            )}
           
            <div className="mt-6 flex justify-end">
                <button onClick={onClose} className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-focus font-semibold">
                    Entendi
                </button>
            </div>
        </div>
    </Modal>
);

const WeightModal: React.FC<{ currentWeight: number; newWeight: number | ''; setNewWeight: (val: number | '') => void; onClose: () => void; onSubmit: (e: React.FormEvent) => void; }> = ({ currentWeight, newWeight, setNewWeight, onClose, onSubmit }) => (
    <Modal title="Atualizar Peso" onClose={onClose}>
        <form onSubmit={onSubmit}>
            <input type="number" step="0.1" value={newWeight} onChange={(e) => setNewWeight(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-4 py-3 bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder={`Peso atual: ${currentWeight} kg`} required/>
            <div className="flex justify-end gap-4 mt-6">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 rounded-lg">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-primary rounded-lg">Salvar (+30 XP)</button>
            </div>
        </form>
    </Modal>
);
const PhotoModal: React.FC<{ newPhoto: string | null; onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void; onClose: () => void; onSubmit: (e: React.FormEvent) => void; }> = ({ newPhoto, onFileChange, onClose, onSubmit }) => (
    <Modal title="Upload de Foto" onClose={onClose}>
        <form onSubmit={onSubmit}>
            <input type="file" accept="image/*" onChange={onFileChange} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-focus" required />
            {newPhoto && <img src={newPhoto} alt="Preview" className="mt-4 rounded-lg max-h-60 mx-auto"/>}
            <div className="flex justify-end gap-4 mt-6">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 rounded-lg">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-primary rounded-lg">Salvar (+30 XP)</button>
            </div>
        </form>
    </Modal>
);

// --- View Components ---
const WorkoutView: React.FC<{
    user: User;
    userData: UserData;
    refreshUserData: () => void;
    onPointsEarned: (amount: number, reason: string) => UserData;
}> = ({ user, userData, refreshUserData, onPointsEarned }) => {
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const daysPT = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const today = new Date();
    const dayKey = days[today.getDay()] as keyof NonNullable<UserData['workoutPlan']>;
    const dayNamePT = daysPT[today.getDay()];
    const todayExercises = userData.workoutPlan?.[dayKey] || [];
    const todayStr = today.toISOString().split('T')[0];

    const completedToday = (userData.dailyProgress?.date === todayStr)
        ? userData.dailyProgress.completedExercises || []
        : [];
        
    const handleToggleExercise = (exerciseName: string) => {
        const isCompleted = completedToday.includes(exerciseName);
        
        // Se não estava completo e agora vai ser, ganha pontos
        let currentData = userData;
        if (!isCompleted) {
            currentData = onPointsEarned(15, `Exercício: ${exerciseName}`);
        }

        // Recalcula com os dados possivelmente atualizados pelo ganho de pontos
        const newCompletedToday = (currentData.dailyProgress?.date === todayStr)
            ? currentData.dailyProgress.completedExercises || []
            : [];

        const newCompleted = isCompleted
            ? newCompletedToday.filter(name => name !== exerciseName)
            : [...newCompletedToday, exerciseName];

        const updatedUserData: UserData = {
            ...currentData,
            dailyProgress: {
                date: todayStr,
                waterConsumed: currentData.dailyProgress?.waterConsumed || 0,
                completedExercises: newCompleted,
                completedMeals: currentData.dailyProgress?.completedMeals || []
            }
        };
        saveUserData(user.email, updatedUserData);
        refreshUserData();
    };

    const progressPercentage = todayExercises.length > 0 ? (completedToday.length / todayExercises.length) * 100 : 0;
    
    return (
        <>
            <Card title={`Treino de Hoje: ${dayNamePT}`}>
                {todayExercises.length > 0 ? (
                    <>
                        <div className="mb-6">
                            <div className="flex justify-between mb-1">
                                <span className="text-base font-medium text-primary">Progresso do Dia</span>
                                <span className="text-sm font-medium text-primary">{Math.round(progressPercentage)}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2.5">
                                <div className="bg-primary h-2.5 rounded-full transition-all duration-500" style={{width: `${progressPercentage}%`}}></div>
                            </div>
                        </div>
                        <ul className="space-y-3">
                            {todayExercises.map((ex, index) => {
                                const isCompleted = completedToday.includes(ex.name);
                                return (
                                    <li key={ex.name} className={`p-4 rounded-lg transition-colors duration-300 ${isCompleted ? 'bg-primary/20' : 'bg-gray-700/50'}`}>
                                        <div className="flex items-start gap-4">
                                            <input
                                                type="checkbox"
                                                id={`ex-${index}`}
                                                checked={isCompleted}
                                                onChange={() => handleToggleExercise(ex.name)}
                                                className="mt-1 h-5 w-5 rounded bg-gray-600 border-gray-500 text-primary focus:ring-primary focus:ring-2 cursor-pointer"
                                                aria-labelledby={`exercise-label-${index}`}
                                            />
                                            <label htmlFor={`ex-${index}`} id={`exercise-label-${index}`} className="flex-1 cursor-pointer">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`font-bold text-on-surface ${isCompleted ? 'line-through text-on-surface-secondary' : ''}`}>
                                                            {ex.name}: {ex.sets}x{ex.reps}
                                                        </span>
                                                        <button 
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                setSelectedExercise(ex);
                                                            }}
                                                            className="text-primary hover:text-white hover:bg-primary/50 rounded-full p-1 transition-colors"
                                                            title="Ver como fazer"
                                                            aria-label={`Ver instruções para ${ex.name}`}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                                              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-on-surface-secondary mt-1">{ex.description}</p>
                                            </label>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </>
                ) : (
                    <p className="text-on-surface-secondary text-center py-8">Hoje é seu dia de descanso! Aproveite para se recuperar e se hidratar bem. 💪</p>
                )}
            </Card>
            {selectedExercise && <ExerciseHelpModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />}
        </>
    );
};

const MealView: React.FC<{
    user: User;
    userData: UserData;
    refreshUserData: () => void;
    onPointsEarned: (amount: number, reason: string) => UserData;
}> = ({ user, userData, refreshUserData, onPointsEarned }) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const daysPT = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const today = new Date();
    const dayKey = days[today.getDay()] as keyof NonNullable<UserData['mealPlan']>;
    const dayNamePT = daysPT[today.getDay()];
    const todayMeals = userData.mealPlan?.[dayKey] || [];
    const todayStr = today.toISOString().split('T')[0];

    const completedMeals = (userData.dailyProgress?.date === todayStr)
        ? userData.dailyProgress.completedMeals || []
        : [];

    const handleToggleMeal = (mealName: string) => {
        const isCompleted = completedMeals.includes(mealName);

         // Se não estava completo e agora vai ser, ganha pontos
        let currentData = userData;
        if (!isCompleted) {
            currentData = onPointsEarned(10, `Refeição: ${mealName}`);
        }

        // Recalcula com os dados possivelmente atualizados
        const newCompletedMealsToday = (currentData.dailyProgress?.date === todayStr)
            ? currentData.dailyProgress.completedMeals || []
            : [];

        const newCompleted = isCompleted
            ? newCompletedMealsToday.filter(name => name !== mealName)
            : [...newCompletedMealsToday, mealName];

        const updatedUserData: UserData = {
            ...currentData,
            dailyProgress: {
                date: todayStr,
                waterConsumed: currentData.dailyProgress?.waterConsumed || 0,
                completedExercises: currentData.dailyProgress?.completedExercises || [],
                completedMeals: newCompleted
            }
        };
        saveUserData(user.email, updatedUserData);
        refreshUserData();
    };

    const progressPercentage = todayMeals.length > 0 ? (completedMeals.length / todayMeals.length) * 100 : 0;

    return (
        <Card title={`Alimentação de Hoje: ${dayNamePT}`}>
            {todayMeals.length > 0 ? (
                <>
                     <div className="mb-6">
                        <div className="flex justify-between mb-1">
                            <span className="text-base font-medium text-primary">Refeições Realizadas</span>
                            <span className="text-sm font-medium text-primary">{Math.round(progressPercentage)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div className="bg-primary h-2.5 rounded-full transition-all duration-500" style={{width: `${progressPercentage}%`}}></div>
                        </div>
                    </div>
                    <ul className="space-y-3">
                        {todayMeals.map((meal, index) => {
                             const isCompleted = completedMeals.includes(meal.name);
                             return (
                                <li key={index} className={`p-4 rounded-lg transition-colors duration-300 ${isCompleted ? 'bg-primary/20' : 'bg-gray-700/50'}`}>
                                    <div className="flex items-start gap-4">
                                        <input
                                            type="checkbox"
                                            id={`meal-${index}`}
                                            checked={isCompleted}
                                            onChange={() => handleToggleMeal(meal.name)}
                                             className="mt-1 h-5 w-5 rounded bg-gray-600 border-gray-500 text-primary focus:ring-primary focus:ring-2 cursor-pointer"
                                        />
                                        <label htmlFor={`meal-${index}`} className="flex-1 cursor-pointer">
                                            <div className="flex justify-between items-center">
                                                <span className={`font-bold text-on-surface ${isCompleted ? 'line-through text-on-surface-secondary' : ''}`}>
                                                    {meal.name}
                                                </span>
                                                <span className="text-xs font-semibold bg-gray-600 px-2 py-1 rounded text-white">
                                                    {meal.calories} kcal
                                                </span>
                                            </div>
                                            <p className="text-sm text-on-surface-secondary mt-1">{meal.description}</p>
                                        </label>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </>
            ) : (
                <p className="text-on-surface-secondary text-center py-8">Não há plano alimentar registrado para hoje.</p>
            )}
        </Card>
    );
};

const ProgressView: React.FC<{
    weightHistory: WeightEntry[], 
    photoHistory: PhotoEntry[],
    onDeletePhoto: (index: number) => void
}> = ({ weightHistory, photoHistory, onDeletePhoto }) => (
    <div className="space-y-8">
        <Card title="Histórico de Peso">
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weightHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                    <XAxis dataKey="date" tickFormatter={(str) => new Date(str).toLocaleDateString()} stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" domain={['dataMin - 2', 'dataMax + 2']} />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}/>
                    <Legend />
                    <Line type="monotone" dataKey="weight" name="Peso (kg)" stroke="#10b981" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </Card>
        <Card title="Histórico de Fotos">
            {photoHistory.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {photoHistory.map((photo, i) => (
                        <div key={`${photo.date}-${i}`} className="relative group rounded-lg overflow-hidden shadow-md bg-gray-800">
                            <img src={photo.photoUrl} alt={`Progresso em ${new Date(photo.date).toLocaleDateString()}`} className="object-cover w-full h-64 rounded-lg" />
                            
                            {/* Camada escura para melhorar a visibilidade do texto e ícones */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 opacity-80 pointer-events-none"></div>

                            {/* Data da foto */}
                            <div className="absolute bottom-2 left-2 text-white text-xs font-medium bg-black/50 px-2 py-1 rounded z-10">
                                {new Date(photo.date).toLocaleDateString()}
                            </div>

                            {/* Botão de exclusão - Aumentado e com Z-index garantido */}
                            <button 
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onDeletePhoto(i);
                                }}
                                className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 flex items-center justify-center rounded-full shadow-lg hover:bg-red-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 z-20 cursor-pointer"
                                title="Excluir foto permanentemente"
                                aria-label="Excluir foto"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            ) : <p className="text-on-surface-secondary">Nenhuma foto de progresso ainda. Faça seu primeiro upload!</p>}
        </Card>
    </div>
);

const ProfileView: React.FC<{
    user: User, 
    quizData: UserData['quizData'],
    onEditProfile: () => void,
    onDeleteAccount: () => void
}> = ({ user, quizData, onEditProfile, onDeleteAccount }) => (
    <Card title="Meus Dados">
        <div className="space-y-4 text-on-surface-secondary">
            <p><span className="font-semibold text-on-surface">Nome: </span>{user.fullName}</p>
            <p><span className="font-semibold text-on-surface">Email: </span>{user.email}</p>
            <p><span className="font-semibold text-on-surface">Idade: </span>{quizData.age} anos</p>
            <p><span className="font-semibold text-on-surface">Altura: </span>{quizData.height} cm</p>
            <p><span className="font-semibold text-on-surface">Peso Inicial: </span>{quizData.currentWeight} kg</p>
            <p><span className="font-semibold text-on-surface">Objetivo: </span>{quizData.goal}</p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button onClick={onEditProfile} className="w-full px-6 py-2 font-bold text-white bg-primary rounded-lg hover:bg-primary-focus transition-colors">Editar Dados</button>
                <button onClick={onDeleteAccount} className="w-full px-6 py-2 font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">Excluir Conta</button>
            </div>
        </div>
    </Card>
);

export default Dashboard;
