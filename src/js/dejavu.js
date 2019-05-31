let d = {};

d.fn = {};
d.ta = 'deja';
d.debug = 1;

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

    console.log(
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

    d.log('Exec::start');
    me.event = evt;

    d.exec(me.get('plant')[evt.type], me);
};

d.notfound = function() {
    d.err();
};

d.exec = function(funcName, el) {
    let func = (d.check(funcName)) ? d.fn[funcName] : d['notfound'];

    d.log('EXEC::' + funcName);

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
    let plant = {};
    let el = f('.' + d.ta, box);
    el.toggleClass(d.ta + ' djv');

    el.each(ta => {
        let me = f(ta);
        let func = me.attr('vu');

        if (d.isset(func)) {
            let elist = func.replace(/\s/, '').split(',');
            elist.forEach((item) => {
                let worker = item.split(':');
                plant[worker[0]] = worker[1];
            });
        }

        me.set('plant', plant);

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
};

module.exports = d;