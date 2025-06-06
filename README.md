# Next.js type-safe Markdown content collections

This project demonstrates a possible implementation of type-safe local markdown files with minimal dependencies, inspired by the Astro implementation of content collections. This could be particularly useful for a blog or a personal site, and is fully customizable to your needs.

- Define collections of local Markdown files
- Schema validation using [zod](https://zod.dev/)
- Type-safe interface to query content collections
- Minimal dependencies

## Getting started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the site. You can define content collections in `content.config.ts` using the `defineCollection` function from the `./lib/content.ts` module. Frontmatter is validated using zod.

## Using this in your own project

To use this in your own project, copy the `lib/content.ts` file to your repository. This requires the following dependencies to be installed:

```
npm install gray-matter zod server-only
```

Define your content collections wherever you want, for example by creating a similar `content.config.ts` file as shown in this repo.

## Implementation details

Most of this project is the default Next.js application after running

```
pnpx create-next-app@latest
```

After which several files were added:

- `app/blog/[slug]/page.tsx`
- `app/blog/page.tsx`
- `components/prose.tsx`
- `components/mdx.tsx`
- `content/blog/hello-world.md`
- `lib/content.ts`
- `content.config.ts`

To keep things simple, the current implementation relies on reading from the file system. Meaning that data can only be loaded while server rendering in a Node.js environment, or by statically rendering the pages during build time.

## Personal recommendations

If your application requires server rendering on the edge runtime, this implementation would not work because it relies on nodejs file system modules. Alternatively, you could generate JSON files during build time (and before starting the dev server), and import these generated JSON files in your app.

Moreover, images are not optimized with the current implementation. I recommend using a CDN, and referencing these images within your frontmatter. If you prefer to keep everything in your git repository, you could optimize images by compiling using a package like `sharp`. To prevent cumulative layout shift, I recommend encoding the image sizes in the filename (e.g. `a021f81ab8d643c4bd9c5ee937fa3054-1920x1080.jpg`). This enables you to read the proportions, and reserve the required space before loading the image with `next/image`.
