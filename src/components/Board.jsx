import { X, Circle, Triangle, Square, Hexagon } from 'lucide-react';

const icons = { X, Circle, Triangle, Square, Hexagon };
const IconRenderer = ({ iconName, ...props }) => {
    const Icon = icons[iconName];
    return Icon ? <Icon {...props} /> : null;
};

const Cell = ({ index, value, onClick, isSelectable, level, winner = null, playersConfig = null, currentPlayerSymbol = null, isHighlighted = false }) => {
    const isSuper = level === 'super';
    const isSubHighlight = level === 'sub' && isHighlighted;

    const borderClasses = `
        ${Math.floor(index / 3) < 2 ? (isSuper ? 'border-b-4' : (isSubHighlight ? 'border-b-2' : 'border-b')) : ''}
        ${index % 3 < 2 ? (isSuper ? 'border-r-4' : (isSubHighlight ? 'border-r-2' : 'border-r')) : ''}
    `.trim();

    const borderColorClass = isSuper ? 'border-board-border' : (isSubHighlight ? 'border-white/70' : 'border-cell-border');

    // Si hay un ganador en este sub-tablero (y estamos renderizándolo como una celda del super-tablero)
    if (isSuper && winner) {
        if (winner === 'DRAW') {
            const color1 = playersConfig?.P1.color || '#3b82f6';
            const color2 = playersConfig?.P2.color || '#ef4444';
            return (
                <div className={`relative ${borderClasses} ${borderColorClass} aspect-square`}>
                    <div className="absolute inset-0 flex items-center justify-center rounded-lg transition-all duration-500 bg-white/5 border border-white/10 overflow-hidden group">
                        <span
                            className="text-6xl font-black absolute top-1/2 left-1/2 -translate-x-3/4 -translate-y-3/4 -rotate-12 group-hover:scale-110 transition-transform opacity-40"
                            style={{ color: color1 }}
                        >
                            {playersConfig ? <IconRenderer iconName={playersConfig.P1.icon} size={64} strokeWidth={3} /> : 'X'}
                        </span>
                        <span
                            className="text-6xl font-black absolute top-1/2 left-1/2 -translate-x-1/4 -translate-y-1/4 rotate-12 group-hover:scale-110 transition-transform opacity-40"
                            style={{ color: color2 }}
                        >
                            {playersConfig ? <IconRenderer iconName={playersConfig.P2.icon} size={64} strokeWidth={3} /> : 'O'}
                        </span>
                        <div
                            className="absolute inset-0 animate-pulse opacity-20"
                            style={{ background: `linear-gradient(to bottom right, ${color1}, ${color2})` }}
                        ></div>
                    </div>
                </div>
            );
        }

        const config = playersConfig ? (winner === 'X' ? playersConfig.P1 : playersConfig.P2) : null;
        const isWinnerPlayer = winner === currentPlayerSymbol;

        return (
            <div className={`relative ${borderClasses} ${borderColorClass} aspect-square`}>
                <div
                    className={`aspect-square flex items-center justify-center transition-all duration-500 bg-white/10 shadow-lg`}
                    style={{
                        color: config ? config.color : (winner === 'X' ? '#3b82f6' : '#ef4444'),
                        filter: isWinnerPlayer ? `drop-shadow(0 0 20px ${config?.color || 'currentColor'}) brightness(1.2)` : 'none',
                        opacity: isWinnerPlayer ? 1 : 0.8
                    }}
                >
                    {config
                        ? <IconRenderer iconName={config.icon} size={80} strokeWidth={4} />
                        : <span className="text-8xl font-black">{winner}</span>
                    }
                </div>
            </div>
        );
    }

    if (Array.isArray(value)) {
        // Bloque de sub-tablero manejado arriba

        return (
            <div className={`relative ${borderClasses} ${borderColorClass} h-full w-full`}>
                <div className={`p-4 w-full h-full transition-all duration-500 ${isSelectable ? 'z-10 opacity-100' : 'opacity-40 grayscale-[0.5]'}`}>
                    <Board
                        cells={value}
                        onCellClick={onClick}
                        level="sub"
                        isSelectable={isSelectable}
                        isHighlighted={isSelectable}
                        playersConfig={playersConfig}
                        currentPlayerSymbol={currentPlayerSymbol}
                    />
                </div>
            </div>
        );
    }

    const config = (playersConfig && value) ? (value === 'X' ? playersConfig.P1 : playersConfig.P2) : null;
    const isCurrentPlayer = value === currentPlayerSymbol;

    return (
        <div className={`relative ${borderClasses} ${borderColorClass} aspect-square`}>
            <button
                onClick={isSelectable ? onClick : undefined}
                className={`
                    w-full h-full flex items-center justify-center transition-all duration-300
                    ${!value && isSelectable ? 'hover:bg-white/5 cursor-pointer' : 'cursor-default'}
                    bg-transparent
                    ${isCurrentPlayer ? 'z-10' : ''}
                    ${isSuper ? 'p-6' : 'p-2'}
                `}
                style={{
                    color: config ? config.color : (value === 'X' ? '#3b82f6' : (value === 'O' ? '#ef4444' : 'currentColor')),
                    filter: isCurrentPlayer ? 'brightness(1.5)' : 'none',
                    opacity: isCurrentPlayer ? 1 : 0.7
                }}
            >
                {config
                    ? <IconRenderer
                        iconName={config.icon}
                        size={isSuper ? 56 : 24}
                        strokeWidth={3}
                    />
                    : <span className={`font-bold ${isSuper ? 'text-6xl' : 'text-2xl'}`}>{value}</span>
                }
            </button>
        </div>
    );
};

const Board = ({ cells, onCellClick, level = 'super', isSelectable = true, isHighlighted = false, activeSubBoard = null, subBoardWinners = [], playersConfig = null, currentPlayerSymbol = null }) => {
    return (
        <div className={`grid grid-cols-3 w-full aspect-square ${level === 'super' ? 'max-w-lg mx-auto p-4 bg-transparent' : ''}`}>
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
