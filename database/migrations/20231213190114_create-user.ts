import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('users', (table) => {
        table.uuid('id')
        table.text('name').notNullable()
        table.text('cpf').unique().notNullable();
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('users')
}

