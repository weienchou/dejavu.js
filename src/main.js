global.f = require('./js/core/fquery.js');
global.djv = require('./js/core/dejavu.js');

window.mainUrl = 'https://cmtb.sense-info.co';
window.apiUri = '/api/';
window.baseUrl = '/dist/';
window.imgPath = '/dist/';

if (process.env.NODE_ENV === 'development') {
    window.mainUrl = 'https://f3cms.lo';
    window.baseUrl = '/';
}

// window.apiUrl = window.mainUrl + '';

djv.debug = (process.env.NODE_ENV === 'development') ? 1 : 0;
djv.apiUrl = window.mainUrl + window.apiUri;
djv.mainUri = window.mainUrl;
djv.tmplPath = window.baseUrl + 'tmpls';
djv.version = '20191125';

// const App = require('./js/core/app.js');
import { App } from './js/core/app.js';

// load main css
require('bulma');
require('./scss/styles.scss');

(function() {
    const app = new App();
})();