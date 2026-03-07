import IconRenderer from './IconRenderer';

// Tamaños en modo normal (3×3 / 4×4): 3 pilas por jugador
// Tamaños en modo compact (5×5): 4 pilas por jugador — todo un poco más pequeño
const SLOT_SIZE = { normal: 58, compact: 46 };
const PIECE_PX = {
    normal: { 1: 22, 2: 32, 3: 43, 4: 54 },
    compact: { 1: 18, 2: 25, 3: 34, 4: 43 },
};
const ICON_PX = {
    normal: { 1: 9, 2: 13, 3: 18, 4: 23 },
    compact: { 1: 7, 2: 10, 3: 14, 4: 19 },
};

const GobbletExternalPiles = ({ piles, player, isCurrentPlayer, selected, onSelectPile, compact = false }) => {
    const mode = compact ? 'compact' : 'normal';
    const slotPx = SLOT_SIZE[mode];
    const piecePx = PIECE_PX[mode];
    const iconPx = ICON_PX[mode];

    return (
        <div className="flex items-center gap-2 flex-nowrap justify-center">
            {piles.map((pile, pileIdx) => {
                const topPiece = pile.length > 0 ? pile[pile.length - 1] : null;
                const isEmpty = pile.length === 0;
                const isSelected = selected?.pileIdx === pileIdx;
                const pxCircle = topPiece ? piecePx[topPiece.size] : slotPx * 0.5;
                const pxIcon = topPiece ? iconPx[topPiece.size] : 0;

                return (
                    <div
                        key={pileIdx}
                        onClick={() => !isEmpty && isCurrentPlayer && onSelectPile(pileIdx)}
                        className={`
                            relative flex items-center justify-center transition-all duration-200
                            ${!isEmpty && isCurrentPlayer ? 'cursor-pointer hover:scale-110 active:scale-95' : 'cursor-default'}
                            ${isEmpty ? 'opacity-20' : ''}
                        `}
                        style={{ width: slotPx, height: slotPx }}
                    >
                        {topPiece ? (
                            <div
                                className="rounded-full border-2 flex items-center justify-center relative overflow-hidden transition-all duration-200"
                                style={{
                                    width: pxCircle,
                                    height: pxCircle,
                                    borderColor: player.color,
                                    backgroundColor: `${player.color}20`,
                                    boxShadow: isSelected
                                        ? `0 0 0 2px white, 0 0 14px ${player.color}`
                                        : `0 2px 8px ${player.color}40`,
                                }}
                            >
                                <div style={{ color: player.color }} className="relative z-10">
                                    <IconRenderer iconName={player.icon} size={pxIcon} strokeWidth={2.5} />
                                </div>
                                <div className="absolute inset-0 bg-linear-to-br from-white/25 to-transparent pointer-events-none" />
                            </div>
                        ) : (
                            <div
                                className="rounded-full border border-dashed border-page-text/20"
                                style={{ width: slotPx * 0.5, height: slotPx * 0.5 }}
                            />
                        )}

                        {/* Badge de cantidad — fondo oscuro para legibilidad en ambos temas */}
                        {pile.length > 0 && (
                            <div className="absolute -top-1 -right-1 bg-black/60 text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center leading-none border border-white/10">
                                {pile.length}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default GobbletExternalPiles;
