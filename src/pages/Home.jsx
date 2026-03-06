import { LayoutGrid, Play, Info, Trophy, Square, Hash } from 'lucide-react';

const GameCard = ({ title, description, icon: Icon, onClick, color }) => (
  <button
    onClick={onClick}
    className="group relative flex flex-col items-center p-5 bg-card-bg/20 border border-board-border/20 rounded-3xl backdrop-blur-md transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl text-left w-full overflow-hidden"
  >
    <div
      className="absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 rounded-full blur-2xl opacity-10 transition-opacity group-hover:opacity-30"
      style={{ backgroundColor: color }}
    ></div>

    <div
      className="p-3 rounded-xl bg-cell-hover mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-inner"
      style={{ color: color }}
    >
      <Icon size={32} strokeWidth={2.5} />
    </div>

    <h3 className="text-lg md:text-xl font-black uppercase tracking-tighter mb-1 text-page-text">{title}</h3>
    <p className="text-slate-400 text-[10px] font-medium leading-relaxed mb-4 line-clamp-2">
      {description}
    </p>

    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest py-1.5 px-3 rounded-full bg-cell-hover group-hover:bg-page-text group-hover:text-page-bg transition-colors">
      <Play size={10} fill="currentColor" />
      Jugar
    </div>
  </button>
);

const Home = ({ onSelectGame }) => {
  const games = [
    {
      id: 'classic-tateti',
      title: 'Ta-Te-Ti Clásico',
      description: 'El desafío original de 3x3. Rápido, icónico y perfecto para calentar.',
      icon: Square,
      color: '#22c55e'
    },
    {
      id: 'super-tateti',
      title: 'Super Ta-Te-Ti',
      description: 'Estrategia recursiva en 9 dimensiones. Domina los sub-tableros.',
      icon: LayoutGrid,
      color: '#3b82f6'
    },
    {
      id: 'dots-and-boxes',
      title: 'Puntos y Cajas',
      description: 'Captura territorio en una grilla táctica. Soporte hasta 5 jugadores.',
      icon: LayoutGrid,
      color: '#a855f7'
    },
    {
      id: 'extended-tateti',
      title: 'Ta-Te-Ti Extendido',
      description: 'Tableros gigantes y rectangulares con puntuación acumulativa.',
      icon: Hash,
      color: '#ec4899'
    },
    {
      id: 'connect4',
      title: 'Conecta 4',
      description: 'Duelo vertical de estrategia. Alinea cuatro fichas antes que tu rival.',
      icon: LayoutGrid, // Usamos LayoutGrid por ahora o Columns si prefieres
      color: '#f59e0b'
    }
  ];

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in zoom-in duration-700 overflow-hidden">
      <header className="mb-8 md:mb-12 text-center">
        <div className="inline-block px-3 py-1 mb-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
          Elige tu Batalla
        </div>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-2 italic leading-none">
          GAMES<span className="text-blue-500">HUB</span>
        </h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] md:text-xs">
          Seleccioná un desafío para comenzar la batalla
        </p>
      </header>

      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full max-w-6xl px-4">
        {games.map((game) => (
          <GameCard
            key={game.id}
            {...game}
            onClick={() => onSelectGame(game.id)}
          />
        ))}

        {/* Próximamente - Compacto */}
        <div className="hidden lg:flex flex-col items-center justify-center p-5 border border-dashed border-board-border/20 rounded-3xl w-full opacity-20 hover:opacity-100 transition-opacity group cursor-not-allowed">
          <Trophy size={32} className="text-slate-500 mb-2 group-hover:scale-110 transition-transform" />
          <p className="text-[10px] font-black uppercase tracking-tighter">New Game</p>
        </div>
      </main>

      <footer className="mt-8 md:mt-12 flex items-center gap-6 opacity-30 hover:opacity-80 transition-opacity">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest cursor-help">
          <Info size={14} />
          Manual
        </div>
        <div className="w-1 h-1 rounded-full bg-slate-500"></div>
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
          v1.0.0
        </div>
      </footer>
    </div>
  );
};

export default Home;
