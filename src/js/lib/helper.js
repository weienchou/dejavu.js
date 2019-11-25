export class Helper {
    static trim(str) {
        return str.toString()
            .replace(/\/+$/, '').replace(/^\/+/, '');
    }

    static ucfirct(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    static isEmpty(str) {
        if (typeof str === 'undefined') {
            return true;
        }

        if (str == null) {
            return true;
        }

        if (str.length > 0) {
            return false;
        }

        if (str.length === 0) {
            return true;
        }

        if (typeof str !== 'string') {
            for (var key in str) {
                if (hasOwnProperty.call(str, key)) return false;
            }
        }

        return true;
    }

    static toInt(value) {
        return +value;
    }

    static waitFor(cond, limit) {
        var times = 0;
        var during = 70;
        limit = limit || 9;

        return new Promise(function(_, err) {
            if (Number(cond) === cond) {
                setTimeout(_, cond * 1000);
            } else {
                var timer = setInterval(function() {
                    times++;
                    if (cond()) {
                        clearInterval(timer);
                        _();
                    }

                    if (times > limit) {
                        clearInterval(timer);
                        err();
                    }
                }, during);
            }
        });
    };
}