import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'

import type {
  Session,
  User,
} from '@supabase/supabase-js'

import { supabase } from '../lib/supabaseClient'


// Auth Context Type
interface AuthContextValue {
  session: Session | null
  user: User | null
  loading: boolean

  signIn: (
    email: string,
    password: string
  ) => Promise<{
    error: string | null
  }>

  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{
    error: string | null
  }>

  signOut: () => Promise<void>
}


// Create Auth Context
const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined
  )


// Auth Provider
export function AuthProvider({
  children,
}: {
  children: ReactNode
}) {

  const [session, setSession] =
    useState<Session | null>(null)

  const [loading, setLoading] =
    useState<boolean>(true)


  // Get current login session
  useEffect(() => {

    const getCurrentSession = async () => {

      try {

        const {
          data,
          error,
        } =
          await supabase.auth.getSession()

        if (error) {
          console.error(
            'Session Error:',
            error.message
          )
        }

        setSession(
          data.session
        )

      } catch (error) {

        console.error(
          'Unable to get session:',
          error
        )

      } finally {

        setLoading(false)

      }

    }


    getCurrentSession()


    // Listen for login/logout changes
    const {
      data: authListener,
    } =
      supabase.auth.onAuthStateChange(
        (
          _event,
          newSession
        ) => {

          setSession(
            newSession
          )

          setLoading(false)

        }
      )


    // Remove listener
    return () => {

      authListener.subscription.unsubscribe()

    }

  }, [])



  // SIGN IN
  const signIn:
    AuthContextValue['signIn'] =
    async (
      email,
      password
    ) => {

      try {

        const {
          error,
        } =
          await supabase.auth
            .signInWithPassword({

              email:
                email
                  .trim()
                  .toLowerCase(),

              password,

            })


        if (error) {

          console.error(
            'Login Error:',
            error.message
          )

          return {
            error:
              error.message,
          }

        }


        return {
          error: null,
        }


      } catch (error) {

        console.error(
          'Unexpected Login Error:',
          error
        )


        return {

          error:

            error instanceof Error

              ? error.message

              : 'Unable to sign in. Please try again.',

        }

      }

    }



  // SIGN UP
  const signUp:
    AuthContextValue['signUp'] =
    async (
      email,
      password,
      fullName
    ) => {

      try {

        const {

          data,

          error,

        } =
          await supabase.auth
            .signUp({

              email:
                email
                  .trim()
                  .toLowerCase(),

              password,

              options: {

                data: {

                  full_name:
                    fullName.trim(),

                },

              },

            })


        // Show signup response
        console.log(
          'Signup Response:',
          data
        )


        // Supabase error
        if (error) {

          console.error(
            'Signup Error:',
            error.message
          )


          return {

            error:
              error.message,

          }

        }


        // User not returned
        if (!data.user) {

          return {

            error:
              'Account could not be created. Please try again.',

          }

        }


        // Signup successful
        return {

          error: null,

        }


      } catch (error) {


        console.error(

          'Unexpected Signup Error:',

          error

        )


        return {

          error:

            error instanceof Error

              ? error.message

              : 'Unable to create account. Please try again.',

        }

      }

    }



  // SIGN OUT
  const signOut =
    async () => {

      try {

        const {
          error,
        } =
          await supabase.auth
            .signOut()


        if (error) {

          console.error(

            'Logout Error:',

            error.message

          )

        }


      } catch (error) {

        console.error(

          'Unexpected Logout Error:',

          error

        )

      }

    }



  // Provider
  return (

    <AuthContext.Provider

      value={{

        session,

        user:
          session?.user
          ?? null,

        loading,

        signIn,

        signUp,

        signOut,

      }}

    >

      {children}

    </AuthContext.Provider>

  )

}



// Custom Auth Hook
export function useAuth() {

  const context =
    useContext(
      AuthContext
    )


  if (!context) {

    throw new Error(

      'useAuth must be used within AuthProvider'

    )

  }


  return context

}