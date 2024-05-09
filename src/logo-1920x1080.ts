import { makeProject } from '@motion-canvas/core';

import logoTall from './scenes/logo-stacked?scene';
import logoWide from './scenes/logo-wide?scene';

import './global.css';

export default makeProject({
	name: 'Logo (1920x1080)',
	scenes: [logoTall, logoWide],
});
