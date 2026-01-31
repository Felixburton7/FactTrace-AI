import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Persona } from '@/types/debate';
import { cn } from '@/lib/utils';

// Import avatar images directly
import skepticAvatar from '@/assets/avatars/skeptic.png';
import academicAvatar from '@/assets/avatars/academic.png';
import journalistAvatar from '@/assets/avatars/journalist.png';
import pragmatistAvatar from '@/assets/avatars/pragmatist.png';
import ethicistAvatar from '@/assets/avatars/ethicist.png';
import moderatorAvatar from '@/assets/avatars/moderator.png';

interface PersonaModalProps {
  persona: Persona | null;
  isOpen: boolean;
  onClose: () => void;
}

const avatarImages: Record<string, string> = {
  skeptic: skepticAvatar,
  academic: academicAvatar,
  journalist: journalistAvatar,
  pragmatist: pragmatistAvatar,
  ethicist: ethicistAvatar,
  moderator: moderatorAvatar,
};

export function PersonaModal({ persona, isOpen, onClose }: PersonaModalProps) {
  if (!persona) return null;

  const nameClass = `text-${persona.color}`;
  const avatarSrc = avatarImages[persona.id] || avatarImages.moderator;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-background/70 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Centered popup card */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', duration: 0.4 }}
          >
            <div className="glass-card rounded-2xl p-8 border border-white/10 text-center relative w-full max-w-sm">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>

              {/* Large centered avatar */}
              <div className="flex justify-center mb-6">
                <div className="w-28 h-28 rounded-full overflow-hidden">
                  <img 
                    src={avatarSrc} 
                    alt={persona.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Name & Role */}
              <h2 className={cn('text-2xl font-bold mb-1', nameClass)}>
                {persona.name}
              </h2>
              <p className="text-sm text-muted-foreground mb-5">{persona.role}</p>

              {/* Bio */}
              <p className="text-base text-foreground/80 leading-relaxed">
                {persona.description}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
