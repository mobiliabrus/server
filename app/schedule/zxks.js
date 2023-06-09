const puppeteer = require('puppeteer');
const ChatBot = require('dingtalk-robot-sender');

module.exports = {
  schedule: {
    immediate: true,
    interval: '60m',
    type: 'worker',
    disable: process.env.NODE_ENV !== 'production',
  },
  async task(ctx) {
    const url = 'https://www.zjzs.net/moban/index/2c9081f061d15b160161d1661f040016_tree.html';
    const name = 'zxks';
    const cache = ctx.app.cache[name] ?? [];
    const browser = await puppeteer.launch({ ignoreHTTPSErrors: true });
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('#right_iframe');
    const frame = page.frames().find(frame => frame.name() === 'right_iframe');
    const texts = await frame.$$eval('#content > ul > li', elements => elements.map(element => element.textContent));
    ctx.app.cache[name] = texts;
    const news = texts.filter(text => cache.indexOf(text) === -1);
    if (news.length > 0) {
      const robot = new ChatBot({
        baseUrl: 'https://oapi.dingtalk.com/robot/send',
        accessToken: '51a16886f61de68e727485c5d678db2315ddc49ac89e6879bde6fb639b596a23',
        secret: 'SEC43537ccc51eb5989e1a1b47c8bae9d5d2c74d4d6ae8429ea6da1f4740bc8b8dd',
      });
      const content = news.map(text => `${text}\n`) + '\n\n' + url;
      robot.markdown(name, content);
    }
  },
};
