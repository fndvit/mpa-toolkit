import compose from 'docker-compose';

async function initDb() {
  const opts = {
    composeOptions: ['-p mpa'],
    config: ['docker-compose.yml']
  };

  await compose.upOne('db-test', { ...opts, commandOptions: ['--force-recreate'] });
  await compose.exec('db-test', 'bash /data/load.sh', opts);
}

initDb()
  .then(() => console.log('done'))
  .catch(err => console.error(err));
