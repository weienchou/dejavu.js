import { Helper } from '../lib/helper.js';
import { Traveller, Route } from '../lib/traveller.js';

import { Controller } from './controller.js';
import { View } from './view.js';
import { Model } from './model.js';

import controllers from '../controllers/*.js';


// import AJAX from './ajax.js';

export class App {
    constructor() {
        this.controller = new Controller();
        this.view = new View();
        this.model = new Model();

        this.fn = {};

        this.traveller();

        djv.log('App init.')
    }

    traveller() {
        djv.hook('traveller/to', (me) => this.surf.call(this, me));

        this.fn.traveller = new Traveller();

        this.fn.traveller.register(new Route('/@module/@method/@popup/@id', (params) => this.process.call(this, params)));
        this.fn.traveller.register(new Route('/@module/@method/@id', (params) => this.process.call(this, params)));
        this.fn.traveller.register(new Route('/@module/@method', (params) => this.process.call(this, params)));
        this.fn.traveller.register(new Route('', (params) => this.process.call(this, params)));

        this.fn.traveller.notify();
    }

    surf(me) {
        const path = me.data('path');
        let replace = me.data('replace');

        replace = (djv.isset(replace) && replace === '1');

        this.fn.traveller.go(path, replace);
    }

    alert() {

    }

    process(params) {
        if (Helper.isEmpty(params)) {
            params['module'] = 'home';
            params['method'] = 'index';
        }

        if (djv.isset(params['popup'])) {
            djv.log('popup');
        } else {
            const moduleName = Helper.ucfirct(params['module']);
            const classCalled = controllers[params['module']][moduleName];

            if (djv.isset(classCalled)) {
                if (!djv.isset(this.fn[params['module']])) {
                    this.fn[params['module']] = new classCalled();
                }

                const method = this.fn[params['module']][params['method']];

                if (djv.isset(method)) {
                    djv.log(`${moduleName}::${params['method']} loaded.`);

                    method.call(this);

                    djv.init();
                    djv.log('djv.init();')
                } else {
                    djv.log(`${moduleName}::${params['method']} load failed.`);
                }
            } else {
                djv.log(`class: ${classCalled} load failed.`);
            }
        }
    }
}