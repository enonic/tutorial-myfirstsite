import type { Content, Response } from '@enonic-types/core';

import { getChildren } from '/lib/xp/content';
import { getSite, pageUrl } from '/lib/xp/portal';

type Country = { description?: string, wikipedia?: string };

export function GET(): Response {
  const site = getSite()!;

  const children = getChildren<Content<Country>>({
    key: site._path,
    count: 100,
  });

  const countries = children.hits
    .filter((item) => item.type === `${app.name}:country`)
    .map((item) => {
      const url = pageUrl({ path: item._path, type: 'absolute' });
      const description = item.data.description ? `: ${item.data.description}` : '';

      return `- [${item.displayName}](${url})${description}`;
    });

  return {
    contentType: 'text/plain; charset=utf-8',
    body: [`# ${site.displayName}`, '', '## Countries', '', ...countries, ''].join('\n'),
  };
}
