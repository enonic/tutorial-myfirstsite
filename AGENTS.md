# Agent instructions for the Enonic Site Framework tutorial

This repository (`enonic/tutorial-site-framework`, formerly `tutorial-myfirstsite`) contains a tutorial for the
**Enonic Site Framework**, written in AsciiDoc and published to https://developer.enonic.com/learn/enonic-site-framework.
The same repository is the starter the reader scaffolds in chapter 1, so the code and the documentation ship together.

Shared conventions for Enonic documentation (language and tone, navigation, tutorials, publishing, and AsciiDoc) are in the
`enonic-docs` skill from the `enonic-contrib` plugin of https://github.com/enonic/agent-toolkit. Install it
and follow it for every change under `docs/`. The rules below are the ones specific to this tutorial, plus the few shared
rules that must hold even without the skill.

## Scope and audience

The tutorial introduces building a front-end with the Enonic Site Framework: content types, pages, regions, parts, page
templates, static assets, layouts, and publishing. Readers are developers who are new to Enonic. Content modelling in depth
and the GraphQL API belong to the content modeling tutorial; component and schema details belong to the reference
documentation, which chapters link to instead of repeating.

## Positioning and vocabulary

- The **Enonic Site Framework** is the built-in way to build content-driven sites: the site service resolves the page for
  a content item and renders its components with server-side JavaScript implementations and HTML templates, with mappings,
  processors, and page contributions around that.
- Enonic is headless first, so the Site Framework and React4XP may be presented next to Next.js, but always as
  alternatives to using a third-party front-end framework, never as the default. Do not write "headless first" in the
  tutorial itself; say that Enonic works with any front-end framework.
- Two perspectives, two terms. The **site service** is the runtime: what XP does with a request to `/site`. The **Site
  Framework** is the developer's view: what you build a site with. Use "site service" when XP is the subject of the
  sentence and "Site Framework" when the developer is.
- React4XP also runs on the site service. It uses mappings to replace the built-in page and component rendering with
  rendering based on React. Next.js renders outside Enonic.
- The Site Framework couples rendering to the component definition: the implementation lives next to the descriptor.
  React4XP detaches the two, binding components and content types to React views in a component registry, as headless
  front-ends do. That makes React4XP closer to headless than the Site Framework is, even though both run inside XP.
- Write "Enonic Site Framework" on first mention and "the Site Framework" after that. Singular "Site", no abbreviation. Do
  not call it "the JS framework", "the Enonic framework", "MVC", or "site engine".
- Call the root component of a page a "page component", never "controller" or "page". Use each component's display name
  as Content Studio shows it, for example `Hello page` and `City list`.
- Content types, regions, page templates, and publishing are CMS concepts shared by every front-end; keep them visibly
  separate from what the Site Framework adds.

## Versioning

Two versions are published, as listed in `docs/versions.json` on `master`:

| Branch | Label | Shown as | Content |
|--------|-------|----------|---------|
| `master` | `stable` (latest) | 8.x | The XP 8 tutorial described in this file. |
| `7.x` | `7.x` | 7.x | The XP 7 tutorial, where the reader scaffolds the repository itself. Only fixes go here. |

A push to either branch that touches `docs/` republishes the tutorial immediately. `docs/versions.json` is read from
`master` only. Nothing from `master` is backported to `7.x`; the two branches share no code.

## How the tutorial is put together

- **The reader starts from `starter-ts`** and writes all code during the tutorial, including the `country` and `city`
  content types.
- **This repository holds the final result**: the app the reader ends up with, plus the complete content. It is what
  the `Demo` page scaffolds with `enonic project create -r tutorial-site-framework`.
- **Start content comes from a separate fixture app**, in the repository `enonic/tutorial-site-framework-fixture` with
  the application ID `com.enonic.tutorial.siteframework.fixture`. It creates the content project and imports the site,
  countries, cities and photos. It holds content only, and refers to the content types as
  `com.example.tutorial.siteframework:country` and `:city`, so the application ID in chapter 1 is not optional. The site
  has no application assigned; the reader adds theirs in chapter 2.
- **Complete content is bundled here**, in `src/main/resources/import/`: the fixture content plus everything the reader
  does in Content Studio (Sweden and Stockholm, the page on the site, the `Country` page template with the layout).
  `main.ts` imports it on first start, rewrites the application ID to `app.name` with `import/replace_app.xsl`, and
  publishes the site, so the demo runs under any application ID.
