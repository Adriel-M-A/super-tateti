import { useState, useEffect } from 'react'
import Home from './pages/Home'
import Connect4 from './pages/games/Connect4';
import ClassicTaTeTi from './pages/games/ClassicTaTeTi';
import SuperTaTeTi from './pages/games/SuperTaTeTi';
import DotsAndBoxes from './pages/games/DotsAndBoxes';
import ExtendedTaTeTi from './pages/games/ExtendedTaTeTi';
import Gobblet from './pages/games/Gobblet';
import MobileTaTeTi from './pages/games/MobileTaTeTi';
import ThemeToggle from './components/layout/ThemeToggle'
import { TournamentProvider } from './contexts/TournamentContext';

function App() {
  const [view, setView] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Lee la preferencia guardada; si no existe, usa modo oscuro por defecto
    const saved = localStorage.getItem('darkMode');
    return saved === null ? true : saved === 'true';
  });

  // Aplicar modo oscuro
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      localStorage.setItem('darkMode', String(!prev));
      return !prev;
    });
  };

  const handleSelectGame = (gameId) => {
    setView(gameId);
  };

  const handleReturnHome = () => {
    setView('home');
  };

  return (
    <TournamentProvider>
      <div className="h-screen bg-page-bg text-page-text flex flex-col items-center transition-colors duration-500 overflow-hidden relative">
        <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />

        {/* Orquestador de Vistas */}
        <main className="w-full h-full max-w-7xl flex flex-col items-center overflow-hidden">
          {view === 'home' ? (
            <Home onSelectGame={handleSelectGame} />
          ) : (
            <div className="w-full h-full flex justify-center py-4 overflow-hidden">
              {view === 'super-tateti' && (
                <SuperTaTeTi onExit={handleReturnHome} />
              )}
              {view === 'classic-tateti' && (
                <ClassicTaTeTi onExit={handleReturnHome} />
              )}
              {view === 'dots-and-boxes' && (
                <DotsAndBoxes onExit={handleReturnHome} />
              )}
              {view === 'extended-tateti' && (
                <ExtendedTaTeTi onExit={handleReturnHome} />
              )}
              {view === 'connect4' && (
                <Connect4 onExit={handleReturnHome} />
              )}
              {view === 'gobblet' && (
                <Gobblet onExit={handleReturnHome} />
              )}
              {view === 'mobile-tateti' && (
                <MobileTaTeTi onExit={handleReturnHome} />
              )}
            </div>
          )}
        </main>

        {/* Indicador de versión sutil */}
        <div className="fixed bottom-4 left-6 text-[8px] font-black uppercase tracking-[0.3em] text-slate-500/20 pointer-events-none italic">
          GamesHub v1.0.0 • Production Ready
        </div>
      </div>
    </TournamentProvider>
  )
}

export default App
