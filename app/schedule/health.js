module.exports = {
  schedule: {
    ...(process.env.NODE_ENV === 'development' ? { interval: '1m' } : { cron: '0 8 7-21 * * ? ' }),
    type: 'worker',
  },
  async task(ctx) {
    const hour = new Date().getHours();
    const lastUpdate = ctx.service.cache.read('lastUpdate');
    const content = '#### health\n' + Object.keys(lastUpdate).map(key => `- ${key}: ` + (hour === new Date(lastUpdate[key]).getHours() ? '<font color="#006600">✓</font>' : '<font color="#dd0000">×</font>')).join('\n');
    console.log(content);
    ctx.service.ding.markdown('health', content);
  },
};
