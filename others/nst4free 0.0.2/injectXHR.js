!(function (t) {
    const e = window.XMLHttpRequest.prototype.open,
      n = window.XMLHttpRequest.prototype.send;
    let s = {};
    function o(t) {
      const e = {};
      for (const n of t.split("&")) {
        const t = n.split("=");
        e[t[0]] = t[1];
      }
      return e;
    }
    (s.itemsNoConfirm = (t, e) => {
      if (!t.url.includes("item.php")) return e;
      if (!e) return e;
      const { step: n, action: s, confirm: i } = o(e);
      return "actionForm" !== n || "equip" !== s || 1 === i
        ? e
        : (function (t) {
            const e = [];
            for (const n in t) e.push(n + "=" + t[n]);
            return e.join("&");
          })({ ...o(e), confirm: 1 });
    }),
      (window.XMLHttpRequest.prototype.open = function (t, n) {
        let s = this.params ?? {};
        return (
          (this.method = t),
          (this.url = n),
          (this.params = s),
          this.addEventListener("readystatechange", function () {
            if (this.readyState > 3 && 200 === this.status) {
              const t = this.responseURL.substring(
                this.responseURL.indexOf("torn.com/") + 9,
                this.responseURL.indexOf(".php"),
              );
              let e, n;
              !(function (t) {
                if (!t || "" === t) return !1;
                try {
                  JSON.parse(t);
                } catch (t) {
                  return !1;
                }
                return !0;
              })(this.response)
                ? (n = (function (t, e) {
                    const n = decodeURIComponent(
                      (t || window.location.href).slice(
                        window.location.href.indexOf("?") + 1,
                      ),
                    ).split("&");
                    let s = {};
                    return (
                      n.forEach((t) => {
                        const e = t.split("=", 2);
                        s[e[0]] = e[1];
                      }),
                      s
                    );
                  })(this.responseURL))
                : (e = JSON.parse(this.response)),
                window.dispatchEvent(
                  new CustomEvent("nstXHR", {
                    detail: {
                      page: t,
                      json: e,
                      uri: n,
                      xhr: {
                        ...this,
                        response: this.response,
                        responseURL: this.responseURL,
                      },
                    },
                  }),
                );
            }
          }),
          e.apply(this, arguments)
        );
      }),
      (window.XMLHttpRequest.prototype.send = function (t) {
        if (((this.params = this.params ?? {}), "object" == typeof s))
          for (let e in s)
            "function" == typeof s[e] && (t = s[e]({ ...this }, t));
        return (this.requestBody = t), n.apply(this, arguments);
      });
  })();
  