import type { AnimationConfig } from '../types';

interface VillageViewProps {
  animationConfig: AnimationConfig;
}

export function VillageView({ animationConfig }: VillageViewProps) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
      padding: '40px'
    }}>
      <h2 style={{ color: 'white', fontSize: '24px' }}>Village View</h2>
      <p style={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', maxWidth: '600px' }}>
        Welcome to the Village! This is where your card characters can interact and build a community.
      </p>
    </div>
  );
}
