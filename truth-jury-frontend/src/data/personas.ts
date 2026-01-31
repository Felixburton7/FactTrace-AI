import { Persona, PersonaType, JuryPersonaType } from '@/types/debate';

export const personas: Persona[] = [
  // Jury Members (5)
  {
    id: 'skeptic',
    name: 'The Skeptic',
    role: 'Devil\'s Advocate',
    avatar: '🔥',
    color: 'skeptic',
    description: 'Assumes the claim is false until proven otherwise. Highlights missing context, challenges numbers and phrasing.',
    strengths: [
      'Critical thinking under pressure',
      'Identifying logical fallacies',
      'Questioning assumptions'
    ],
    biases: [
      'May be overly cynical',
      'Tends to doubt authority'
    ],
    examplePhrases: [
      '"That\'s a bold claim. Show me the receipts."',
      '"What are they conveniently leaving out?"'
    ],
    isJury: true,
  },
  {
    id: 'academic',
    name: 'The Academic',
    role: 'Research Scholar',
    avatar: '📚',
    color: 'academic',
    description: 'Approaches claims with scholarly rigor. Demands peer-reviewed sources and methodological transparency.',
    strengths: [
      'Deep research methodology',
      'Statistical literacy',
      'Historical context awareness'
    ],
    biases: [
      'May dismiss non-academic sources',
      'Can be slow to reach conclusions'
    ],
    examplePhrases: [
      '"What does the literature say about this?"',
      '"The sample size here is concerning."'
    ],
    isJury: true,
  },
  {
    id: 'journalist',
    name: 'The Journalist',
    role: 'Investigative Reporter',
    avatar: '📰',
    color: 'journalist',
    description: 'Follows the story wherever it leads. Focuses on who, what, when, where, and why. Seeks primary sources.',
    strengths: [
      'Source verification',
      'Narrative analysis',
      'Detecting spin and framing'
    ],
    biases: [
      'May sensationalize findings',
      'Deadline-driven thinking'
    ],
    examplePhrases: [
      '"Who benefits from this claim?"',
      '"Let me trace this back to the original source."'
    ],
    isJury: true,
  },
  {
    id: 'pragmatist',
    name: 'The Pragmatist',
    role: 'Real-World Analyst',
    avatar: '⚙️',
    color: 'pragmatist',
    description: 'Focuses on practical implications. Asks whether the claim matters in the real world and who it affects.',
    strengths: [
      'Practical impact assessment',
      'Cost-benefit analysis',
      'Stakeholder awareness'
    ],
    biases: [
      'May ignore theoretical concerns',
      'Can be too utilitarian'
    ],
    examplePhrases: [
      '"But does this actually matter in practice?"',
      '"Who gets hurt if this is wrong?"'
    ],
    isJury: true,
  },
  {
    id: 'ethicist',
    name: 'The Ethicist',
    role: 'Moral Compass',
    avatar: '⚖️',
    color: 'ethicist',
    description: 'Evaluates claims through ethical frameworks. Considers intent, harm, and the responsibility of truth-telling.',
    strengths: [
      'Moral reasoning',
      'Intent analysis',
      'Harm assessment'
    ],
    biases: [
      'May moralize excessively',
      'Can be idealistic'
    ],
    examplePhrases: [
      '"What was the intent behind this claim?"',
      '"Truth matters even if the harm seems small."'
    ],
    isJury: true,
  },
  // Moderator (1)
  {
    id: 'moderator',
    name: 'The Moderator',
    role: 'Debate Facilitator',
    avatar: '🎙️',
    color: 'moderator',
    description: 'Guides the discussion, summarizes key points, and steers the conversation toward productive analysis.',
    strengths: [
      'Synthesis of arguments',
      'Neutral facilitation',
      'Identifying common ground'
    ],
    biases: [
      'May seek consensus too early',
      'Can oversimplify debates'
    ],
    examplePhrases: [
      '"Let me summarize what we\'ve heard so far..."',
      '"For round two, let\'s focus on..."'
    ],
    isJury: false,
  },
];

export const juryPersonas = personas.filter(p => p.isJury);
export const moderatorPersona = personas.find(p => p.id === 'moderator')!;

export const getPersonaById = (id: PersonaType): Persona | undefined => {
  return personas.find(p => p.id === id);
};

export const getJuryPersonaById = (id: JuryPersonaType): Persona | undefined => {
  return juryPersonas.find(p => p.id === id);
};
