import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import { Prose } from './prose'

type Props = {
  source: string
}

export function MDXBody(props: Props) {
  return (
    <Prose>
      <MDXRemote
        source={props.source}
        components={{
          a: (props) => {
            if (props.href != null && !props.href.startsWith('http')) {
              return <Link {...props} />
            }

            return <a {...props} />
          },
        }}
        options={{
          parseFrontmatter: false, // frontmatter is parsed by gray-matter
        }}
      />
    </Prose>
  )
}
