
import { Goal, ActivityLevel } from './types';

export const QUIZ_MOTIVATIONAL_MESSAGES = [
    "Smart Good: você está prestes a mudar sua vida.",
    "Seu futuro ‘eu’ vai agradecer por essa decisão.",
    "É o momento de escrever uma nova história.",
    "Você merece saúde, força e autoconfiança."
];

export const COMMON_QUESTIONS = [
    { id: 'fullName', label: 'Nome completo', type: 'text', placeholder: 'Seu nome completo' },
    { id: 'age', label: 'Idade', type: 'number', placeholder: 'Sua idade' },
    { id: 'height', label: 'Altura (cm)', type: 'number', placeholder: 'Sua altura em centímetros' },
    { id: 'currentWeight', label: 'Peso atual (kg)', type: 'number', placeholder: 'Seu peso atual em kg' },
    { id: 'goal', label: 'Qual seu principal objetivo?', type: 'radio', options: [Goal.LOSE_WEIGHT, Goal.GAIN_MUSCLE] },
    { id: 'measurements', label: 'Mede regularmente glicemia/pressão?', type: 'text', placeholder: 'Sim, ambos / Sim, apenas pressão / Não' },
    { id: 'intolerances', label: 'Tem alguma intolerância alimentar?', type: 'text', placeholder: 'Glúten, lactose, frutos do mar, etc. ou "Nenhuma"' }
];

export const WEIGHT_LOSS_QUESTIONS = [
    { id: 'weightLossMedication', label: 'Já usou ou usa algum medicamento para emagrecer? Quais?', type: 'text', placeholder: 'Ex: Ozempic, Sibutramina, ou "Nenhum"' },
    { id: 'medicationFrequency', label: 'Com que frequência toma (se aplica)?', type: 'select', options: ['Diariamente', 'Semanalmente', 'Mensalmente', 'Não tomo remédios'] },
    { id: 'medicalRestrictions', label: 'Possui alguma restrição médica?', type: 'text', placeholder: 'Ex: Problemas no joelho, hérnia de disco, ou "Nenhuma"' },
    { id: 'activityLevel', label: 'Nível de atividade física atual', type: 'select', options: Object.values(ActivityLevel) },
    { id: 'sleepQuality', label: 'Como está seu sono?', type: 'text', placeholder: 'Ex: Durmo bem, tenho insônia, acordo cansado' },
    { 
        id: 'yoYoEffect', 
        label: 'Tem histórico de efeito sanfona?', 
        type: 'radio', 
        options: ['Sim', 'Não'],
        explanation: 'Efeito sanfona é o ciclo de perda e reganho de peso repetidas vezes, comum após dietas muito restritivas.'
    },
    { id: 'eatingOutFrequency', label: 'Costuma comer fora? Quantas vezes por semana?', type: 'text', placeholder: 'Ex: 2 vezes por semana' },
    { id: 'weightLossChallenge', label: 'Qual seu maior desafio para emagrecer?', type: 'textarea', placeholder: 'Descreva seu maior desafio' },
    { id: 'dailyReminders', label: 'Deseja receber lembretes diários?', type: 'radio', options: ['Sim', 'Não'] }
];

export const MUSCLE_GAIN_QUESTIONS = [
    { id: 'supplements', label: 'Já usou ou usa suplemento? Quais?', type: 'text', placeholder: 'Ex: Whey Protein, Creatina, ou "Nenhum"' },
    { id: 'controlledMedication', label: 'Algum medicamento controlado?', type: 'text', placeholder: 'Ex: Rivotril, ou "Nenhum"' },
    { id: 'trainingFrequency', label: 'Frequência atual de treino', type: 'text', placeholder: 'Ex: 3 vezes por semana' },
    { id: 'mealsPerDay', label: 'Quantas refeições por dia costuma fazer?', type: 'number', placeholder: 'Ex: 5' },
    { id: 'difficultyGainingWeight', label: 'Tem dificuldade em ganhar peso?', type: 'radio', options: ['Sim', 'Não'] },
    { id: 'injuries', label: 'Alguma lesão que atrapalhe treinar?', type: 'text', placeholder: 'Ex: Lesão no ombro, ou "Nenhuma"' },
    { id: 'muscleGainChallenge', label: 'Qual seu maior desafio para ganhar músculo?', type: 'textarea', placeholder: 'Descreva seu maior desafio' },
    { id: 'dailyReminders', label: 'Deseja receber lembretes diários?', type: 'radio', options: ['Sim', 'Não'] }
];

export const MOTIVATIONAL_NOTIFICATIONS = [
    "Você está mais perto do seu objetivo do que imagina.",
    "Mantenha o foco, o resultado vem!",
    "Cada passo, por menor que seja, é um progresso.",
    "A consistência é a chave para o sucesso.",
    "Beba água! Seu corpo agradece.",
    "Lembre-se do seu porquê. Isso te dará forças.",
    "Você é mais forte do que pensa.",
    "Um dia de cada vez. Você consegue!"
];

// Sistema de Gamificação
export const USER_LEVELS = [
    { name: 'Iniciante', minPoints: 0 },
    { name: 'Determinado', minPoints: 100 },
    { name: 'Focado', minPoints: 300 },
    { name: 'Atleta', minPoints: 600 },
    { name: 'Mestre', minPoints: 1000 },
    { name: 'Lenda', minPoints: 2000 },
    { name: 'Imparável', minPoints: 5000 }
];
