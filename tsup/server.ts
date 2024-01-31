import type { Options } from '.';
import { globSync } from 'glob';
import {
	DIR_SRC,
	DIR_SRC_ASSETS,
	DIR_SRC_STATIC
} from './constants';


export default function buildServerConfig(): Options {
	const GLOB_EXTENSIONS_SERVER = '{ts,js}';
	const FILES_SERVER = globSync(
		`${DIR_SRC}/**/*.${GLOB_EXTENSIONS_SERVER}`,
		{
			absolute: false,
			ignore: globSync(`${DIR_SRC_ASSETS}/**/*.${GLOB_EXTENSIONS_SERVER}`).concat(
				globSync(`${DIR_SRC_STATIC}/**/*.${GLOB_EXTENSIONS_SERVER}`)
			)
		}
	).map(s => s.replaceAll('\\', '/'));
	// print(FILES_SERVER, { maxItems: Infinity });

	return {
		bundle: true, // Needed to bundle @enonic/js-utils
		dts: false, // d.ts files are use useless at runtime
		entry: FILES_SERVER,
		env: {
			BROWSER_SYNC_PORT: '3000',
		},
		esbuildOptions(options, context) {
			// If you have libs with chunks, use this to avoid collisions
			options.chunkNames = '_chunks/[name]-[hash]';

			options.mainFields = ['module', 'main'];
		},
		external: [
			'/lib/cache',
			'/lib/enonic/static',
			'/lib/http-client',
			'/lib/mustache',
			'/lib/thymeleaf',
			/^\/lib\/xp\//,
		],
		format: 'cjs',

		minify: false, // Minifying server files makes debugging harder

		// TIP: Command to check if there are any bad requires left behind
		// grep -r 'require("' build/resources/main | grep -v 'require("/'|grep -v chunk
		noExternal: [
			/^@enonic\/js-utils.*$/
		],

		platform: 'neutral',
		silent: ['QUIET', 'WARN'].includes(process.env.LOG_LEVEL_FROM_GRADLE||''),
		shims: false, // https://tsup.egoist.dev/#inject-cjs-and-esm-shims
		splitting: true,
		sourcemap: false,
		target: 'es5'
	};
}

