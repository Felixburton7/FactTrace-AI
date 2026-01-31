import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  SkipForward, 
  FileText, 
  AlertCircle,
  Settings,
  Eye
} from 'lucide-react';
import { ClaimPair, Message, PersonaType, JudgeVerdict } from '@/types/debate';
import { personas, juryPersonas, moderatorPersona, getPersonaById } from '@/data/personas';
import { getScriptForClaim, DebateScript } from '@/data/debateScripts';
import { PersonaAvatar } from '@/components/PersonaAvatar';
import { PersonaModal } from '@/components/PersonaModal';
import { ChatMessage } from '@/components/ChatMessage';
import { TypingIndicator } from '@/components/TypingIndicator';
import { VerdictCard } from '@/components/VerdictCard';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

type DebatePhase = 'intro' | 'round1' | 'moderator-summary' | 'round2' | 'verdict';

export default function DebatePage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [claim, setClaim] = useState<ClaimPair | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentSpeaker, setCurrentSpeaker] = useState<PersonaType | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [verdict, setVerdict] = useState<JudgeVerdict | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<typeof personas[0] | null>(null);
  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false);
  const [showFullFact, setShowFullFact] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [script, setScript] = useState<DebateScript | null>(null);
  const [phase, setPhase] = useState<DebatePhase>('intro');

  // Get claim from location state or fetch it
  useEffect(() => {
    if (location.state?.claim) {
      setClaim(location.state.claim);
      const foundScript = getScriptForClaim(location.state.claim.id);
      setScript(foundScript || null);
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

  // Get current phase messages
  const getCurrentPhaseMessages = () => {
    if (!script) return [];
    switch (phase) {
      case 'round1':
        return script.round1Messages;
      case 'round2':
        return script.round2Messages;
      default:
        return [];
    }
  };

  // Calculate total messages for progress
  const getTotalMessages = () => {
    if (!script) return 0;
    return 1 + script.round1Messages.length + 1 + script.round2Messages.length; // +1 intro, +1 for moderator summary
  };

  const getCompletedMessages = () => {
    if (!script) return 0;
    if (phase === 'intro') return 0;
    if (phase === 'round1') return 1 + messageIndex;
    if (phase === 'moderator-summary') return 1 + script.round1Messages.length;
    if (phase === 'round2') return 1 + script.round1Messages.length + 1 + messageIndex;
    return getTotalMessages();
  };

  // Simulate debate progression
  useEffect(() => {
    if (!script || isPaused || verdict) return;

    const phaseMessages = getCurrentPhaseMessages();

    // Handle intro phase - moderator introduces the discussion
    if (phase === 'intro') {
      setIsTyping(true);
      setCurrentSpeaker('moderator');

      const typingTimer = setTimeout(() => {
        const introMessage: Message = {
          id: 'moderator-intro',
          personaId: 'moderator',
          content: script.moderatorIntro,
          timestamp: new Date(),
          reactions: [],
        };
        
        setMessages(prev => [...prev, introMessage]);
        setIsTyping(false);
        setCurrentSpeaker(null);
        
        // Transition to round 1
        setTimeout(() => {
          setPhase('round1');
          setMessageIndex(0);
        }, 1000);
      }, 2500);

      return () => clearTimeout(typingTimer);
    }

    // Handle round completion and phase transitions
    if (phase === 'round1' && messageIndex >= phaseMessages.length) {
      // Transition to moderator summary
      setTimeout(() => {
        setPhase('moderator-summary');
        setMessageIndex(0);
      }, 500);
      return;
    }

    if (phase === 'moderator-summary') {
      // Show moderator summary
      setIsTyping(true);
      setCurrentSpeaker('moderator');

      const typingTimer = setTimeout(() => {
        const moderatorMessage: Message = {
          id: `moderator-summary`,
          personaId: 'moderator',
          content: `${script.moderatorSummary}\n\n${script.round2Direction}`,
          timestamp: new Date(),
          reactions: [],
          isModeratorSummary: true,
        };
        
        setMessages(prev => [...prev, moderatorMessage]);
        setIsTyping(false);
        setCurrentSpeaker(null);
        
        // Transition to round 2
        setTimeout(() => {
          setPhase('round2');
          setMessageIndex(0);
        }, 1000);
      }, 2500);

      return () => clearTimeout(typingTimer);
    }

    if (phase === 'round2' && messageIndex >= phaseMessages.length) {
      // Show verdict
      setTimeout(() => {
        setPhase('verdict');
        setVerdict(script.judgeVerdict);
      }, 1000);
      return;
    }

    if (phase === 'verdict') return;

    // Show typing indicator for current message
    setIsTyping(true);
    setCurrentSpeaker(phaseMessages[messageIndex].personaId);

    const typingTimer = setTimeout(() => {
      const newMessage: Message = {
        id: `msg-${phase}-${messageIndex}`,
        personaId: phaseMessages[messageIndex].personaId,
        content: phaseMessages[messageIndex].content,
        timestamp: new Date(),
        reactions: phaseMessages[messageIndex].reactions || [],
      };
      
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
      setCurrentSpeaker(null);
      setMessageIndex(prev => prev + 1);
    }, 2000 + Math.random() * 1500);

    return () => clearTimeout(typingTimer);
  }, [messageIndex, script, isPaused, verdict, phase]);

  const handleSkipToVerdict = () => {
    if (!script) return;
    
    // Add all remaining messages based on current phase
    const allMessages: Message[] = [];
    
    // Add intro if not shown yet
    if (phase === 'intro') {
      allMessages.push({
        id: 'moderator-intro',
        personaId: 'moderator',
        content: script.moderatorIntro,
        timestamp: new Date(),
        reactions: [],
      });
    }
    
    // Add remaining round 1 messages if in intro or round 1
    if (phase === 'intro' || phase === 'round1') {
      const startIdx = phase === 'round1' ? messageIndex : 0;
      const remaining1 = script.round1Messages.slice(startIdx).map((msg, i) => ({
        id: `msg-round1-${startIdx + i}`,
        personaId: msg.personaId,
        content: msg.content,
        timestamp: new Date(),
        reactions: msg.reactions || [],
      }));
      allMessages.push(...remaining1);
    }
    
    // Add moderator summary if not shown yet
    if (phase === 'intro' || phase === 'round1' || phase === 'moderator-summary') {
      allMessages.push({
        id: 'moderator-summary',
        personaId: 'moderator',
        content: `${script.moderatorSummary}\n\n${script.round2Direction}`,
        timestamp: new Date(),
        reactions: [],
        isModeratorSummary: true,
      });
    }
    
    // Add round 2 messages
    const startIdx = phase === 'round2' ? messageIndex : 0;
    const remaining2 = script.round2Messages.slice(startIdx).map((msg, i) => ({
      id: `msg-round2-${startIdx + i}`,
      personaId: msg.personaId,
      content: msg.content,
      timestamp: new Date(),
      reactions: msg.reactions || [],
    }));
    allMessages.push(...remaining2);
    
    setMessages(prev => [...prev, ...allMessages]);
    setIsTyping(false);
    setCurrentSpeaker(null);
    setPhase('verdict');
    
    setTimeout(() => {
      setVerdict(script.judgeVerdict);
    }, 500);
  };

  const handlePersonaClick = (persona: typeof personas[0]) => {
    setSelectedPersona(persona);
    setIsPersonaModalOpen(true);
  };

  const currentTypingPersona = currentSpeaker ? getPersonaById(currentSpeaker) : null;
  const progress = script ? (getCompletedMessages() / getTotalMessages()) * 100 : 0;

  // Get phase label for display
  const getPhaseLabel = () => {
    switch (phase) {
      case 'intro': return 'Introduction';
      case 'round1': return 'Round 1';
      case 'moderator-summary': return 'Moderator Summary';
      case 'round2': return 'Round 2';
      case 'verdict': return 'Verdict';
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPaused(!isPaused)}
                disabled={!!verdict}
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSkipToVerdict}
                disabled={!!verdict}
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        {!verdict && (
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
            {messages.length === 0 && !isTyping ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="flex justify-center gap-4 mb-4">
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
                  <p className="text-muted-foreground">The jury is assembling...</p>
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
          {!verdict && (
            <div className="glass rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isPaused ? (
                  <span className="text-sm text-muted-foreground">Debate paused</span>
                ) : isTyping && currentTypingPersona ? (
                  <span className="text-sm text-muted-foreground">
                    <span className={cn('font-medium', `text-${currentTypingPersona.color}`)}>
                      {currentTypingPersona.name}
                    </span>
                    {' '}is typing...
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    {getPhaseLabel()} • {getCompletedMessages()} of {getTotalMessages()} arguments
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Settings className="w-3.5 h-3.5" />
                Speed: Normal
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
