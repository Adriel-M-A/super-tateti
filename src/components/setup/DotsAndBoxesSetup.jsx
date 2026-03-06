import { useState } from 'react';
import SetupLayout from '../layout/SetupLayout';
import PlayerConfigRow from './PlayerConfigRow';
import SetupSelector from './SetupSelector';
import usePlayerSetup from '../../hooks/usePlayerSetup';
import { Users, LayoutGrid } from 'lucide-react';

const DotsAndBoxesSetup = ({ onComplete }) => {
    const [numPlayers, setNumPlayers] = useState(2);
    const [boardSize, setBoardSize] = useState(5);
    const { players, updatePlayer, getVisiblePlayers, getTakenResources } = usePlayerSetup(2, 5);

    const activePlayers = getVisiblePlayers(numPlayers);
    const { takenIcons, takenColors } = getTakenResources(activePlayers);

    const handleStart = () => {
        onComplete({
            players: activePlayers,
            boardSize,
        });
    };

    return (
        <SetupLayout
            gameTitle="Puntos y Cajas"
            onBack={() => window.location.reload()}
            onStart={handleStart}
        >
            <div className="space-y-8 w-full max-w-4xl mx-auto">
                <div className="grid md:grid-cols-2 gap-4">
                    <SetupSelector
                        icon={Users}
                        title="Jugadores"
                        options={[2, 3, 4, 5]}
                        value={numPlayers}
                        onChange={setNumPlayers}
                    />

                    <SetupSelector
                        icon={LayoutGrid}
                        title="Tablero"
                        options={[5, 7, 9]}
                        value={boardSize}
                        onChange={setBoardSize}
                    />
                </div>

                {/* Filas de Jugadores */}
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

export default DotsAndBoxesSetup;
