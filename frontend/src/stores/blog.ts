import { ref } from 'vue'
import { defineStore } from 'pinia'
import { provideApolloClient, useMutation, useQuery } from '@vue/apollo-composable'
import { apolloClient } from '@/apollo'
import gql from 'graphql-tag'
import { socket } from '@/socket'
import { useAuthStore } from './auth'

interface Blog {
    id: string
    title: string
    content: string
    authorId: string
    authorName: string
    authorEmail: string
    createdAt: string
}

const BLOGS_QUERY = gql`
  query {
    blogs {
      id
      title
      content
      authorId
      authorName
      authorEmail
      createdAt
    }
  }
`

const CREATE_BLOG_MUTATION = gql`
  mutation CreateBlog($input: CreateBlogInput!) {
    createBlog(input: $input) {
      id
      title
      content
      authorId
      authorName
      authorEmail
      createdAt
    }
  }
`

export const useBlogStore = defineStore('blog', () => {
    const blogs = ref<Blog[]>([])
    const isLoading = ref(false)
    const newBlogNotification = ref<{ authorName: string; title: string } | null>(null)
    const fetchBlogs = async () => {
        try {
            isLoading.value = true
            provideApolloClient(apolloClient)

            const { result } = useQuery(BLOGS_QUERY)

            await new Promise((resolve) => {
                const unwatch = result.value
                if (unwatch?.blogs) {
                    blogs.value = [...unwatch.blogs]
                    resolve(true)
                } else {
                    setTimeout(() => {
                        if (result.value?.blogs) {
                            blogs.value = [...result.value.blogs]
                        }
                        resolve(true)
                    }, 500)
                }
            })
        } catch (error) {
            console.error('Error fetching blogs:', error)
        } finally {
            isLoading.value = false
        }
    }

    const createBlog = async (
        title: string,
        content: string,
        authorId: string
    ): Promise<{ success: boolean; error?: string }> => {
        try {
            provideApolloClient(apolloClient)
            const { mutate } = useMutation(CREATE_BLOG_MUTATION)
            const result = await mutate({
                input: { title, content, authorId }
            })

            if (result?.data?.createBlog) {
                await fetchBlogs()
                return { success: true }
            } else {
                return { success: false, error: 'Failed to create blog' }
            }
        } catch (error: any) {
            console.error('Error creating blog:', error)
            return { success: false, error: error.message || 'Network error' }
        }
    }
    const setNewBlogNotification = (blog: Blog) => {
        newBlogNotification.value = {
            authorName: blog.authorName,
            title: blog.title
        }
    }

    const clearNotification = () => {
        newBlogNotification.value = null
    }

    socket.on('newBlog', (blog: Blog) => {
        console.log('New blog received via WebSocket:', blog)

        const authStore = useAuthStore()
        if (authStore.user && blog.authorId !== authStore.user.id) {
            setNewBlogNotification(blog)
        }
    })

    return {
        blogs,
        isLoading,
        newBlogNotification,
        fetchBlogs,
        createBlog,
        setNewBlogNotification,
        clearNotification
    }
})
