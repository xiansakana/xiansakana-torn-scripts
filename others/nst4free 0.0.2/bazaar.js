!(function () {
    var t = {
        61: function (t, e, r) {
          var n = r(698).default;
          function o() {
            "use strict";
            (t.exports = o =
              function () {
                return e;
              }),
              (t.exports.__esModule = !0),
              (t.exports.default = t.exports);
            var e = {},
              r = Object.prototype,
              a = r.hasOwnProperty,
              i =
                Object.defineProperty ||
                function (t, e, r) {
                  t[e] = r.value;
                },
              u = "function" == typeof Symbol ? Symbol : {},
              c = u.iterator || "@@iterator",
              s = u.asyncIterator || "@@asyncIterator",
              l = u.toStringTag || "@@toStringTag";
            function f(t, e, r) {
              return (
                Object.defineProperty(t, e, {
                  value: r,
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
              f = function (t, e, r) {
                return (t[e] = r);
              };
            }
            function h(t, e, r, n) {
              var o = e && e.prototype instanceof v ? e : v,
                a = Object.create(o.prototype),
                u = new S(n || []);
              return i(a, "_invoke", { value: _(t, r, u) }), a;
            }
            function p(t, e, r) {
              try {
                return { type: "normal", arg: t.call(e, r) };
              } catch (t) {
                return { type: "throw", arg: t };
              }
            }
            e.wrap = h;
            var d = {};
            function v() {}
            function y() {}
            function m() {}
            var g = {};
            f(g, c, function () {
              return this;
            });
            var b = Object.getPrototypeOf,
              x = b && b(b(A([])));
            x && x !== r && a.call(x, c) && (g = x);
            var w = (m.prototype = v.prototype = Object.create(g));
            function L(t) {
              ["next", "throw", "return"].forEach(function (e) {
                f(t, e, function (t) {
                  return this._invoke(e, t);
                });
              });
            }
            function E(t, e) {
              function r(o, i, u, c) {
                var s = p(t[o], t, i);
                if ("throw" !== s.type) {
                  var l = s.arg,
                    f = l.value;
                  return f && "object" == n(f) && a.call(f, "__await")
                    ? e.resolve(f.__await).then(
                        function (t) {
                          r("next", t, u, c);
                        },
                        function (t) {
                          r("throw", t, u, c);
                        },
                      )
                    : e.resolve(f).then(
                        function (t) {
                          (l.value = t), u(l);
                        },
                        function (t) {
                          return r("throw", t, u, c);
                        },
                      );
                }
                c(s.arg);
              }
              var o;
              i(this, "_invoke", {
                value: function (t, n) {
                  function a() {
                    return new e(function (e, o) {
                      r(t, n, e, o);
                    });
                  }
                  return (o = o ? o.then(a, a) : a());
                },
              });
            }
            function _(t, e, r) {
              var n = "suspendedStart";
              return function (o, a) {
                if ("executing" === n)
                  throw new Error("Generator is already running");
                if ("completed" === n) {
                  if ("throw" === o) throw a;
                  return { value: void 0, done: !0 };
                }
                for (r.method = o, r.arg = a; ; ) {
                  var i = r.delegate;
                  if (i) {
                    var u = k(i, r);
                    if (u) {
                      if (u === d) continue;
                      return u;
                    }
                  }
                  if ("next" === r.method) r.sent = r._sent = r.arg;
                  else if ("throw" === r.method) {
                    if ("suspendedStart" === n) throw ((n = "completed"), r.arg);
                    r.dispatchException(r.arg);
                  } else "return" === r.method && r.abrupt("return", r.arg);
                  n = "executing";
                  var c = p(t, e, r);
                  if ("normal" === c.type) {
                    if (
                      ((n = r.done ? "completed" : "suspendedYield"), c.arg === d)
                    )
                      continue;
                    return { value: c.arg, done: r.done };
                  }
                  "throw" === c.type &&
                    ((n = "completed"), (r.method = "throw"), (r.arg = c.arg));
                }
              };
            }
            function k(t, e) {
              var r = e.method,
                n = t.iterator[r];
              if (void 0 === n)
                return (
                  (e.delegate = null),
                  ("throw" === r &&
                    t.iterator.return &&
                    ((e.method = "return"),
                    (e.arg = void 0),
                    k(t, e),
                    "throw" === e.method)) ||
                    ("return" !== r &&
                      ((e.method = "throw"),
                      (e.arg = new TypeError(
                        "The iterator does not provide a '" + r + "' method",
                      )))),
                  d
                );
              var o = p(n, t.iterator, e.arg);
              if ("throw" === o.type)
                return (
                  (e.method = "throw"), (e.arg = o.arg), (e.delegate = null), d
                );
              var a = o.arg;
              return a
                ? a.done
                  ? ((e[t.resultName] = a.value),
                    (e.next = t.nextLoc),
                    "return" !== e.method &&
                      ((e.method = "next"), (e.arg = void 0)),
                    (e.delegate = null),
                    d)
                  : a
                : ((e.method = "throw"),
                  (e.arg = new TypeError("iterator result is not an object")),
                  (e.delegate = null),
                  d);
            }
            function j(t) {
              var e = { tryLoc: t[0] };
              1 in t && (e.catchLoc = t[1]),
                2 in t && ((e.finallyLoc = t[2]), (e.afterLoc = t[3])),
                this.tryEntries.push(e);
            }
            function O(t) {
              var e = t.completion || {};
              (e.type = "normal"), delete e.arg, (t.completion = e);
            }
            function S(t) {
              (this.tryEntries = [{ tryLoc: "root" }]),
                t.forEach(j, this),
                this.reset(!0);
            }
            function A(t) {
              if (t) {
                var e = t[c];
                if (e) return e.call(t);
                if ("function" == typeof t.next) return t;
                if (!isNaN(t.length)) {
                  var r = -1,
                    n = function e() {
                      for (; ++r < t.length; )
                        if (a.call(t, r))
                          return (e.value = t[r]), (e.done = !1), e;
                      return (e.value = void 0), (e.done = !0), e;
                    };
                  return (n.next = n);
                }
              }
              return { next: P };
            }
            function P() {
              return { value: void 0, done: !0 };
            }
            return (
              (y.prototype = m),
              i(w, "constructor", { value: m, configurable: !0 }),
              i(m, "constructor", { value: y, configurable: !0 }),
              (y.displayName = f(m, l, "GeneratorFunction")),
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
                    : ((t.__proto__ = m), f(t, l, "GeneratorFunction")),
                  (t.prototype = Object.create(w)),
                  t
                );
              }),
              (e.awrap = function (t) {
                return { __await: t };
              }),
              L(E.prototype),
              f(E.prototype, s, function () {
                return this;
              }),
              (e.AsyncIterator = E),
              (e.async = function (t, r, n, o, a) {
                void 0 === a && (a = Promise);
                var i = new E(h(t, r, n, o), a);
                return e.isGeneratorFunction(r)
                  ? i
                  : i.next().then(function (t) {
                      return t.done ? t.value : i.next();
                    });
              }),
              L(w),
              f(w, l, "Generator"),
              f(w, c, function () {
                return this;
              }),
              f(w, "toString", function () {
                return "[object Generator]";
              }),
              (e.keys = function (t) {
                var e = Object(t),
                  r = [];
                for (var n in e) r.push(n);
                return (
                  r.reverse(),
                  function t() {
                    for (; r.length; ) {
                      var n = r.pop();
                      if (n in e) return (t.value = n), (t.done = !1), t;
                    }
                    return (t.done = !0), t;
                  }
                );
              }),
              (e.values = A),
              (S.prototype = {
                constructor: S,
                reset: function (t) {
                  if (
                    ((this.prev = 0),
                    (this.next = 0),
                    (this.sent = this._sent = void 0),
                    (this.done = !1),
                    (this.delegate = null),
                    (this.method = "next"),
                    (this.arg = void 0),
                    this.tryEntries.forEach(O),
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
                  function r(r, n) {
                    return (
                      (i.type = "throw"),
                      (i.arg = t),
                      (e.next = r),
                      n && ((e.method = "next"), (e.arg = void 0)),
                      !!n
                    );
                  }
                  for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                    var o = this.tryEntries[n],
                      i = o.completion;
                    if ("root" === o.tryLoc) return r("end");
                    if (o.tryLoc <= this.prev) {
                      var u = a.call(o, "catchLoc"),
                        c = a.call(o, "finallyLoc");
                      if (u && c) {
                        if (this.prev < o.catchLoc) return r(o.catchLoc, !0);
                        if (this.prev < o.finallyLoc) return r(o.finallyLoc);
                      } else if (u) {
                        if (this.prev < o.catchLoc) return r(o.catchLoc, !0);
                      } else {
                        if (!c)
                          throw new Error(
                            "try statement without catch or finally",
                          );
                        if (this.prev < o.finallyLoc) return r(o.finallyLoc);
                      }
                    }
                  }
                },
                abrupt: function (t, e) {
                  for (var r = this.tryEntries.length - 1; r >= 0; --r) {
                    var n = this.tryEntries[r];
                    if (
                      n.tryLoc <= this.prev &&
                      a.call(n, "finallyLoc") &&
                      this.prev < n.finallyLoc
                    ) {
                      var o = n;
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
                      ? ((this.method = "next"), (this.next = o.finallyLoc), d)
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
                    d
                  );
                },
                finish: function (t) {
                  for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                    var r = this.tryEntries[e];
                    if (r.finallyLoc === t)
                      return this.complete(r.completion, r.afterLoc), O(r), d;
                  }
                },
                catch: function (t) {
                  for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                    var r = this.tryEntries[e];
                    if (r.tryLoc === t) {
                      var n = r.completion;
                      if ("throw" === n.type) {
                        var o = n.arg;
                        O(r);
                      }
                      return o;
                    }
                  }
                  throw new Error("illegal catch attempt");
                },
                delegateYield: function (t, e, r) {
                  return (
                    (this.delegate = {
                      iterator: A(t),
                      resultName: e,
                      nextLoc: r,
                    }),
                    "next" === this.method && (this.arg = void 0),
                    d
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
          function e(r) {
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
              e(r)
            );
          }
          (t.exports = e),
            (t.exports.__esModule = !0),
            (t.exports.default = t.exports);
        },
        687: function (t, e, r) {
          var n = r(61)();
          t.exports = n;
          try {
            regeneratorRuntime = n;
          } catch (t) {
            "object" == typeof globalThis
              ? (globalThis.regeneratorRuntime = n)
              : Function("r", "regeneratorRuntime = r")(n);
          }
        },
      },
      e = {};
    function r(n) {
      var o = e[n];
      if (void 0 !== o) return o.exports;
      var a = (e[n] = { exports: {} });
      return t[n](a, a.exports, r), a.exports;
    }
    (r.n = function (t) {
      var e =
        t && t.__esModule
          ? function () {
              return t.default;
            }
          : function () {
              return t;
            };
      return r.d(e, { a: e }), e;
    }),
      (r.d = function (t, e) {
        for (var n in e)
          r.o(e, n) &&
            !r.o(t, n) &&
            Object.defineProperty(t, n, { enumerable: !0, get: e[n] });
      }),
      (r.o = function (t, e) {
        return Object.prototype.hasOwnProperty.call(t, e);
      }),
      (function () {
        "use strict";
        function t(t, e, r, n, o, a, i) {
          try {
            var u = t[a](i),
              c = u.value;
          } catch (t) {
            return void r(t);
          }
          u.done ? e(c) : Promise.resolve(c).then(n, o);
        }
        function e(e) {
          return function () {
            var r = this,
              n = arguments;
            return new Promise(function (o, a) {
              var i = e.apply(r, n);
              function u(e) {
                t(i, o, a, u, c, "next", e);
              }
              function c(e) {
                t(i, o, a, u, c, "throw", e);
              }
              u(void 0);
            });
          };
        }
        var n = r(687),
          o = r.n(n);
        function a() {
          for (var t = arguments.length, e = new Array(t), r = 0; r < t; r++)
            e[r] = arguments[r];
          return new Promise(function (t) {
            chrome.runtime.sendMessage(e, function (e) {
              t(e);
            });
          });
        }
        function i(t) {
          return t.status || console.log(t), t;
        }
        function u() {
          return c.apply(this, arguments);
        }
        function c() {
          return (c = e(
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
        function s() {
          return l.apply(this, arguments);
        }
        function l() {
          return (l = e(
            o().mark(function t() {
              return o().wrap(function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      return (t.next = 2), u();
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
        e(
          o().mark(function t() {
            var r, n, u, c, l, f, h, p, d, v, y;
            return o().wrap(function (t) {
              for (;;)
                switch ((t.prev = t.next)) {
                  case 0:
                    return (
                      (y = function (t, e) {
                        var r = new Event("input", {
                          bubbles: !0,
                          simulated: !0,
                        });
                        (t.value = "".concat(e)), t.dispatchEvent(r), t.select();
                      }),
                      (v = function () {
                        return (v = e(
                          o().mark(function t(e) {
                            var r, n, s, l, f, h, p;
                            return o().wrap(function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (e) {
                                      t.next = 2;
                                      break;
                                    }
                                    return t.abrupt("return");
                                  case 2:
                                    if (
                                      (e.closest("li")
                                        ? ((l = "li"),
                                          (s = 'div[title*="Market value"]'))
                                        : ((l = "div[class^=row]"),
                                          (s = 'div[class^="rrp"]')),
                                      (h = +(
                                        (null == e ||
                                        null === (r = e.closest(l)) ||
                                        void 0 === r ||
                                        null === (r = r.querySelector(s)) ||
                                        void 0 === r ||
                                        null === (r = r.innerText) ||
                                        void 0 === r ||
                                        null === (r = r.replace("$", "")) ||
                                        void 0 === r
                                          ? void 0
                                          : r.replaceAll(",", "")) || 0
                                      )),
                                      (p =
                                        null == e ||
                                        null === (n = e.closest(l)) ||
                                        void 0 === n ||
                                        null === (n = n.querySelector("img")) ||
                                        void 0 === n ||
                                        null === (n = n.src.match(/\d+/)) ||
                                        void 0 === n
                                          ? void 0
                                          : n[0]))
                                    ) {
                                      t.next = 7;
                                      break;
                                    }
                                    return t.abrupt("return");
                                  case 7:
                                    a({
                                      name: "msgGetApiData",
                                      value: c,
                                      obj: {
                                        section: "market",
                                        selection: "bazaar",
                                        objectID: p,
                                      },
                                    })
                                      .then(function (t) {
                                        if (!Array.isArray(t)) {
                                          if (!t.data) return;
                                          var r = Object.values(t.data).reduce(
                                              function (t, e) {
                                                return t.concat(e);
                                              },
                                              [],
                                            ),
                                            n = 0.9999 * parseInt(r[1].cost);
                                          (f = Math.round(1 * n)),
                                            2460991 === u.playerID &&
                                              (f = Math.max(h, f)),
                                            y(e, f);
                                        }
                                      })
                                      .catch(function (t) {
                                        i({
                                          status: !1,
                                          fromWhere: "setPrice",
                                          message: "error fetching torn api",
                                          data: t,
                                        });
                                      });
                                  case 8:
                                  case "end":
                                    return t.stop();
                                }
                            }, t);
                          }),
                        )).apply(this, arguments);
                      }),
                      (d = function (t) {
                        return v.apply(this, arguments);
                      }),
                      (p = function (t) {
                        var e,
                          r,
                          n =
                            arguments.length > 1 &&
                            void 0 !== arguments[1] &&
                            arguments[1],
                          o = "",
                          a = "";
                        t.closest("li")
                          ? ((o = "li"), (a = "div.name-wrap"))
                          : ((o = "div[class^=row]"), (a = "div[class^=desc]"));
                        var i =
                            null == t ||
                            null === (e = t.closest(o)) ||
                            void 0 === e
                              ? void 0
                              : e.querySelector(a),
                          c = +(
                            (null == i ||
                            null === (r = i.innerText) ||
                            void 0 === r ||
                            null === (r = r.match(/x(\d+)/)) ||
                            void 0 === r
                              ? void 0
                              : r[1]) || 1
                          );
                        if (n && 2460991 === u.playerID) {
                          var s = Math.floor(0.2 * c);
                          c = Math.floor(Math.random() * (s - 1 + 1) + 1);
                        }
                        y(t, c);
                      }),
                      (h = function (t) {
                        var e,
                          r,
                          n =
                            null == t ||
                            null === (e = t.closest("div[class^=buyMenu]")) ||
                            void 0 === e
                              ? void 0
                              : e.querySelector("span[class^=amount]"),
                          o =
                            (null == n ||
                            null === (r = n.innerText) ||
                            void 0 === r ||
                            null === (r = r.match(/\d+/)) ||
                            void 0 === r
                              ? void 0
                              : r[0]) || 1;
                        y(t, +o);
                      }),
                      (f = function () {
                        document.addEventListener("dblclick", function (t) {
                          var e = null == t ? void 0 : t.target;
                          if ("INPUT" === (null == e ? void 0 : e.tagName)) {
                            var r = e;
                            r.className.includes("buyAmountInput")
                              ? h(r)
                              : r.className.includes("input-money")
                                ? d(r)
                                : r.className.includes("removeAmount")
                                  ? p(r)
                                  : "clear-all" == r.className && p(r, !1);
                          } else
                            i({
                              status: !1,
                              fromWhere: "bazaarAutoPrice",
                              message: "wrong dblclick",
                              data: e,
                            });
                        });
                      }),
                      (l = function () {
                        var t;
                        document.head.appendChild(
                          ((t = {
                            innerText:
                              "\n      [class^='buyConfirmation'] [class^='control'] button {\n        position: absolute;\n        width: 100%;\n        height: 50%;\n      }\n      [class^='buyConfirmation'] [class^='control'] button:nth-child(1) {\n          bottom: 0;\n      }\n      [class^='buyConfirmation'] [class^='control'] button:nth-child(2) {\n          top: 0;\n      }\n      [class^='itemDescription'] [class^='imgBar'] {\n          position: absolute;\n          right: 0;\n          bottom: 0;\n      }",
                          }),
                          Object.assign(document.createElement("style"), t)),
                        );
                      }),
                      (t.next = 9),
                      s()
                    );
                  case 9:
                    if ((r = t.sent)) {
                      t.next = 12;
                      break;
                    }
                    return t.abrupt("return");
                  case 12:
                    if (Array.isArray(r)) {
                      t.next = 14;
                      break;
                    }
                    return t.abrupt("return");
                  case 14:
                    (n = r[0].data),
                      (u = r[1].data),
                      (c = "".concat(r[2].data)),
                      n.ezBuyBazaar.enabled && l(),
                      n.bazaarAutoPrice.enabled && f();
                  case 19:
                  case "end":
                    return t.stop();
                }
            }, t);
          }),
        )();
      })();
  })();
  