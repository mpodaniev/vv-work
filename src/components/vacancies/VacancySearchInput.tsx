interface VacancySearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function VacancySearchInput({ value, onChange, placeholder }: VacancySearchInputProps) {
  return (
    <input
      type="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder ?? 'Search vacancies…'}
      aria-label="Search vacancies"
      className="w-full rounded-md border border-border bg-bg px-4 py-2 text-fg placeholder:text-muted focus-visible:outline-none"
    />
  )
}
