
import './globals.css';
import { UserProvider } from '@/contexts/UserContext';
import { ACHProvider } from '@/contexts/AchievementContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { ToastContainer } from '@/components/ui/Toast';
import localFont from 'next/font/local';

let phase:string;
const setPhase = () => {
  const now = new Date();
  const hour = now.getHours();
  phase = (hour >= 18 || hour < 6 ? 'eve' : 'day');
};
setPhase();
const Pixelify = localFont({ src: "./pixelify.ttf", display: "swap" });
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
})  {
  // Фаза day/eve для фоновых стилей определена в Home, прокинь через props, или вычисли здесь

  return (
    <html lang="ru">
      <body className={`max-h-screen flex flex-col font-sans ${Pixelify.className} transition-colors duration-1000`}
        style={{ backgroundColor: phase === 'day' ? '#f0f0f0' : '#1a1a1a' }}>
        <UserProvider>
          <ToastProvider>
            <ACHProvider>
                {children}
              <ToastContainer />
            </ACHProvider>
          </ToastProvider>
        </UserProvider>
        <div className={`absolute bg-cover bg-no-repeat bg-center ${phase === 'day' ? 'bg-day' : 'bg-eve'} w-full h-full z-[-1] blur-sm `}></div>
      </body>
    </html>
  );
};