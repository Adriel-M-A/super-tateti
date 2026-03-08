import IconRenderer from './IconRenderer';
import { useGame } from '../../contexts/GameContext';

const Cell = ({ index, value, onClick, isSelectable, level, winner = null, playersConfig = null, currentPlayerSymbol = null, isHighlighted = false }) => {
    const { players, currentPlayerIndex } = useGame();

    // Adaptar configuración de jugadores (soporta objeto P1/P2 o array del contexto)
    const activeConfig = playersConfig || {
        P1: players[0],
        P2: players[1]
    };

    // Símbolo actual basado en el turno si no se provee
    const activeSymbol = currentPlayerSymbol || (currentPlayerIndex === 0 ? 'X' : 'O');

    const isSuper = level === 'super';
    const isSubHighlight = level === 'sub' && isHighlighted;

    const borderClasses = `
        ${Math.floor(index / 3) < 2 ? (isSuper ? 'border-b-4' : (isSubHighlight ? 'border-b-2' : 'border-b')) : ''}
        ${index % 3 < 2 ? (isSuper ? 'border-r-4' : (isSubHighlight ? 'border-r-2' : 'border-r')) : ''}
    `.trim();

    const borderColorClass = isSuper ? 'border-board-border' : (isSubHighlight ? 'border-border-highlight' : 'border-cell-border');

    // Celda ganadora del super-tablero (empate)
    if (isSuper && winner === 'DRAW') {
        const color1 = activeConfig?.P1?.color || '#3b82f6';
        const color2 = activeConfig?.P2?.color || '#ef4444';
        return (
            <div className={`relative ${borderClasses} ${borderColorClass} h-full w-full overflow-hidden`}>
                <div className="absolute inset-0 flex items-center justify-center rounded-lg transition-all duration-500 bg-cell-hover border border-board-border overflow-hidden group">
                    <span
                        className="text-6xl font-black absolute top-1/2 left-1/2 -translate-x-3/4 -translate-y-3/4 -rotate-12 group-hover:scale-110 transition-transform opacity-40"
                        style={{ color: color1 }}
                    >
                        {activeConfig?.P1 ? <IconRenderer iconName={activeConfig.P1.icon} size={64} strokeWidth={3} /> : 'X'}
                    </span>
                    <span
                        className="text-6xl font-black absolute top-1/2 left-1/2 -translate-x-1/4 -translate-y-1/4 rotate-12 group-hover:scale-110 transition-transform opacity-40"
                        style={{ color: color2 }}
                    >
                        {activeConfig?.P2 ? <IconRenderer iconName={activeConfig.P2.icon} size={64} strokeWidth={3} /> : 'O'}
                    </span>
                    <div
                        className="absolute inset-0 animate-pulse opacity-20"
                        style={{ background: `linear-gradient(to bottom right, ${color1}, ${color2})` }}
                    ></div>
                </div>
            </div>
        );
    }

    // Celda ganadora del super-tablero (ganador único)
    if (isSuper && winner) {
        const winnerConfig = activeConfig ? (winner === 'X' ? activeConfig.P1 : activeConfig.P2) : null;
        const isWinnerPlayer = winner === activeSymbol;

        return (
            <div className={`relative ${borderClasses} ${borderColorClass} h-full w-full overflow-hidden`}>
                <div
                    className="absolute inset-0 flex items-center justify-center transition-all duration-500 bg-cell-hover shadow-lg"
                    style={{
                        color: winnerConfig ? winnerConfig.color : (winner === 'X' ? '#3b82f6' : '#ef4444'),
                        filter: isWinnerPlayer
                            ? `drop-shadow(0 0 20px ${winnerConfig?.color || 'currentColor'}) brightness(1.2)`
                            : 'none',
                        opacity: isWinnerPlayer ? 1 : 0.8
                    }}
                >
                    {winnerConfig
                        ? <IconRenderer iconName={winnerConfig.icon} size={80} strokeWidth={4} />
                        : <span className="text-8xl font-black">{winner}</span>
                    }
                </div>
            </div>
        );
    }

    // Celda del super-tablero que contiene un sub-tablero
    if (Array.isArray(value)) {
        return (
            <div className={`relative ${borderClasses} ${borderColorClass} h-full w-full`}>
                <div className={`p-4 w-full h-full transition-all duration-500 ${isSelectable ? 'z-10 opacity-100' : 'opacity-40'}`}>
                    <Board
                        cells={value}
                        onCellClick={onClick}
                        level="sub"
                        isSelectable={isSelectable}
                        isHighlighted={isSelectable}
                        playersConfig={activeConfig}
                        currentPlayerSymbol={activeSymbol}
                    />
                </div>
            </div>
        );
    }

    // Celda normal (con pieza o vacía)
    const cellOwnerConfig = (activeConfig && value) ? (value === 'X' ? activeConfig.P1 : activeConfig.P2) : null;
    const isCurrentPlayer = value === activeSymbol;

    return (
        <div className={`relative ${borderClasses} ${borderColorClass} h-full w-full`}>
            <button
                onClick={isSelectable ? onClick : undefined}
                className={`
                    w-full h-full flex items-center justify-center transition-all duration-300
                    ${!value && isSelectable ? 'hover:bg-cell-hover cursor-pointer' : 'cursor-default'}
                    bg-transparent
                    ${isSuper ? 'p-6' : 'p-2'}
                `}
                style={{
                    color: cellOwnerConfig ? cellOwnerConfig.color : (value === 'X' ? '#3b82f6' : (value === 'O' ? '#ef4444' : 'currentColor')),
                    filter: value
                        ? (isCurrentPlayer
                            ? `drop-shadow(0 0 8px ${cellOwnerConfig?.color || 'currentColor'}) brightness(1.15)`
                            : 'none')
                        : 'none',
                    opacity: value ? (isCurrentPlayer ? 1 : 0.55) : 1
                }}
            >
                {cellOwnerConfig
                    ? (
                        <div className="animate-in zoom-in duration-300">
                            <IconRenderer
                                iconName={cellOwnerConfig.icon}
                                size={isSuper ? 56 : 24}
                                strokeWidth={3}
                            />
                        </div>
                    )
                    : <span className={`font-bold ${isSuper ? 'text-6xl' : 'text-2xl'}`}>{value}</span>
                }
            </button>
        </div>
    );
};

const Board = ({ cells, onCellClick, level = 'super', isSelectable = true, isHighlighted = false, activeSubBoard = null, subBoardWinners = [], playersConfig = null, currentPlayerSymbol = null }) => {
    return (
        // grid-rows-3: fuerza filas de altura exacta para evitar desplazamiento de bordes
        <div className={`grid grid-cols-3 grid-rows-3 w-full aspect-square ${level === 'super' ? 'max-w-lg mx-auto p-4 bg-transparent' : ''}`}>
            {cells.map((cell, index) => {
                const canPlayInThisCell = level === 'super' ? (activeSubBoard === null || activeSubBoard === index) : isSelectable;

                return (
                    <Cell
                        key={index}
                        index={index}
                        value={cell}
                        level={level}
                        isSelectable={canPlayInThisCell}
                        isHighlighted={isHighlighted}
                        winner={level === 'super' ? subBoardWinners[index] : null}
                        playersConfig={playersConfig}
                        currentPlayerSymbol={currentPlayerSymbol}
                        onClick={level === 'super'
                            ? (cellIndex) => onCellClick(index, cellIndex)
                            : () => onCellClick(index)
                        }
                    />
                );
            })}
        </div>
    );
};

export default Board;
