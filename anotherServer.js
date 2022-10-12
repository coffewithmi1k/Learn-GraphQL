const express = require('express')
const expressGraphQL = require('express-graphql')
const {
GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList,
    GraphQLInt, GraphQLNonNull
} = require('graphql');

const app = express();

/*const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'My_first_schema',
        fields: () => ({
            message: {
                type: GraphQLString,
                resolve: () => 'Hello u did your fist schema'
            }
        })
    })
})*/

const authors = [
    { id: 1, name: 'J. K. Rowling' },
    { id: 2, name: 'J. R. R. Tolkien' },
    { id: 3, name: 'Brent Weeks' }
]

const books = [
    { id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
    { id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
    { id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
    { id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
    { id: 5, name: 'The Two Towers', authorId: 2 },
    { id: 6, name: 'The Return of the King', authorId: 2 },
    { id: 7, name: 'The Way of Shadows', authorId: 3 },
    { id: 8, name: 'Beyond the Shadows', authorId: 3 }
]

const rootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    description: 'This is root query where all other queries will be formed from',
    fields: () => ({
        books: {
            type: new GraphQLList(BookType),
            description: 'List of books',
            resolve: () => books
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: 'List of authors',
            resolve: () => authors
        },
        book: {
            type: BookType,
            description: 'Name of the book',
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (parent, args) => books.find((book) => book.id === args.id)

        },
        author: {
            type: AuthorType,
            description: 'Single Author instance',
            args: {
                id: { type: GraphQLInt}
            },
            resolve: (parent, args) => authors.find((author) => author.id === args.id)
        },
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Authors',
    description: 'List of Authors',
    fields : () => ({
        id: {type: GraphQLNonNull(GraphQLInt)},
        name: {type : GraphQLNonNull(GraphQLString)},
        books:{
            type: new GraphQLList(BookType),
            description: 'List of books for that specific author',
            resolve: (author) => {
              return  books.filter(book => book.authorId === author.id)
            }
        }
    })
})

const BookType = new GraphQLObjectType({
    name: 'BookType',
    description: 'just description what can be done with books',
    fields: () => ({
        id : { type : GraphQLNonNull(GraphQLInt) },
        name: { type : GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLString) },
        author: {
            type: AuthorType,
            description: 'List of Authors',
            resolve: (book) => {
              return  authors.find((author) => author.id === book.authorId)

            }
        }
    })
})

const rootMutation = new GraphQLObjectType({
    name: 'Mutation GraphQL',
    description: 'root mutation',
    fields: () => ({
        addBook: {
            type: BookType,
            description: 'Add a new book',
            args: {
                name : {type: GraphQLNonNull(GraphQLString)},
                authorId : {type: GraphQLNonNull(GraphQLInt)},
            },
            resolve: (parent, args) => {
              const book = {id: books.length+1, name: args.name, authorId: args.authorId}
                books.push(book);
              return books;
            }
        }
    })
})

const schema = new GraphQLSchema({
    query: rootQuery,
    mutation: rootMutation,
})



app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}))
app.listen(5000, () => console.log('Server Running'))