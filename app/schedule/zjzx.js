module.exports = {
  schedule: {
    cron: '0 5 7-21 * * ? ',
    type: 'worker',
    // immediate: process.env.NODE_ENV === 'development',
  },
  async task(ctx) {
    const url = 'https://zk.zjzs.net/Index/index.aspx';
    const name = 'zjzx';
    const cache = ctx.service.cache.read(name);
    ctx.service.browser.launch(url, async page => {
      await page.waitForSelector('.news-list');
      const texts = await page.$$eval('.news-list > a', elements => elements.map(element => element.textContent));
      ctx.service.cache.update(name, texts);
      const news = texts.filter(text => cache.indexOf(text) === -1);
      if (news.length > 0) {
        const content = `#### ${name}\n` + news.slice(0, 5).map(text => `- ${text}`).join('\n') + `\n\n<${url}>\n`;
        ctx.service.ding.markdown(name, content);
      }
    });
  },
};
