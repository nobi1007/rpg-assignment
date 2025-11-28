import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'

const httpLink = createHttpLink({
    uri: 'http://localhost:3200/graphql',
})

const cache = new InMemoryCache()

export const apolloClient = new ApolloClient({
    link: httpLink,
    cache,
})
