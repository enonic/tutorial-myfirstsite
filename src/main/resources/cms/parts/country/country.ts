import type { Content, Response } from '@enonic-types/core';

import { render } from '/lib/thymeleaf';
import { getContent } from '/lib/xp/portal';

type Country = { description?: string, wikipedia?: string };

const VIEW = resolve('./country.html');

export function GET(): Response {
  const content = getContent<Content<Country>>()!;

  const model = {
    description: content.data.description || 'Missing description',
    wikipedia: content.data.wikipedia,
  };

  return {
    body: render(VIEW, model),
  };
}
