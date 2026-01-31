export interface ClaimPair {
  id: number;
  claim: string;
  truth: string;
  topic?: string;
}

export type JuryPersonaType = 'skeptic' | 'academic' | 'journalist' | 'pragmatist' | 'ethicist';
export type ModeratorPersonaType = 'moderator';
export type PersonaType = JuryPersonaType | ModeratorPersonaType;

export interface Persona {
  id: PersonaType;
  name: string;
  role: string;
  avatar: string;
  color: string;
  description: string;
  strengths: string[];
  biases: string[];
  examplePhrases: string[];
  isJury: boolean;
}

export type ReactionType = 'thumbsUp' | 'thumbsDown';

export interface Reaction {
  personaId: PersonaType;
  type: ReactionType;
}

export interface Message {
  id: string;
  personaId: PersonaType;
  content: string;
  timestamp: Date;
  reactions: Reaction[];
  isModeratorSummary?: boolean;
}

export type VerdictType = 'faithful' | 'mutated' | 'ambiguous';

export interface Vote {
  personaId: JuryPersonaType;
  verdict: VerdictType;
  reasoning: string;
}

export interface JudgeVerdict {
  outcome: VerdictType;
  confidence: number;
  argumentsFor: string;
  argumentsAgainst: string;
  finalJudgement: string;
  juryVotes: Vote[];
}

// Legacy type for backwards compatibility
export interface Verdict {
  outcome: VerdictType;
  votes: Vote[];
  confidence: number;
  summary: string;
}

export interface DebateState {
  claimPair: ClaimPair;
  messages: Message[];
  currentSpeaker: PersonaType | null;
  isTyping: boolean;
  round: number;
  totalRounds: number;
  verdict: JudgeVerdict | null;
  isPaused: boolean;
}
