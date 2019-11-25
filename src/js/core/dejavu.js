let d = {};

d.fn = {};
d.ta = 'deja';
d.debug = 1;

d.tmpls = {};

d.version = '201905-2';

d.apiUrl = '';
d.csrf = false;

d.isset = function(ta, type) {
    if (typeof ta === 'undefined' || ta === null) {
        return false;
    } else {
        if (typeof type !== 'undefined') {
            return typeof ta === type;
        } else {
            return true;
        }
    }
};

d.check = function(ta) {
    return d.isset(d.fn[ta]);
};

d.log = function(...msg) {
    if (!d.isset(console) || d.debug !== 1) {
        return true;
    }

    console.log('DEJAVU::', msg.length === 1 ? msg[0] : msg);
};

d.err = function(...msg) {
    if (!d.isset(console) || d.debug !== 1) {
        return true;
    }

    console.error(
        '%cDEJAVU:: Error::',
        'color: #ffcc00',
        msg.length === 1 ? msg[0] : msg ? msg : 'Unkown'
    );
};

d.handler = function(evt) {
    let me = f(this);
    if (me.attr('data-nopde') != 1) {
        evt.preventDefault();
        d.log('NOPDE');
    }

    d.log('Exec::handler', evt.type);
    me.event = evt;

    d.exec(me.store('plant')[evt.type], me);
};

d.notfound = function() {
    d.err();
};

d.exec = function(funcName, el) {
    let func = (d.check(funcName)) ? d.fn[funcName] : d['notfound'];

    d.log('Exec::' + funcName);

    return func.call(this, el);
};

d.hook = function(funcName, func, evt) {
    if (!d.check(funcName)) {
        d.fn[funcName] = func;
    } else {
        d.log(funcName + ' overwrite');
    }
};

d.init = box => {
    let el = f('.' + d.ta, box);

    el.toggleClass(d.ta + ' djv');

    el.each(ta => {
        let plant = {};
        let me = f(ta);
        let func = me.attr('vu');

        if (d.isset(func)) {
            let elist = func.replace(/\s/, '').split(',');
            elist.forEach((item) => {
                let worker = item.split(':');
                plant[worker[0]] = worker[1];
            });
        }

        me.store('plant', plant);

        Object.keys(plant).map(function(k) {
            if (!d.check(plant[k])) {
                d.err(plant[k] + ' Load Fail.');
            } else {
                if (k.toLowerCase() === 'init') {
                    d.exec(plant[k], me);
                } else {
                    me.on(k, d.handler);
                }
            }
        });
    });

    el.toggleClass('djv');
};

d.fn.bubble = function(me) {
    let ta = f(me.event.target);
    if (!ta.attr('func')) {
        ta = ta.closest('[func]');
    }

    if (d.isset(ta)) {
        let func = ta.attr('func');
        if (d.check(func)) {
            ta.event = me.event;
            d.exec(func, ta);
        }
    }
};

module.exports = d;