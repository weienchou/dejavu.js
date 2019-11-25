var path = require('path');
var config = require('./config.js');

config.devtool = 'eval';
config.mode = 'development';
config.devServer = {
    host: '127.0.0.1',
    port: '8080',
    disableHostCheck: true,
};

module.exports = config;