module.exports = {
  schedule: {
    interval: '60m',
    type: 'worker',
    immediate: true,
  },
  async task(ctx) {
    await ctx.app.runSchedule('health');
    await ctx.app.runSchedule('hzjyksy');
    await ctx.app.runSchedule('pets');
    await ctx.app.runSchedule('shks');
    await ctx.app.runSchedule('zjzx');
    await ctx.app.runSchedule('zx');
    await ctx.app.runSchedule('zxks');
  },
};
