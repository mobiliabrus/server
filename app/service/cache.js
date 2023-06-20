const Service = require('egg').Service;

const cache = {};

class CacheService extends Service {
  read(name) {
    return cache[name] || [];
  }
  update(name, content) {
    cache[name] = content;
    cache.lastUpdate = {
      ...(cache.lastUpdate || {}),
      [name]: new Date().toLocaleString(),
    };
    console.log('update cache', name, content.length);
  }
}

module.exports = CacheService;
