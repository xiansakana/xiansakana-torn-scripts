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
              i = r.hasOwnProperty,
              a =
                Object.defineProperty ||
                function (t, e, r) {
                  t[e] = r.value;
                },
              u = "function" == typeof Symbol ? Symbol : {},
              c = u.iterator || "@@iterator",
              s = u.asyncIterator || "@@asyncIterator",
              f = u.toStringTag || "@@toStringTag";
            function l(t, e, r) {
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
              l({}, "");
            } catch (t) {
              l = function (t, e, r) {
                return (t[e] = r);
              };
            }
            function h(t, e, r, n) {
              var o = e && e.prototype instanceof d ? e : d,
                i = Object.create(o.prototype),
                u = new k(n || []);
              return a(i, "_invoke", { value: _(t, r, u) }), i;
            }
            function p(t, e, r) {
              try {
                return { type: "normal", arg: t.call(e, r) };
              } catch (t) {
                return { type: "throw", arg: t };
              }
            }
            e.wrap = h;
            var y = {};
            function d() {}
            function v() {}
            function m() {}
            var g = {};
            l(g, c, function () {
              return this;
            });
            var b = Object.getPrototypeOf,
              x = b && b(b(P([])));
            x && x !== r && i.call(x, c) && (g = x);
            var w = (m.prototype = d.prototype = Object.create(g));
            function L(t) {
              ["next", "throw", "return"].forEach(function (e) {
                l(t, e, function (t) {
                  return this._invoke(e, t);
                });
              });
            }
            function E(t, e) {
              function r(o, a, u, c) {
                var s = p(t[o], t, a);
                if ("throw" !== s.type) {
                  var f = s.arg,
                    l = f.value;
                  return l && "object" == n(l) && i.call(l, "__await")
                    ? e.resolve(l.__await).then(
                        function (t) {
                          r("next", t, u, c);
                        },
                        function (t) {
                          r("throw", t, u, c);
                        },
                      )
                    : e.resolve(l).then(
                        function (t) {
                          (f.value = t), u(f);
                        },
                        function (t) {
                          return r("throw", t, u, c);
                        },
                      );
                }
                c(s.arg);
              }
              var o;
              a(this, "_invoke", {
                value: function (t, n) {
                  function i() {
                    return new e(function (e, o) {
                      r(t, n, e, o);
                    });
                  }
                  return (o = o ? o.then(i, i) : i());
                },
              });
            }
            function _(t, e, r) {
              var n = "suspendedStart";
              return function (o, i) {
                if ("executing" === n)
                  throw new Error("Generator is already running");
                if ("completed" === n) {
                  if ("throw" === o) throw i;
                  return { value: void 0, done: !0 };
                }
                for (r.method = o, r.arg = i; ; ) {
                  var a = r.delegate;
                  if (a) {
                    var u = O(a, r);
                    if (u) {
                      if (u === y) continue;
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
                      ((n = r.done ? "completed" : "suspendedYield"), c.arg === y)
                    )
                      continue;
                    return { value: c.arg, done: r.done };
                  }
                  "throw" === c.type &&
                    ((n = "completed"), (r.method = "throw"), (r.arg = c.arg));
                }
              };
            }
            function O(t, e) {
              var r = e.method,
                n = t.iterator[r];
              if (void 0 === n)
                return (
                  (e.delegate = null),
                  ("throw" === r &&
                    t.iterator.return &&
                    ((e.method = "return"),
                    (e.arg = void 0),
                    O(t, e),
                    "throw" === e.method)) ||
                    ("return" !== r &&
                      ((e.method = "throw"),
                      (e.arg = new TypeError(
                        "The iterator does not provide a '" + r + "' method",
                      )))),
                  y
                );
              var o = p(n, t.iterator, e.arg);
              if ("throw" === o.type)
                return (
                  (e.method = "throw"), (e.arg = o.arg), (e.delegate = null), y
                );
              var i = o.arg;
              return i
                ? i.done
                  ? ((e[t.resultName] = i.value),
                    (e.next = t.nextLoc),
                    "return" !== e.method &&
                      ((e.method = "next"), (e.arg = void 0)),
                    (e.delegate = null),
                    y)
                  : i
                : ((e.method = "throw"),
                  (e.arg = new TypeError("iterator result is not an object")),
                  (e.delegate = null),
                  y);
            }
            function S(t) {
              var e = { tryLoc: t[0] };
              1 in t && (e.catchLoc = t[1]),
                2 in t && ((e.finallyLoc = t[2]), (e.afterLoc = t[3])),
                this.tryEntries.push(e);
            }
            function j(t) {
              var e = t.completion || {};
              (e.type = "normal"), delete e.arg, (t.completion = e);
            }
            function k(t) {
              (this.tryEntries = [{ tryLoc: "root" }]),
                t.forEach(S, this),
                this.reset(!0);
            }
            function P(t) {
              if (t) {
                var e = t[c];
                if (e) return e.call(t);
                if ("function" == typeof t.next) return t;
                if (!isNaN(t.length)) {
                  var r = -1,
                    n = function e() {
                      for (; ++r < t.length; )
                        if (i.call(t, r))
                          return (e.value = t[r]), (e.done = !1), e;
                      return (e.value = void 0), (e.done = !0), e;
                    };
                  return (n.next = n);
                }
              }
              return { next: A };
            }
            function A() {
              return { value: void 0, done: !0 };
            }
            return (
              (v.prototype = m),
              a(w, "constructor", { value: m, configurable: !0 }),
              a(m, "constructor", { value: v, configurable: !0 }),
              (v.displayName = l(m, f, "GeneratorFunction")),
              (e.isGeneratorFunction = function (t) {
                var e = "function" == typeof t && t.constructor;
                return (
                  !!e &&
                  (e === v || "GeneratorFunction" === (e.displayName || e.name))
                );
              }),
              (e.mark = function (t) {
                return (
                  Object.setPrototypeOf
                    ? Object.setPrototypeOf(t, m)
                    : ((t.__proto__ = m), l(t, f, "GeneratorFunction")),
                  (t.prototype = Object.create(w)),
                  t
                );
              }),
              (e.awrap = function (t) {
                return { __await: t };
              }),
              L(E.prototype),
              l(E.prototype, s, function () {
                return this;
              }),
              (e.AsyncIterator = E),
              (e.async = function (t, r, n, o, i) {
                void 0 === i && (i = Promise);
                var a = new E(h(t, r, n, o), i);
                return e.isGeneratorFunction(r)
                  ? a
                  : a.next().then(function (t) {
                      return t.done ? t.value : a.next();
                    });
              }),
              L(w),
              l(w, f, "Generator"),
              l(w, c, function () {
                return this;
              }),
              l(w, "toString", function () {
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
              (e.values = P),
              (k.prototype = {
                constructor: k,
                reset: function (t) {
                  if (
                    ((this.prev = 0),
                    (this.next = 0),
                    (this.sent = this._sent = void 0),
                    (this.done = !1),
                    (this.delegate = null),
                    (this.method = "next"),
                    (this.arg = void 0),
                    this.tryEntries.forEach(j),
                    !t)
                  )
                    for (var e in this)
                      "t" === e.charAt(0) &&
                        i.call(this, e) &&
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
                      (a.type = "throw"),
                      (a.arg = t),
                      (e.next = r),
                      n && ((e.method = "next"), (e.arg = void 0)),
                      !!n
                    );
                  }
                  for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                    var o = this.tryEntries[n],
                      a = o.completion;
                    if ("root" === o.tryLoc) return r("end");
                    if (o.tryLoc <= this.prev) {
                      var u = i.call(o, "catchLoc"),
                        c = i.call(o, "finallyLoc");
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
                      i.call(n, "finallyLoc") &&
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
                  var a = o ? o.completion : {};
                  return (
                    (a.type = t),
                    (a.arg = e),
                    o
                      ? ((this.method = "next"), (this.next = o.finallyLoc), y)
                      : this.complete(a)
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
                    y
                  );
                },
                finish: function (t) {
                  for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                    var r = this.tryEntries[e];
                    if (r.finallyLoc === t)
                      return this.complete(r.completion, r.afterLoc), j(r), y;
                  }
                },
                catch: function (t) {
                  for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                    var r = this.tryEntries[e];
                    if (r.tryLoc === t) {
                      var n = r.completion;
                      if ("throw" === n.type) {
                        var o = n.arg;
                        j(r);
                      }
                      return o;
                    }
                  }
                  throw new Error("illegal catch attempt");
                },
                delegateYield: function (t, e, r) {
                  return (
                    (this.delegate = {
                      iterator: P(t),
                      resultName: e,
                      nextLoc: r,
                    }),
                    "next" === this.method && (this.arg = void 0),
                    y
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
      var i = (e[n] = { exports: {} });
      return t[n](i, i.exports, r), i.exports;
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
        function t(t, e, r, n, o, i, a) {
          try {
            var u = t[i](a),
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
            return new Promise(function (o, i) {
              var a = e.apply(r, n);
              function u(e) {
                t(a, o, i, u, c, "next", e);
              }
              function c(e) {
                t(a, o, i, u, c, "throw", e);
              }
              u(void 0);
            });
          };
        }
        var n = r(687),
          o = r.n(n);
        function i() {
          for (var t = arguments.length, e = new Array(t), r = 0; r < t; r++)
            e[r] = arguments[r];
          return new Promise(function (t) {
            chrome.runtime.sendMessage(e, function (e) {
              t(e);
            });
          });
        }
        function a() {
          return u.apply(this, arguments);
        }
        function u() {
          return (u = e(
            o().mark(function t() {
              return o().wrap(function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      return (
                        (t.next = 2),
                        i({ name: "msgReadKey", value: "nstMember" })
                          .then(function (t) {
                            return (
                              !Array.isArray(t) &&
                              !(!t.status || !t.data) &&
                              t.data
                            );
                          })
                          .catch(function (t) {
                            return (
                              (e = {
                                status: !1,
                                fromWhere: "getGlobs",
                                message: "you shall not pass",
                                data: t,
                              }).status || console.log(e),
                              e
                            );
                            var e;
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
        function c() {
          return (c = e(
            o().mark(function t() {
              return o().wrap(function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      return (t.next = 2), a();
                    case 2:
                      if (t.sent) {
                        t.next = 5;
                        break;
                      }
                      return t.abrupt("return", !1);
                    case 5:
                      return t.abrupt(
                        "return",
                        i(
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
        (function () {
          return c.apply(this, arguments);
        })().then(function (t) {
          Array.isArray(t) &&
            t[0].data.ezMoneyDeposit.enabled &&
            (function () {
              var t = document.querySelector(
                ".deposit-box .input-money-symbol, .deposit .input-money-symbol",
              );
              function e(t) {
                var e = 0;
                t.addEventListener("click", function () {
                  if (1 == e++) {
                    (e = 0),
                      document
                        .querySelector(
                          ".deposit-box input[value='DEPOSIT'], .deposit button.torn-btn, #armoury-donate .cash button",
                        )
                        .click();
                    var t = document.querySelector(
                      "#armoury-donate .cash-confirm .yes",
                    );
                    t && t.click();
                  }
                });
              }
              t && e(t),
                new MutationObserver(function (t) {
                  t.forEach(function (t) {
                    for (
                      var r = 0, n = Array.from(t.addedNodes);
                      r < n.length;
                      r++
                    ) {
                      var o = n[r],
                        i =
                          o.querySelector &&
                          o.querySelector(
                            ".deposit-box .input-money-symbol, .deposit .input-money-symbol, .donate .input-money-symbol",
                          );
                      i && e(i);
                    }
                  });
                }).observe(document.body, { childList: !0, subtree: !0 });
            })();
        });
      })();
  })();
  