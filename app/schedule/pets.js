module.exports = {
  schedule: {
    cron: '0 10 7-21 * * ? ',
    type: 'worker',
  },
  async task(ctx) {
    const url = 'https://pets.neea.edu.cn/';
    const name = 'pets';
    const cache = ctx.app.cache[name] ?? [];
    ctx.service.browser.launch(url, async page => {
      await page.waitForSelector('#ReportIDname');
      const texts = await page.$$eval('#ReportIDname > a', elements => elements.map(element => element.textContent));
      ctx.app.cache[name] = texts;
      const news = texts.filter(text => cache.indexOf(text) === -1);
      if (news.length > 0) {
        const content = news.map(text => `${text}\n`) + '\n\n' + url;
        ctx.service.ding.markdown(name, content);
      }
    });
  },
};
