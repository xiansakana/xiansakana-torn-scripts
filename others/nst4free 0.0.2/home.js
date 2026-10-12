!(function () {
    var t = {
        61: function (t, e, n) {
          var r = n(698).default;
          function o() {
            "use strict";
            (t.exports = o =
              function () {
                return e;
              }),
              (t.exports.__esModule = !0),
              (t.exports.default = t.exports);
            var e = {},
              n = Object.prototype,
              a = n.hasOwnProperty,
              i =
                Object.defineProperty ||
                function (t, e, n) {
                  t[e] = n.value;
                },
              c = "function" == typeof Symbol ? Symbol : {},
              l = c.iterator || "@@iterator",
              u = c.asyncIterator || "@@asyncIterator",
              s = c.toStringTag || "@@toStringTag";
            function f(t, e, n) {
              return (
                Object.defineProperty(t, e, {
                  value: n,
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                }),
                t[e]
              );
            }
            try {
              f({}, "");
            } catch (t) {
              f = function (t, e, n) {
                return (t[e] = n);
              };
            }
            function d(t, e, n, r) {
              var o = e && e.prototype instanceof v ? e : v,
                a = Object.create(o.prototype),
                c = new _(r || []);
              return i(a, "_invoke", { value: A(t, n, c) }), a;
            }
            function h(t, e, n) {
              try {
                return { type: "normal", arg: t.call(e, n) };
              } catch (t) {
                return { type: "throw", arg: t };
              }
            }
            e.wrap = d;
            var p = {};
            function v() {}
            function y() {}
            function m() {}
            var g = {};
            f(g, l, function () {
              return this;
            });
            var b = Object.getPrototypeOf,
              w = b && b(b(j([])));
            w && w !== n && a.call(w, l) && (g = w);
            var x = (m.prototype = v.prototype = Object.create(g));
            function E(t) {
              ["next", "throw", "return"].forEach(function (e) {
                f(t, e, function (t) {
                  return this._invoke(e, t);
                });
              });
            }
            function L(t, e) {
              function n(o, i, c, l) {
                var u = h(t[o], t, i);
                if ("throw" !== u.type) {
                  var s = u.arg,
                    f = s.value;
                  return f && "object" == r(f) && a.call(f, "__await")
                    ? e.resolve(f.__await).then(
                        function (t) {
                          n("next", t, c, l);
                        },
                        function (t) {
                          n("throw", t, c, l);
                        },
                      )
                    : e.resolve(f).then(
                        function (t) {
                          (s.value = t), c(s);
                        },
                        function (t) {
                          return n("throw", t, c, l);
                        },
                      );
                }
                l(u.arg);
              }
              var o;
              i(this, "_invoke", {
                value: function (t, r) {
                  function a() {
                    return new e(function (e, o) {
                      n(t, r, e, o);
                    });
                  }
                  return (o = o ? o.then(a, a) : a());
                },
              });
            }
            function A(t, e, n) {
              var r = "suspendedStart";
              return function (o, a) {
                if ("executing" === r)
                  throw new Error("Generator is already running");
                if ("completed" === r) {
                  if ("throw" === o) throw a;
                  return { value: void 0, done: !0 };
                }
                for (n.method = o, n.arg = a; ; ) {
                  var i = n.delegate;
                  if (i) {
                    var c = k(i, n);
                    if (c) {
                      if (c === p) continue;
                      return c;
                    }
                  }
                  if ("next" === n.method) n.sent = n._sent = n.arg;
                  else if ("throw" === n.method) {
                    if ("suspendedStart" === r) throw ((r = "completed"), n.arg);
                    n.dispatchException(n.arg);
                  } else "return" === n.method && n.abrupt("return", n.arg);
                  r = "executing";
                  var l = h(t, e, n);
                  if ("normal" === l.type) {
                    if (
                      ((r = n.done ? "completed" : "suspendedYield"), l.arg === p)
                    )
                      continue;
                    return { value: l.arg, done: n.done };
                  }
                  "throw" === l.type &&
                    ((r = "completed"), (n.method = "throw"), (n.arg = l.arg));
                }
              };
            }
            function k(t, e) {
              var n = e.method,
                r = t.iterator[n];
              if (void 0 === r)
                return (
                  (e.delegate = null),
                  ("throw" === n &&
                    t.iterator.return &&
                    ((e.method = "return"),
                    (e.arg = void 0),
                    k(t, e),
                    "throw" === e.method)) ||
                    ("return" !== n &&
                      ((e.method = "throw"),
                      (e.arg = new TypeError(
                        "The iterator does not provide a '" + n + "' method",
                      )))),
                  p
                );
              var o = h(r, t.iterator, e.arg);
              if ("throw" === o.type)
                return (
                  (e.method = "throw"), (e.arg = o.arg), (e.delegate = null), p
                );
              var a = o.arg;
              return a
                ? a.done
                  ? ((e[t.resultName] = a.value),
                    (e.next = t.nextLoc),
                    "return" !== e.method &&
                      ((e.method = "next"), (e.arg = void 0)),
                    (e.delegate = null),
                    p)
                  : a
                : ((e.method = "throw"),
                  (e.arg = new TypeError("iterator result is not an object")),
                  (e.delegate = null),
                  p);
            }
            function S(t) {
              var e = { tryLoc: t[0] };
              1 in t && (e.catchLoc = t[1]),
                2 in t && ((e.finallyLoc = t[2]), (e.afterLoc = t[3])),
                this.tryEntries.push(e);
            }
            function T(t) {
              var e = t.completion || {};
              (e.type = "normal"), delete e.arg, (t.completion = e);
            }
            function _(t) {
              (this.tryEntries = [{ tryLoc: "root" }]),
                t.forEach(S, this),
                this.reset(!0);
            }
            function j(t) {
              if (t) {
                var e = t[l];
                if (e) return e.call(t);
                if ("function" == typeof t.next) return t;
                if (!isNaN(t.length)) {
                  var n = -1,
                    r = function e() {
                      for (; ++n < t.length; )
                        if (a.call(t, n))
                          return (e.value = t[n]), (e.done = !1), e;
                      return (e.value = void 0), (e.done = !0), e;
                    };
                  return (r.next = r);
                }
              }
              return { next: O };
            }
            function O() {
              return { value: void 0, done: !0 };
            }
            return (
              (y.prototype = m),
              i(x, "constructor", { value: m, configurable: !0 }),
              i(m, "constructor", { value: y, configurable: !0 }),
              (y.displayName = f(m, s, "GeneratorFunction")),
              (e.isGeneratorFunction = function (t) {
                var e = "function" == typeof t && t.constructor;
                return (
                  !!e &&
                  (e === y || "GeneratorFunction" === (e.displayName || e.name))
                );
              }),
              (e.mark = function (t) {
                return (
                  Object.setPrototypeOf
                    ? Object.setPrototypeOf(t, m)
                    : ((t.__proto__ = m), f(t, s, "GeneratorFunction")),
                  (t.prototype = Object.create(x)),
                  t
                );
              }),
              (e.awrap = function (t) {
                return { __await: t };
              }),
              E(L.prototype),
              f(L.prototype, u, function () {
                return this;
              }),
              (e.AsyncIterator = L),
              (e.async = function (t, n, r, o, a) {
                void 0 === a && (a = Promise);
                var i = new L(d(t, n, r, o), a);
                return e.isGeneratorFunction(n)
                  ? i
                  : i.next().then(function (t) {
                      return t.done ? t.value : i.next();
                    });
              }),
              E(x),
              f(x, s, "Generator"),
              f(x, l, function () {
                return this;
              }),
              f(x, "toString", function () {
                return "[object Generator]";
              }),
              (e.keys = function (t) {
                var e = Object(t),
                  n = [];
                for (var r in e) n.push(r);
                return (
                  n.reverse(),
                  function t() {
                    for (; n.length; ) {
                      var r = n.pop();
                      if (r in e) return (t.value = r), (t.done = !1), t;
                    }
                    return (t.done = !0), t;
                  }
                );
              }),
              (e.values = j),
              (_.prototype = {
                constructor: _,
                reset: function (t) {
                  if (
                    ((this.prev = 0),
                    (this.next = 0),
                    (this.sent = this._sent = void 0),
                    (this.done = !1),
                    (this.delegate = null),
                    (this.method = "next"),
                    (this.arg = void 0),
                    this.tryEntries.forEach(T),
                    !t)
                  )
                    for (var e in this)
                      "t" === e.charAt(0) &&
                        a.call(this, e) &&
                        !isNaN(+e.slice(1)) &&
                        (this[e] = void 0);
                },
                stop: function () {
                  this.done = !0;
                  var t = this.tryEntries[0].completion;
                  if ("throw" === t.type) throw t.arg;
                  return this.rval;
                },
                dispatchException: function (t) {
                  if (this.done) throw t;
                  var e = this;
                  function n(n, r) {
                    return (
                      (i.type = "throw"),
                      (i.arg = t),
                      (e.next = n),
                      r && ((e.method = "next"), (e.arg = void 0)),
                      !!r
                    );
                  }
                  for (var r = this.tryEntries.length - 1; r >= 0; --r) {
                    var o = this.tryEntries[r],
                      i = o.completion;
                    if ("root" === o.tryLoc) return n("end");
                    if (o.tryLoc <= this.prev) {
                      var c = a.call(o, "catchLoc"),
                        l = a.call(o, "finallyLoc");
                      if (c && l) {
                        if (this.prev < o.catchLoc) return n(o.catchLoc, !0);
                        if (this.prev < o.finallyLoc) return n(o.finallyLoc);
                      } else if (c) {
                        if (this.prev < o.catchLoc) return n(o.catchLoc, !0);
                      } else {
                        if (!l)
                          throw new Error(
                            "try statement without catch or finally",
                          );
                        if (this.prev < o.finallyLoc) return n(o.finallyLoc);
                      }
                    }
                  }
                },
                abrupt: function (t, e) {
                  for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                    var r = this.tryEntries[n];
                    if (
                      r.tryLoc <= this.prev &&
                      a.call(r, "finallyLoc") &&
                      this.prev < r.finallyLoc
                    ) {
                      var o = r;
                      break;
                    }
                  }
                  o &&
                    ("break" === t || "continue" === t) &&
                    o.tryLoc <= e &&
                    e <= o.finallyLoc &&
                    (o = null);
                  var i = o ? o.completion : {};
                  return (
                    (i.type = t),
                    (i.arg = e),
                    o
                      ? ((this.method = "next"), (this.next = o.finallyLoc), p)
                      : this.complete(i)
                  );
                },
                complete: function (t, e) {
                  if ("throw" === t.type) throw t.arg;
                  return (
                    "break" === t.type || "continue" === t.type
                      ? (this.next = t.arg)
                      : "return" === t.type
                        ? ((this.rval = this.arg = t.arg),
                          (this.method = "return"),
                          (this.next = "end"))
                        : "normal" === t.type && e && (this.next = e),
                    p
                  );
                },
                finish: function (t) {
                  for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                    var n = this.tryEntries[e];
                    if (n.finallyLoc === t)
                      return this.complete(n.completion, n.afterLoc), T(n), p;
                  }
                },
                catch: function (t) {
                  for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                    var n = this.tryEntries[e];
                    if (n.tryLoc === t) {
                      var r = n.completion;
                      if ("throw" === r.type) {
                        var o = r.arg;
                        T(n);
                      }
                      return o;
                    }
                  }
                  throw new Error("illegal catch attempt");
                },
                delegateYield: function (t, e, n) {
                  return (
                    (this.delegate = {
                      iterator: j(t),
                      resultName: e,
                      nextLoc: n,
                    }),
                    "next" === this.method && (this.arg = void 0),
                    p
                  );
                },
              }),
              e
            );
          }
          (t.exports = o),
            (t.exports.__esModule = !0),
            (t.exports.default = t.exports);
        },
        698: function (t) {
          function e(n) {
            return (
              (t.exports = e =
                "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
                  ? function (t) {
                      return typeof t;
                    }
                  : function (t) {
                      return t &&
                        "function" == typeof Symbol &&
                        t.constructor === Symbol &&
                        t !== Symbol.prototype
                        ? "symbol"
                        : typeof t;
                    }),
              (t.exports.__esModule = !0),
              (t.exports.default = t.exports),
              e(n)
            );
          }
          (t.exports = e),
            (t.exports.__esModule = !0),
            (t.exports.default = t.exports);
        },
        687: function (t, e, n) {
          var r = n(61)();
          t.exports = r;
          try {
            regeneratorRuntime = r;
          } catch (t) {
            "object" == typeof globalThis
              ? (globalThis.regeneratorRuntime = r)
              : Function("r", "regeneratorRuntime = r")(r);
          }
        },
      },
      e = {};
    function n(r) {
      var o = e[r];
      if (void 0 !== o) return o.exports;
      var a = (e[r] = { exports: {} });
      return t[r](a, a.exports, n), a.exports;
    }
    (n.n = function (t) {
      var e =
        t && t.__esModule
          ? function () {
              return t.default;
            }
          : function () {
              return t;
            };
      return n.d(e, { a: e }), e;
    }),
      (n.d = function (t, e) {
        for (var r in e)
          n.o(e, r) &&
            !n.o(t, r) &&
            Object.defineProperty(t, r, { enumerable: !0, get: e[r] });
      }),
      (n.o = function (t, e) {
        return Object.prototype.hasOwnProperty.call(t, e);
      }),
      (function () {
        "use strict";
        function t(t, e, n, r, o, a, i) {
          try {
            var c = t[a](i),
              l = c.value;
          } catch (t) {
            return void n(t);
          }
          c.done ? e(l) : Promise.resolve(l).then(r, o);
        }
        function e(e) {
          return function () {
            var n = this,
              r = arguments;
            return new Promise(function (o, a) {
              var i = e.apply(n, r);
              function c(e) {
                t(i, o, a, c, l, "next", e);
              }
              function l(e) {
                t(i, o, a, c, l, "throw", e);
              }
              c(void 0);
            });
          };
        }
        var r = n(687),
          o = n.n(r);
        function a() {
          for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++)
            e[n] = arguments[n];
          return new Promise(function (t) {
            chrome.runtime.sendMessage(e, function (e) {
              t(e);
            });
          });
        }
        function i(t) {
          return t.status || console.log(t), t;
        }
        function c(t) {
          return Math.round(t)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        function l(t, e) {
          return Object.assign(document.createElement(t), e);
        }
        function u(t, e) {
          var n;
          return null === (n = document) ||
            void 0 === n ||
            null === (n = n.getElementById(t)) ||
            void 0 === n
            ? void 0
            : n.appendChild(e);
        }
        function s(t, e) {
          var n,
            r =
              null === (n = document) || void 0 === n
                ? void 0
                : n.getElementById(t);
          if (r && r.parentElement) return r.parentElement.insertBefore(e, r);
        }
        function f() {
          return d.apply(this, arguments);
        }
        function d() {
          return (d = e(
            o().mark(function t() {
              return o().wrap(function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      return (
                        (t.next = 2),
                        a({ name: "msgReadKey", value: "nstMember" })
                          .then(function (t) {
                            return (
                              !Array.isArray(t) &&
                              !(!t.status || !t.data) &&
                              t.data
                            );
                          })
                          .catch(function (t) {
                            return i({
                              status: !1,
                              fromWhere: "getGlobs",
                              message: "you shall not pass",
                              data: t,
                            });
                          })
                      );
                    case 2:
                      return t.abrupt("return", t.sent);
                    case 3:
                    case "end":
                      return t.stop();
                  }
              }, t);
            }),
          )).apply(this, arguments);
        }
        function h() {
          return (h = e(
            o().mark(function t() {
              return o().wrap(function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      return (t.next = 2), f();
                    case 2:
                      if (t.sent) {
                        t.next = 5;
                        break;
                      }
                      return t.abrupt("return", !1);
                    case 5:
                      return t.abrupt(
                        "return",
                        a(
                          { name: "msgReadKey", value: "nstScripts" },
                          { name: "msgReadKey", value: "nstUser" },
                          { name: "msgReadKey", value: "nstApikey" },
                          { name: "msgReadKey", value: "nstFight" },
                          { name: "msgReadKey", value: "nstUserData" },
                        ),
                      );
                    case 6:
                    case "end":
                      return t.stop();
                  }
              }, t);
            }),
          )).apply(this, arguments);
        }
        function p(t) {
          for (
            var e = ["K", "M", "B", "T", "Q"], n = Math.abs(t), r = 0;
            r < e.length;
            r++
          )
            if (!((n /= 1e3) >= 1e3))
              return "".concat(+n.toFixed(2), " ").concat(e[r]);
        }
        var v = [];
        function y(t, e) {
          document.querySelector(t) ? e() : v.push([t, e]);
        }
        new MutationObserver(function (t) {
          t.forEach(function (t) {
            for (var e = 0, n = Array.from(t.addedNodes); e < n.length; e++) {
              var r = n[e];
              if (r.querySelector)
                for (var o = v.length; o--; ) {
                  var a = v[o];
                  r.querySelector(a[0]) && (a[1](), v.splice(o, 1));
                }
            }
          });
        }).observe(document.documentElement, { childList: !0, subtree: !0 }),
          (function () {
            return h.apply(this, arguments);
          })().then(function (t) {
            if (t && Array.isArray(t)) {
              var e,
                n,
                r = t[0].data;
              switch (
                ((e = document.body.getAttribute("data-traveling")),
                (n = document.body.getAttribute("data-abroad")),
                "false" == e && "false" == n
                  ? "home"
                  : "true" == e && "true" == n
                    ? "trav"
                    : "false" == e && "true" == n
                      ? "abro"
                      : "".concat(e, ", ").concat(n))
              ) {
                case "home":
                  y(".battle", function () {
                    var t = document.querySelector(".battle");
                    if (t) {
                      for (
                        var e = t.getElementsByTagName("ul")[0],
                          n = { Strength: 0, Defense: 0, Speed: 0, Dexterity: 0 },
                          r = 0,
                          o = 0,
                          a = Array.from(e.children);
                        o < a.length;
                        o++
                      ) {
                        var i = a[o].getAttribute("aria-label");
                        if (!i) return;
                        var f = i.split(" ");
                        if (f.length > 2) {
                          var d = f[0].replaceAll(":", ""),
                            h = +f[1].replaceAll(",", ""),
                            p = f[2].replaceAll("%", ""),
                            v = p.charAt(0),
                            y = +p.replace(/^[+−-]/, ""),
                            m = "+" == v ? y / 100 + 1 : 1 - y / 100;
                          (n[d] = Math.round(h * m)), (r += Math.round(h * m));
                        }
                      }
                      !(function (t, e, n) {
                        var r = "\n  ".concat(
                          (function (t) {
                            var e =
                              arguments.length > 1 && void 0 !== arguments[1]
                                ? arguments[1]
                                : "";
                            return (
                              t.includes("Crimes") &&
                                (e =
                                  " title=\"click a crime's image to add it, click a crime's image in the box to remove it\""),
                              '<div class="nstBoxHeader">\n<span class="nstBoxTitle"><span id="nstBoxTitle"'
                                .concat(e, ">")
                                .concat(t, "</span></span>\n</div>")
                            );
                          })("Effective Stats"),
                          '\n  <div id="nstEffective" class="nstStatList" cont-gray bottom-round>\n    <ul id="nstEffectiveUL">\n    </ul>\n  </div>\n  ',
                        );
                        t.insertAdjacentHTML("afterend", r),
                          t.classList.remove("bottom-round");
                        for (var o = 0, a = Object.keys(e); o < a.length; o++) {
                          var i = a[o];
                          u(
                            "nstEffectiveUL",
                            l("li", { tabIndex: 0, role: "row" }),
                          ).appendChild(
                            l("span", {
                              id: "eff".concat(i),
                              classList: "stats",
                              innerText: c(e[i]),
                            }),
                          );
                          var f = s(
                            "eff".concat(i),
                            l("span", { classList: "nstDivider" }),
                          );
                          if (!f) return;
                          f.appendChild(l("span", { innerText: "".concat(i) }));
                        }
                        u(
                          "nstEffectiveUL",
                          l("li", { tabIndex: 0, classList: "last" }),
                        ).appendChild(
                          l("span", {
                            id: "effTotal",
                            classList: "stats",
                            innerText: c(n),
                          }),
                        );
                        var d = s(
                          "effTotal",
                          l("span", { classList: "nstDivider" }),
                        );
                        d && d.appendChild(l("span", { innerText: "Total" }));
                      })(t, n, r);
                    }
                  }),
                    a({ name: "msgReadKey", value: "nstUserData" })
                      .then(function (t) {
                        if (!Array.isArray(t) && t.status) {
                          var e = 'ul.info-cont-wrap [aria-label^="Networth"]';
                          y(e, function () {
                            if (t.data) {
                              var n = "",
                                o = document.querySelector(e),
                                a = null == o ? void 0 : o.parentElement,
                                i = t.data.networth,
                                u = t.data.personalstats,
                                s = Math.round(+i.total - +u.networth),
                                f = s > 0 ? " green" : s < 0 ? " red" : "",
                                d = "<b class='"
                                  .concat(f, "'>$")
                                  .concat(c(s), "</b>");
                              if (r.netDetails.enabled) {
                                n +=
                                  '<li>\n        <table class="nstRow nstNWtable">\n          <tr>\n            <th>type</th>\n            <th>live</th>\n            <th>diff</th>\n          </tr>';
                                for (
                                  var h = 0,
                                    v = [
                                      "auction house",
                                      "bank",
                                      "bazaar",
                                      "bookie",
                                      "cayman",
                                      "company",
                                      "display case",
                                      "items",
                                      "piggybank",
                                      "points",
                                      "stock market",
                                      "total",
                                      "cash",
                                    ];
                                  h < v.length;
                                  h++
                                ) {
                                  var y = v[h],
                                    m = void 0,
                                    g = void 0;
                                  switch (y) {
                                    case "cash":
                                      (m = +i.wallet + +i.vault),
                                        (g =
                                          +u.networthwallet + +u.networthvault);
                                      break;
                                    case "total":
                                      (m = +i.total), (g = +u.networth);
                                      break;
                                    default:
                                      (m = +i["".concat(y.replaceAll(" ", ""))]),
                                        (g =
                                          +u[
                                            "networth".concat(
                                              y.replaceAll(" ", ""),
                                            )
                                          ]);
                                  }
                                  var b = Math.round(m - g),
                                    w = b > 0 ? " green" : b < 0 ? " red" : "";
                                  0 !== b &&
                                    (n += "\n            <tr>\n            <td>"
                                      .concat(y, "</td>\n            <td>$")
                                      .concat(
                                        p(m),
                                        '</td>\n            <td class="',
                                      )
                                      .concat(w, '">$')
                                      .concat(p(b), "</td>\n            </tr>"));
                                }
                                n += "</table></li>";
                              }
                              null == a ||
                                a.appendChild(
                                  l("div", { classList: "nstNetworth" }),
                                ),
                                (null == a
                                  ? void 0
                                  : a.lastChild
                                ).insertAdjacentHTML(
                                  "afterbegin",
                                  '<li>\n          <span class="divider">\n            <span>Live Networth</span>\n          </span>\n          <span class="desc'
                                    .concat(f, '">$')
                                    .concat(
                                      c(+i.total),
                                      '\n          <i class="networth-info-icon" title="',
                                    )
                                    .concat(
                                      d,
                                      '"></i>\n          </span>\n          </li>\n          ',
                                    )
                                    .concat(n),
                                );
                            }
                          });
                        }
                      })
                      .catch(function (t) {
                        i({
                          status: !1,
                          fromWhere: "liveNetworth",
                          message: "error reading storage",
                          data: t,
                        });
                      });
                  break;
                case "trav":
                  document.head.appendChild(
                    l("style", {
                      innerText:
                        "\n      .travel-agency-travelling .stage,\n      .travel-agency-travelling .stage + hr,\n      .travel-agency-travelling .popup-info {\n        display: none !important;\n      }",
                    }),
                  );
                  break;
                case "abro":
                  document.addEventListener("dblclick", function (t) {
                    var e = null == t ? void 0 : t.target;
                    if ("INPUT" === (null == e ? void 0 : e.tagName))
                      for (
                        var n = e,
                          r = 0,
                          o = Array.from(
                            document.querySelectorAll(".delimiter > .msg"),
                          );
                        r < o.length;
                        r++
                      ) {
                        var a = o[r];
                        if (a.children.length) {
                          var c,
                            l,
                            u,
                            s = +(
                              (null === (c = document) ||
                              void 0 === c ||
                              null ===
                                (c = c.querySelector(
                                  ".travel-agency-market .availableItemsAmount",
                                )) ||
                              void 0 === c
                                ? void 0
                                : c.getAttribute("value")) || 0
                            ),
                            f = +Array.from(a.children)
                              .find(function (t) {
                                return t.innerText.includes("$");
                              })
                              .innerText.replace("$", "")
                              .replaceAll(",", ""),
                            d = +(
                              null == n ||
                              null === (l = n.parentElement) ||
                              void 0 === l ||
                              null === (l = l.parentElement) ||
                              void 0 === l ||
                              null === (l = l.parentElement) ||
                              void 0 === l ||
                              null === (l = l.parentElement) ||
                              void 0 === l
                                ? void 0
                                : l.querySelector(".cost .c-price")
                            ).innerText
                              .replace("$", "")
                              .replaceAll(",", ""),
                            h = +(
                              null == n ||
                              null === (u = n.parentElement) ||
                              void 0 === u ||
                              null === (u = u.parentElement) ||
                              void 0 === u ||
                              null === (u = u.parentElement) ||
                              void 0 === u ||
                              null === (u = u.parentElement) ||
                              void 0 === u
                                ? void 0
                                : u.querySelector(".stock .stck-amount")
                            ).innerText.replaceAll(",", ""),
                            p = f / d >= s ? s : Math.trunc(f / d),
                            v = Math.min(p, h),
                            y = new Event("input", {
                              bubbles: !0,
                              simulated: !0,
                            });
                          (n.value = "".concat(v)),
                            n.dispatchEvent(y),
                            n.select();
                        }
                      }
                    else
                      i({
                        status: !1,
                        fromWhere: "bazaarAutoPrice",
                        message: "wrong dblclick",
                        data: e,
                      });
                  });
              }
            }
          });
      })();
  })();
  