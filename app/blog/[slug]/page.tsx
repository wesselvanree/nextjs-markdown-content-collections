import { MDXBody } from '@/components/mdx'
import { collections } from '@/content.config'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ slug: string }>
}

// use static site generation
export async function generateStaticParams() {
  const slugs = collections.blog.getSlugs()

  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata(props: Props) {
  const params = await props.params

  const article = collections.blog.getEntryBySlug(params.slug)

  if (article == null) {
    return undefined
  }

  return {
    title: article.title,
  }
}

export default async function BlogArticlePage(props: Props) {
  const params = await props.params
  const article = collections.blog.getEntryBySlug(params.slug)

  if (article == null) {
    notFound()
  }

  return (
    <div className="py-12 px-4">
      <div className="max-w-prose mx-auto">
        <div className="mb-12">
          <div className="mb-12">
            <Link href="/blog" className="text-gray-500 hover:text-foreground transition-colors">
              &larr; All posts
            </Link>
          </div>

          <div className="mb-3 text-gray-500">
            Published {article.publishedAt.toLocaleDateString('en-US', { dateStyle: 'long' })}
          </div>

          <h1 className="text-4xl font-semibold">{article.title}</h1>
          {article.tags != null && article.tags.length > 0 && (
            <div className="text-gray-500 mt-2">{article.tags.join(', ')}</div>
          )}

          {article.image != null && (
            <Image
              src={article.image}
              alt={article.imageAlt ?? ''}
              className="w-full h-auto object-cover my-12"
            />
          )}
        </div>

        <MDXBody source={article.content} />
      </div>
    </div>
  )
}
