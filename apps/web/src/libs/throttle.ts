import _throttle from 'lodash.throttle'
import { useCallback, useRef } from 'react'

const THROTTLE_TIME = 1000

export const throttle = (fn: (...args: any) => any, delay = THROTTLE_TIME) => {
  const fnRef = useRef(fn)
  fnRef.current = fn

  return useCallback(
    _throttle(
      (...args) => {
        fnRef.current(...args)
      },
      delay,
      { trailing: false }
    ),
    []
  )
}
