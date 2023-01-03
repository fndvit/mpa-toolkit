import { initDatabase, DbSeeder } from '@mpa/db';
const db = initDatabase();
const seeder = new DbSeeder(db);
seeder
  .migrate()
  .then(() => console.debug('done'))
  .catch(e => console.error(e));
