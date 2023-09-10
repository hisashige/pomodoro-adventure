import { createContext, useContext, useRef, ReactNode, useState } from 'react'

type BookContext = {
  bookRef: React.MutableRefObject<any | null> | null
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  totalPage: number
  setTotalPage: React.Dispatch<React.SetStateAction<number>>
  orientation: string
  setOrientation: React.Dispatch<React.SetStateAction<string>>
  pageState: string
  setPageState: React.Dispatch<React.SetStateAction<string>>
}
const defaultBookContext = {
  bookRef: null,
  page: 0,
  setPage: () => {},
  totalPage: 0,
  setTotalPage: () => {},
  orientation: 'portrait',
  setOrientation: () => {},
  pageState: 'read',
  setPageState: () => {},
}
const BookContext = createContext<BookContext>(defaultBookContext)

interface Props {
  children: ReactNode
}
export const BookProvider = ({ children }: Props) => {
  const bookRef = useRef<any | null>(defaultBookContext.bookRef)
  const [page, setPage] = useState(defaultBookContext.page)
  const [totalPage, setTotalPage] = useState(defaultBookContext.totalPage)
  const [orientation, setOrientation] = useState('portrait')
  const [pageState, setPageState] = useState('read')

  return (
    <BookContext.Provider
      value={{
        bookRef,
        page,
        setPage,
        totalPage,
        setTotalPage,
        orientation,
        setOrientation,
        pageState,
        setPageState,
      }}
    >
      {children}
    </BookContext.Provider>
  )
}

export const useBookContext = () => useContext(BookContext)
