import { useState } from 'react';
import SetupLayout from '../layout/SetupLayout';
import PlayerConfigRow from './PlayerConfigRow';
import SetupSelector from './SetupSelector';
import usePlayerSetup from '../../hooks/usePlayerSetup';
import useCompetitiveSetup from '../../hooks/useCompetitiveSetup';
import TournamentSection from '../tournament/TournamentSection';

const Connect4Setup = ({
    onComplete,
    onBack,
    initialPlayers = null,
    initialCompetitiveMode = false,
    initialTurnTime = 0
}) => {
    const { competitiveMode, turnTime, competitiveSelectorProps } = useCompetitiveSetup(initialCompetitiveMode, initialTurnTime);
    // Conecta 4 es estrictamente para 2 jugadores
    const numPlayers = 2;
    const { players, updatePlayer, getVisiblePlayers, getTakenResources } = usePlayerSetup(2, 2, initialPlayers);
    // Estado de configuración del torneo (null = desactivado)
    const [tournamentConfig, setTournamentConfig] = useState(null);

    const activePlayers = getVisiblePlayers(numPlayers);
    const { takenIcons, takenColors } = getTakenResources(activePlayers);

    const handleStart = () => {
        onComplete({
            players: activePlayers,
            competitiveMode,
            turnTime: competitiveMode ? turnTime : 0,
            tournament: tournamentConfig
        });
    };

    return (
        <SetupLayout
            gameTitle="Conecta 4"
            onBack={onBack ?? (() => window.location.reload())}
            onStart={handleStart}
            startLabel={tournamentConfig ? 'Comenzar Torneo' : 'Comenzar Batalla'}
        >
            <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto h-full">
                {/* Modo Competitivo — solo si no hay torneo activo */}
                {!tournamentConfig && (
                    <div className="shrink-0">
                        <SetupSelector {...competitiveSelectorProps} />
                    </div>
                )}

                {/* Modo Torneo */}
                <div className="shrink-0">
                    <TournamentSection
                        gameType="connect4"
                        onTournamentChange={setTournamentConfig}
                    />
                </div>

                {/* Filas de Jugadores — solo si no hay torneo activo */}
                {!tournamentConfig && (
                    <div className="flex flex-col gap-4 overflow-y-auto min-h-0 pr-1">
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
                )}
            </div>
        </SetupLayout>
    );
};

export default Connect4Setup;
