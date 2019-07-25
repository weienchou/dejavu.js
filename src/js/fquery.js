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

    removeAttr(name) {
        if (typeof value !== 'undefined') {
            this.units.forEach(function(el) {
                el.removeAttr(name);
            });
            return this;
        } else {
            return this;
        }
    }

    data(name, value) {
        name = 'data-' + name;

        return this.attr(name, value);
    }

    val(value) {
        if (typeof value === 'undefined') {
            return this.units[0].value;
        } else {
            this.units.forEach(function(el) {
                el.value = value;
            });
            return this;
        }
    }

    css(prop, value) {
        if (typeof value === 'undefined') {
            return this.units[0].style.getPropertyValue(prop);
        } else {
            this.units.forEach(function(el) {
                el.style[prop] = value;
            });
            return this;
        }
    }

    text(string) {
        if (typeof string !== 'undefined') {
            this.units.forEach(function(el) {
                el.innerText = string;
            });

            return this;
        } else {
            let text = '';
            this.units.forEach(function(element) {
                text += element.innerText;
            });

            return text;
        }
    }

    remove() {
        this.units.forEach(function(el) {
            el.remove();
        });

        return this;
    }

    find(selector) {
        var matching = [],
            query, cur;

        this.units.forEach(function(el) {
            query = el.querySelectorAll(selector);

            cur = Array.prototype.slice.call(query);
            cur.forEach(function(match) {
                if (matching.indexOf(match) === -1) {
                    matching.push(match);
                }
            });
        });

        return new Unit(matching);
    }

    siblings(selector) {
        var matching = [];
        let parent = f(this.units[0]).parent();
        let child = f(parent.units[0]).children();

        child.each((el) => {
            let ta = f(el);
            
            if (ta.is(selector) && !el.isEqualNode(this.units[0])) {
                matching.push(el);
            }
        });

        return new Unit(matching);
    }

    closest(selector) {
        let ele = f(this.get(0));

        do {
            if (ele.is(selector)) {
                return ele;
            }

            ele = ele.parent();
        } while (ele.get(0) !== null);

        return null;
    }

    parent() {
        var parents = [],
            currentParent;

        this.units.forEach(function(el) {
            // debugger
            currentParent = el.parentElement;

            if (parents.indexOf(currentParent) === -1) {
                parents.push(currentParent);
            }
        });

        return new Unit(parents);
    }

    children() {
        var allChildren = [],
            newChildren;

        this.units.forEach(function(el) {
            newChildren = Array.prototype.slice.call(el.children);

            allChildren = allChildren.concat(newChildren);
        });

        return new Unit(allChildren);
    }

    get(index) {
        return this.units[index];
    }

    isElement(selector) {
        let ele = this.units[0];

        try {
            return ele instanceof HTMLElement;
        } catch (e) {
            return (typeof ele === "object") &&
                (ele.nodeType === 1) && (typeof ele.style === "object") &&
                (typeof ele.ownerDocument === "object");
        }
    }

    is(selector) {
        if (this.length == 0) {
            return false;
        }

        let ele = this.units[0];
        return (ele) ? ele.matches(selector) : false;
    }

    append(arg) {
        if (arg instanceof Unit) {
            arg.units.forEach(function(el) {
                el.appendChild(el.cloneNode(true));
            }.bind(this));
        } else if (arg instanceof HTMLElement) {
            this.units[0].appendChild(arg.cloneNode(true));
        } else if (typeof arg === 'string') {
            this.units.forEach(function(el) {
                el.innerHTML += arg;
            });
        }

        return this;
    }

    prepend(arg) {
        if (arg instanceof Unit) {
            arg.units.forEach(function(el) {
                el.insertBefore(arg.cloneNode(true), el.firstChild);
            }.bind(this));
        } else if (arg instanceof HTMLElement) {
            this.units[0].insertBefore(arg.cloneNode(true), el.firstChild);
        } else if (typeof arg === 'string') {
            this.units.forEach(function(el) {
                el.innerHTML = arg + el.innerHTML;
            });
        }

        return this;
    }

    html(string) {
        if (typeof string !== 'undefined') {
            this.units.forEach(function(el) {
                el.innerHTML = string;
            });

            return this;
        } else {
            return this.units[0].innerHTML;
        }
    }

    empty() {
        this.html('');
        return this;
    }

    prop(name, value) {
        if (typeof value !== 'undefined') {
            this.units.forEach(function(el) {
                el[name] = value;
            });
            return this;
        } else {
            return this.units[0][name];
        }
    };


    /* --- * * --- */

    serialize() {
        let form = this.units[0];
        let serialized = [];

        for (let i = 0; i < form.elements.length; i++) {
            let field = form.elements[i];

            if (!field.name || field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') {
                continue;
            }

            if (field.type === 'select-multiple') {
                for (let n = 0; n < field.options.length; n++) {
                    if (!field.options[n].selected) {
                        continue;
                    }

                    serialized.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.options[n].value));
                }
            } else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
                serialized.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value));
            }
        }

        return serialized.join('&');
    }

    /* --- * * --- */

    get outerHTML() {
        return this.units[0].outerHTML;
    }

    set outerHTML(newHtml) {
        return this.units[0].outerHTML = newHtml;
    }

    get class() {
        return this.units[0].className;
    }

    set class(newClass) {
        return this.units[0].className = newClass;
    }

    /* --- * * --- */

    on(type, callback) {
        this.units.forEach(function(el) {
            let ta = f(el);
            ta.store(type, callback);
            el.addEventListener(type, ta.store(type));
        });
    }

    off(type) {
        this.units.forEach(function(el) {
            let ta = f(el);
            el.removeEventListener(type, ta.store(type));
        });
    }

    /* --- * * --- */

    store(name, value) {
        if (typeof value !== 'undefined') {
            f.n.store.set(this.units[0], name, value);
            return this;
        } else {
            return f.n.store.get(this.units[0], name);
        }
    }
}

let f = (selector, box) => {
    let el;
    box = typeof box !== 'undefined' ? box.units[0] : document;

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