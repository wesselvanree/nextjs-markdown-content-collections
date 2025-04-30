# Next.js type-safe Markdown content collections

This project demonstrates a possible implementation of type-safe local markdown files with minimal dependencies, inspired by the Astro implementation of content collections. This could be particularly useful for a blog or a personal site, and is fully customizable to your needs.

- Define collections of local Markdown files
- Schema validation using zod
- Type-safe interface to query content collections
- Minimal dependencies

## Getting started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the site. You can define content collections in `content.config.ts` using the `defineCollection` function from the `./lib/content.ts` module. Frontmatter is parsed using zod.

## Implementation details

Most of this project is the default Next.js application after running

```
pnpx create-next-app@latest
```

After which several files were added:

- `app/blog/[slug]/page.tsx`
- `app/blog/page.tsx`
- `components/prose.tsx`
- `content/blog/hello-world.md`
- `lib/content.ts`
- `lib/markdown-to-html.ts`
- `content.config.ts`

To keep things simple, the current implementation relies on reading from the file system. Meaning that data can only be loaded while server rendering in a Node.js environment, or by statically rendering the pages during build time. If your application requires server rendering on the edge runtime, a possible implementation could be to add a compile step that generates json files of the content, and import those json files in the edge runtime.

Moreover, images are not optimized with the current implementation. I recommend using a CDN, and reference these images in your frontmatter. If you prefer to keep everything in your git repository, you could optimize images by compiling using a package like `sharp`. To prevent cumulative layout shift, I recommend encoding the image sizes in the filename (e.g. `a021f81ab8d643c4bd9c5ee937fa3054-1920x1080.jpg`). This enables you to read the proportions, and reserve the required space before loading the image.

The current implementation just renders markdown as html. If you want to be able to link to other pages on your own site from markdown files, they do not use the `next/link` components with this implementation. Read the [Remote MDX section of the docs](https://nextjs.org/docs/app/guides/mdx#remote-mdx) for more details.
