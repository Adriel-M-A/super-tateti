import IconRenderer from './IconRenderer';
import { useGame } from '../../contexts/GameContext';

const ROWS = 6;

const Connect4Board = ({ grid, onColumnClick, winningCells = [] }) => {
    const { players, currentPlayerIndex } = useGame();

    return (
        <div className="relative p-2 md:p-4 rounded-4xl max-w-2xl mx-auto w-full aspect-7/6 flex gap-1 md:gap-3 box-border bg-transparent">
            {/* Generamos 7 columnas */}
            {Array.from({ length: 7 }).map((_, colIdx) => (
                <button
                    key={colIdx}
                    onClick={() => onColumnClick(colIdx)}
                    className="flex-1 flex flex-col gap-1 md:gap-3 group transition-all duration-300 relative"
                >
                    {/* Indicador de columna flotante (Slot) */}
                    <div
                        className="absolute -top-8 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-2 border-dashed border-page-text/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center scale-75 group-hover:scale-100"
                        style={{ color: players[currentPlayerIndex]?.color }}
                    >
                        <div
                            className="w-2 h-2 rounded-full animate-pulse"
                            style={{ backgroundColor: 'currentColor' }}
                        ></div>
                    </div>

                    {/* Resaltado de fondo de columna */}
                    <div className="absolute inset-x-0 inset-y-[-10px] bg-page-text/0 group-hover:bg-page-text/5 rounded-2xl transition-colors duration-300 pointer-events-none"></div>

                    {/* Generamos 6 filas (de arriba hacia abajo) */}
                    {Array.from({ length: ROWS }).map((_, rowIdx) => {
                        const cellValue = grid[rowIdx][colIdx];
                        const isWinning = winningCells.some(([r, c]) => r === rowIdx && c === colIdx);
                        const player = cellValue !== null ? players[cellValue] : null;

                        return (
                            <div
                                key={rowIdx}
                                className={`
                                    relative aspect-square rounded-full border-2 transition-all duration-500 flex items-center justify-center overflow-hidden z-10
                                    ${player
                                        ? 'scale-90 shadow-md'
                                        : 'bg-slate-200/20 dark:bg-slate-800/20 border-slate-300/30 dark:border-slate-700/30 shadow-inner'
                                    }
                                    ${isWinning ? 'animate-none border-white! dark:border-slate-200! scale-100 z-20' : ''}
                                `}
                                style={{
                                    borderColor: player ? player.color : '',
                                    backgroundColor: player ? `${player.color}15` : '',
                                    color: player ? player.color : ''
                                }}
                            >
                                {player && (
                                    <div className="animate-in zoom-in slide-in-from-top-10 duration-500">
                                        <IconRenderer
                                            iconName={player.icon}
                                            size={32}
                                            strokeWidth={3}
                                        />
                                    </div>
                                )}

                                {/* Reflejo premium */}
                                {player && (
                                    <div
                                        className="absolute inset-0 opacity-20 pointer-events-none bg-linear-to-br from-white/40 to-transparent"
                                    ></div>
                                )}
                            </div>
                        );
                    })}
                </button>
            ))}
        </div>
    );
};

export default Connect4Board;
