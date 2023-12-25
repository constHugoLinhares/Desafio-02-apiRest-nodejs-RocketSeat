import type { Knex } from 'knex';

const tables = ['meals', 'users'];

export async function up(knex: Knex): Promise<void> {
  for (const table of tables) {
    await knex.schema.alterTable(`${table}`, (table) => {
      table.uuid('session_id').after('id').index();
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  for(const table of tables) {
    await knex.schema.alterTable(`${table}`, (table) => {
      table.dropColumn('session_id');
    });
  }
}
