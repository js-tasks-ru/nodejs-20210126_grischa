const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.prceededDataLength = 0;
    this.limit = options.limit || 8;
  }

  _transform(chunk, encoding, callback) {
    const buffer = new Buffer(chunk);
    this.prceededDataLength = this.prceededDataLength + buffer.byteLength;
    if (this.prceededDataLength > this.limit) {
      return callback(new LimitExceededError());
    }
    this.push(chunk);
    callback();
  }
}

module.exports = LimitSizeStream;
