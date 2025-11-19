
import React, { useState, useEffect, useMemo } from 'react';
import { Goal } from '../types';
import type { User, QuizData } from '../types';
import { COMMON_QUESTIONS, WEIGHT_LOSS_QUESTIONS, MUSCLE_GAIN_QUESTIONS, QUIZ_MOTIVATIONAL_MESSAGES } from '../constants';
import { generatePlans } from '../services/geminiService';
import { saveUserData } from '../services/dataService';

interface QuizProps {
    user: User;
    onComplete: () => void;
}

const Spinner: React.FC = () => (
    <div className="w-8 h-8 border-4 border-white border-t-transparent border-solid rounded-full animate-spin"></div>
);

const Quiz: React.FC<QuizProps> = ({ user, onComplete }) => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Partial<QuizData>>({ fullName: user.fullName });
    const [motivationalMessage, setMotivationalMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setMotivationalMessage(QUIZ_MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * QUIZ_MOTIVATIONAL_MESSAGES.length)]);
    }, [step]);

    const questions = useMemo(() => {
        const goal = answers.goal;
        if (!goal) {
            return COMMON_QUESTIONS;
        }
        if (goal === Goal.LOSE_WEIGHT) {
            return [...COMMON_QUESTIONS, ...WEIGHT_LOSS_QUESTIONS];
        }
        return [...COMMON_QUESTIONS, ...MUSCLE_GAIN_QUESTIONS];
    }, [answers.goal]);

    const currentQuestion = questions[step];
    const totalSteps = questions.length;
    const progress = ((step + 1) / totalSteps) * 100;

    const handleAnswer = (key: string, value: any) => {
        let processedValue = value;
        
        // Validação baseada no tipo da pergunta atual
        if (currentQuestion.type === 'number') {
            // Garante limpeza extra mesmo com type="number" (caso cole texto)
            let cleanVal = processedValue.replace(/[^0-9.,]/g, '');
            // Substitui vírgula por ponto para padronização
            cleanVal = cleanVal.replace(',', '.');
            
            // Garante apenas um ponto decimal
            const parts = cleanVal.split('.');
            if (parts.length > 2) {
                cleanVal = parts[0] + '.' + parts.slice(1).join('');
            }
            
            processedValue = cleanVal;
        } else if (currentQuestion.type === 'text' && key === 'fullName') {
            // Para o campo de nome, impede estritamente números e caracteres especiais comuns
            processedValue = processedValue.replace(/[0-9!@#$%^&*()_+={}[\]|\\:;"<>,.?/~`]/g, '');
        }

        setAnswers(prev => ({ ...prev, [key]: processedValue }));
    };

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        
        const answerKey = currentQuestion.id as keyof QuizData;
        const answerValue = answers[answerKey];

        // Validação de campo vazio
        if (answerValue === undefined || answerValue === '') {
             setError('Por favor, responda a pergunta para continuar.');
             return;
        }

        // Validação específica para números
        if (currentQuestion.type === 'number') {
            const numValue = parseFloat(answerValue as string);
            if (isNaN(numValue)) {
                setError('Por favor, insira um número válido.');
                return;
            }
        }

        setError('');

        if (step < totalSteps - 1) {
            setStep(step + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };

    const handleSubmit = () => {
        setIsLoading(true);
        setError('');
        
        // Simula um pequeno atraso para UX
        setTimeout(() => {
            try {
                // Certifique-se de que os valores numéricos são números
                const finalAnswers = { ...answers };
                const numericKeys: (keyof QuizData)[] = ['age', 'height', 'currentWeight', 'mealsPerDay'];
                
                // Percorre todas as respostas para garantir conversão correta onde necessário
                Object.keys(finalAnswers).forEach((key) => {
                    const k = key as keyof QuizData;
                    // Se a chave está na lista de numéricos ou se a pergunta correspondente era do tipo 'number'
                    const questionDef = questions.find(q => q.id === k);
                    if (numericKeys.includes(k) || (questionDef && questionDef.type === 'number')) {
                         if (finalAnswers[k] && typeof finalAnswers[k] === 'string') {
                            finalAnswers[k] = parseFloat(finalAnswers[k] as string) as any;
                        }
                    }
                });

                const finalQuizData = finalAnswers as QuizData;
                const { workoutPlan, mealPlan } = generatePlans(finalQuizData);
                
                sessionStorage.setItem('showWelcomeNotification', 'true');

                saveUserData(user.email, {
                    quizData: finalQuizData,
                    workoutPlan,
                    mealPlan,
                    weightHistory: [{ date: new Date().toISOString(), weight: finalQuizData.currentWeight }],
                    photoHistory: [],
                    points: 0 // Inicializa a pontuação
                });
                onComplete();
            } catch (err) {
                console.error('Error saving data:', err);
                setError('Ocorreu um erro ao salvar seus dados. Por favor, tente novamente.');
                setIsLoading(false);
            }
        }, 1500); // 1.5 segundos de delay
    };

    const renderInput = () => {
        const key = currentQuestion.id as keyof QuizData;
        const value = answers[key] as any || '';
        
        switch (currentQuestion.type) {
            case 'text':
                return <input type="text" value={value} onChange={(e) => handleAnswer(key, e.target.value)} placeholder={currentQuestion.placeholder} className="w-full px-4 py-3 bg-surface border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" required />;
            case 'number':
                // Usando type="number" para forçar teclado numérico e validação nativa do browser
                return <input type="number" value={value} onChange={(e) => handleAnswer(key, e.target.value)} placeholder={currentQuestion.placeholder} className="w-full px-4 py-3 bg-surface border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" required />;
            case 'textarea':
                return <textarea value={value} onChange={(e) => handleAnswer(key, e.target.value)} placeholder={currentQuestion.placeholder} rows={4} className="w-full px-4 py-3 bg-surface border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" required />;
            case 'radio':
                return (
                    <div className="flex flex-col gap-4">
                        {currentQuestion.options?.map(option => {
                            const isGoalQuestion = key === 'goal';
                            const spanClasses = `text-lg font-bold ${isGoalQuestion ? 'uppercase tracking-wider' : ''}`;
                            return (
                                <label key={option} className={`p-5 text-center border-2 rounded-lg cursor-pointer transition-all duration-200 ${value === option ? 'border-primary bg-primary/20 text-primary ring-2 ring-primary' : 'border-gray-600 hover:border-primary/50'}`}>
                                    <input type="radio" name={key} value={option} checked={value === option} onChange={(e) => handleAnswer(key, e.target.value)} className="hidden" />
                                    <span className={spanClasses}>{option}</span>
                                </label>
                            );
                        })}
                    </div>
                );
            case 'select':
                 return (
                    <select value={value} onChange={(e) => handleAnswer(key, e.target.value)} className="w-full px-4 py-3 bg-surface border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary appearance-none" required>
                         <option value="" disabled>Selecione uma opção</option>
                         {currentQuestion.options?.map(option => (
                            <option key={option} value={option}>{option}</option>
                         ))}
                    </select>
                 );
            default:
                return null;
        }
    };


    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                <Spinner />
                <h2 className="mt-4 text-2xl font-bold text-primary">Estamos preparando tudo para você...</h2>
                <p className="mt-2 text-on-surface-secondary">Seu novo plano de vida está quase pronto.</p>
                {error && <p className="mt-4 text-red-400">{error}</p>}
            </div>
        );
    }
    
    const hasExplanation = (currentQuestion as any).explanation;

    return (
        <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-br from-background to-gray-900">
            <div className="w-full max-w-2xl bg-surface/80 backdrop-blur-sm rounded-xl shadow-2xl p-8 space-y-6">
                <div className="text-center">
                    <p className="text-primary font-semibold">{motivationalMessage}</p>
                    <h2 className="text-2xl font-bold mt-2">{currentQuestion.label}</h2>
                    {hasExplanation && (
                        <div className="mt-3 bg-surface/50 border border-primary/30 p-3 rounded-lg text-sm text-on-surface-secondary flex items-start gap-2 text-left">
                            <span className="text-xl">💡</span>
                            <span>{hasExplanation}</span>
                        </div>
                    )}
                </div>
                
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}></div>
                </div>

                <form onSubmit={handleNext}>
                    <div className="my-6 min-h-[100px]">
                        {renderInput()}
                    </div>
                    {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
                    <div className="flex justify-between">
                        <button type="button" onClick={handleBack} disabled={step === 0} className="px-6 py-2 font-bold text-on-surface-secondary bg-gray-600 rounded-lg hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Voltar</button>
                        <button type="submit" className="px-6 py-2 font-bold text-white bg-primary rounded-lg hover:bg-primary-focus transition-colors">
                            {step === totalSteps - 1 ? 'Finalizar e Ver Planos' : 'Próximo'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Quiz;
