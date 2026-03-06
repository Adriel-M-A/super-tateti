import { useState } from 'react';
import SetupLayout from '../layout/SetupLayout';
import PlayerConfigRow from './PlayerConfigRow';
import SetupSelector from './SetupSelector';
import usePlayerSetup from '../../hooks/usePlayerSetup';
import { Users, LayoutGrid, Hash, Swords } from 'lucide-react';

const ExtendedTaTeTiSetup = ({ onComplete }) => {
    const [numPlayers, setNumPlayers] = useState(2);
    const [rows, setRows] = useState(7);
    const [cols, setCols] = useState(7);
    const [winCondition, setWinCondition] = useState(4);

    const { players, updatePlayer, getVisiblePlayers, getTakenResources } = usePlayerSetup(2, 5);

    const activePlayers = getVisiblePlayers(numPlayers);
    const { takenIcons, takenColors } = getTakenResources(activePlayers);

    const handleStart = () => {
        onComplete({
            players: activePlayers,
            rows,
            cols,
            winCondition
        });
    };

    return (
        <SetupLayout
            gameTitle="Ta-Te-Ti Extendido"
            onBack={() => window.location.reload()}
            onStart={handleStart}
        >
            <div className="space-y-8 w-full max-w-4xl mx-auto pb-10">
                {/* Configuración del Tablero y Reglas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SetupSelector
                        icon={Users}
                        title="Jugadores"
                        options={[2, 3, 4, 5]}
                        value={numPlayers}
                        onChange={setNumPlayers}
                    />

                    <SetupSelector
                        icon={Hash}
                        title="Filas"
                        type="range"
                        min={5}
                        max={15}
                        value={rows}
                        onChange={setRows}
                    />

                    <SetupSelector
                        icon={Hash}
                        title="Columnas"
                        type="range"
                        min={5}
                        max={15}
                        value={cols}
                        onChange={setCols}
                        iconContainerClassName="rotate-90"
                    />

                    <SetupSelector
                        icon={Swords}
                        title="En Línea"
                        options={[3, 4, 5]}
                        value={winCondition}
                        onChange={setWinCondition}
                    />
                </div>

                {/* Jugadores */}
                <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {activePlayers.map((player, idx) => (
                        <PlayerConfigRow
                            key={player.id}
                            index={idx}
                            player={player}
                            onUpdate={(updates) => updatePlayer(idx, updates)}
                            takenIcons={takenIcons}
                            takenColors={takenColors}
                        />
                    ))}
                </div>
            </div>
        </SetupLayout>
    );
};

export default ExtendedTaTeTiSetup;
