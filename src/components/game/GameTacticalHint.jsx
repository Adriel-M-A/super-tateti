const GameTacticalHint = ({ children, className = "" }) => {
    if (!children) return null;

    return (
        <div className={`px-6 py-2 rounded-full bg-cell-hover border border-board-border text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-500 italic shadow-inner backdrop-blur-sm animate-in fade-in zoom-in duration-500 ${className}`}>
            {children}
        </div>
    );
};

export default GameTacticalHint;
