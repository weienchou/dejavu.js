import { Helper } from './helper.js'

export class Traveller {
    constructor() {
        this.routes = [];
        this.root = '/';
        this.mode = 'history';

        this.path = this.current();

        // listen
        if (this.mode === 'history') {
            window.addEventListener('popstate', this.listen.bind(this));
        } else {
            window.addEventListener('hashchange', this.listen.bind(this));
        }
    }

    // send current url to the routes
    listen(e) {
        let cur = this.current();

        if (this.mode === 'hash') {
            cur = cur.replace('#', '');
        }

        if (this.path !== cur) {
            this.path = cur;
            this.notify(cur);
        }
    }

    // get the current url
    current() {
        let fragment = '';

        fragment = Helper.trim(decodeURI(location.pathname + location.hash));
        fragment = fragment.replace(/\?(.*)$/, '');
        fragment = this.root != '/' ? fragment.replace(Helper.trim(this.root), '') : fragment;

        return Helper.trim(fragment);
    }

    // send the url to routes
    notify(url) {
        url = (typeof url === 'undefined') ? this.current() : url;
        let match = false;

        // 逐一對routes檢查
        for (let i = 0; i < this.routes.length; i++) {

            if (this.routes[i].decide(url)) {
                match = true;
                break;
            }
        }
    }

    // register the route
    register(route) {
        if (!(route instanceof Route)) {
            return false;
        }

        this.routes.push(route);
        return true;
    }

    // travel to the path
    go(path, replace) {
        const trimPath = Helper.trim(path);

        let url = this.root + trimPath;

        if (this.mode === 'hash') {
            url = `${Helper.trim(this.root)}#${trimPath}`;
        }

        if (!!replace) {
            window.history.replaceState(null, null, url);
        } else {
            window.history.pushState(null, null, url);
        }

        this.listen();
    }

    setRoot(rootPath) {
        this.root = '/';

        rootPath = Helper.trim(rootPath);

        if (typeof rootPath === 'string' && rootPath !== '') {
            this.root = `/${rootPath}/`;
        }
    }
}

export class Route {
    /**
     * @param  [string] pattern route pattern, e.g. @a/@b/@c
     * @param  [string] act     action after hit
     */
    constructor(pattern, act) {
        const trimedPattern = Helper.trim(pattern);

        this.slug = trimedPattern;
        this.parts = trimedPattern.split('/');
        // this.default = typeof defs === 'undefined' ? false : defs;

        if (typeof act === 'function') {
            this.act = act;
        }
    }

    /**
     * Traveler will call this when get a new redirect path
     * @param  [url] url 
     * @return [bool]    
     */
    decide(url) {
        const urlParts = url.split('/');
        const params = {};

        if (urlParts.length !== this.parts.length) {
            return false;
        }

        for (let i = 0; i < urlParts.length; i += 1) {
            const isParam = /^@/.test(this.parts[i]);

            if (!isParam && (urlParts[i] !== this.parts[i])) {
                return false;
            }

            if (isParam) {
                params[this.parts[i].slice(1)] = urlParts[i];
            }
        }

        if (typeof this.act === 'function') {
            this.act.call(this, params); // put the url parts which has '@' into the callback
        }

        return true;
    }
}