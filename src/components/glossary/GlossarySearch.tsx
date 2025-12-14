import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { GLOSSARY_TERMS, searchGlossaryTerms } from '@/data/glossary'
import type { GlossaryTerm } from '@/data/glossary'

interface GlossarySearchProps {
  onTermSelect: (term: GlossaryTerm) => void
}

export function GlossarySearch({ onTermSelect }: GlossarySearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GlossaryTerm[]>([])
  const [showResults, setShowResults] = useState(false)

  const handleSearch = (value: string) => {
    setQuery(value)
    if (value.length >= 2) {
      const found = searchGlossaryTerms(value)
      setResults(found.slice(0, 5))
      setShowResults(true)
    } else {
      setResults([])
      setShowResults(false)
    }
  }

  const handleSelect = (term: GlossaryTerm) => {
    onTermSelect(term)
    setQuery('')
    setShowResults(false)
  }

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search terms..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-10"
        onFocus={() => query.length >= 2 && setShowResults(true)}
        onBlur={() => setTimeout(() => setShowResults(false), 200)}
      />
      {showResults && results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg">
          {results.map((term) => (
            <button
              key={term.term}
              className="w-full px-4 py-2 text-left hover:bg-muted first:rounded-t-md last:rounded-b-md"
              onClick={() => handleSelect(term)}
            >
              <div className="font-medium">{term.term}</div>
              <div className="text-sm text-muted-foreground truncate">{term.definition}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
