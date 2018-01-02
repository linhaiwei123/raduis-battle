export default class Clone {

    private static _instance:Clone;
    public static get instance() {
        return Clone._instance;
    }

    initialize() {
        Clone._instance = this;
    }

    clone(dst: object,...srcs:object[]) {
        for (let i = 0; i < srcs.length; i++) {
			dst = this._extend(dst, srcs[i])
		}
		return dst
    }

    private _extend(dst:object,src:object):object {
        for (let i in src) {
            if (typeof src[i] === 'object') {
                if (typeof dst[i] === 'object') {
                    dst[i] = this._extend(dst[i], src[i])
                } else {
                    if (Array.isArray(src[i])) {
                        dst[i] = this._extend([], src[i]);
                    } else {
                        dst[i] = this._extend({}, src[i])
                    }
                }
            } else {
                dst[i] = src[i]
            }
        }
        return dst
    }
}

new Clone().initialize();