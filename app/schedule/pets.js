module.exports = {
  schedule: {
    cron: '0 3 7-21 * * ? ',
    type: 'worker',
    // immediate: process.env.NODE_ENV === 'development',
  },
  async task(ctx) {
    const url = 'https://pets.neea.edu.cn/';
    const name = 'pets';
    const cache = ctx.service.cache.read(name);
    ctx.service.browser.launch(url, async page => {
      await page.waitForSelector('#ReportIDname');
      const texts = await page.$$eval('#ReportIDname > a', elements => elements.map(element => element.textContent));
      ctx.service.cache.update(name, texts);
      const news = texts.filter(text => cache.indexOf(text) === -1);
      if (news.length > 0) {
        const content = `#### ${name}\n` + news.slice(0, 5).map(text => `- ${text}`).join('\n') + `\n\n<${url}>\n`;
        ctx.service.ding.markdown(name, content);
      }
    });
  },
};
