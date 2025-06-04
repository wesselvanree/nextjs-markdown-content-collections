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

/**
 * Define a content collection for markdown files.
 *
 * @param config Collection configuration
 * @param config.dir Directory that contains markdown files, this should be relative to the nodejs process path
 * @param config.schema Zod schema for markdown frontmatter
 * @param config.sortBy Function to set custom sort order based on the content, by default the content is sorted based on the markdown filename
 * @param config.sortDirection Whether the content should be sorted in ascending or descending order (default: ascending)
 *
 * @returns An object that can be used to query content on the server
 */
export function defineCollection<S extends Record<string, unknown>>(config: {
  dir: string
  schema: z.ZodType<S>
  sortBy?: (item: S) => string | number | Date | null | undefined
  sortDirection?: 'asc' | 'desc'
}) {
  const collectionDirectory = join(process.cwd(), config.dir)
  const negatedIfDesc = config.sortDirection === 'desc' ? -1 : 1

  function getSlugs() {
    return fs
      .readdirSync(collectionDirectory)
      .filter((file) => file.endsWith('.md'))
      .map((entry) => entry.replace(/\.md$/, ''))
      .sort((a, b) => negatedIfDesc * a.localeCompare(b))
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
    const sortBy = config.sortBy

    if (typeof sortBy !== 'undefined') {
      entries = entries.sort((a, b) => {
        const sortValueA = sortBy(a)
        const sortValueB = sortBy(b)

        if (sortValueA == null && sortValueB == null) {
          return 0
        } else if (sortValueA == null) {
          return negatedIfDesc
        } else if (sortValueB == null) {
          return negatedIfDesc * -1
        }

        return negatedIfDesc * (sortValueA < sortValueB ? -1 : 1)
      })
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
