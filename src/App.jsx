import { useState, useEffect } from 'react'
import Home from './pages/Home'
import SuperTaTeTi from './pages/games/SuperTaTeTi'
import ClassicTaTeTi from './pages/games/ClassicTaTeTi'
import DotsAndBoxes from './pages/games/DotsAndBoxes'
import ExtendedTaTeTi from './pages/games/ExtendedTaTeTi'

function App() {
  const [view, setView] = useState('home'); // 'home' | 'super-tateti'
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Aplicar modo oscuro
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleSelectGame = (gameId) => {
    setView(gameId);
  };

  const handleReturnHome = () => {
    setView('home');
  };

  return (
    <div className="min-h-screen bg-page-bg text-page-text flex flex-col items-center p-4 transition-colors duration-500 overflow-x-hidden">
      {/* Botón de Tema Global */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:scale-110 active:scale-95 transition-all backdrop-blur-md shadow-xl font-black text-[10px] tracking-widest uppercase"
        title="Cambiar tema de batalla"
      >
        {isDarkMode ? '🌞 Light' : '🌙 Dark'}
      </button>

      {/* Orquestador de Vistas */}
      <main className="w-full max-w-7xl flex flex-col items-center">
        {view === 'home' ? (
          <Home onSelectGame={handleSelectGame} />
        ) : (
          <div className="w-full flex justify-center py-10">
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
            {/* Otros juegos se añadirán aquí con condicionales similates */}
          </div>
        )}
      </main>

      {/* Footer minimalista global (opcional) */}
      {view !== 'home' && (
        <footer className="mt-auto py-8 text-slate-500 text-[10px] font-black uppercase tracking-[0.5em] opacity-20 pointer-events-none">
          Super Ta-Te-Ti v4.0 • Build with Passion
        </footer>
      )}
    </div>
  )
}

export default App
