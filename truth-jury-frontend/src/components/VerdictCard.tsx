import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, HelpCircle, ChevronRight } from 'lucide-react';
import { JudgeVerdict, VerdictType } from '@/types/debate';
import { getPersonaById } from '@/data/personas';
import { PersonaAvatar } from './PersonaAvatar';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface VerdictCardProps {
  verdict: JudgeVerdict;
  onExploreAnother: () => void;
}

const verdictConfig: Record<VerdictType, {
  label: string;
  icon: typeof CheckCircle2;
  color: string;
  bgColor: string;
  borderColor: string;
}> = {
  faithful: {
    label: 'FAITHFUL',
    icon: CheckCircle2,
    color: 'text-faithful',
    bgColor: 'bg-faithful/10',
    borderColor: 'border-faithful/30',
  },
  mutated: {
    label: 'MUTATED',
    icon: XCircle,
    color: 'text-mutated',
    bgColor: 'bg-mutated/10',
    borderColor: 'border-mutated/30',
  },
  ambiguous: {
    label: 'AMBIGUOUS',
    icon: HelpCircle,
    color: 'text-ambiguous',
    bgColor: 'bg-ambiguous/10',
    borderColor: 'border-ambiguous/30',
  },
};

const voteColorClasses: Record<VerdictType, string> = {
  faithful: 'bg-faithful/20 text-faithful border-faithful/30',
  mutated: 'bg-mutated/20 text-mutated border-mutated/30',
  ambiguous: 'bg-ambiguous/20 text-ambiguous border-ambiguous/30',
};

export function VerdictCard({ verdict, onExploreAnother }: VerdictCardProps) {
  const config = verdictConfig[verdict.outcome];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className={cn(
        'glass-card rounded-2xl p-6 border',
        config.borderColor
      )}
    >
      {/* Header - Simplified */}
      <div className="flex items-center gap-4 mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className={cn(
            'w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0',
            config.bgColor
          )}
        >
          <Icon className={cn('w-7 h-7', config.color)} />
        </motion.div>
        
        <div className="flex-1">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xs uppercase tracking-widest text-muted-foreground mb-1"
          >
            Judge Verdict
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={cn('text-2xl font-bold tracking-tight', config.color)}
          >
            {config.label}
          </motion.h2>
        </div>

        {/* Confidence */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-right"
        >
          <p className="text-xs text-muted-foreground">Confidence</p>
          <p className={cn('text-xl font-bold', config.color)}>{verdict.confidence}%</p>
        </motion.div>
      </div>

      {/* Arguments For & Against */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid md:grid-cols-2 gap-4 mb-6"
      >
        <div className="p-4 rounded-xl bg-faithful/5 border border-faithful/20">
          <p className="text-xs uppercase tracking-wider text-faithful mb-2 font-medium">Arguments For</p>
          <p className="text-sm text-foreground/80 leading-relaxed">{verdict.argumentsFor}</p>
        </div>
        <div className="p-4 rounded-xl bg-mutated/5 border border-mutated/20">
          <p className="text-xs uppercase tracking-wider text-mutated mb-2 font-medium">Arguments Against</p>
          <p className="text-sm text-foreground/80 leading-relaxed">{verdict.argumentsAgainst}</p>
        </div>
      </motion.div>

      {/* Final Judgement */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mb-6 p-4 rounded-xl bg-muted/30 border border-border"
      >
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2 font-medium">Final Judgement</p>
        <p className="text-sm text-foreground/90 leading-relaxed">{verdict.finalJudgement}</p>
      </motion.div>

      {/* Jury Votes - Compact */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mb-6"
      >
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3 font-medium">Jury Votes</p>
        <div className="flex flex-wrap gap-2">
          {verdict.juryVotes.map((vote) => {
            const persona = getPersonaById(vote.personaId);
            if (!persona) return null;
            return (
              <div
                key={vote.personaId}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border"
              >
                <PersonaAvatar persona={persona} size="sm" />
                <span className="text-xs text-foreground/70">{persona.name}</span>
                <span className={cn(
                  'text-xs font-medium px-2 py-0.5 rounded-full border',
                  voteColorClasses[vote.verdict]
                )}>
                  {vote.verdict}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Action */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <Button
          onClick={onExploreAnother}
          className="w-full bg-primary hover:bg-primary/90"
        >
          Explore Another Claim
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </motion.div>
    </motion.div>
  );
}
