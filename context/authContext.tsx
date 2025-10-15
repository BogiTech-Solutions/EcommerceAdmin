"use client"
import React, { createContext, ReactNode } from 'react'
const AuthContext=createContext({})

function AuthProvider({children}:{children:ReactNode}) {
  return (
    <AuthContext.Provider value={{}}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider