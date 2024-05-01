import { makeProject } from '@motion-canvas/core';

import logoTall from './scenes/logo-stacked?scene';
import logoWide from './scenes/logo-wide?scene';

import './global.css';

export default makeProject({
	scenes: [logoTall, logoWide],
});
