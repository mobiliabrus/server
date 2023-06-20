module.exports = {
  schedule: {
    cron: '0 1 7-21 * * ? ',
    type: 'worker',
    immediate: process.env.NODE_ENV === 'development',
  },
  async task(ctx) {
    const url = 'http://www.hzjyksy.cn/';
    const name = 'hzjyksy';
    const cache = ctx.service.cache.read(name);
    ctx.service.browser.launch(url, async page => {
      await page.waitForSelector('.article_tab');
      const texts = await page.$$eval('.article_tab > div.bd > div > div.con.cms_show > ul li', elements => elements.map(element => element.children[1].textContent.replace('\n', '(' + element.children[2].textContent + ')')));
      ctx.service.cache.update(name, texts);
      const news = texts.filter(text => cache.indexOf(text) === -1);
      if (news.length > 0) {
        const content = news.map(text => `${text}\n`) + '\n\n' + url;
        ctx.service.ding.markdown(name, content);
      }
    });
  },
};
