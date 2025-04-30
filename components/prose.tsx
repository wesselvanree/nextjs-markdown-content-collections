type Props = {
  children: React.ReactNode
}

export function Prose({ children }: Props) {
  return (
    <div className="max-w-none mx-auto prose prose-headings:font-semibold prose-strong:font-semibold">
      {children}
    </div>
  )
}
