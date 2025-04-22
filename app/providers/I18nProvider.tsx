'use client';

import { useEffect, useState } from 'react';
import '../i18n';
import i18next from 'i18next';

export default function I18nProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initI18n = async () => {
      if (!i18next.isInitialized) {
        await i18next.init();
      }
      setIsInitialized(true);
    };

    initI18n();
  }, []);

  if (!isInitialized) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
} 