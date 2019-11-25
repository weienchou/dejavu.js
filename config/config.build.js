var path = require('path');
var config = require('./config.js');

config.mode = 'production';
config.devtool = 'cheap-source-map';

config.optimization = {
    runtimeChunk: false,
    concatenateModules: true,

    namedModules: true,
    namedChunks: true,
};

config.output = {
    path: path.join(__dirname, '../dist'),
    filename: 'js/[name].js',
    publicPath: '/dist/'
};

module.exports = config;