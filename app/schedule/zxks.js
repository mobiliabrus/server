module.exports = {
  schedule: {
    cron: '0 7 7-21 * * ? ',
    type: 'worker',
  },
  async task(ctx) {
    const url = 'https://www.zjzs.net/moban/index/2c9081f061d15b160161d1661f040016_tree.html';
    const name = 'zxks';
    const cache = ctx.app.cache[name] ?? [];
    ctx.service.browser.launch(async page => {
      await page.goto(url);
      await page.waitForSelector('#right_iframe');
      const frame = page.frames().find(frame => frame.name() === 'right_iframe');
      const texts = await frame.$$eval('#content > ul > li', elements => elements.map(element => element.textContent));
      ctx.app.cache[name] = texts;
      const news = texts.filter(text => cache.indexOf(text) === -1);
      if (news.length > 0) {
        const content = news.map(text => `${text}\n`) + '\n\n' + url;
        ctx.service.ding.markdown(name, content);
      }
    });
  },
};
