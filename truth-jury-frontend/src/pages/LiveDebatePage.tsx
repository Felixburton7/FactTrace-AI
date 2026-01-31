import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Play,
    Pause,
    SkipForward,
    FileText,
    AlertCircle,
    Settings,
    Eye,
    Wifi,
    WifiOff,
    Zap
} from 'lucide-react';
import { ClaimPair, Message, PersonaType, JudgeVerdict } from '@/types/debate';
import { personas, juryPersonas, moderatorPersona, getPersonaById } from '@/data/personas';
import { PersonaAvatar } from '@/components/PersonaAvatar';
import { PersonaModal } from '@/components/PersonaModal';
import { ChatMessage } from '@/components/ChatMessage';
import { TypingIndicator } from '@/components/TypingIndicator';
import { VerdictCard } from '@/components/VerdictCard';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useLiveDebate, DebatePhase } from '@/hooks/useLiveDebate';
import { healthCheck } from '@/lib/api';

export default function LiveDebatePage() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const [claim, setClaim] = useState<ClaimPair | null>(null);
    const [selectedPersona, setSelectedPersona] = useState<typeof personas[0] | null>(null);
    const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false);
    const [showFullFact, setShowFullFact] = useState(false);
    const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);
    const [hasStarted, setHasStarted] = useState(false);

    // Get model from search params (defaults to gpt-4o-mini)
    const model = searchParams.get('model') || 'gpt-4o-mini';

    // Use the live debate hook
    const {
        messages,
        phase,
        currentSpeaker,
        isTyping,
        verdict,
        error,
        isDebating,
        progress,
        startDebate,
        stopDebate,
        reset,
    } = useLiveDebate({
        onComplete: () => {
            console.log('Debate completed');
        },
        onError: (err) => {
            console.error('Debate error:', err);
        },
    });

    // Check API availability on mount
    useEffect(() => {
        healthCheck().then(setApiAvailable);
    }, []);

    // Get claim from location state
    useEffect(() => {
        if (location.state?.claim) {
            setClaim(location.state.claim);
        } else if (id !== undefined) {
            navigate('/');
        }
    }, [id, location.state, navigate]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    // Start debate when claim is available and user confirms
    const handleStartDebate = () => {
        if (!claim) return;
        setHasStarted(true);
        startDebate(claim.claim, claim.truth, model);
    };

    const handlePersonaClick = (persona: typeof personas[0]) => {
        setSelectedPersona(persona);
        setIsPersonaModalOpen(true);
    };

    const currentTypingPersona = currentSpeaker ? getPersonaById(currentSpeaker) : null;

    // Get phase label for display
    const getPhaseLabel = () => {
        switch (phase) {
            case 'idle': return 'Ready to Start';
            case 'intro': return 'Introduction';
            case 'round1': return 'Round 1';
            case 'moderator-summary': return 'Moderator Summary';
            case 'round2': return 'Round 2';
            case 'verdict': return 'Verdict';
            case 'complete': return 'Complete';
            case 'error': return 'Error';
            default: return 'Unknown';
        }
    };

    if (!claim) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading debate...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="border-b border-border sticky top-0 z-40 bg-background/80 backdrop-blur-xl">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/')}
                            className="gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Claims
                        </Button>

                        <div className="flex items-center gap-4">
                            {/* API Status */}
                            <div className="flex items-center gap-2 text-sm">
                                {apiAvailable === null ? (
                                    <span className="text-muted-foreground">Checking API...</span>
                                ) : apiAvailable ? (
                                    <>
                                        <Wifi className="w-4 h-4 text-green-500" />
                                        <span className="text-green-500">Live Mode</span>
                                    </>
                                ) : (
                                    <>
                                        <WifiOff className="w-4 h-4 text-red-500" />
                                        <span className="text-red-500">API Offline</span>
                                    </>
                                )}
                            </div>

                            {/* Jury avatars */}
                            <div className="flex items-center gap-1">
                                <span className="text-xs text-muted-foreground mr-2">Jury:</span>
                                <div className="flex -space-x-2">
                                    {juryPersonas.map((persona) => (
                                        <PersonaAvatar
                                            key={persona.id}
                                            persona={persona}
                                            size="sm"
                                            isActive={currentSpeaker === persona.id}
                                            onClick={() => handlePersonaClick(persona)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Moderator avatar */}
                            <div className="flex items-center gap-1 border-l border-border pl-4">
                                <span className="text-xs text-muted-foreground mr-2">Mod:</span>
                                <PersonaAvatar
                                    persona={moderatorPersona}
                                    size="sm"
                                    isActive={currentSpeaker === 'moderator'}
                                    onClick={() => handlePersonaClick(moderatorPersona)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{getPhaseLabel()}</span>
                            {error && (
                                <span className="text-xs text-red-500">Error occurred</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Progress bar */}
                {!verdict && hasStarted && (
                    <Progress value={progress} className="h-1 rounded-none" />
                )}
            </header>

            {/* Context banner */}
            <div className="border-b border-border bg-card/50">
                <div className="container mx-auto px-4 py-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Claim */}
                        <div className="glass rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertCircle className="w-4 h-4 text-skeptic" />
                                <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                                    External Claim
                                </span>
                            </div>
                            <p className="text-sm text-foreground">{claim.claim}</p>
                        </div>

                        {/* Truth */}
                        <div className="glass rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-academic" />
                                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                                        Internal Fact
                                    </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowFullFact(!showFullFact)}
                                    className="h-6 text-xs"
                                >
                                    <Eye className="w-3 h-3 mr-1" />
                                    {showFullFact ? 'Hide' : 'Show Full'}
                                </Button>
                            </div>
                            <p className={cn(
                                'text-sm text-foreground transition-all',
                                !showFullFact && 'line-clamp-2'
                            )}>
                                {claim.truth}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 container mx-auto px-4 py-6 flex gap-6">
                {/* Chat area */}
                <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full">
                    {/* Messages */}
                    <div
                        ref={chatContainerRef}
                        className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-thin"
                    >
                        {!hasStarted ? (
                            /* Start screen */
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <div className="flex justify-center gap-4 mb-6">
                                        {juryPersonas.map((p, i) => (
                                            <motion.div
                                                key={p.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                            >
                                                <PersonaAvatar
                                                    persona={p}
                                                    size="lg"
                                                    onClick={() => handlePersonaClick(p)}
                                                />
                                            </motion.div>
                                        ))}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                            className="border-l border-border pl-4"
                                        >
                                            <PersonaAvatar
                                                persona={moderatorPersona}
                                                size="lg"
                                                onClick={() => handlePersonaClick(moderatorPersona)}
                                            />
                                        </motion.div>
                                    </div>

                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                    >
                                        <p className="text-muted-foreground mb-6">The jury is ready to debate this claim.</p>

                                        {apiAvailable === false ? (
                                            <div className="text-center">
                                                <p className="text-red-500 mb-4">
                                                    ⚠️ Backend API is not available. Please start the API server.
                                                </p>
                                                <code className="bg-muted px-3 py-2 rounded text-sm">
                                                    cd checker-of-claims && pip install -e . && python -m checker_of_facts.api
                                                </code>
                                            </div>
                                        ) : (
                                            <Button
                                                onClick={handleStartDebate}
                                                size="lg"
                                                className="gap-2"
                                                disabled={!apiAvailable}
                                            >
                                                <Zap className="w-5 h-5" />
                                                Start Live Debate
                                            </Button>
                                        )}
                                    </motion.div>
                                </div>
                            </div>
                        ) : messages.length === 0 && !isTyping ? (
                            /* Loading state */
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                                    <p className="text-muted-foreground">Connecting to jury...</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {messages.map((message, index) => {
                                    const persona = getPersonaById(message.personaId);
                                    if (!persona) return null;
                                    return (
                                        <ChatMessage
                                            key={message.id}
                                            message={message}
                                            persona={persona}
                                            index={index}
                                            onPersonaClick={handlePersonaClick}
                                        />
                                    );
                                })}

                                {/* Typing indicator */}
                                <AnimatePresence>
                                    {isTyping && currentTypingPersona && (
                                        <TypingIndicator
                                            persona={currentTypingPersona}
                                            isRightAligned={currentTypingPersona.id === 'moderator'}
                                        />
                                    )}
                                </AnimatePresence>

                                {/* Error message */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="glass-card rounded-xl p-4 border-red-500/50"
                                    >
                                        <div className="flex items-center gap-2 text-red-500">
                                            <AlertCircle className="w-5 h-5" />
                                            <span className="font-medium">Error</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
                                        <Button
                                            onClick={() => reset()}
                                            variant="outline"
                                            size="sm"
                                            className="mt-4"
                                        >
                                            Try Again
                                        </Button>
                                    </motion.div>
                                )}

                                {/* Verdict */}
                                <AnimatePresence>
                                    {verdict && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-6"
                                        >
                                            <VerdictCard
                                                verdict={verdict}
                                                onExploreAnother={() => navigate('/')}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </>
                        )}
                    </div>

                    {/* Status bar */}
                    {hasStarted && !verdict && (
                        <div className="glass rounded-xl p-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {isTyping && currentTypingPersona ? (
                                    <span className="text-sm text-muted-foreground">
                                        <span className={cn('font-medium', `text-${currentTypingPersona.color}`)}>
                                            {currentTypingPersona.name}
                                        </span>
                                        {' '}is typing...
                                    </span>
                                ) : (
                                    <span className="text-sm text-muted-foreground">
                                        {getPhaseLabel()} • {messages.length} messages
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Zap className="w-3.5 h-3.5 text-green-500" />
                                Live • Model: {model}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Persona Modal */}
            <PersonaModal
                persona={selectedPersona}
                isOpen={isPersonaModalOpen}
                onClose={() => setIsPersonaModalOpen(false)}
            />
        </div>
    );
}
