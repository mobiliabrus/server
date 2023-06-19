module.exports = {
  schedule: {
    cron: '0 25 7-21 * * ? ',
    type: 'worker',
  },
  async task(ctx) {
    const url = 'https://zhejiang.zikao365.com/';
    const name = 'zx';
    const cache = ctx.app.cache[name] ?? [];
    ctx.service.browser.launch(url, async page => {
      await page.waitForSelector('divnewslist');
      const texts = await page.$$eval('divnewslist > .list', elements => elements.map(element => element.children[0].children[0].textContent));
      ctx.app.cache[name] = texts;
      const news = texts.filter(text => cache.indexOf(text) === -1);
      if (news.length > 0) {
        const content = news.map(text => `${text}\n`) + '\n\n' + url;
        ctx.service.ding.markdown(name, content);
      }
    });
  },
};
