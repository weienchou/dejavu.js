import { Ajax } from '../lib/ajax.js';
import { Helper } from '../lib/helper.js';

import { Dropdown } from '../lib/dropdown.js';

export class View {
    constructor() {
        this.container = f('#main-container');
        this.dropdownInit();

        this.tmpls = {};
        this.tmplsEngine = require('template7');
    }

    dropdownInit() {
        this.dropdown = new Dropdown();
        djv.hook('dropdown/click', (me) => this.dropdown.click(me));
    }

    show(str, ta) {
        ta = (!djv.isset(ta)) ? this.container : ta;
        
        ta.html(str);
    }

    load(src, ta) {
        let set = function(html) {
            ta.html(html);

            Helper.waitFor(function() {
                return !ta.is(':empty');
            }).then(function() {
                djv.init(ta);
            });
        }

        let success = function(res) {
            djv.tmpls['tmp-' + src] = res.data;
            set(res.data);
        }

        ta = (djv.isset(ta, 'string')) ? djv.find('#' + ta) : ta;
        ta = (!djv.isset(ta)) ? this.container : ta;
        if (!djv.isset(djv.tmpls['tmp-' + src])) {
            let url = djv.tmplPath + '/' + src + '.html?v=' + djv.version;
            djv.log('Load html ' + url);

            Ajax.load(url, success);
        } else {
            set(djv.tmpls['tmp-' + src]);
        }
    }
}