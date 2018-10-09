import gql from 'graphql-tag'
import graphQLClient from './graphQLClient'
import minDelay from 'p-min-delay'

// Fetch list of todoes
export const fetchTodoes = async () => {
  // Get sorted todoes by dueDate ASC.
  const query = gql`
    query {
      todoes(orderBy: dueDate_ASC) {
        id
        title
        isDone
        dueDate
      }
    }
  `

  const { todoes } = await graphQLClient.request(query)

  return todoes
}

// Fetch single todo
export const fetchTodo = async (id) => {
  const query = gql`
    query getTodo($id: ID!) {
      todo(where: {
        id: $id
      }) {
        id
        title
        isDone
        dueDate
      }
    }
  `

  const { todo } = await graphQLClient.request(query, { id })
  return todo
}

// Delete single todo
export const deleteTodo = async (id) => {
  const query = gql`
    mutation deleteTodo($id: ID!) {
      deleteTodo(where: {
        id: $id
      }) {
        id
        title
        isDone
        dueDate
      }
    }
  `

  const { deleteTodo } = await minDelay(graphQLClient.request(query, { id }), 300)
  return deleteTodo
}

// Update/Create single todo
export const upsertTodo = async (id, todoData) => {
  const query = gql`
    mutation upsertTodo($id: ID, $createTodoData: TodoCreateInput!, $updateTodoData: TodoUpdateInput!) {
      upsertTodo(create: $createTodoData, update: $updateTodoData, where: {id: $id}) {
        id
        title
        isDone
        dueDate
      }
    }
  `

  // Add p-min-delay for better ux :)
  const { upsertTodo } = await minDelay(graphQLClient.request(query, {
    id: id === 'new' ? '' : id,
    createTodoData: todoData,
    updateTodoData: todoData
  }), 300)

  return upsertTodo
}