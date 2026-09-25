import fs from 'node:fs';
import {ArcadeRenderer} from 'pacman-contribution-graph';

const token = process.env.GITHUB_TOKEN;
if (!token) {
  throw new Error('Set GITHUB_TOKEN before generating the Pac-Man contribution graph.');
}

const renderer = new ArcadeRenderer({
  game: 'pacman',
  platform: 'github',
  username: 'thuan2172001',
  gameTheme: 'github-dark',
  playerStyle: 'opportunistic',
  githubSettings: {accessToken: token},
  svgCallback: (svg) => {
    fs.writeFileSync('../assets/pacman-contribution-graph.svg', svg);
    console.log('Updated ../assets/pacman-contribution-graph.svg');
  },
});

await renderer.start();
