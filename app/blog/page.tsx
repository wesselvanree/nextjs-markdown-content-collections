import { collections } from '@/content.config'
import Link from 'next/link'

export const metadata = {
  title: 'Blog',
}

export default async function BlogPage() {
  const articles = collections.blog.getAll()

  return (
    <div className="py-12 px-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-semibold mb-4">Blog</h1>
        {articles.map((article) => (
          <div key={article.slug} className="isolate relative z-0">
            <img src={article.image} alt={article.imageAlt ?? ''} />
            <h2 className="text-xl font-semibold">
              <Link href={`/blog/${article.slug}`}>
                <span>{article.title}</span>
                <span className="absolute left-0 top-0 size-full"></span>
              </Link>
            </h2>
            <div className="text-gray-500 text-sm">
              {article.publishedAt.toLocaleDateString('en-us', { dateStyle: 'long' })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
