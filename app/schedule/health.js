module.exports = {
  schedule: {
    cron: '0 1 7-21 * * ? ',
    type: 'worker',
    immediate: true,
  },
  async task(ctx) {
    ctx.service.ding.markdown('health', 'ok');
  },
};
