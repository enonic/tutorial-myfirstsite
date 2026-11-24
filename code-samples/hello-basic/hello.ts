import type { Response } from '@enonic-types/core';

import { render } from '/lib/thymeleaf';
import { getContent } from '/lib/xp/portal';

const VIEW = resolve('./hello.html');

export function GET(): Response {
  const content = getContent()!;

  const model = {
    displayName: content.displayName,
  };

  return {
    body: render(VIEW, model),
  };
}
