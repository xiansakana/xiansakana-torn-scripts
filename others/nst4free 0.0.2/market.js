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
            f(g, c, function () {
              return this;
            });
            var b = Object.getPrototypeOf,
              w = b && b(b(A([])));
            w && w !== r && i.call(w, c) && (g = w);
            var x = (m.prototype = d.prototype = Object.create(g));
            function L(t) {
              ["next", "throw", "return"].forEach(function (e) {
                f(t, e, function (t) {
                  return this._invoke(e, t);
                });
              });
            }
            function E(t, e) {
              function r(o, a, u, c) {
                var s = p(t[o], t, a);
                if ("throw" !== s.type) {
                  var l = s.arg,
                    f = l.value;
                  return f && "object" == n(f) && i.call(f, "__await")
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
                    var u = S(a, r);
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
            function S(t, e) {
              var r = e.method,
                n = t.iterator[r];
              if (void 0 === n)
                return (
                  (e.delegate = null),
                  ("throw" === r &&
                    t.iterator.return &&
                    ((e.method = "return"),
                    (e.arg = void 0),
                    S(t, e),
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
            function O(t) {
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
                t.forEach(O, this),
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
                        if (i.call(t, r))
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
              (v.prototype = m),
              a(x, "constructor", { value: m, configurable: !0 }),
              a(m, "constructor", { value: v, configurable: !0 }),
              (v.displayName = f(m, l, "GeneratorFunction")),
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
                    : ((t.__proto__ = m), f(t, l, "GeneratorFunction")),
                  (t.prototype = Object.create(x)),
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
              (e.async = function (t, r, n, o, i) {
                void 0 === i && (i = Promise);
                var a = new E(h(t, r, n, o), i);
                return e.isGeneratorFunction(r)
                  ? a
                  : a.next().then(function (t) {
                      return t.done ? t.value : a.next();
                    });
              }),
              L(x),
              f(x, l, "Generator"),
              f(x, c, function () {
                return this;
              }),
              f(x, "toString", function () {
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
                      iterator: A(t),
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
        function s(t, e) {
          (null == e || e > t.length) && (e = t.length);
          for (var r = 0, n = new Array(e); r < e; r++) n[r] = t[r];
          return n;
        }
        function l(t, e) {
          var r,
            n = (function (t, e) {
              var r =
                ("undefined" != typeof Symbol && t[Symbol.iterator]) ||
                t["@@iterator"];
              if (!r) {
                if (
                  Array.isArray(t) ||
                  (r = (function (t, e) {
                    if (t) {
                      if ("string" == typeof t) return s(t, e);
                      var r = Object.prototype.toString.call(t).slice(8, -1);
                      return (
                        "Object" === r &&
                          t.constructor &&
                          (r = t.constructor.name),
                        "Map" === r || "Set" === r
                          ? Array.from(t)
                          : "Arguments" === r ||
                              /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)
                            ? s(t, e)
                            : void 0
                      );
                    }
                  })(t))
                ) {
                  r && (t = r);
                  var n = 0,
                    o = function () {};
                  return {
                    s: o,
                    n: function () {
                      return n >= t.length
                        ? { done: !0 }
                        : { done: !1, value: t[n++] };
                    },
                    e: function (t) {
                      throw t;
                    },
                    f: o,
                  };
                }
                throw new TypeError(
                  "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
                );
              }
              var i,
                a = !0,
                u = !1;
              return {
                s: function () {
                  r = r.call(t);
                },
                n: function () {
                  var t = r.next();
                  return (a = t.done), t;
                },
                e: function (t) {
                  (u = !0), (i = t);
                },
                f: function () {
                  try {
                    a || null == r.return || r.return();
                  } finally {
                    if (u) throw i;
                  }
                },
              };
            })(t);
          try {
            for (n.s(); !(r = n.n()).done; ) {
              var o,
                i = r.value,
                a = i.querySelector(".buy .buy-link");
              a &&
                ((a.dataset.action = "buyItemConfirm"),
                a.classList.add("yes-buy"),
                e &&
                  (a.dataset.price =
                    null == i ||
                    null === (o = i.querySelector(".cost")) ||
                    void 0 === o ||
                    null === (o = o.innerText) ||
                    void 0 === o ||
                    null === (o = o.replace(",", "")) ||
                    void 0 === o ||
                    null === (o = o.match(/\d+/)) ||
                    void 0 === o
                      ? void 0
                      : o[0]));
            }
          } catch (t) {
            n.e(t);
          } finally {
            n.f();
          }
        }
        (function () {
          return c.apply(this, arguments);
        })().then(function (t) {
          Array.isArray(t) &&
            t[0].data.marketNoConfirm.enabled &&
            (function () {
              var t, e;
              document.head.appendChild(
                ((e = {
                  innerText:
                    ".info-msg-cont {\n        display: none !important;\n    }",
                }),
                Object.assign(document.createElement("style"), e)),
              );
              var r =
                  null === (t = window.location.hash.match(/p=(shop|market)/)) ||
                  void 0 === t
                    ? void 0
                    : t[1],
                n = "".concat(
                  "market" == r ? ".buy-item-info-wrap" : "",
                  " .buy .buy-link",
                );
              new MutationObserver(function (t) {
                t.forEach(function (t) {
                  for (
                    var e = 0, o = Array.from(t.addedNodes);
                    e < o.length;
                    e++
                  ) {
                    var i = o[e];
                    i.querySelector &&
                      i.querySelector(n) &&
                      l(
                        Array.from(
                          document.querySelectorAll(
                            ".items > li:not(.clear):not(.private-bazaar)",
                          ),
                        ),
                        "shop" === r,
                      );
                  }
                });
              }).observe(document.documentElement, {
                childList: !0,
                subtree: !0,
              });
            })();
        });
      })();
  })();
  