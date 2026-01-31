import { motion } from 'framer-motion';
import { Persona } from '@/types/debate';
import { PersonaAvatar } from './PersonaAvatar';
import { cn } from '@/lib/utils';

interface TypingIndicatorProps {
  persona: Persona;
  isRightAligned?: boolean;
}

export function TypingIndicator({ persona, isRightAligned = false }: TypingIndicatorProps) {
  const isJury = persona.id !== 'moderator';
  
  // Jury gets neutral bubble, moderator gets yellow
  const bubbleClass = isJury 
    ? 'bg-white/5 border-white/10' 
    : 'bg-moderator/10 border-moderator/20';
  const dotClass = `bg-${persona.color}`;
  const textClass = `text-${persona.color}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        'flex flex-col max-w-[85%]',
        isRightAligned ? 'ml-auto items-end' : 'mr-auto items-start'
      )}
    >
      {/* Header: Avatar + Name (WhatsApp style) */}
      <div className={cn(
        'flex items-center gap-2 mb-1',
        isRightAligned ? 'flex-row-reverse' : ''
      )}>
        <PersonaAvatar persona={persona} size="sm" isTyping />
        <span className={cn('text-sm font-semibold', textClass)}>
          {persona.name}
        </span>
      </div>

      {/* Typing bubble */}
      <div className={cn(
        isRightAligned ? 'mr-10' : 'ml-10'
      )}>
        <div className={cn(
          'rounded-2xl px-4 py-2.5 border',
          bubbleClass,
          isRightAligned ? 'rounded-tr-sm' : 'rounded-tl-sm'
        )}>
          <div className="flex items-center gap-1.5">
            <motion.span
              className={cn('w-2 h-2 rounded-full', dotClass)}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
            />
            <motion.span
              className={cn('w-2 h-2 rounded-full', dotClass)}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
            />
            <motion.span
              className={cn('w-2 h-2 rounded-full', dotClass)}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
