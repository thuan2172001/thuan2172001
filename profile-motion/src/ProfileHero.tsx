import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const BG = '#07111f';
const PANEL = '#0b1627';
const GRID = 'rgba(77,159,255,.10)';
const BLUE = '#4D9FFF';
const MINT = '#00FF94';
const PURPLE = '#A855F7';
const TEXT = '#F8FAFC';
const MUTED = '#94A3B8';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const typeText = (value: string, frame: number, start: number, speed = 1.8) => {
  const count = Math.max(0, Math.floor((frame - start) / speed));
  return value.slice(0, count);
};

const DotGrid: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      opacity: 0.7,
      backgroundImage: `radial-gradient(circle, ${GRID} 1.4px, transparent 1.4px)`,
      backgroundSize: '28px 28px',
    }}
  />
);

const Terminal: React.FC<{frame: number; opacity: number}> = ({frame, opacity}) => {
  const lines = [
    {prompt: '$', text: ' whoami', start: 4, color: MINT},
    {prompt: '>', text: ' Leo Trinh', start: 22, color: TEXT},
    {prompt: '$', text: ' build --focus', start: 38, color: MINT},
    {prompt: '>', text: ' systems  ai  cloud  tools', start: 58, color: BLUE},
  ];
  return (
    <div
      style={{
        position: 'absolute',
        left: 64,
        top: 62,
        width: 500,
        height: 236,
        borderRadius: 20,
        border: '1px solid #243b5a',
        background: 'rgba(5,12,23,.94)',
        boxShadow: '0 20px 60px rgba(0,0,0,.38)',
        overflow: 'hidden',
        opacity,
      }}
    >
      <div
        style={{
          height: 42,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '0 18px',
          borderBottom: '1px solid #1d314c',
          background: '#0b1422',
        }}
      >
        {[MINT, BLUE, PURPLE].map((c) => (
          <div key={c} style={{width: 10, height: 10, borderRadius: 99, background: c}} />
        ))}
        <div style={{marginLeft: 10, fontFamily: 'monospace', color: MUTED, fontSize: 14}}>
          leo@systems:~
        </div>
      </div>
      <div style={{padding: '24px 26px', fontFamily: 'monospace', fontSize: 20, lineHeight: 1.75}}>
        {lines.map((line) => (
          <div key={line.start} style={{color: line.color, minHeight: 35}}>
            <span style={{color: line.prompt === '$' ? MINT : PURPLE}}>{line.prompt}</span>
            {typeText(line.text, frame, line.start)}
          </div>
        ))}
        <span
          style={{
            display: 'inline-block',
            width: 12,
            height: 3,
            background: MINT,
            opacity: Math.floor(frame / 8) % 2 ? 0.2 : 1,
          }}
        />
      </div>
    </div>
  );
};

const Node: React.FC<{
  x: number;
  y: number;
  label: string;
  accent: string;
  progress: number;
  small?: boolean;
}> = ({x, y, label, accent, progress, small}) => {
  const s = interpolate(progress, [0, 1], [0.75, 1], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${s})`,
        opacity: progress,
        minWidth: small ? 130 : 160,
        height: small ? 48 : 58,
        padding: '0 18px',
        borderRadius: 14,
        border: `1.5px solid ${accent}`,
        background: PANEL,
        color: TEXT,
        fontFamily: 'Arial, sans-serif',
        fontWeight: 800,
        fontSize: small ? 16 : 18,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 0 26px ${accent}22`,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </div>
  );
};

