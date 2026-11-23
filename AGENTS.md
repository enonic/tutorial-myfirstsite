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
  a content item and renders its components with server-side JavaScript controllers and HTML templates, with mappings,
  processors, and page contributions around that. It is presented alongside Next.js and React4XP.
- Two perspectives, two terms. The **site service** is the runtime: what XP does with a request to `/site`. The **Site
  Framework** is the developer's view: what you build a site with. Use "site service" when XP is the subject of the
  sentence and "Site Framework" when the developer is.
- React4XP also runs on the site service, but deploys its own mapping that takes over the request and does the page
  rendering itself, bypassing the Site Framework's built-in page rendering. Next.js renders outside Enonic.
- Write "Enonic Site Framework" on first mention and "the Site Framework" after that. Singular "Site", no abbreviation. Do
  not call it "the JS framework", "the Enonic framework", "MVC", or "site engine".
- Call the root component of a page a "page component", never "controller" or "page". Use each component's display name
  as Content Studio shows it, for example `Hello Page Controller` and `Hello Regions!`.
- Content types, regions, page templates, and publishing are CMS concepts shared by every front-end; keep them visibly
  separate from what the Site Framework adds.

## Versioning

Two versions are published, as listed in `docs/versions.json` on `master`:

| Branch | Label | Shown as | Content |
|--------|-------|----------|---------|
| `7.x` | `stable` (latest) | 7.x | The XP 7 tutorial. Only fixes go here. |
| `master` | `next` | next | The rewrite for XP 8. Not indexed by search engines. |

A push to either branch that touches `docs/` republishes the tutorial immediately. `docs/versions.json` is read from
`master` only. When the rewrite ships, point `stable` at `master` and give `7.x` its own label.

- `:starter-branch:` in `docs/.variables.adoc` must name the branch the page is published from: `7.x` on `7.x`, `master`
  on `master`. It is the one line that differs when a docs change is ported between the branches.
- The XP version in `:xp-version:` must bundle a Java version the Gradle wrapper supports. With Gradle 8.7, XP 7.16.11
  (Java 21) works and XP 7.17.0 (Java 25) fails at `enonic dev`.
- Reference links for the XP 7 code use `{xp-docs}/{xp-docs-version}/...`, which points at the 7.x documentation.
  `/docs/xp/stable/...` URLs redirect to XP 8 documentation.

## Plan for the XP 8 rewrite on `master`

The sections below this one describe the current XP 7 code, which `master` still holds. The rewrite replaces it as follows.
None of it is backported to `7.x`.

- **Pure XP 8.** The tutorial targets XP 8 only, with GraalJS and the GraphQL client library.
- **Starts from `starter-ts`.** The reader scaffolds `starter-ts` in chapter 1 and writes the code during the tutorial,
  as in the other tutorials. They no longer scaffold this repository.
- **This repository holds the final result**, so it can be deployed as a demo without following the tutorial.
- **The reader adds all schemas.** The `country` and `city` content types are created by the reader, not supplied.
- **Start content comes from a separate fixture app**, in the repository `enonic/tutorial-site-framework-fixture` with
  the application ID `com.enonic.tutorial.siteframework.fixture`. It creates the content project and imports the site,
  countries, cities and images. The reader installs it with `enonic app install --url`; it is published as a jar to the Enonic
  repository and not listed on Market. It holds content only, and references the content types as
  `com.example.tutorial.siteframework:country` and `:city`, so the application ID in chapter 1 is not optional. The site
  has no application assigned; the reader adds theirs in Content Studio.
- **This repository bundles the complete content:** the fixture content plus everything the reader adds during the
  tutorial (page setup, page template, components, layout). `main.ts` imports it on first start and rewrites the
  application ID to `app.name`, so a demo runs under any ID with this one app. The import code and the `import/` folder
  are the only parts of the repository the reader does not write; say so in the README.
- **Both apps create the project only if it does not exist**, so installing one after the other never imports twice.
- **No BrowserSync.** It proved problematic and is not carried over.

Not decided or verified yet: the fixture app's display name, the export format on XP 8, and
`enonic app install --url` against an XP 8 sandbox.

## Code and documentation are coupled

- Chapters pull code in with `include::` from `src/main/resources/` and `code-samples/`. Editing those files changes the
  published tutorial; renaming or moving them breaks a chapter.
- `code-samples/pages/` holds the versions of the `hello` page component that the reader copies in during the regions and
  static assets chapters (`hello-region`, `hello-assets`, `hello-static`).
- A change to a component's behavior, descriptor, or display name must be checked against the prose and screenshots of the
  chapter that presents it.
- `docs/`, `code-samples/` and this file are copied into the reader's project, and chapter 1 describes that structure.

## Tutorial identifiers

All names live in `docs/.variables.adoc`; use the attributes in commands and prose, never the literal values.

| Resource | Value | Set by |
|----------|-------|--------|
| Sandbox | `tutorial_siteframework` | The reader's command |
| Project folder | `tutorial-siteframework-enonic` | The reader's command |
| Application ID | `com.example.tutorial.siteframework` | The reader's command |
| Application display name | `My First Site` | `gradle.properties` |
| Content project | `myfirstsite`, displayed as `My First Site` | `main.ts` |
| Site path | `/hello-world` | The sample content in `import/` |

The last three come from the code and appear in the screenshots. Change them only together with the code and new captures.

## Key conventions specific to this repository

- **Assets and images:** all screenshots and GIFs live in `docs/media/`. File names are case-sensitive on the portal.
  Screenshots dominated by photos are stored as JPEG to keep them under 1 MB.
- **Screenshots are from XP 7.14 and Content Studio 5.1.** `xp-boot.png` shows the app as "My App", not "My First Site".
- **Verification:** build the docs with the asciidoctor command from the skill before pushing. To test the steps, run
  chapter 1 against a throwaway sandbox, then copy each `code-samples` version into place and check that `enonic dev`
  rebuilds without errors.

## Must-know rules even without the skill

- Every page in `docs/menu.json` has real content; add new pages to the menu.
- A section landing page is `docs/topic.adoc` with children in `docs/topic/`; no `index.adoc` in subdirectories.
- Wrap identifiers containing `_` in `+...+` outside source blocks.
- Use relative `<<path#,Label>>` links and never a `^` suffix.
- Only `.adoc` and `.json` files under `docs/` stay out of the published site; everything else becomes a page or a media item.
