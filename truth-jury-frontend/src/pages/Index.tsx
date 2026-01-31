import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Papa from 'papaparse';
import { Search, Filter, Sparkles, Users, Eye, Wifi, WifiOff, Zap, Play } from 'lucide-react';
import { ClaimPair } from '@/types/debate';
import { ClaimCard } from '@/components/ClaimCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { healthCheck } from '@/lib/api';

export default function Index() {
  const navigate = useNavigate();
  const [claims, setClaims] = useState<ClaimPair[]>([]);
  const [filteredClaims, setFilteredClaims] = useState<ClaimPair[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);
  const [useDemoMode, setUseDemoMode] = useState(false);

  // Check API availability on mount
  useEffect(() => {
    healthCheck().then(available => {
      setApiAvailable(available);
      // If API is not available, default to demo mode
      if (!available) {
        setUseDemoMode(true);
      }
    });
  }, []);

  useEffect(() => {
    // Load and parse CSV
    fetch('/data/Polaris.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            const parsedClaims: ClaimPair[] = results.data
              .filter((row: any) => row.claim && row.truth)
              .map((row: any, index: number) => ({
                id: index,
                claim: row.claim,
                truth: row.truth,
              }));
            setClaims(parsedClaims);
            setFilteredClaims(parsedClaims);
            setIsLoading(false);
          },
        });
      })
      .catch(err => {
        console.error('Error loading CSV:', err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredClaims(claims);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredClaims(
        claims.filter(
          c => c.claim.toLowerCase().includes(query) || c.truth.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, claims]);

  const handleSelectClaim = (claim: ClaimPair) => {
    const route = useDemoMode ? `/demo/${claim.id}` : `/debate/${claim.id}`;
    navigate(route, { state: { claim } });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative">
        <div className="container mx-auto px-4 pt-16 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
            >
              <Sparkles className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">FactTrace Hackathon @ Cambridge</span>
            </motion.div>

            {/* Title - Simple and bold */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-foreground"
            >
              The Agentic Consensus Challenge
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10"
            >
              Select a claim to see our AI jury debate whether it's a faithful representation of
              the source fact — or a mutation.
            </motion.p>

            {/* Feature badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-6 mb-6"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span className="text-sm">Multi-agent deliberation</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span className="text-sm">Transparent reasoning</span>
              </div>
            </motion.div>

            {/* Mode Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-4"
            >
              {/* API Status */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                {apiAvailable === null ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                    <span className="text-xs text-muted-foreground">Checking API...</span>
                  </>
                ) : apiAvailable ? (
                  <>
                    <Wifi className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-500">Backend Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 text-red-500" />
                    <span className="text-xs text-red-500">Backend Offline</span>
                  </>
                )}
              </div>

              {/* Mode Toggle Buttons */}
              <div className="flex gap-1 p-1 rounded-lg bg-white/5 border border-white/10">
                <Button
                  variant={!useDemoMode ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setUseDemoMode(false)}
                  disabled={!apiAvailable}
                  className="gap-1.5 text-xs"
                >
                  <Zap className="w-3 h-3" />
                  Live
                </Button>
                <Button
                  variant={useDemoMode ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setUseDemoMode(true)}
                  className="gap-1.5 text-xs"
                >
                  <Play className="w-3 h-3" />
                  Demo
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Claims Section */}
      <section className="relative container mx-auto px-4 pb-24">
        {/* Search and filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search claims..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-card border-border"
            />
          </div>
          <Button
            variant="outline"
            className="h-12 px-6 gap-2"
          >
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </motion.div>

        {/* Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-xl p-4 mb-8 flex items-start gap-3"
        >
          <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Pro tip:</span> Pick cases that spark debate—
            ambiguous wording, missing context, or subtle numerical shifts make for interesting jury deliberations.
          </p>
        </motion.div>

        {/* Claims grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 h-64 animate-pulse">
                <div className="h-6 bg-muted rounded-full w-20 mb-4" />
                <div className="h-4 bg-muted rounded w-full mb-2" />
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredClaims.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-muted-foreground text-lg">No claims found matching your search.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClaims.map((claim, index) => (
              <ClaimCard
                key={claim.id}
                claim={claim}
                index={index}
                onSelect={handleSelectClaim}
              />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Built for the FactTrace Hackathon @ University of Cambridge</p>
        </div>
      </footer>
    </div>
  );
}
