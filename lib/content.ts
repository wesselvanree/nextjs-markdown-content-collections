import fs from 'fs'
import matter from 'gray-matter'
import { join } from 'path'
import { z } from 'zod'

import 'server-only'

type ContentCollection<S> = {
  getSlugs: () => string[]
  getEntryBySlug: (slug: string) =>
    | (S & {
        slug: string
        content: string
      })
    | null
  getAll: () => (S & {
    slug: string
    content: string
  })[]
}

export function defineCollection<S extends Record<string, unknown>>(config: {
  dir: string
  schema: z.ZodType<S>
  sortKey?: keyof S
  sortDirection?: 'asc' | 'desc'
}) {
  const collectionDirectory = join(process.cwd(), config.dir)

  function getSlugs() {
    return fs
      .readdirSync(collectionDirectory)
      .filter((file) => file.endsWith('.md'))
      .map((entry) => entry.replace(/\.md$/, ''))
  }

  function getEntryBySlug(slug: string) {
    const fullPath = join(collectionDirectory, `${slug}.md`)

    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    const validated = config.schema.safeParse(data)

    if (!validated.success) {
      throw new Error(
        `Invalid frontmatter in ${config.dir}/${slug}: \n${JSON.stringify(
          validated.error.flatten().fieldErrors,
          undefined,
          4
        )}`
      )
    }

    return { ...validated.data, slug, content }
  }

  function getAll() {
    const slugs = getSlugs()
    let entries = slugs.map((slug) => getEntryBySlug(slug)!)

    if (config.sortKey != null) {
      entries = entries.sort(
        (a, b) =>
          (config.sortDirection === 'desc' ? -1 : 1) *
          (a[config.sortKey!] < b[config.sortKey!] ? -1 : 1)
      )
    }

    return entries
  }

  const result: ContentCollection<S> = {
    getSlugs,
    getEntryBySlug,
    getAll,
  }

  return result
}
