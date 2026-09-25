import React from 'react';
import {Composition} from 'remotion';
import {ProfileHero} from './ProfileHero';

export const Root: React.FC = () => (
  <Composition
    id="ProfileHero"
    component={ProfileHero}
    durationInFrames={180}
    fps={30}
    width={1200}
    height={360}
  />
);
