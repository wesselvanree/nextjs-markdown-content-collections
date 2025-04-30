type Props = {
  content: string
}

export function MarkdownBody({ content }: Props) {
  return (
    <div
      className="max-w-none mx-auto prose prose-headings:font-semibold prose-strong:font-semibold"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
