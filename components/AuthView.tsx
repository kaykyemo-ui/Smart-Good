import React, { useState } from 'react';
import { login, signup, resetPassword } from '../services/authService';
import type { User } from '../types';

interface AuthViewProps {
  onLogin: (user: User) => void;
}

type AuthMode = 'login' | 'signup' | 'forgot';

export const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (mode === 'login') {
      try {
        const user = login(email, password);
        onLogin(user);
      } catch (err: any) {
        setError(err.message);
      }
    } else if (mode === 'signup') {
      if (password !== confirmPassword) {
        setError('As senhas não combinam.');
        return;
      }
      if (password.length < 6) {
        setError('A senha deve ter no mínimo 6 caracteres.');
        return;
      }
      try {
        const user = signup(fullName, email, password);
        setMessage('Conta criada com sucesso! Faça o login.');
        setMode('login');
      } catch (err: any) {
        setError(err.message);
      }
    } else if (mode === 'forgot') {
        if (password !== confirmPassword) {
            setError('As senhas não combinam.');
            return;
        }
        if (password.length < 6) {
            setError('A nova senha deve ter no mínimo 6 caracteres.');
            return;
        }
        try {
            resetPassword(email, password);
            setMessage('Senha redefinida com sucesso! Faça o login com sua nova senha.');
            setMode('login');
        } catch (err: any) {
            setError(err.message);
        }
    }
  };

  const renderFormFields = () => {
    switch (mode) {
      case 'signup':
        return (
          <>
            <input type="text" placeholder="Nome Completo" value={fullName} onChange={e => setFullName(e.target.value)} required className="w-full px-4 py-3 bg-surface rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 bg-surface rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            <input type="password" placeholder="Senha (mínimo 6 caracteres)" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-3 bg-surface rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            <input type="password" placeholder="Confirmar Senha" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full px-4 py-3 bg-surface rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </>
        );
      case 'forgot':
        return (
          <>
            <input type="email" placeholder="E-mail Cadastrado" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 bg-surface rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            <input type="password" placeholder="Nova Senha (mínimo 6 caracteres)" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-3 bg-surface rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            <input type="password" placeholder="Confirmar Nova Senha" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full px-4 py-3 bg-surface rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </>
        );
      case 'login':
      default:
        return (
          <>
            <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 bg-surface rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-3 bg-surface rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </>
        );
    }
  };
  
  const getTitle = () => {
    if (mode === 'login') return 'Bem-vindo ao Smart Good';
    if (mode === 'signup') return 'Crie sua conta';
    return 'Recupere sua senha';
  };

  const getButtonText = () => {
    if (mode === 'login') return 'Entrar';
    if (mode === 'signup') return 'Criar Conta';
    return 'Redefinir Senha';
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-background to-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 rounded-xl shadow-2xl bg-surface/50 backdrop-blur-sm">
        <h1 className="text-3xl font-bold text-center text-primary">{getTitle()}</h1>
        <p className="text-center text-on-surface-secondary">Sua jornada para uma vida mais saudável começa aqui.</p>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {renderFormFields()}
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          {message && <p className="text-green-400 text-sm text-center">{message}</p>}
          <button type="submit" className="w-full px-4 py-3 font-bold text-white uppercase bg-primary rounded-lg hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-colors duration-300">
            {getButtonText()}
          </button>
        </form>
        <div className="text-sm text-center text-on-surface-secondary">
          {mode === 'login' && (
            <div className='flex justify-between'>
              <button onClick={() => setMode('forgot')} className="hover:text-primary">Esqueci minha senha</button>
              <button onClick={() => setMode('signup')} className="hover:text-primary">Criar conta</button>
            </div>
          )}
          {(mode === 'signup' || mode === 'forgot') && (
            <button onClick={() => setMode('login')} className="hover:text-primary">Voltar para o Login</button>
          )}
        </div>
      </div>
    </div>
  );
};