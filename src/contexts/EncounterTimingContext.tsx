import { createContext, useContext, ReactNode } from 'react';
import {
  getEncounterTimings,
  type EncounterAnimationSpeed,
  type EncounterAnimationTimings,
} from '../config/encounterAnimationConfig';

const EncounterTimingContext = createContext<EncounterAnimationTimings | null>(null);

interface EncounterTimingProviderProps {
  speed: EncounterAnimationSpeed;
  children: ReactNode;
}

export function EncounterTimingProvider({ speed, children }: EncounterTimingProviderProps) {
  const timings = getEncounterTimings(speed);

  return (
    <EncounterTimingContext.Provider value={timings}>
      {children}
    </EncounterTimingContext.Provider>
  );
}

export function useEncounterTimings(): EncounterAnimationTimings {
  const timings = useContext(EncounterTimingContext);

  if (!timings) {
    throw new Error('useEncounterTimings must be used within EncounterTimingProvider');
  }

  return timings;
}
