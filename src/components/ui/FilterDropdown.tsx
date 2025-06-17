export function FilterDropdown({ options, onChange }: any) {
  return <select onChange={onChange}>{options?.map((opt: any) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select>;
}