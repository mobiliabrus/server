module.exports = {
  schedule: {
    ...(process.env.NODE_ENV === 'development' ? { interval: '1m' } : { cron: '0 50 7-21 * * ? ' }),
    type: 'worker',
  },
  async task(ctx) {
    const lastUpdate = ctx.service.cache.read('lastUpdate');
    const content = Object.keys(lastUpdate).map(key => `${key}: ${lastUpdate[key]}\n`);
    console.log(content);
    ctx.service.ding.markdown('health', `lastUpdate:\n${content}`);
  },
};
