import type { AnimationConfig } from '../types';

interface SandboxViewProps {
  animationConfig: AnimationConfig;
}

export function SandboxView({ animationConfig }: SandboxViewProps) {
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
      <h2 style={{ color: 'white', fontSize: '24px' }}>Sandbox View</h2>
      <p style={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', maxWidth: '600px' }}>
        This is a blank canvas for experimenting with new components or different contexts.
        Current animation config is available via props.
      </p>
      <div style={{
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        color: 'white'
      }}>
        <p>Animation Config:</p>
        <pre style={{ fontSize: '12px', opacity: 0.8 }}>
          {JSON.stringify(animationConfig, null, 2)}
        </pre>
      </div>
    </div>
  );
}
