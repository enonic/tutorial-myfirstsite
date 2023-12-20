import { LayoutComponent, LayoutRegion } from '@enonic-types/core';
import type { Response } from '/index.d';

// @ts-expect-error no-types
import {render} from '/lib/thymeleaf';
import {assetUrl, getComponent} from '/lib/xp/portal';

type LayoutDescriptor = "company.starter.myfirstsite:two-column"
type LayoutConfig = { sizes: '33_66' | '50_50' | '66_33' }
type Layout = LayoutComponent< LayoutDescriptor,LayoutConfig, {left: LayoutRegion, right: LayoutRegion} >

// Specify the view file to use
const VIEW = resolve('./two-columns.html');

// Handle the GET request
export function get(): Response {

  // Get the layout component
  const component = getComponent<Layout>();

  // Prepare the model that will be passed to the view
  const model = {
    sizes: component.config.sizes,
    leftRegion: component.regions.left,
    rightRegion: component.regions.right
  }

  // Prepare the response object
  const response: Response = {
    body: render(VIEW, model),
    pageContributions: {
      
      headEnd: [
        `<link rel="stylesheet" href="${assetUrl({ path: 'styles/two-column.css' })}" type="text/css" />`
      ]
    }
  };

  return response;
}