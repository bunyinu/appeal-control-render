const chokidar = require('chokidar');
const { exec } = require('child_process');
const nodemon = require('nodemon');

const nodeEnv = process.env.NODE_ENV || 'dev_stage';
const childEnv = {
    ...process.env,
    NODE_ENV: nodeEnv,
    ENABLE_DEMO_SEEDING: process.env.ENABLE_DEMO_SEEDING || 'true',
};

const migrationsWatcher = chokidar.watch('./src/db/migrations', {
    persistent: true,
    ignoreInitial: true
});
migrationsWatcher.on('add', () => {
    exec('npm run db:migrate', { env: childEnv }, (error, stdout, stderr) => {
        if (error) {
            console.error(stderr);
        }
    });
});

const seedersWatcher = chokidar.watch('./src/db/seeders', {
    persistent: true,
    ignoreInitial: true
});
seedersWatcher.on('add', () => {
    exec('npm run db:seed', { env: childEnv }, (error, stdout, stderr) => {
        if (error) {
            console.error(stderr);
        }
    });
});

nodemon({
    script: './src/index.js',
    env: childEnv,
    ignore: ['./src/db/migrations', './src/db/seeders'],
    delay: '500'
});
