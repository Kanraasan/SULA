import { SearchIcon } from "lucide-react"
import { Field } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group"

interface SearchFormProps extends React.ComponentProps<"form"> {
  searchValue: string
  onSearchChange: (val: string) => void
}

export function SearchForm({ searchValue, onSearchChange, ...props }: SearchFormProps) {
  return (
    <form {...props} onSubmit={(e) => e.preventDefault()}>
      <Field orientation="horizontal">
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon className="size-4" />
          </InputGroupAddon>
          <InputGroupInput 
            className="w-sm" 
            placeholder="Search reports by title or reporter name..." 
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </InputGroup>
      </Field>
    </form>
  )
}