import { Txt, View2D } from '@motion-canvas/2d';
import { all, createRef, waitFor } from '@motion-canvas/core';

export const logoScene = function* (
	view: View2D,
	scale: number,
	string: string,
) {
	const parts = string.split('\n');
	const rawLetters = parts.join('').split('');
	const isWide = parts.length === 1;

	// add newlines & invisible symbols to position each letter, to simplify
	// vertical offsets when rendering
	const invisible = '\u2063';
	const toReplace = Array.from({ length: parts.length }, () => invisible);
	const letters = parts
		.map((part, partIndex) => {
			return part.split('').map((c) => {
				const str = [...toReplace];
				str[partIndex] = c;
				return str.join('\n');
			});
		})
		.flat();

	const fontSize = 80 * scale;
	const lineHeight = fontSize * 0.8;

	// NOTE: I computed all the hardcoded values at a scale of 2.5, oops
	const scaleAdjust = (v: number) => (v / 2.5) * scale;

	const offsets = [
		// Write
		[-724.625, -589, -517.75, -447, -349.875],
		// Games
		[-214, -73.25, 76, 220.75, 325.25],
		// .com
		[404.75, 484.5, 591, 738.25],
	]
		.flat()
		.map(scaleAdjust);

	// X offsets
	let horizontalAlignOffset = 0;
	if (!isWide) {
		const writeOffset = 493;
		const gamesOffset = -40;
		const comOffset = -707.5;

		horizontalAlignOffset = 8;
		const xOffset = [writeOffset, gamesOffset, comOffset]
			.map((v) => v + horizontalAlignOffset)
			.map(scaleAdjust);

		let index = 0;
		parts.forEach((part, i) => {
			part.split('').forEach(() => {
				offsets[index] += xOffset[i];
				++index;
			});
		});
	}

	const lines = [
		// Write
		[1250, 280, 280, 450, 680],
		// Games
		[900, 320, 350, 680, 490],
		// .com
		[150, 420, 350, 350],
	].flat();

	const segments = [
		// Write
		[3, 3, 3, 5, 3],
		// Games
		[3, 3, 3, 3, 3],
		// .com
		[3, 3, 3, 3],
	].flat();

	const maxLine = Math.max(...lines);

	const textRefs = Array.from({ length: rawLetters.length }, () =>
		createRef<Txt>(),
	);

	// const textRef = createRef<Txt>();

	view.add(
		<>
			{/*<Txt
				ref={textRef}
				fontSize={fontSize}
				fontWeight={900}
				text={string}
				x={scaleAdjust(horizontalAlignOffset)}
				fontFamily={'Outfit'}
				lineHeight={lineHeight}
				fill={'#ffffff00'}
				stroke={'#000080'}
			/>*/}
			{letters.map((l, i) => (
				<Txt
					ref={textRefs[i]}
					fontSize={fontSize}
					fontWeight={900}
					lineHeight={lineHeight}
					text={l}
					x={offsets[i]}
					fontFamily={'Outfit'}
					fill={'#ffffff00'}
					stroke={'#000080'}
					lineWidth={1 * scale}
					lineDash={[0, lines[i] / segments[i]]}
					lineDashOffset={-100}
				/>
			))}
		</>,
	);

	const TOTAL_DIR = 3;
	const yields = letters.map((_, i) => {
		return function* thing() {
			const ref = textRefs[i]();

			const outline = function* () {
				const rawStrokeDir = Math.max(0.6, lines[i] / maxLine);
				const strokeDir = rawStrokeDir * TOTAL_DIR;
				yield* waitFor(Math.sign(i % 5) * 0.4);
				yield* ref.lineDash([lines[i], 0], strokeDir + 0.05 * i);
			};

			const fade = function* () {
				const dir = TOTAL_DIR + 0.03 * letters.length * 0.75;
				const wait = 0.6 * TOTAL_DIR;
				yield* waitFor(wait);
				yield* ref.fill('#ffffffff', dir - wait);
			};

			yield* all(outline(), fade());
		};
	});

	yield* all(...yields.map((f) => f()));
};
