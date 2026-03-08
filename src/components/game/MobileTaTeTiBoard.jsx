import IconRenderer from './IconRenderer';

// Todas las combinaciones ganadoras
const WIN_LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

const MobileTaTeTiBoard = ({
    board,          // Array(9): null | 0 | 1  (índice de jugador)
    phase,          // 'placement' | 'movement'
    selectedIdx,    // índice de la celda seleccionada | null
    validTargets,   // Set de índices válidos para mover | []
    players,        // [player0, player1]
    currentPlayerIndex,
    onCellClick,
    winningLine = null
}) => {
    const currentPlayer = players[currentPlayerIndex];

    return (
        <div className="grid grid-cols-3 w-full aspect-square max-w-md mx-auto">
            {board.map((value, idx) => {
                const rowIdx = Math.floor(idx / 3);
                const colIdx = idx % 3;
                const isSelected = selectedIdx === idx;
                const isValidTarget = validTargets.includes(idx);
                const isWinning = winningLine?.includes(idx);
                const owner = value !== null ? players[value] : null;
                const isOwn = value === currentPlayerIndex;
                const isEmpty = value === null;

                // Clases de borde estilo tablero clásico
                const borderB = rowIdx < 2 ? 'border-b-2' : '';
                const borderR = colIdx < 2 ? 'border-r-2' : '';

                return (
                    <div
                        key={idx}
                        className={`relative aspect-square ${borderB} ${borderR} border-board-border`}
                    >
                        <button
                            onClick={() => onCellClick(idx)}
                            className={`
                                w-full h-full flex items-center justify-center relative
                                transition-all duration-300
                                ${isEmpty && !isSelected && (phase === 'placement' || isValidTarget) ? 'cursor-pointer' : isEmpty ? 'cursor-pointer' : 'cursor-default'}
                                ${isEmpty && !isSelected ? 'hover:bg-cell-hover' : ''}
                                ${isSelected ? 'bg-cell-hover' : ''}
                            `}
                        >
                            {/* Pieza del jugador */}
                            {owner && (
                                <div
                                    className={`
                                        animate-in zoom-in duration-300
                                        flex items-center justify-center
                                        ${isSelected ? 'scale-110' : 'scale-90'}
                                        ${isWinning ? 'scale-105' : ''}
                                    `}
                                    style={{
                                        color: owner.color,
                                        filter: isSelected
                                            ? `drop-shadow(0 0 12px ${owner.color})`
                                            : isWinning
                                                ? `drop-shadow(0 0 20px ${owner.color}) brightness(1.3)`
                                                : isOwn
                                                    ? `drop-shadow(0 0 8px ${owner.color}) brightness(1.15)`
                                                    : 'none',
                                        opacity: isWinning ? 1 : (isOwn ? 1 : 0.55),
                                        transition: 'filter 0.3s, opacity 0.3s'
                                    }}
                                >
                                    <IconRenderer iconName={owner.icon} size={48} strokeWidth={3} />
                                </div>
                            )}

                            {/* Ring de selección */}
                            {isSelected && (
                                <div
                                    className="absolute inset-2 rounded-xl border-2 animate-pulse"
                                    style={{ borderColor: currentPlayer.color }}
                                />
                            )}

                            {/* Hint de celda válida para mover */}
                            {isValidTarget && isEmpty && (
                                <div
                                    className="absolute inset-3 rounded-full border-2 border-dashed animate-pulse"
                                    style={{
                                        borderColor: `${currentPlayer.color}80`,
                                        backgroundColor: `${currentPlayer.color}10`
                                    }}
                                />
                            )}

                            {/* Hint de colocación (placement phase, celda vacía) */}
                            {isEmpty && phase === 'placement' && !isValidTarget && (
                                <div
                                    className="absolute inset-4 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200"
                                    style={{ backgroundColor: `${currentPlayer.color}20` }}
                                />
                            )}
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default MobileTaTeTiBoard;
