import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface GlossaryTerm {
  term: string
  definition: string
  category: string
}

interface GlossaryCategoryProps {
  category: string
  terms: GlossaryTerm[]
}

export function GlossaryCategory({ category, terms }: GlossaryCategoryProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl">{category}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-4">
          {terms.map((item) => (
            <div key={item.term}>
              <dt className="font-semibold text-primary">{item.term}</dt>
              <dd className="text-muted-foreground mt-1">{item.definition}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}
