import { useState, useEffect } from 'react'
import Board from './components/Board'

function App() {
  // Estado inicial del tablero
  const [board, setBoard] = useState(Array(9).fill(null).map(() => Array(9).fill(null)))
  const [isXNext, setIsXNext] = useState(true)
  const [activeSubBoard, setActiveSubBoard] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(true)

  // Aplicar o quitar la clase 'dark' del elemento html
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const toggleTheme = () => setIsDarkMode(!isDarkMode)

  const handleCellClick = (boardIndex, cellIndex) => {
    // Por ahora solo una función simple para demostrar la interactividad
    console.log(`Jugada en sub-tablero ${boardIndex}, celda ${cellIndex}`);

    // Aquí irá la lógica compleja de validación y cambio de turno
    const newBoard = board.map((subBoard, bIdx) => {
      if (bIdx === boardIndex) {
        return subBoard.map((cell, cIdx) => {
          if (cIdx === cellIndex && cell === null) {
            return isXNext ? 'X' : 'O';
          }
          return cell;
        });
      }
      return subBoard;
    });

    setBoard(newBoard);
    setIsXNext(!isXNext);
    // Siguiendo la regla: la celda marcada (cellIndex) determina el próximo sub-tablero (activeSubBoard)
    setActiveSubBoard(cellIndex);
  }

  return (
    <div className="min-h-screen bg-page-bg text-page-text flex flex-col items-center justify-center p-4 transition-colors duration-300">
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:scale-110 transition-all font-bold text-sm"
        title="Cambiar tema"
      >
        {isDarkMode ? '🌞 MODO CLARO' : '🌙 MODO OSCURO'}
      </button>

      <header className="mb-8 text-center">
        <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter">
          SUPER TA-TE-TI
        </h1>
        <div className="flex items-center justify-center gap-8 text-2xl font-bold">
          <div className={`px-4 py-2 rounded-lg transition-all ${isXNext ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] scale-110' : 'text-slate-500 opacity-50'}`}>
            JUGADOR X
          </div>
          <div className={`px-4 py-2 rounded-lg transition-all ${!isXNext ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] scale-110' : 'text-slate-500 opacity-50'}`}>
            JUGADOR O
          </div>
        </div>
      </header>

      <main className="w-full max-w-2xl">
        <Board
          cells={board}
          onCellClick={(boardIndex) => (cellIndex) => handleCellClick(boardIndex, cellIndex)}
          activeSubBoard={activeSubBoard}
        />
      </main>

      <footer className="mt-8 text-slate-500 text-sm italic">
        {activeSubBoard === null
          ? "Puedes jugar en cualquier tablero"
          : `Obligado a jugar en el tablero ${activeSubBoard + 1}`}
      </footer>
    </div>
  )
}

export default App
