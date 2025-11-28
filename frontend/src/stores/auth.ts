import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { provideApolloClient, useMutation } from '@vue/apollo-composable'
import { apolloClient } from '@/apollo'
import gql from 'graphql-tag'

interface User {
    id: string
    name: string
    email: string
}

const STORAGE_KEY = 'auth_user'

const CREATE_ACCOUNT_MUTATION = gql`
  mutation CreateAccount($input: CreateAccountInput!) {
    createAccount(input: $input) {
      success
      message
      user {
        id
        name
        email
      }
    }
  }
`

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      success
      message
      user {
        id
        name
        email
      }
    }
  }
`

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null)

    const isAuthenticated = computed(() => user.value !== null)

    const loadUser = () => {
        const storedUser = localStorage.getItem(STORAGE_KEY)
        if (storedUser) {
            try {
                user.value = JSON.parse(storedUser)
            } catch (e) {
                console.error('Failed to parse stored user:', e)
                localStorage.removeItem(STORAGE_KEY)
            }
        }
    }

    const createAccount = async (
        name: string,
        email: string,
        password: string
    ): Promise<{ success: boolean; error?: string }> => {
        try {
            provideApolloClient(apolloClient)

            const { mutate } = useMutation(CREATE_ACCOUNT_MUTATION);
            console.log(mutate, { name, email, password });
            const result = await mutate({
                input: { name, email, password }
            })

            if (result?.data?.createAccount?.success) {
                user.value = {
                    id: result.data.createAccount.user.id,
                    name: result.data.createAccount.user.name,
                    email: result.data.createAccount.user.email
                }
                localStorage.setItem(STORAGE_KEY, JSON.stringify(user.value))
                return { success: true }
            } else {
                return {
                    success: false,
                    error: result?.data?.createAccount?.message || 'Failed to create account'
                }
            }
        } catch (error: any) {
            console.error('Create account error:', error)
            return {
                success: false,
                error: error.message || 'Network error. Please try again.'
            }
        }
    }

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            provideApolloClient(apolloClient)

            const { mutate } = useMutation(LOGIN_MUTATION)
            const result = await mutate({
                input: { email, password }
            })

            if (result?.data?.login?.success) {
                user.value = {
                    id: result.data.login.user.id,
                    name: result.data.login.user.name,
                    email: result.data.login.user.email
                }
                localStorage.setItem(STORAGE_KEY, JSON.stringify(user.value))
                return true
            } else {
                return false
            }
        } catch (error) {
            console.error('Login error:', error)
            return false
        }
    }

    const logout = () => {
        user.value = null
        localStorage.removeItem(STORAGE_KEY)
    }

    loadUser()

    return {
        user,
        isAuthenticated,
        login,
        createAccount,
        logout
    }
})
