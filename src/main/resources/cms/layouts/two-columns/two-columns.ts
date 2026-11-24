import type { LayoutComponent, Response } from '@enonic-types/core';

import { assetUrl } from '/lib/enonic/asset';
import { render } from '/lib/thymeleaf';
import { getComponent } from '/lib/xp/portal';

type TwoColumns = LayoutComponent<`${string}:two-columns`, { sizes: string }>;

const VIEW = resolve('./two-columns.html');

export function GET(): Response {
  const component = getComponent<TwoColumns>()!;

  const model = {
    sizes: component.config.sizes,
    leftRegion: component.regions.left,
    rightRegion: component.regions.right,
  };

  return {
    body: render(VIEW, model),
    pageContributions: {
      headEnd: [
        `<link rel="stylesheet" href="${assetUrl({ path: 'styles/two-columns.css' })}"/>`,
      ],
    },
  };
}
