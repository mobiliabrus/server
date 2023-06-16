const Service = require('egg').Service;
const puppeteer = require('puppeteer');

class BrowserService extends Service {
  async launch(callback) {
    const browser = await puppeteer.launch({ args: [ '--no-sandbox' ], ignoreHTTPSErrors: true, timeout: 60000 });
    const page = await browser.newPage();
    try {
      await callback(page);
    } catch (e) {
      //
    }
    await browser.close();
  }
}

module.exports = BrowserService;
