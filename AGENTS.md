# Agent instructions for the Enonic Site Framework tutorial

This repository (`enonic/tutorial-site-framework`, formerly `tutorial-myfirstsite`) contains a tutorial for the
**Enonic Site Framework**, written in AsciiDoc and published to https://developer.enonic.com/learn/enonic-site-framework.
The same repository is the starter the reader scaffolds in chapter 1
(`enonic project create ... -r tutorial-site-framework`), so the code and the documentation ship together.

Shared conventions for Enonic documentation (language and tone, navigation, tutorials, publishing, and AsciiDoc) are in the
`enonic-docs` skill from the `enonic-contrib` plugin of https://github.com/enonic/agent-toolkit. Install it
and follow it for every change under `docs/`. The rules below are the ones specific to this tutorial, plus the few shared
rules that must hold even without the skill.

## Renaming in progress

The tutorial is being renamed from "My first site" to the Enonic Site Framework tutorial. The repository and the Dev
portal entry ("Enonic Site Framework") are already renamed. The page title is "Build a website with the Enonic Site
Framework". The work happens in this order:

1. **Terminology first.** Use the new name and vocabulary in the title, introductions, and prose that names the framework.
   Do not change what the tutorial teaches, its steps, code, screenshots, or any identifier. All code stays on XP 7.
2. **Then fix the tutorial iteratively**, one reviewable change at a time: the shared tutorial conventions, outdated
   screenshots, the upgrade to XP 8, fetching content over GraphQL, and migrating the identifiers below.

The sandbox, project folder, application, and content project keep their current names until step 2 reaches them. "My First Site" in the chapters still correctly names the application and the content project as they appear
in Content Studio; leave those mentions alone during step 1.

## Scope and audience

The tutorial introduces building a front-end with the Enonic Site Framework: content types, pages, regions, parts, page
templates, static assets, layouts, and publishing. Readers are developers who are new to Enonic. Content modelling in depth
and the GraphQL API belong to the Developer 101 tutorial; component and schema details belong to the reference
documentation, which chapters link to instead of repeating.

## Positioning and vocabulary

- The **Enonic Site Framework** is the built-in way to build content-driven sites: the site service resolves the page for
  a content item and renders its components with server-side JavaScript controllers and HTML templates, with mappings,
  processors, and page contributions around that. It is presented alongside Next.js and React4XP.
- Two perspectives, two terms. The **site service** is the runtime: what XP does with a request to `/site`, documented in
  https://developer.enonic.com/docs/code/stable/web/sites. The **Site Framework** is the developer's view: what you build a
  site with. Use "site service" when XP is the subject of the sentence and "Site Framework" when the developer is.
- The reference owns the mechanics (pipeline, mappings, processors, contributions); the tutorial walks through them, uses
  the same terms, and links there.
- React4XP also runs on the site service, but deploys its own mapping that takes over the request and does the page
  rendering itself, bypassing the Site Framework's built-in page rendering. Next.js renders outside Enonic.
- Write "Enonic Site Framework" on first mention and "the Site Framework" after that. Singular "Site", never "Sites
  Framework", and no abbreviation. Do not call it "the JS framework", "the Enonic framework", "MVC", or "site engine" (the
  XP 7 term for the site service).
- Content types, regions, page templates, and publishing are CMS concepts shared by every front-end; keep them visibly
  separate from what the Site Framework adds.

## Repository layout

- `docs/` - the chapters, `menu.json`, `versions.json`, and screenshots in `docs/media/`.
- `src/main/resources/` - the finished state of most components (`site/pages/hello`, `site/parts/country`,
  `site/parts/city-list`, `site/layouts/two-columns`), content types `country` and `city`, and sample content in `import/`.
- `code-samples/pages/` - the versions of the `hello` page that the reader pastes in during chapters 4 and 7
  (`hello-region`, `hello-assets`, `hello-static`).
- `main.ts` creates the content project `myfirstsite` and imports the sample content on first start.

## Code and documentation are coupled

- Chapters pull code in with `include::` from `src/main/resources/` and `code-samples/`. Editing those files changes the
  published tutorial; renaming or moving them breaks a chapter. Check every `include::` after touching either tree.
- A change to a component's behavior, descriptor, or display name must be checked against the prose and screenshots of the
  chapter that presents it.
- `docs/` and `code-samples/` are copied into the reader's project, and chapter 1 describes that structure.

## Versioning

A single version is published: `stable`, built from `master`. There are no version branches. A push to `master` that
touches `docs/` republishes the tutorial immediately.

The code targets XP 7 (`xpVersion` in `gradle.properties`). `docs/index.adoc` states the prerequisites and the tested
versions; keep that table in step with the code. Reference links written as `/docs/xp/stable/...` now redirect to the XP 8
documentation; use `/docs/xp/7.x/...` for links that must match the XP 7 code.

## Tutorial identifiers

Commands, log excerpts, URLs, and screenshots in the chapters must agree on these names. They predate the shared tutorial
naming convention; when step 2 migrates them, change them together.

| Resource | Current value |
|----------|---------------|
| Sandbox | `mfstutorial` |
| Project folder | `mfs` |
| Application ID | `my.first.site` |
| Application display name | `My First Site` |
| Content project | `myfirstsite`, displayed as `My First Site` |
| Site path | `/hello-world` |

## Key conventions specific to this repository

- **Assets and images:** all screenshots and GIFs live in `docs/media/`, referenced with `:imagesdir: media/`. File names
  are case-sensitive on the portal.
- **Verification:** `enonic dev` from the project root builds and deploys to the linked sandbox; walk through the affected
  chapter in Content Studio after changing code or steps.

## Must-know rules even without the skill

- Every page in `docs/menu.json` has real content; add new pages to the menu.
- A section landing page is `docs/topic.adoc` with children in `docs/topic/`; no `index.adoc` in subdirectories.
- Wrap identifiers containing `_` in `+...+` outside source blocks.
- Use relative `<<path#,Label>>` links and never a `^` suffix.
- Only `.adoc` and `.json` files under `docs/` stay out of the published site; everything else becomes a page or a media item.
