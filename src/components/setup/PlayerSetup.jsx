import { useState } from 'react';
import usePlayerSetup from '../../hooks/usePlayerSetup';
import SetupLayout from '../layout/SetupLayout';
import PlayerConfigRow from './PlayerConfigRow';
import SetupSelector from './SetupSelector';
import { Timer } from 'lucide-react';

const PlayerSetup = ({
    title = "Ta-Te-Ti",
    onComplete,
    initialPlayers = null,
    initialCompetitiveMode = false,
    initialTurnTime = 10
}) => {
    const [competitiveMode, setCompetitiveMode] = useState(initialCompetitiveMode);
    const [turnTime, setTurnTime] = useState(initialTurnTime);
    const { players, updatePlayer, getVisiblePlayers, getTakenResources } = usePlayerSetup(2, 2, initialPlayers);

    const activePlayers = getVisiblePlayers(2);
    const { takenIcons, takenColors } = getTakenResources(activePlayers);

    const handleStart = () => {
        onComplete({
            players: { P1: activePlayers[0], P2: activePlayers[1] },
            competitiveMode,
            turnTime: competitiveMode ? turnTime : 0
        });
    };

    return (
        <SetupLayout
            gameTitle={title}
            onBack={() => window.location.reload()}
            onStart={handleStart}
        >
            <div className="flex flex-col gap-8 w-full max-w-3xl mx-auto pb-10">
                {/* Modo Competitivo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <SetupSelector
                            icon={Timer}
                            title="Modo Competitivo"
                            options={["No", 5, 10, 20, 30]}
                            value={competitiveMode ? turnTime : "No"}
                            onChange={(val) => {
                                if (val === "No") {
                                    setCompetitiveMode(false);
                                } else {
                                    setCompetitiveMode(true);
                                    setTurnTime(val);
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Jugadores */}
                <div className="flex flex-col gap-4">
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

export default PlayerSetup;
