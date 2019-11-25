import axios from 'axios';

export class Ajax {
    constructor() {}

    static tranx(cmd) { // show | hide
        let obj = f('body');

        if (cmd == 'hide') {
            obj.toggleClass('inTranx', false);
        } else if (cmd == 'show') {
            obj.toggleClass('inTranx', true);
        } else {
            obj.toggleClass('inTranx');
        }
    };

    static load(uri, cb) {
        axios.get(uri).then(cb).catch(Ajax.ajax_error);
    }

    static call(uri, data, cb, type, hideLoading) {
        uri = (uri.indexOf('://') == -1) ? djv.apiUrl + uri : uri;
        type = djv.isset(type) ? type : 'post';

        let opts = {
            method: type,
            url: uri,
            data: data,
            config: {
                // headers: {
                //     'Content-Type': 'multipart/form-data'
                // }
            },
            withCredentials: true,
            crossdomain: true,
            credentials: 'same-origin',
            mode: 'no-cors',
        };

        if (djv.csrf === true) {
            axios.defaults.headers.post['X-Requested-Token'] = window.csrf;
        }

        if (!hideLoading) {
            Ajax.tranx('show');
        }

        axios(opts)
            .then(function(res) {
                if (djv.csrf === true) {
                    window.csrf = (djv.isset(res.data.csrf)) ? res.data.csrf : window.csrf;
                }

                djv.log(res.data);

                if (typeof cb == 'function') {
                    cb.call(res.data);
                }
            })
            .catch(Ajax.ajax_error)
            .finally(function() {
                djv.log('AJAX:: Complete');
                if (!hideLoading) {
                    Ajax.tranx('hide');
                }
            });
    }

    static ajax_error(err) {
        if (err.response) {
            djv.err('AJAX:: ' + err.message);
            djv.log(err.stack);
        } else if (err.request) {
            djv.err('AJAX:: No result.' + err.message);
            djv.log(err.stack);
        } else {
            djv.err('AJAX:: ' + err.message);
            djv.log(err.stack);
        }
    }
}