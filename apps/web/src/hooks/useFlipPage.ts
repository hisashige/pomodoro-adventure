import { useBookContext } from '../contexts/BookContext'

const useFlipPage = () => {
  const {
    bookRef,
    page,
    setPage,
    totalPage,
    setTotalPage,
    orientation,
    setOrientation,
    pageState,
    setPageState,
  } = useBookContext()

  const toNextPage = () => {
    bookRef?.current?.pageFlip().flipNext()
  }

  const toPrevPage = () => {
    bookRef?.current?.pageFlip().flipPrev()
  }

  const toPage = (pageNum: number) => {
    bookRef?.current?.pageFlip().turnToPage(pageNum)
  }

  const onPage = (e: any) => {
    setPage(e.data)
    setTotalPage(bookRef?.current?.pageFlip()?.getPageCount() ?? 0)
  }

  const onChangeOrientation = (e: any) => {
    setOrientation(e.data)
  }

  const onChangePageState = (e: any) => {
    setPageState(e.data)
  }

  return {
    bookRef,
    page,
    totalPage,
    orientation,
    pageState,
    toNextPage,
    toPrevPage,
    toPage,
    onPage,
    onChangeOrientation,
    onChangePageState,
  }
}

export default useFlipPage
