import { forwardTo } from 'prisma-binding'

export default {
  createTodo: forwardTo('binding'),
  updateTodo: forwardTo('binding'),
  updateManyTodoes: forwardTo('binding'),
  upsertTodo: forwardTo('binding'),
  deleteTodo: forwardTo('binding'),
  deleteManyTodoes: forwardTo('binding')
}