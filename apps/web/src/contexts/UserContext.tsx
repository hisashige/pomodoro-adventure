import { User } from 'firebase/auth'
import { createContext, useContext, ReactNode, useState, useEffect } from 'react'

type UserConxtex = {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  token: string | null
}

const defaultUserContext: UserConxtex = {
  user: null,
  setUser: () => {},
  token: null,
}

const UserContext = createContext<UserConxtex>(defaultUserContext)

interface Props {
  children: ReactNode
}
export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState(defaultUserContext.user)
  const [token, setToken] = useState(defaultUserContext.token)

  useEffect(() => {
    if (user) {
      user.getIdToken().then((idToken) => {
        setToken(idToken)
      })
    } else {
      setToken(null)
    }
  }, [user])

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        token,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUserContext = () => useContext(UserContext)
