class Unit {
    constructor(el) {
        this.units = el;
        this.length = el.length;
        return this;
    }

    toggleClass(toggleClass, force) {
        let tc = toggleClass.split(' ');

        this.units.forEach(function(el) {
            tc.forEach(function(c) {
                if (typeof force !== 'undefined') {
                    if (force) {
                        if (!el.classList.contains(c)) {
                            el.classList.add(c);
                        }
                    } else {
                        el.classList.remove(c);
                    }
                } else {
                    el.classList.toggle(c);
                }
            });
        });

        return this;
    }

    each(callback) {
        this.units.forEach(callback);
    }

    attr(name, value) {
        if (typeof value !== 'undefined') {
            this.units.forEach(function(el) {
                el.setAttribute(name, value);
            });
            return this;
        } else {
            return this.units[0].getAttribute(name);
        }
    }

    data(name, value) {
        name = 'data-' + name;

        return this.attr(name, value);
    }

    on(type, callback) {
        this.units.forEach(function(el) {
            f.n.store.set(el, type, callback);
            el.addEventListener(type, f.n.store.get(el, type));
        });
    }

    off(type) {
        this.units.forEach(function(el) {
            el.removeEventListener(type, f.n.store.get(el, type));
        });
    }

    /* --- * * --- */

    set(k, v) {
        return f.n.store.set(this.units[0], k, v);
    }

    get(k) {
        return f.n.store.get(this.units[0], k);
    }

    /* --- * * --- */
}

let f = (selector, box) => {
    let el;
    box = typeof box !== 'undefined' ? box : document;

    if (selector instanceof Object) {
        return new Unit([selector]);
    } else {
        if (selector instanceof HTMLElement) {
            el = [selector];
        } else {
            let matches = selector.match(/^<(\w+)>$/);

            if (matches) {
                el = [document.createElement(matches[1])];
            } else {
                el = Array.prototype.slice.call(box.querySelectorAll(selector));
            }
        }

        return new Unit(el);
    }
};

f.n = {};

f.n.store = {
    _storage: new WeakMap(),
    set: function(ele, k, o) {
        if (!this._storage.has(ele)) {
            this._storage.set(ele, new Map());
        }

        this._storage.get(ele).set(k, o);
    },
    get: function(ele, k) {
        return this._storage.get(ele).get(k);
    },
    has: function(ele, k) {
        return this._storage.has(ele) && this._storage.get(ele).has(k);
    },
    remove: function(ele, k) {
        var ret = this._storage.get(ele).delete(k);
        if (!this._storage.get(k).size === 0) {
            this._storage.delete(ele);
        }
        return ret;
    }
}

module.exports = f;