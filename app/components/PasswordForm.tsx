import { useState, useEffect } from 'react';
import Spinner from './ui/Spinner';

interface PasswordFormProps {
  onAuthenticated: () => void;
}

export default function PasswordForm({ onAuthenticated }: PasswordFormProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if already authenticated in this session
    const isAuthenticated = sessionStorage.getItem('adminAuthenticated');
    if (isAuthenticated === 'true') {
      onAuthenticated();
    }
    setIsChecking(false);
  }, [onAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/admin/check-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      sessionStorage.setItem('adminAuthenticated', 'true');
      onAuthenticated();
    } else {
      setError('Неверный пароль');
    }
  };

  if (isChecking) {
    return <Spinner />;
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-4 rounded shadow-md w-64">
        <h1 className="text-lg font-bold mb-2">Введите пароль для доступа к админке</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
            required
            className="border p-2 mb-2 w-full"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full cursor-pointer">Войти</button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
} 