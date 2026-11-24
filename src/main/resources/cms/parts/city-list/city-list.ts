import type { Content, PartComponent, Response } from '@enonic-types/core';

import { render } from '/lib/thymeleaf';
import { getChildren } from '/lib/xp/content';
import { getComponent, getContent, imageUrl, type ImageUrlParams } from '/lib/xp/portal';

type City = { photo?: string, slogan?: string, population: number };
type Crop = 'ORIGINAL' | 'WIDESCREEN' | 'SQUARE';
type CityList = PartComponent<`${string}:city-list`, { crop?: Crop }>;

const VIEW = resolve('./city-list.html');

const SCALES: Record<Crop, ImageUrlParams['scale']> = {
  ORIGINAL: 'width(1080)',
  WIDESCREEN: 'block(1080,300)',
  SQUARE: 'square(1080)',
};

export function GET(): Response {
  const config = getComponent<CityList>()!.config;
  const scale = SCALES[config.crop || 'ORIGINAL'];

  const children = getChildren<Content<City>>({
    key: getContent()!._path,
    count: 100,
  });

  const cities = children.hits
    .filter((item) => item.type === `${app.name}:city`)
    .map((item) => ({
      name: item.displayName,
      photo: item.data.photo && imageUrl({ id: item.data.photo, scale }),
      caption: [item.data.slogan, `Population: ${item.data.population}`].filter(Boolean).join(' - '),
    }));

  return {
    body: render(VIEW, { cities }),
  };
}
