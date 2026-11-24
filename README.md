# Enonic Site Framework tutorial

The tutorial is published at https://developer.enonic.com/learn/enonic-site-framework.

This repository holds the documentation (`docs/`) and the result of the tutorial: the app a reader ends up with after
following all chapters from `starter-ts`, and the content as it looks at the end.

## Run the finished site

Install the [Enonic CLI](https://developer.enonic.com/start), then run:

```bash
enonic sandbox create demo_siteframework -t essentials -f
enonic project create com.example.demo.siteframework -r tutorial-site-framework -s demo_siteframework -d demo-siteframework-enonic -f
cd demo-siteframework-enonic
enonic dev
```

On first start the app creates the `Site Framework` content project, imports the content in
`src/main/resources/import/`, and publishes the site. Open
http://localhost:8080/site/siteframework/master/hello-world/norway to see the result.

## What a reader does not write

`src/main/resources/main.ts`, `src/main/resources/import/`, and the libraries they need in `build.gradle` exist to set
up the content for the demo. Everything else under `src/` is written by the reader during the tutorial. Readers get
their starting content from the fixture app in https://github.com/enonic/tutorial-site-framework-fixture.

## Compatibility

| Branch | Enonic XP |
|--------|-----------|
| `master` | 8.1 |
| `7.x` | 7.14 to 7.16 |
