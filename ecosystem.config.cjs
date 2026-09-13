module.exports = {
  apps: [{
    name: 'aanahtar-frontend',
    script: '.output/server/index.mjs',
    cwd: '/home/admin2/domains/aanahtar.com.tr/aanahtar-frontend',
    exec_mode: 'fork',
    instances: 1,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      NITRO_PORT: 3000,
      NITRO_HOST: '127.0.0.1',
      BACKEND_ORIGIN: 'https://api.aanahtar.com.tr',
      NUXT_PUBLIC_SITE_URL: 'https://aanahtar.com.tr',
      CLIENT_KEY_WEB: 'daa91e53c3d6955969cdf6a847b605805538237ee242e4b47622ff35688b2dfc',
    },
  }],
};
