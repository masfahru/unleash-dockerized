const unleash = require('unleash-server');

const port = process.env.PORT || 4242;
const db = {
  ssl: process.env.POSTGRES_SSL === 'true',
  host: process.env.POSTGRES_HOST || '0.0.0.0',
  port: process.env.POSTGRES_PORT || 5432,
  database: process.env.POSTGRES_DATABASE || 'unleash',
  user: process.env.POSTGRES_USERNAME || 'unleash_user',
  password: process.env.POSTGRES_PASSWORD || 'password',
};

unleash
  .start({
    db,
    server: {
      port,
    },
  })
  .then((unleash) => {
    console.log(
      `Unleash started on http://localhost:${unleash.app.get('port')}`,
    );
  });
