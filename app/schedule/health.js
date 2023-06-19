module.exports = {
  schedule: {
    cron: '0 50 7-21 * * ? ',
    type: 'worker',
  },
  async task(ctx) {
    const content = Object.keys(ctx.app.cache).map(key => {
      if (ctx.app.cache[key]) return ctx.app.cache[key][0];
      return '';
    }).join('\n');
    if (content.length) {
      ctx.service.ding.markdown('health', `news:\n${content}`);
    }
  },
};
