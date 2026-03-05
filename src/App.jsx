import { useState, useEffect } from 'react'
import Board from './components/Board'

function App() {
  // Estado inicial del tablero
  const [board, setBoard] = useState(Array(9).fill(null).map(() => Array(9).fill(null)))
  const [isXNext, setIsXNext] = useState(true)
  const [activeSubBoard, setActiveSubBoard] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [subBoardWinners, setSubBoardWinners] = useState(Array(9).fill(null))
  const [globalWinner, setGlobalWinner] = useState(null)

  // Aplicar o quitar la clase 'dark' del elemento html
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const toggleTheme = () => setIsDarkMode(!isDarkMode)

  // Función para comprobar si hay un ganador en un tablero de 9 celdas
  const checkWinner = (cells) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontales
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Verticales
      [0, 4, 8], [2, 4, 6],             // Diagonales
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
        return cells[a];
      }
    }
    return null;
  };

  const handleCellClick = (boardIndex, cellIndex) => {
    // 0. Validar si ya terminó el juego
    if (globalWinner) return;

    // 1. Validar si es el sub-tablero correcto
    if (activeSubBoard !== null && activeSubBoard !== boardIndex) return;

    // 2. Validar si el sub-tablero ya tiene ganador
    if (subBoardWinners[boardIndex]) return;

    // 3. Validar si la celda ya está ocupada
    if (board[boardIndex][cellIndex]) return;

    // Realizar la jugada
    const newBoard = board.map((subBoard, bIdx) => {
      if (bIdx === boardIndex) {
        const newSubBoard = [...subBoard];
        newSubBoard[cellIndex] = isXNext ? 'X' : 'O';
        return newSubBoard;
      }
      return subBoard;
    });

    // Comprobar si esta jugada gana el sub-tablero
    const newSubBoardWinners = [...subBoardWinners];
    const winner = checkWinner(newBoard[boardIndex]);
    if (winner) {
      newSubBoardWinners[boardIndex] = winner;

      // Comprobar si esta victoria de sub-tablero gana el juego global
      const finalWinner = checkWinner(newSubBoardWinners);
      if (finalWinner) {
        setGlobalWinner(finalWinner);
      }
    }

    // Determinar el próximo sub-tablero activo
    let nextActiveSubBoard = cellIndex;

    // Si el tablero marcado ya estaba terminado (ganado o lleno), el jugador tiene libertad
    if (newSubBoardWinners[nextActiveSubBoard]) {
      nextActiveSubBoard = null;
    }

    setBoard(newBoard);
    setSubBoardWinners(newSubBoardWinners);
    setIsXNext(!isXNext);
    setActiveSubBoard(nextActiveSubBoard);
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

      <header className="mb-8 text-center flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter">
          SUPER TA-TE-TI
        </h1>

        {globalWinner ? (
          <div className="bg-white/10 p-6 rounded-2xl border-4 border-board-border animate-bounce shadow-xl">
            <h2 className={`text-4xl font-black ${globalWinner === 'X' ? 'text-blue-500' : 'text-red-500'}`}>
              ¡GANADOR JUGADOR {globalWinner}!
            </h2>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors uppercase text-sm font-bold"
            >
              Reiniciar Juego
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-8 text-2xl font-bold">
            <div className={`px-4 py-2 rounded-lg transition-all ${isXNext ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] scale-110' : 'text-slate-500 opacity-50'}`}>
              JUGADOR X
            </div>
            <div className={`px-4 py-2 rounded-lg transition-all ${!isXNext ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] scale-110' : 'text-slate-500 opacity-50'}`}>
              JUGADOR O
            </div>
          </div>
        )}
      </header>

      <main className="w-full max-w-2xl">
        <Board
          cells={board}
          onCellClick={handleCellClick}
          activeSubBoard={activeSubBoard}
          subBoardWinners={subBoardWinners}
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
