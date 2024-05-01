import { makeScene2D, View2D } from '@motion-canvas/2d';
import { logoScene } from './base-scene';

export default makeScene2D(function* (view: View2D) {
	yield* logoScene(view, 2.25, 'WriteGames.com');
});
