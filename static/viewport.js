!function (a) {
    function s() {
        var c = m.getBoundingClientRect().width;
        c / u > 640 && (c = 640 * u), a.rem = c / 16, m.style.fontSize = a.rem + "px"
    }
    var u, t, r, q = window.document,
        m = q.documentElement,
        p = q.querySelector('meta[name="viewport"]'),
        o = q.querySelector('meta[name="flexible"]');
    if (p) {
        console.warn("将根据已有的meta标签来设置缩放比例");
        var n = p.getAttribute("content").match(/initial\-scale=(["']?)([\d\.]+)\1?/);
        n && (t = parseFloat(n[2]), u = parseInt(1 / t))
    }
    else {
        if (o) {
            var n = o.getAttribute("content").match(/initial\-dpr=(["']?)([\d\.]+)\1?/);
            n && (u = parseFloat(n[2]), t = parseFloat((1 / u).toFixed(2)))
        }
    }
    if (!u && !t) {
        var g = (a.navigator.appVersion.match(/android/gi), a.navigator.appVersion.match(/iphone/gi)),
            u = a.devicePixelRatio;
        u = g ? u >= 3 ? 3 : u >= 2 ? 2 : 1 : 1, t = 1 / u
    }
    if (m.setAttribute("data-dpr", u), !p) {
        if (p = q.createElement("meta"), p.setAttribute("name", "viewport"), p.setAttribute("content", "initial-scale=" + t + ", maximum-scale=" + t + ", minimum-scale=" + t + ", user-scalable=no"), m.firstElementChild) {
            m.firstElementChild.appendChild(p)
        }
        else {
            var f = q.createElement("div");
            f.appendChild(p), q.write(f.innerHTML)
        }
    }
    a.dpr = u, a.addEventListener("resize", function () {
        clearTimeout(r), r = setTimeout(s, 300)
    }, !1), a.addEventListener("pageshow", function (c) {
        a.persisted && (clearTimeout(r), r = setTimeout(b, 300))
    }, !1), "complete" === q.readyState ? q.body.style.fontSize = 28 * u + "px" : q.addEventListener("DOMContentLoaded", function () {
        q.body.style.fontSize = 28 * u + "px"
    }, !1), s()
}(window);
