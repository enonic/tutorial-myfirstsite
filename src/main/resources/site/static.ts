import type {
	Request,
	Response,
} from '/index.d';

import {
	getSite,
	pageUrl as getPageUrl,
} from '/lib/xp/portal';
// @ts-expect-error TS2307: Cannot find module '/lib/enonic/static' or its corresponding type declarations.
import {buildGetter} from '/lib/enonic/static';
import ioResource from '../lib/ioResource';
import {IS_DEV_MODE} from '../lib/runMode';

import {
	FILEPATH_MANIFEST_CJS,
	FILEPATH_MANIFEST_ESM,
	GETTER_ROOT,
} from '/constants';

type UrlPostfixParams = {
	manifestPath?: string
	path: string,
};

type UrlParams = UrlPostfixParams & {urlPrefix: string};

const manifests = {
	[FILEPATH_MANIFEST_CJS]: ioResource(FILEPATH_MANIFEST_CJS),
	[FILEPATH_MANIFEST_ESM]: ioResource(FILEPATH_MANIFEST_ESM)
}

const getImmutableUrl = ({
	manifestPath = FILEPATH_MANIFEST_ESM,
	path,
	urlPrefix
}: UrlParams) => {
	if (IS_DEV_MODE) {
		manifests[manifestPath] = ioResource(manifestPath);
	}

	return `${urlPrefix}/${GETTER_ROOT}/${manifests[manifestPath][path]}`;
}

export const getStaticAssetUrl = (path: string) => {
	const sitePath = getSite()._path;
	let urlPrefix = getPageUrl({
		path: sitePath
	});
	if (urlPrefix === '/') {
		urlPrefix = '';
	}

	return getImmutableUrl({
		manifestPath: FILEPATH_MANIFEST_CJS,
		path,
		urlPrefix
	});
}

const staticGetter = buildGetter({
	etag: false, // default is true in production and false in development
	getCleanPath: (request: Request) => {
		let rawPathParts = request.rawPath.split('/');
		if (rawPathParts[1] === 'admin') {
			rawPathParts = rawPathParts.slice(7)
		} else if (rawPathParts[1] === 'site') {
			rawPathParts = rawPathParts.slice(5)
		} else {
			throw new Error(`Invalid rawPath: ${request.rawPath}`);
		}

		const r = rawPathParts.shift(); // Remove ROOT
		if (r !== GETTER_ROOT) {
			throw new Error(`Path outside root! ${request.rawPath}`);
		}
		return `/${rawPathParts.join('/')}`;
	},
	root: GETTER_ROOT,
}) as (_request: Request) => Response;


export const get = (request: Request) => staticGetter(request);
