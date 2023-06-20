module.exports = {
  schedule: {
    cron: '0 4 7-21 * * ? ',
    type: 'worker',
    immediate: process.env.NODE_ENV === 'development',
  },
  async task(ctx) {
    const url = 'https://www.zjzs.net/moban/index/2c9081f061d15b160161d1664ccd0018_tree.html';
    const name = 'shks';
    const cache = ctx.service.cache.read(name);
    ctx.service.browser.launch(url, async page => {
      await page.waitForSelector('#right_iframe');
      const frame = page.frames().find(frame => frame.name() === 'right_iframe');
      const texts = await frame.$$eval('#content > ul > li', elements => elements.map(element => element.textContent));
      ctx.service.cache.update(name, texts);
      const news = texts.filter(text => cache.indexOf(text) === -1);
      if (news.length > 0) {
        const content = news.map(text => `${text}\n`) + '\n\n' + url;
        ctx.service.ding.markdown(name, content);
      }
    });
  },
};
