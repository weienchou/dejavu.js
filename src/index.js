import './styles.css';

global.f = require('./js/fquery.js');
global.djv = require('./js/dejavu.js');


djv.hook('test', (me) => {
    djv.log(me);
});

djv.init();
