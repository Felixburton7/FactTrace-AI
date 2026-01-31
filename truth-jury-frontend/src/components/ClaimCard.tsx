import { motion } from 'framer-motion';
import { ArrowRight, FileText, AlertCircle } from 'lucide-react';
import { ClaimPair } from '@/types/debate';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ClaimCardProps {
  claim: ClaimPair;
  index: number;
  onSelect: (claim: ClaimPair) => void;
}

// Simple topic detection based on keywords
function detectTopic(text: string): { label: string; color: string; icon: string } {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('covid') || lowerText.includes('coronavirus') || lowerText.includes('pandemic') || lowerText.includes('death')) {
    return { label: 'Health', color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: '🏥' };
  }
  if (lowerText.includes('browser') || lowerText.includes('netflix') || lowerText.includes('download')) {
    return { label: 'Technology', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: '💻' };
  }
  if (lowerText.includes('movie') || lowerText.includes('film') || lowerText.includes('anime')) {
    return { label: 'Entertainment', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: '🎬' };
  }
  if (lowerText.includes('angels') || lowerText.includes('team')) {
    return { label: 'Sports', color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: '⚾' };
  }
  if (lowerText.includes('travel') || lowerText.includes('european')) {
    return { label: 'Travel', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: '✈️' };
  }
  
  return { label: 'General', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: '📄' };
}

export function ClaimCard({ claim, index, onSelect }: ClaimCardProps) {
  const topic = detectTopic(claim.claim);
  const truncatedClaim = claim.claim.length > 120 
    ? claim.claim.substring(0, 120) + '...' 
    : claim.claim;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <div className="glass-card rounded-2xl p-6 h-full flex flex-col transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            'px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5',
            topic.color
          )}>
            <span>{topic.icon}</span>
            {topic.label}
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            #{index + 1}
          </span>
        </div>

        {/* Claim text */}
        <div className="flex-1 mb-4">
          <div className="flex items-start gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              External Claim
            </span>
          </div>
          <p className="text-foreground leading-relaxed">
            {truncatedClaim}
          </p>
        </div>

        {/* Truth preview on hover */}
        <div className="mb-4 overflow-hidden">
          <div className="flex items-start gap-2 mb-2">
            <FileText className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Internal Fact
            </span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
            {claim.truth}
          </p>
        </div>

        {/* Action button */}
        <Button
          onClick={() => onSelect(claim)}
          className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 hover:border-primary/40 transition-all duration-300 group/btn"
        >
          <span>Start Debate</span>
          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </div>
    </motion.div>
  );
}
