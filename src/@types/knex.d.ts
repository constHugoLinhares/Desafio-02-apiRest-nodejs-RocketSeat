// eslint-disable-next-line
import { Knex } from 'knex'
// ou faça apenas:
// import 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    meals: {
      id: string
      description: string
      inDiet: boolean
      created_at: string
      session_id?: string
    }
    users: {
      id: string
      name: string
      session_id?: string
    }
  }
}