- **Both apps create the project only if it does not exist**, so installing one after the other never imports twice.
- **What the reader does not write:** `main.ts`, `import/`, and the `cluster`, `context`, `export` and `project`
  libraries in `build.gradle`. Everything else under `src/` must match what the chapters tell the reader to create.

## Code and documentation are coupled

- Chapters pull code in with `include::` from `src/main/resources/` (the final version of each file) and from
  `code-samples/` (earlier versions of the `hello` page component and the site descriptor). Editing those files changes
  the published tutorial; renaming or moving them breaks a chapter.
- A change to a component's behavior, descriptor, or title must be checked against the prose and screenshots of the
  chapter that presents it, and the complete content must still import and render.
- When the sample content changes, re-export it in both repositories: the start content in the fixture, the complete
  content here. To make the complete export, follow the tutorial to the end and export `/content/hello-world` from the
  `draft` branch.

## Tutorial identifiers

All names live in `docs/.variables.adoc`; use the attributes in commands and prose, never the literal values.

| Resource | Value | Set by |
|----------|-------|--------|
| Sandbox | `tutorial_siteframework` | The reader's command |
| Project folder | `tutorial-siteframework-enonic` | The reader's command |
| Application ID | `com.example.tutorial.siteframework` | The reader's command; the fixture depends on it |
| Application title | `Site Framework tutorial` | The reader, in `enonic.yaml` |
| Content project | `siteframework`, displayed as `Site Framework` | The fixture app and `main.ts` |
| Site path | `/hello-world` | The sample content |
| Demo sandbox, folder and application ID | `demo_siteframework`, `demo-siteframework-enonic`, `com.example.demo.siteframework` | The demo page |

`:fixture-url:` points at the published fixture jar. Update it when the fixture is released.

## Things that are easy to get wrong on XP 8

Each of these was hit while the tutorial was built and tested on XP 8.1.3 with Content Studio 6.1.1.

- **Regions are plain strings** in page and layout descriptors (`regions: ["main"]`), and a page descriptor must have a
  `regions` key, even when empty. A list of `name:` objects gives a region with an empty name and a failing page.
- **`importNodes` needs the `xslt` parameter**, although the type definition says it is optional. Without it the import
  fails with a `NullPointerException`. The fixture passes an identity stylesheet for this reason.
- **The CLI cannot install an app in a fresh sandbox**, because `enonic app install` needs a user with a password and
  the sandbox only has guest login. Readers upload the fixture in the Applications tool instead.
- **Installing from a URL in the Applications tool is restricted** to `https` URLs by default, and the management API
  requires a checksum. Uploading the file works without configuration.
- **`enonic dev` does not pick up changes to `build.gradle`.** Chapters that add a library tell the reader to restart it.
- **A library needs three edits**: the `include` in `build.gradle`, the `@enonic-types` package, and a `paths` entry in
  `src/main/resources/tsconfig.json`. `enonic dev` builds without the last two, but `enonic project build` fails.
- **The Text component is not offered in Content Studio 6**, so no chapter uses it.
- **Selecting a page component or a part saves automatically; dragging a component in the tree does not.** The layouts
  chapter tells the reader to click Save.
- **Saving several files in quick succession can make one dev build fail** on the jar step. The next save fixes it.

## Key conventions specific to this repository

- **Assets and images:** all screenshots live in `docs/media/`. File names are case-sensitive on the portal.
  Content Studio screenshots are 1440 pixels wide and `result.png` is 1280, all captured in English and kept under
  1 MB; photo-heavy ones are stored as JPEG.
  There are no animated GIFs.
- **Screenshots show XP 8.1.3 and Content Studio 6.1.1.** `page-settings.png` was captured after the site was styled
  and published, so it shows a later state than chapter 3 describes.
- **Verification:** build the docs with the asciidoctor command from the skill before pushing. To test the steps,
  create a sandbox without a password, scaffold `starter-ts`, install the fixture, and follow every chapter in the
  browser, running `npm run check` after each chapter that adds code. Then test the demo by deploying this repository
  under a different application ID to a clean sandbox and opening the published site.

## Must-know rules even without the skill

- Every page in `docs/menu.json` has real content; add new pages to the menu.
- A section landing page is `docs/topic.adoc` with children in `docs/topic/`; no `index.adoc` in subdirectories.
- Wrap identifiers containing `_` in `+...+` outside source blocks.
- Use relative `<<path#,Label>>` links and never a `^` suffix, except on links to the reader's local XP (`{xp-url}`), which open in a new tab so the reader stays in the tutorial.
- Only `.adoc` and `.json` files under `docs/` stay out of the published site; everything else becomes a page or a media item.
