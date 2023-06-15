const Service = require('egg').Service;
const ChatBot = require('dingtalk-robot-sender');

class DingService extends Service {
  async markdown(name, content) {
    const robot = new ChatBot({
      baseUrl: 'https://oapi.dingtalk.com/robot/send',
      accessToken: '51a16886f61de68e727485c5d678db2315ddc49ac89e6879bde6fb639b596a23',
      secret: 'SEC43537ccc51eb5989e1a1b47c8bae9d5d2c74d4d6ae8429ea6da1f4740bc8b8dd',
    });
    robot.markdown(name, content);
  }
}

module.exports = DingService;
