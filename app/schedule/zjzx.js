module.exports = {
  schedule: {
    cron: '0 5 7-21 * * ? ',
    type: 'worker',
  },
  async task(ctx) {
    const url = 'https://zk.zjzs.net/Index/index.aspx';
    const name = 'zjzx';
    const cache = ctx.app.cache[name] ?? [];
    ctx.service.browser.launch(async page => {
      await page.goto(url);
      await page.waitForSelector('.news-list');
      const texts = await page.$$eval('.news-list > a', elements => elements.map(element => element.textContent));
      ctx.app.cache[name] = texts;
      const news = texts.filter(text => cache.indexOf(text) === -1);
      if (news.length > 0) {
        const content = news.map(text => `${text}\n`) + '\n\n' + url;
        ctx.service.ding.markdown(name, content);
      }
    });
  },
};
