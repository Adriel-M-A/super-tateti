import { X, Circle, Triangle, Square, Hexagon } from 'lucide-react';

const icons = { X, Circle, Triangle, Square, Hexagon };
const IconRenderer = ({ iconName, ...props }) => {
    const Icon = icons[iconName];
    return Icon ? <Icon {...props} /> : null;
};

const Cell = ({ value, onClick, isSelectable, level, winner = null, playersConfig = null, currentPlayerSymbol = null }) => {
    // Si hay un ganador en este sub-tablero (y estamos renderizándolo como una celda del super-tablero)
    if (level === 'super' && winner) {
        if (winner === 'DRAW') {
            const color1 = playersConfig?.P1.color || '#3b82f6';
            const color2 = playersConfig?.P2.color || '#ef4444';
            return (
                <div className="aspect-square flex items-center justify-center rounded-lg transition-all duration-500 bg-white/5 border border-white/10 relative overflow-hidden group">
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
            );
        }

        const config = playersConfig ? (winner === 'X' ? playersConfig.P1 : playersConfig.P2) : null;
        const isCurrentPlayer = winner === currentPlayerSymbol;

        return (
            <div
                className={`aspect-square flex items-center justify-center rounded-lg transition-all duration-500 bg-white/10 shadow-lg ${isCurrentPlayer ? 'scale-105 z-10' : ''}`}
                style={{
                    color: config ? config.color : (winner === 'X' ? '#3b82f6' : '#ef4444'),
                    filter: isCurrentPlayer ? `drop-shadow(0 0 15px ${config?.color || 'currentColor'})` : 'none',
                    opacity: isCurrentPlayer ? 1 : 0.8
                }}
            >
                {config
                    ? <IconRenderer iconName={config.icon} size={80} strokeWidth={4} />
                    : <span className="text-8xl font-black">{winner}</span>
                }
            </div>
        );
    }

    if (Array.isArray(value)) {
        return (
            <div className={`p-1 border transition-all duration-300 ${isSelectable ? 'bg-cell-hover border-board-border shadow-lg scale-[1.02]' : 'bg-transparent border-cell-border opacity-40'}`}>
                <Board
                    cells={value}
                    onCellClick={onClick}
                    level="sub"
                    isSelectable={isSelectable}
                    playersConfig={playersConfig}
                    currentPlayerSymbol={currentPlayerSymbol}
                />
            </div>
        );
    }

    const config = (playersConfig && value) ? (value === 'X' ? playersConfig.P1 : playersConfig.P2) : null;
    const isCurrentPlayer = value === currentPlayerSymbol;

    return (
        <button
            onClick={isSelectable ? onClick : undefined}
            className={`
        aspect-square flex items-center justify-center transition-all duration-300
        ${!value && isSelectable ? 'hover:bg-cell-hover cursor-pointer' : 'cursor-default'}
        ${level === 'sub' ? 'border border-cell-border' : 'border-4 border-board-border'}
        bg-transparent
        ${isCurrentPlayer ? 'scale-110 z-10' : ''}
      `}
            style={{
                color: config ? config.color : (value === 'X' ? '#3b82f6' : (value === 'O' ? '#ef4444' : 'currentColor')),
                filter: isCurrentPlayer ? `drop-shadow(0 0 10px ${config?.color || 'currentColor'})` : 'none',
                opacity: isCurrentPlayer ? 1 : 0.7
            }}
        >
            {config
                ? <IconRenderer
                    iconName={config.icon}
                    size={level === 'sub' ? 24 : 56}
                    strokeWidth={3}
                    className={isCurrentPlayer ? 'animate-pulse' : ''}
                />
                : <span className={`font-bold ${level === 'sub' ? 'text-2xl' : 'text-6xl'}`}>{value}</span>
            }
        </button>
    );
};

const Board = ({ cells, onCellClick, level = 'super', isSelectable = true, activeSubBoard = null, subBoardWinners = [], playersConfig = null, currentPlayerSymbol = null }) => {
    return (
        <div className={`grid grid-cols-3 gap-1 w-full aspect-square ${level === 'super' ? 'max-w-lg mx-auto p-4 bg-transparent' : ''}`}>
            {cells.map((cell, index) => {
                const canPlayInThisCell = level === 'super' ? (activeSubBoard === null || activeSubBoard === index) : isSelectable;

                return (
                    <Cell
                        key={index}
                        value={cell}
                        level={level}
                        isSelectable={canPlayInThisCell}
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
