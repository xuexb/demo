/**
 * @file 滚动懒加载
 * @author xieyaowu
 * @required $
 */

let uuid = 0;

const $window = $(window);

export default class Lazyload {
    constructor() {
        this._uuid = uuid++;
        this._stop = true;
        this._cache = {};
        this._bind();
    }

    /**
     * 绑定事件
     */
    _bind() {
        $window.on(`scroll.Lazyload-${this._uuid}`, () => {
            if (this._stop) {
                return;
            }

            if (!Object.keys(this._cache).length) {
                return;
            }

            $.each(this._cache, (key, {$elem}) => {
                // 如果不可见
                if (!($elem.width() || $elem.height()) || $elem.css('display') === 'none') {
                    return;
                }

                let offset = $elem.offset();

                if (scrollY + innerHeight >= offset.top && offset.top + $elem.height() >= scrollY) {
                    this._load(key);
                }

            });
        });
    }

    /**
     * 加载某个元素
     *
     * @param  {string} key 元素key
     */
    _load(key) {
        if (!this._cache[key]) {
            return;
        }

        let cache = this._cache[key];

        // 如果返回false则不删除
        if (cache.filter.call(this, this._cache[key].$elem[0]) === false) {
            return;
        }

        // 执行回调
        cache.callback.call(this, this._cache[key].$elem[0]);

        // 删除缓存
        delete this._cache[key];
    }

    /**
     * 追加元素
     *
     * @param  {Object} options 配置参数
     * @param {HTMLElement|selector} options.elem 元素
     * @param {Function} options.filter 元素加载前filter, 如果返回false则不加载
     * @param {Function} options.callback 元素加载后回调
     */
    push(options = {}) {
        let cache = this._cache;

        $(options.elem).each((index, elem) => {
            let $elem = $(elem);
            if ($elem.attr('data-lazyload')) {
                return;
            }

            let id = uuid++;
            $elem.attr('data-lazyload', id);
            cache[id] = {
                $elem: $elem,
                id,
                filter: options.filter || (() => true),
                callback: options.callback || (() => {})
            };

            $elem = null;
        });
    }

    /**
     * 删除某个元素
     *
     * @param  {HTMLElement|selector} elems 目标元素, 该元素需要之前绑定(push)过
     */
    remove(elems) {
        if (elems) {
            $(elems).each((index, elem) => {
                let id = $(elem).attr('data-lazyload');

                if (id && this._cache[id]) {
                    delete this._cache[id];
                }

            });
        }
        else {
            this._cache = {};
        }
    }

    /**
     * 运行
     */
    run() {
        this._stop = false;
    }

    /**
     * 停止
     */
    stop() {
        this._stop = true;
    }

    /**
     * 销毁
     */
    destroy() {
        $window.off(`scroll.Lazyload-${this._uuid}`);
        this._stop = true;
        this._cache = {};
    }
}
