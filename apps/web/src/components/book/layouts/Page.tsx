import { ReactNode } from 'react'

type Props = {
  header?: string
  number: number
  children: ReactNode
}
const Page: React.FC<Props> = ({ header, number, children }: Props) => {
  return (
    <>
      <div className="page-content">
        <h2 className="page-header">{header ?? number}</h2>
        {children}
      </div>
      <div className="page-footer">{number + 1}</div>
    </>
  )
}

export default Page
