import { LayoutGrid, Play, Info, Trophy, Square } from 'lucide-react';

const GameCard = ({ title, description, icon: Icon, onClick, color }) => (
  <button
    onClick={onClick}
    className="group relative flex flex-col items-center p-8 bg-cell-hover border border-board-border rounded-3xl backdrop-blur-md transition-all duration-500 hover:shadow-2xl text-left w-full max-w-sm overflow-hidden"
  >
    <div
      className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full blur-3xl opacity-20 transition-opacity group-hover:opacity-40"
      style={{ backgroundColor: color }}
    ></div>

    <div
      className="p-4 rounded-2xl bg-cell-hover mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
      style={{ color: color }}
    >
      <Icon size={48} strokeWidth={2.5} />
    </div>

    <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">{title}</h3>
    <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6">
      {description}
    </p>

    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest py-2 px-4 rounded-full bg-cell-hover group-hover:bg-page-text group-hover:text-page-bg transition-colors">
      <Play size={14} fill="currentColor" />
      Jugar Ahora
    </div>
  </button>
);

const Home = ({ onSelectGame }) => {
  const games = [
    {
      id: 'classic-tateti',
      title: 'Ta-Te-Ti Clásico',
      description: 'El juego original de 3x3 que todos conocemos. Rápido, divertido y perfecto para una partida rápida.',
      icon: Square,
      color: '#22c55e' // Verde esmeralda
    },
    {
      id: 'super-tateti',
      title: 'Super Ta-Te-Ti',
      description: 'La versión definitiva y estratégica del clásico tres en raya. Gana sub-tableros para dominar el tablero global.',
      icon: LayoutGrid,
      color: '#3b82f6' // Azul vibrante
    },
    {
      id: 'dots-and-boxes',
      title: 'Puntos y Cajas',
      description: 'Conecta puntos para capturar territorio. El juego de estrategia clásica ahora con soporte para hasta 5 jugadores.',
      icon: LayoutGrid,
      color: '#a855f7' // Púrpura estratégico
    },
    // Aquí se agregarán más juegos en el futuro
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
      <header className="mb-16 text-center">
        <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-[0.2em] animate-pulse">
          Elige tu Batalla
        </div>
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-4 italic">
          GAMES<span className="text-blue-500">HUB</span>
        </h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest max-w-md mx-auto">
          Selecciona un desafío para comenzar
        </p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl justify-items-center">
        {games.map((game) => (
          <GameCard
            key={game.id}
            {...game}
            onClick={() => onSelectGame(game.id)}
          />
        ))}

        {/* Placeholder para próximos juegos */}
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-board-border rounded-3xl w-full max-w-sm opacity-30">
          <Trophy size={48} className="text-slate-500 mb-4" />
          <p className="text-slate-500 font-black uppercase tracking-tighter">Próximamente</p>
        </div>
      </main>

      <footer className="mt-20 flex items-center gap-6 opacity-40 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest cursor-help">
          <Info size={16} />
          Cómo Jugar
        </div>
        <div className="w-1 h-1 rounded-full bg-slate-500"></div>
        <div className="text-sm font-bold uppercase tracking-widest text-slate-500">
          v1.0.0
        </div>
      </footer>
    </div>
  );
};

export default Home;
