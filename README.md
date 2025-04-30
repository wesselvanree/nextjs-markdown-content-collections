# Next.js type-safe Markdown content collections with zod

This project demonstrates a possible implementation of type-safe local markdown files with minimal dependencies, inspired by the Astro implementation of content collections. This could be particularly useful for a blog or a personal site, and is fully customizable to your needs.

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
- `components/markdown-body.tsx`
- `content/blog/hello-world.md`
- `lib/content.ts`
- `content.config.ts`

To keep things simple, the current implementation relies on reading from the file system. Meaning that data can only be loaded while server rendering in a Node.js environment, or by statically rendering the pages during build time. If your application requires server rendering on the edge runtime, a possible implementation could be to add a compile step that generates json files of the content, and import those json files in the edge runtime.
