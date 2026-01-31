import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Message, Reaction } from '@/types/debate';
import { Persona } from '@/types/debate';
import { PersonaAvatar } from './PersonaAvatar';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getPersonaById } from '@/data/personas';

interface ChatMessageProps {
  message: Message;
  persona: Persona;
  index: number;
  onPersonaClick: (persona: Persona) => void;
}

export function ChatMessage({ message, persona, index, onPersonaClick }: ChatMessageProps) {
  // Moderator on the right, jury on the left
  const isRightAligned = persona.id === 'moderator';
  const isJury = persona.id !== 'moderator';
  
  // Jury gets neutral bubble, moderator gets yellow
  const bubbleClass = isJury 
    ? 'bg-white/5 border-white/10' 
    : 'bg-moderator/10 border-moderator/20';
  const nameClass = `text-${persona.color}`;

  const reactions = message.reactions || [];
  const thumbsUpReactions = reactions.filter(r => r.type === 'thumbsUp');
  const thumbsDownReactions = reactions.filter(r => r.type === 'thumbsDown');

  const getReactorNames = (reactions: Reaction[]) => {
    return reactions
      .map(r => getPersonaById(r.personaId)?.name || r.personaId)
      .join(', ');
  };

  const hasReactions = thumbsUpReactions.length > 0 || thumbsDownReactions.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={cn(
        'flex flex-col max-w-[85%]',
        isRightAligned ? 'ml-auto items-end' : 'mr-auto items-start'
      )}
    >
      {/* Header: Avatar + Name + Time (WhatsApp style) */}
      <div className={cn(
        'flex items-center gap-2 mb-1',
        isRightAligned ? 'flex-row-reverse' : ''
      )}>
        <PersonaAvatar
          persona={persona}
          size="sm"
          onClick={() => onPersonaClick(persona)}
        />
        <span className={cn('font-semibold text-sm', nameClass)}>
          {persona.name}
        </span>
        <span className="text-xs text-muted-foreground">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Message bubble with attached reactions */}
      <div className={cn(
        'relative',
        isRightAligned ? 'mr-10' : 'ml-10'
      )}>
        <div className={cn(
          'rounded-2xl px-4 py-2.5 border',
          bubbleClass,
          isRightAligned ? 'rounded-tr-sm' : 'rounded-tl-sm'
        )}>
          <p className="text-sm text-foreground/90 leading-relaxed">
            {message.content}
          </p>
        </div>

        {/* Reactions - attached to bubble bottom (WhatsApp style) */}
        {hasReactions && (
          <TooltipProvider delayDuration={200}>
            <div className={cn(
              'flex items-center gap-1 mt-1',
              isRightAligned ? 'justify-end' : 'justify-start'
            )}>
              {thumbsUpReactions.length > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 cursor-default hover:bg-emerald-500/25 transition-colors">
                      <ThumbsUp className="w-3 h-3 text-emerald-400" />
                      <span className="text-xs text-emerald-400 font-medium">
                        {thumbsUpReactions.length}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    {getReactorNames(thumbsUpReactions)}
                  </TooltipContent>
                </Tooltip>
              )}

              {thumbsDownReactions.length > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/25 cursor-default hover:bg-red-500/25 transition-colors">
                      <ThumbsDown className="w-3 h-3 text-red-400" />
                      <span className="text-xs text-red-400 font-medium">
                        {thumbsDownReactions.length}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    {getReactorNames(thumbsDownReactions)}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </TooltipProvider>
        )}
      </div>
    </motion.div>
  );
}
