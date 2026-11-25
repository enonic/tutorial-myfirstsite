import type { Content, Response } from '@enonic-types/core';

import { getChildren } from '/lib/xp/content';
import { getSite } from '/lib/xp/portal';

type City = { photo?: string, slogan?: string, population: number };

export function GET(): Response {
  const children = getChildren({
    key: getSite()!._path,
    count: 100,
  });

  const rows = children.hits
    .filter((item) => item.type === `${app.name}:country`)
    .map((country) => {
      const cities = getChildren<Content<City>>({ key: country._path, count: 100 }).hits
        .filter((item) => item.type === `${app.name}:city`);
      const population = cities.reduce((sum, city) => sum + city.data.population, 0);

      return [`"${country.displayName.replace(/"/g, '""')}"`, cities.length, population];
    });

  return {
    contentType: 'text/csv; charset=utf-8',
    headers: {
      'Content-Disposition': 'attachment; filename="countries.csv"',
    },
    body: [['Country', 'Cities', 'Population'], ...rows].map((row) => row.join(',')).join('\n'),
  };
}
