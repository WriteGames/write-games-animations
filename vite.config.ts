import { defineConfig } from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';
import ffmpeg from '@motion-canvas/ffmpeg';

export default defineConfig({
	plugins: [
		motionCanvas({
			project: ['./src/logo-1920x1080.ts', './src/logo-1080x1920.ts'],
		}),
		ffmpeg(),
	],
});
