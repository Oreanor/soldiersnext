import { useState, useEffect } from 'react';
import Spinner from './ui/Spinner';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

interface PasswordFormProps {
  onAuthenticated: () => void;
}

export default function PasswordForm({ onAuthenticated }: PasswordFormProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(true);
  const { t } = useTranslation();

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <div className="flex justify-between items-center">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            {t('admin.login')}
          </h2>
          <LanguageSelector />
        </div>
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