const Network: React.FC<{frame: number; opacity: number}> = ({frame, opacity}) => {
  const {fps} = useVideoConfig();
  const reveal = spring({frame: frame - 58, fps, config: {damping: 18, stiffness: 115}});
  const endpoints = [
    {x: 900, y: 86, label: 'Backend Systems', color: BLUE},
    {x: 1040, y: 155, label: 'AI Automation', color: PURPLE},
    {x: 1015, y: 252, label: 'Cloud Infra', color: MINT},
    {x: 820, y: 286, label: 'Developer Tools', color: '#36D5F0'},
  ];

  return (
    <div style={{position: 'absolute', inset: 0, opacity}}>
      <svg width="1200" height="360" style={{position: 'absolute', inset: 0}}>
        {endpoints.map((n, i) => {
          const p = interpolate(reveal, [0.15 + i * 0.08, 0.55 + i * 0.08], [0, 1], clamp);
          const x1 = 730;
          const y1 = 180;
          const x2 = x1 + (n.x - x1) * p;
          const y2 = y1 + (n.y - y1) * p;
          const packet = ((frame * 4 + i * 57) % 100) / 100;
          return (
            <g key={n.label}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={n.color} strokeWidth={2} opacity={0.55} />
              {p > 0.72 ? (
                <circle
                  cx={x1 + (n.x - x1) * packet}
                  cy={y1 + (n.y - y1) * packet}
                  r={4}
                  fill={n.color}
                />
              ) : null}
            </g>
          );
        })}
      </svg>
      <Node x={730} y={180} label="LEO" accent={MINT} progress={reveal} />
      {endpoints.map((n, i) => (
        <Node
          key={n.label}
          x={n.x}
          y={n.y}
          label={n.label}
          accent={n.color}
          progress={interpolate(reveal, [0.3 + i * 0.07, 0.7 + i * 0.07], [0, 1], clamp)}
          small
        />
      ))}
      <div
        style={{
          position: 'absolute',
          left: 650,
          top: 34,
          width: 460,
          color: MUTED,
          fontFamily: 'monospace',
          fontSize: 14,
          letterSpacing: 2.2,
          opacity: reveal,
        }}
      >
        SYSTEM MAP / LIVE PACKETS / BUILD → DEPLOY → SCALE
      </div>
    </div>
  );
};

const Finale: React.FC<{frame: number; opacity: number}> = ({frame, opacity}) => {
  const lift = interpolate(frame, [118, 150], [24, 0], clamp);
  const line = interpolate(frame, [128, 154], [0, 520], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity,
        transform: `translateY(${lift}px)`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingLeft: 72,
      }}
    >
      <div style={{fontFamily: 'monospace', fontSize: 18, color: MINT, letterSpacing: 2.6, marginBottom: 12}}>
        DEVELOPER → ENGINEER → BUILDER
      </div>
      <div style={{fontFamily: 'Arial, sans-serif', fontWeight: 950, fontSize: 68, letterSpacing: -2, color: TEXT}}>
        TRINH VAN <span style={{color: BLUE}}>THUAN</span>
      </div>
      <div style={{height: 4, width: line, marginTop: 14, background: `linear-gradient(90deg,${BLUE},${MINT},${PURPLE})`, borderRadius: 5}} />
      <div style={{fontFamily: 'Arial, sans-serif', fontSize: 23, fontWeight: 700, color: '#D7DFEA', marginTop: 18}}>
        Backend & Systems Engineer <span style={{color: BLUE}}>•</span> Full-Stack Developer
      </div>
      <div style={{fontFamily: 'monospace', fontSize: 18, color: MUTED, marginTop: 18, letterSpacing: 1.4}}>
        Build <span style={{color: MINT}}>•</span> Measure <span style={{color: BLUE}}>•</span> Improve <span style={{color: PURPLE}}>•</span> Ship
      </div>
    </div>
  );
};

export const ProfileHero: React.FC = () => {
  const frame = useCurrentFrame();

  const terminalOpacity = interpolate(frame, [0, 10, 82, 110], [0, 1, 1, 0], clamp);
  const networkOpacity = interpolate(frame, [48, 72, 120, 142], [0, 1, 1, 0], clamp);
  const finaleOpacity = interpolate(frame, [118, 140, 168, 179], [0, 1, 1, 0], clamp);
  const enter = interpolate(frame, [0, 8], [0, 1], clamp);

  return (
    <AbsoluteFill style={{background: BG, color: TEXT, overflow: 'hidden', opacity: enter}}>
      <DotGrid />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 88% 12%, rgba(168,85,247,.16), transparent 28%), radial-gradient(circle at 8% 94%, rgba(0,255,148,.11), transparent 28%)',
        }}
      />
      <Terminal frame={frame} opacity={terminalOpacity} />
      <Network frame={frame} opacity={networkOpacity} />
      <Finale frame={frame} opacity={finaleOpacity} />
      <div
        style={{
          position: 'absolute',
          right: 28,
          bottom: 18,
          fontFamily: 'monospace',
          fontSize: 12,
          color: '#53657c',
          letterSpacing: 1.5,
        }}
      >
        CODE / AUTOMATE / SCALE / CREATE / REPEAT
      </div>
    </AbsoluteFill>
  );
};
