import { motion } from 'framer-motion';
import { Persona } from '@/types/debate';
import { cn } from '@/lib/utils';

// Import avatar images
import skepticAvatar from '@/assets/avatars/skeptic.png';
import academicAvatar from '@/assets/avatars/academic.png';
import journalistAvatar from '@/assets/avatars/journalist.png';
import pragmatistAvatar from '@/assets/avatars/pragmatist.png';
import ethicistAvatar from '@/assets/avatars/ethicist.png';
import moderatorAvatar from '@/assets/avatars/moderator.png';

interface PersonaAvatarProps {
  persona: Persona;
  isActive?: boolean;
  isTyping?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
};

// Map persona IDs to avatar images
const avatarImages: Record<string, string> = {
  skeptic: skepticAvatar,
  academic: academicAvatar,
  journalist: journalistAvatar,
  pragmatist: pragmatistAvatar,
  ethicist: ethicistAvatar,
  moderator: moderatorAvatar,
};

// Dynamic color mapping based on persona color field
const getColorClasses = (colorId: string) => ({
  ring: `ring-${colorId}`,
  dot: `bg-${colorId}`,
  pulse: `bg-${colorId}/30`,
});

export function PersonaAvatar({ 
  persona, 
  isActive = false, 
  isTyping = false, 
  size = 'md',
  onClick 
}: PersonaAvatarProps) {
  const colors = getColorClasses(persona.color);
  const avatarSrc = avatarImages[persona.id] || avatarImages.moderator;
  
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'relative rounded-full flex items-center justify-center transition-all duration-300 overflow-hidden',
        sizeClasses[size],
        isActive && 'ring-2 ring-offset-2 ring-offset-background',
        isActive && colors.ring,
        onClick && 'cursor-pointer hover:scale-105'
      )}
      whileHover={onClick ? { scale: 1.05 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
    >
      <img 
        src={avatarSrc} 
        alt={persona.name}
        className="w-full h-full object-cover"
      />
      
      {/* Typing indicator */}
      {isTyping && (
        <motion.div
          className="absolute -bottom-1 -right-1 flex gap-0.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className={cn('w-1.5 h-1.5 rounded-full typing-dot', colors.dot)} />
          <span className={cn('w-1.5 h-1.5 rounded-full typing-dot', colors.dot)} />
          <span className={cn('w-1.5 h-1.5 rounded-full typing-dot', colors.dot)} />
        </motion.div>
      )}
      
      {/* Active pulse ring */}
      {isActive && (
        <motion.div
          className={cn('absolute inset-0 rounded-full', colors.pulse)}
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
}
