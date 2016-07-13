var Promise = require('bluebird');
var redis = require("redis");
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

function Redis() {
  this.client = redis.createClient();
}

Redis.prototype.test = function () {
  console.log('called localCache...Redis...........');
};

Redis.prototype.get = function (key) {
  return this.client.getAsync(key);
};

Redis.prototype.set = function (key, value, timeout) {
	if( timeout )
	{
		return this.client.setAsync(key, value).bind(this)
		.then(function(result) {
			return this.client.EXPIRE(key, timeout);
		});
	} else {
		return this.client.setAsync(key, value);
	}
};

Redis.prototype.getClient = function () {
  return this.client;
};

module.exports = new Redis();
