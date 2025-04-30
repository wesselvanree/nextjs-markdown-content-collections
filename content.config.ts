import { z } from 'zod'
import { defineCollection } from './lib/content'

const blog = defineCollection({
  dir: './content/blog',
  schema: z.object({
    title: z.string(),
    publishedAt: z.coerce.date(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
  sortKey: 'publishedAt',
  sortDirection: 'desc',
})

export const collections = {
  blog,
}
