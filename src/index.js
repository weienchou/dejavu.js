(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof define === 'function' && define.cmd) {
        define(function(require, exports, module) {
            module.exports = factory()
        });
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.LocalStorage = factory();
    }
})(this, function() {
    require('./styles.css');

    global.f = require('./js/fquery.js');
    global.djv = require('./js/dejavu.js');

    return [f, djv];
});