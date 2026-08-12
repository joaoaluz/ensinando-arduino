export type ComponentInfo = {
  id: string
  icon: string
  name: string
  /** Função do componente. Só é revelada quando `showRole` é verdadeiro. */
  role: string
}

type Props = {
  item: ComponentInfo
  /** Mostra a função do componente (depois que o aluno descobriu). */
  showRole?: boolean
  found?: boolean
}

/** Card de um componente da bancada (§14). */
export function ComponentCard({ item, showRole = false, found = false }: Props) {
  return (
    <div className={`comp ${found ? 'comp--found' : ''}`}>
      <span className="comp__icon" aria-hidden="true">
        {item.icon}
      </span>
      <div className="comp__name">{item.name}</div>
      <div className="comp__role">{showRole ? item.role : '???'}</div>
    </div>
  )
}

export function ComponentGrid({
  items,
  revealed = [],
}: {
  items: ComponentInfo[]
  revealed?: string[]
}) {
  return (
    <div className="comp-grid">
      {items.map((item) => (
        <ComponentCard
          key={item.id}
          item={item}
          showRole={revealed.includes(item.id)}
          found={revealed.includes(item.id)}
        />
      ))}
    </div>
  )
}
