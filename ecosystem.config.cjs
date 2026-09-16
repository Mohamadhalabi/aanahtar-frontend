module.exports = {
  apps: [{
    name: 'aanahtar-frontend',
    script: '.output/server/index.mjs',
    cwd: '/home/admin2/domains/aanahtar.com.tr/aanahtar-frontend',
    exec_mode: 'fork',
    instances: 1,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    restart_delay: 2000,
    max_memory_restart: '500M',
    kill_timeout: 5000,
    time: true,
    env: {
      NODE_ENV: 'production',
      NITRO_PORT: 3000,
      NITRO_HOST: '127.0.0.1',
    },
  }],
};