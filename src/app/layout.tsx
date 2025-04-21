
import './globals.css';
import { UserProvider } from '@/contexts/UserContext';
import { ACHProvider } from '@/contexts/AchievementContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { ToastContainer } from '@/components/ui/Toast';
import localFont from 'next/font/local';

import { Background } from '@/components/abstract/background';

const Pixelify = localFont({ src: "./pixelify.ttf", display: "swap" });
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
})  {
  // Фаза day/eve для фоновых стилей определена в Home, прокинь через props, или вычисли здесь

  return (
    <html lang="ru">
      <body className={`max-h-screen flex flex-col font-sans ${Pixelify.className} transition-colors duration-1000`}>
        <Background />
        <UserProvider>
          <ToastProvider>
            <ACHProvider>
                {children}
              <ToastContainer />
            </ACHProvider>
          </ToastProvider>
        </UserProvider>
      </body>
    </html>
  );
};