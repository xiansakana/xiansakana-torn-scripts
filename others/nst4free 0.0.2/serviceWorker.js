!(function () {
    var e = {
        61: function (e, t, r) {
          var n = r(698).default;
          function a() {
            "use strict";
            (e.exports = a =
              function () {
                return t;
              }),
              (e.exports.__esModule = !0),
              (e.exports.default = e.exports);
            var t = {},
              r = Object.prototype,
              s = r.hasOwnProperty,
              o =
                Object.defineProperty ||
                function (e, t, r) {
                  e[t] = r.value;
                },
              i = "function" == typeof Symbol ? Symbol : {},
              u = i.iterator || "@@iterator",
              c = i.asyncIterator || "@@asyncIterator",
              l = i.toStringTag || "@@toStringTag";
            function p(e, t, r) {
              return (
                Object.defineProperty(e, t, {
                  value: r,
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                }),
                e[t]
              );
            }
            try {
              p({}, "");
            } catch (e) {
              p = function (e, t, r) {
                return (e[t] = r);
              };
            }
            function f(e, t, r, n) {
              var a = t && t.prototype instanceof d ? t : d,
                s = Object.create(a.prototype),
                i = new A(n || []);
              return o(s, "_invoke", { value: j(e, r, i) }), s;
            }
            function h(e, t, r) {
              try {
                return { type: "normal", arg: e.call(t, r) };
              } catch (e) {
                return { type: "throw", arg: e };
              }
            }
            t.wrap = f;
            var m = {};
            function d() {}
            function v() {}
            function g() {}
            var y = {};
            p(y, u, function () {
              return this;
            });
            var b = Object.getPrototypeOf,
              x = b && b(b(P([])));
            x && x !== r && s.call(x, u) && (y = x);
            var w = (g.prototype = d.prototype = Object.create(y));
            function k(e) {
              ["next", "throw", "return"].forEach(function (t) {
                p(e, t, function (e) {
                  return this._invoke(t, e);
                });
              });
            }
            function S(e, t) {
              function r(a, o, i, u) {
                var c = h(e[a], e, o);
                if ("throw" !== c.type) {
                  var l = c.arg,
                    p = l.value;
                  return p && "object" == n(p) && s.call(p, "__await")
                    ? t.resolve(p.__await).then(
                        function (e) {
                          r("next", e, i, u);
                        },
                        function (e) {
                          r("throw", e, i, u);
                        },
                      )
                    : t.resolve(p).then(
                        function (e) {
                          (l.value = e), i(l);
                        },
                        function (e) {
                          return r("throw", e, i, u);
                        },
                      );
                }
                u(c.arg);
              }
              var a;
              o(this, "_invoke", {
                value: function (e, n) {
                  function s() {
                    return new t(function (t, a) {
                      r(e, n, t, a);
                    });
                  }
                  return (a = a ? a.then(s, s) : s());
                },
              });
            }
            function j(e, t, r) {
              var n = "suspendedStart";
              return function (a, s) {
                if ("executing" === n)
                  throw new Error("Generator is already running");
                if ("completed" === n) {
                  if ("throw" === a) throw s;
                  return { value: void 0, done: !0 };
                }
                for (r.method = a, r.arg = s; ; ) {
                  var o = r.delegate;
                  if (o) {
                    var i = O(o, r);
                    if (i) {
                      if (i === m) continue;
                      return i;
                    }
                  }
                  if ("next" === r.method) r.sent = r._sent = r.arg;
                  else if ("throw" === r.method) {
                    if ("suspendedStart" === n) throw ((n = "completed"), r.arg);
                    r.dispatchException(r.arg);
                  } else "return" === r.method && r.abrupt("return", r.arg);
                  n = "executing";
                  var u = h(e, t, r);
                  if ("normal" === u.type) {
                    if (
                      ((n = r.done ? "completed" : "suspendedYield"), u.arg === m)
                    )
                      continue;
                    return { value: u.arg, done: r.done };
                  }
                  "throw" === u.type &&
                    ((n = "completed"), (r.method = "throw"), (r.arg = u.arg));
                }
              };
            }
            function O(e, t) {
              var r = t.method,
                n = e.iterator[r];
              if (void 0 === n)
                return (
                  (t.delegate = null),
                  ("throw" === r &&
                    e.iterator.return &&
                    ((t.method = "return"),
                    (t.arg = void 0),
                    O(e, t),
                    "throw" === t.method)) ||
                    ("return" !== r &&
                      ((t.method = "throw"),
                      (t.arg = new TypeError(
                        "The iterator does not provide a '" + r + "' method",
                      )))),
                  m
                );
              var a = h(n, e.iterator, t.arg);
              if ("throw" === a.type)
                return (
                  (t.method = "throw"), (t.arg = a.arg), (t.delegate = null), m
                );
              var s = a.arg;
              return s
                ? s.done
                  ? ((t[e.resultName] = s.value),
                    (t.next = e.nextLoc),
                    "return" !== t.method &&
                      ((t.method = "next"), (t.arg = void 0)),
                    (t.delegate = null),
                    m)
                  : s
                : ((t.method = "throw"),
                  (t.arg = new TypeError("iterator result is not an object")),
                  (t.delegate = null),
                  m);
            }
            function W(e) {
              var t = { tryLoc: e[0] };
              1 in e && (t.catchLoc = e[1]),
                2 in e && ((t.finallyLoc = e[2]), (t.afterLoc = e[3])),
                this.tryEntries.push(t);
            }
            function T(e) {
              var t = e.completion || {};
              (t.type = "normal"), delete t.arg, (e.completion = t);
            }
            function A(e) {
              (this.tryEntries = [{ tryLoc: "root" }]),
                e.forEach(W, this),
                this.reset(!0);
            }
            function P(e) {
              if (e) {
                var t = e[u];
                if (t) return t.call(e);
                if ("function" == typeof e.next) return e;
                if (!isNaN(e.length)) {
                  var r = -1,
                    n = function t() {
                      for (; ++r < e.length; )
                        if (s.call(e, r))
                          return (t.value = e[r]), (t.done = !1), t;
                      return (t.value = void 0), (t.done = !0), t;
                    };
                  return (n.next = n);
                }
              }
              return { next: L };
            }
            function L() {
              return { value: void 0, done: !0 };
            }
            return (
              (v.prototype = g),
              o(w, "constructor", { value: g, configurable: !0 }),
              o(g, "constructor", { value: v, configurable: !0 }),
              (v.displayName = p(g, l, "GeneratorFunction")),
              (t.isGeneratorFunction = function (e) {
                var t = "function" == typeof e && e.constructor;
                return (
                  !!t &&
                  (t === v || "GeneratorFunction" === (t.displayName || t.name))
                );
              }),
              (t.mark = function (e) {
                return (
                  Object.setPrototypeOf
                    ? Object.setPrototypeOf(e, g)
                    : ((e.__proto__ = g), p(e, l, "GeneratorFunction")),
                  (e.prototype = Object.create(w)),
                  e
                );
              }),
              (t.awrap = function (e) {
                return { __await: e };
              }),
              k(S.prototype),
              p(S.prototype, c, function () {
                return this;
              }),
              (t.AsyncIterator = S),
              (t.async = function (e, r, n, a, s) {
                void 0 === s && (s = Promise);
                var o = new S(f(e, r, n, a), s);
                return t.isGeneratorFunction(r)
                  ? o
                  : o.next().then(function (e) {
                      return e.done ? e.value : o.next();
                    });
              }),
              k(w),
              p(w, l, "Generator"),
              p(w, u, function () {
                return this;
              }),
              p(w, "toString", function () {
                return "[object Generator]";
              }),
              (t.keys = function (e) {
                var t = Object(e),
                  r = [];
                for (var n in t) r.push(n);
                return (
                  r.reverse(),
                  function e() {
                    for (; r.length; ) {
                      var n = r.pop();
                      if (n in t) return (e.value = n), (e.done = !1), e;
                    }
                    return (e.done = !0), e;
                  }
                );
              }),
              (t.values = P),
              (A.prototype = {
                constructor: A,
                reset: function (e) {
                  if (
                    ((this.prev = 0),
                    (this.next = 0),
                    (this.sent = this._sent = void 0),
                    (this.done = !1),
                    (this.delegate = null),
                    (this.method = "next"),
                    (this.arg = void 0),
                    this.tryEntries.forEach(T),
                    !e)
                  )
                    for (var t in this)
                      "t" === t.charAt(0) &&
                        s.call(this, t) &&
                        !isNaN(+t.slice(1)) &&
                        (this[t] = void 0);
                },
                stop: function () {
                  this.done = !0;
                  var e = this.tryEntries[0].completion;
                  if ("throw" === e.type) throw e.arg;
                  return this.rval;
                },
                dispatchException: function (e) {
                  if (this.done) throw e;
                  var t = this;
                  function r(r, n) {
                    return (
                      (o.type = "throw"),
                      (o.arg = e),
                      (t.next = r),
                      n && ((t.method = "next"), (t.arg = void 0)),
                      !!n
                    );
                  }
                  for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                    var a = this.tryEntries[n],
                      o = a.completion;
                    if ("root" === a.tryLoc) return r("end");
                    if (a.tryLoc <= this.prev) {
                      var i = s.call(a, "catchLoc"),
                        u = s.call(a, "finallyLoc");
                      if (i && u) {
                        if (this.prev < a.catchLoc) return r(a.catchLoc, !0);
                        if (this.prev < a.finallyLoc) return r(a.finallyLoc);
                      } else if (i) {
                        if (this.prev < a.catchLoc) return r(a.catchLoc, !0);
                      } else {
                        if (!u)
                          throw new Error(
                            "try statement without catch or finally",
                          );
                        if (this.prev < a.finallyLoc) return r(a.finallyLoc);
                      }
                    }
                  }
                },
                abrupt: function (e, t) {
                  for (var r = this.tryEntries.length - 1; r >= 0; --r) {
                    var n = this.tryEntries[r];
                    if (
                      n.tryLoc <= this.prev &&
                      s.call(n, "finallyLoc") &&
                      this.prev < n.finallyLoc
                    ) {
                      var a = n;
                      break;
                    }
                  }
                  a &&
                    ("break" === e || "continue" === e) &&
                    a.tryLoc <= t &&
                    t <= a.finallyLoc &&
                    (a = null);
                  var o = a ? a.completion : {};
                  return (
                    (o.type = e),
                    (o.arg = t),
                    a
                      ? ((this.method = "next"), (this.next = a.finallyLoc), m)
                      : this.complete(o)
                  );
                },
                complete: function (e, t) {
                  if ("throw" === e.type) throw e.arg;
                  return (
                    "break" === e.type || "continue" === e.type
                      ? (this.next = e.arg)
                      : "return" === e.type
                        ? ((this.rval = this.arg = e.arg),
                          (this.method = "return"),
                          (this.next = "end"))
                        : "normal" === e.type && t && (this.next = t),
                    m
                  );
                },
                finish: function (e) {
                  for (var t = this.tryEntries.length - 1; t >= 0; --t) {
                    var r = this.tryEntries[t];
                    if (r.finallyLoc === e)
                      return this.complete(r.completion, r.afterLoc), T(r), m;
                  }
                },
                catch: function (e) {
                  for (var t = this.tryEntries.length - 1; t >= 0; --t) {
                    var r = this.tryEntries[t];
                    if (r.tryLoc === e) {
                      var n = r.completion;
                      if ("throw" === n.type) {
                        var a = n.arg;
                        T(r);
                      }
                      return a;
                    }
                  }
                  throw new Error("illegal catch attempt");
                },
                delegateYield: function (e, t, r) {
                  return (
                    (this.delegate = {
                      iterator: P(e),
                      resultName: t,
                      nextLoc: r,
                    }),
                    "next" === this.method && (this.arg = void 0),
                    m
                  );
                },
              }),
              t
            );
          }
          (e.exports = a),
            (e.exports.__esModule = !0),
            (e.exports.default = e.exports);
        },
        698: function (e) {
          function t(r) {
            return (
              (e.exports = t =
                "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
                  ? function (e) {
                      return typeof e;
                    }
                  : function (e) {
                      return e &&
                        "function" == typeof Symbol &&
                        e.constructor === Symbol &&
                        e !== Symbol.prototype
                        ? "symbol"
                        : typeof e;
                    }),
              (e.exports.__esModule = !0),
              (e.exports.default = e.exports),
              t(r)
            );
          }
          (e.exports = t),
            (e.exports.__esModule = !0),
            (e.exports.default = e.exports);
        },
        687: function (e, t, r) {
          var n = r(61)();
          e.exports = n;
          try {
            regeneratorRuntime = n;
          } catch (e) {
            "object" == typeof globalThis
              ? (globalThis.regeneratorRuntime = n)
              : Function("r", "regeneratorRuntime = r")(n);
          }
        },
      },
      t = {};
    function r(n) {
      var a = t[n];
      if (void 0 !== a) return a.exports;
      var s = (t[n] = { exports: {} });
      return e[n](s, s.exports, r), s.exports;
    }
    (r.n = function (e) {
      var t =
        e && e.__esModule
          ? function () {
              return e.default;
            }
          : function () {
              return e;
            };
      return r.d(t, { a: t }), t;
    }),
      (r.d = function (e, t) {
        for (var n in t)
          r.o(t, n) &&
            !r.o(e, n) &&
            Object.defineProperty(e, n, { enumerable: !0, get: t[n] });
      }),
      (r.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
      }),
      (function () {
        "use strict";
        function e(t) {
          return (
            (e =
              "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
                ? function (e) {
                    return typeof e;
                  }
                : function (e) {
                    return e &&
                      "function" == typeof Symbol &&
                      e.constructor === Symbol &&
                      e !== Symbol.prototype
                      ? "symbol"
                      : typeof e;
                  }),
            e(t)
          );
        }
        function t(t, r, n) {
          return (
            (r = (function (t) {
              var r = (function (t, r) {
                if ("object" !== e(t) || null === t) return t;
                var n = t[Symbol.toPrimitive];
                if (void 0 !== n) {
                  var a = n.call(t, "string");
                  if ("object" !== e(a)) return a;
                  throw new TypeError(
                    "@@toPrimitive must return a primitive value.",
                  );
                }
                return String(t);
              })(t);
              return "symbol" === e(r) ? r : String(r);
            })(r)) in t
              ? Object.defineProperty(t, r, {
                  value: n,
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                })
              : (t[r] = n),
            t
          );
        }
        function n(e, t) {
          (null == t || t > e.length) && (t = e.length);
          for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
          return n;
        }
        function a(e, t) {
          return (
            (function (e) {
              if (Array.isArray(e)) return e;
            })(e) ||
            (function (e, t) {
              var r =
                null == e
                  ? null
                  : ("undefined" != typeof Symbol && e[Symbol.iterator]) ||
                    e["@@iterator"];
              if (null != r) {
                var n,
                  a,
                  s,
                  o,
                  i = [],
                  u = !0,
                  c = !1;
                try {
                  if (((s = (r = r.call(e)).next), 0 === t)) {
                    if (Object(r) !== r) return;
                    u = !1;
                  } else
                    for (
                      ;
                      !(u = (n = s.call(r)).done) &&
                      (i.push(n.value), i.length !== t);
                      u = !0
                    );
                } catch (e) {
                  (c = !0), (a = e);
                } finally {
                  try {
                    if (
                      !u &&
                      null != r.return &&
                      ((o = r.return()), Object(o) !== o)
                    )
                      return;
                  } finally {
                    if (c) throw a;
                  }
                }
                return i;
              }
            })(e, t) ||
            (function (e, t) {
              if (e) {
                if ("string" == typeof e) return n(e, t);
                var r = Object.prototype.toString.call(e).slice(8, -1);
                return (
                  "Object" === r && e.constructor && (r = e.constructor.name),
                  "Map" === r || "Set" === r
                    ? Array.from(e)
                    : "Arguments" === r ||
                        /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)
                      ? n(e, t)
                      : void 0
                );
              }
            })(e, t) ||
            (function () {
              throw new TypeError(
                "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
              );
            })()
          );
        }
        function s(e, t, r, n, a, s, o) {
          try {
            var i = e[s](o),
              u = i.value;
          } catch (e) {
            return void r(e);
          }
          i.done ? t(u) : Promise.resolve(u).then(n, a);
        }
        function o(e) {
          return function () {
            var t = this,
              r = arguments;
            return new Promise(function (n, a) {
              var o = e.apply(t, r);
              function i(e) {
                s(o, n, a, i, u, "next", e);
              }
              function u(e) {
                s(o, n, a, i, u, "throw", e);
              }
              i(void 0);
            });
          };
        }
        var i = r(687),
          u = r.n(i);
        function c(e) {
          return !e || null == e || 0 === Object.keys(e).length;
        }
        function l(e) {
          return e.status || console.log(e), e;
        }
        function p(e, t) {
          var r = Object.keys(e);
          if (Object.getOwnPropertySymbols) {
            var n = Object.getOwnPropertySymbols(e);
            t &&
              (n = n.filter(function (t) {
                return Object.getOwnPropertyDescriptor(e, t).enumerable;
              })),
              r.push.apply(r, n);
          }
          return r;
        }
        function f(e) {
          for (var r = 1; r < arguments.length; r++) {
            var n = null != arguments[r] ? arguments[r] : {};
            r % 2
              ? p(Object(n), !0).forEach(function (r) {
                  t(e, r, n[r]);
                })
              : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
                : p(Object(n)).forEach(function (t) {
                    Object.defineProperty(
                      e,
                      t,
                      Object.getOwnPropertyDescriptor(n, t),
                    );
                  });
          }
          return e;
        }
        function h(e) {
          var t,
            r,
            n,
            a = 2;
          for (
            "undefined" != typeof Symbol &&
            ((r = Symbol.asyncIterator), (n = Symbol.iterator));
            a--;
  
          ) {
            if (r && null != (t = e[r])) return t.call(e);
            if (n && null != (t = e[n])) return new m(t.call(e));
            (r = "@@asyncIterator"), (n = "@@iterator");
          }
          throw new TypeError("Object is not async iterable");
        }
        function m(e) {
          function t(e) {
            if (Object(e) !== e)
              return Promise.reject(new TypeError(e + " is not an object."));
            var t = e.done;
            return Promise.resolve(e.value).then(function (e) {
              return { value: e, done: t };
            });
          }
          return (
            (m = function (e) {
              (this.s = e), (this.n = e.next);
            }),
            (m.prototype = {
              s: null,
              n: null,
              next: function () {
                return t(this.n.apply(this.s, arguments));
              },
              return: function (e) {
                var r = this.s.return;
                return void 0 === r
                  ? Promise.resolve({ value: e, done: !0 })
                  : t(r.apply(this.s, arguments));
              },
              throw: function (e) {
                var r = this.s.return;
                return void 0 === r
                  ? Promise.reject(e)
                  : t(r.apply(this.s, arguments));
              },
            }),
            new m(e)
          );
        }
        function d(e) {
          return v.apply(this, arguments);
        }
        function v() {
          return (v = o(
            u().mark(function e(t) {
              return u().wrap(function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      return e.abrupt(
                        "return",
                        new Promise(function (e, r) {
                          try {
                            chrome.storage.local.set(t, function () {
                              e(
                                l({
                                  status: !0,
                                  fromWhere: "writeKey",
                                  message: Object.keys(t)[0] + " has been wrote",
                                }),
                              );
                            });
                          } catch (e) {
                            r(
                              l({
                                status: !1,
                                fromWhere: "writeKey",
                                message: "error writing key",
                                data: { err: e },
                              }),
                            );
                          }
                        }),
                      );
                    case 1:
                    case "end":
                      return e.stop();
                  }
              }, e);
            }),
          )).apply(this, arguments);
        }
        function g(e) {
          return y.apply(this, arguments);
        }
        function y() {
          return (y = o(
            u().mark(function e(t) {
              return u().wrap(function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      return e.abrupt(
                        "return",
                        new Promise(function (e, r) {
                          chrome.storage.local.get(t, function (n) {
                            c(n) &&
                              r(
                                l({
                                  status: !1,
                                  fromWhere: "readKey",
                                  message: t + " is empty",
                                }),
                              ),
                              e(
                                l({
                                  status: !0,
                                  fromWhere: "readKey",
                                  message: t + " has been read",
                                  data: n[t],
                                }),
                              );
                          });
                        }),
                      );
                    case 1:
                    case "end":
                      return e.stop();
                  }
              }, e);
            }),
          )).apply(this, arguments);
        }
        function b() {
          return x.apply(this, arguments);
        }
        function x() {
          return (x = o(
            u().mark(function e() {
              return u().wrap(function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      return e.abrupt(
                        "return",
                        new Promise(function (e) {
                          chrome.storage.local.get(null, function (t) {
                            e(
                              l({
                                status: !0,
                                fromWhere: "readStorage",
                                message: "storage has been read",
                                data: t,
                              }),
                            );
                          });
                        }),
                      );
                    case 1:
                    case "end":
                      return e.stop();
                  }
              }, e);
            }),
          )).apply(this, arguments);
        }
        function w(e) {
          return k.apply(this, arguments);
        }
        function k() {
          return (k = o(
            u().mark(function e(t) {
              return u().wrap(function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      return e.abrupt(
                        "return",
                        new Promise(function (e, r) {
                          try {
                            chrome.storage.local.remove(t, function () {
                              e(
                                l({
                                  status: !0,
                                  fromWhere: "removeKey",
                                  message: t + " removed",
                                }),
                              );
                            });
                          } catch (e) {
                            r(
                              l({
                                status: !1,
                                fromWhere: "removeKey",
                                message: "error removing key: " + t,
                                data: { err: e },
                              }),
                            );
                          }
                        }),
                      );
                    case 1:
                    case "end":
                      return e.stop();
                  }
              }, e);
            }),
          )).apply(this, arguments);
        }
        function S(e) {
          return j.apply(this, arguments);
        }
        function j() {
          return (j = o(
            u().mark(function e(t) {
              var r, n, a;
              return u().wrap(
                function (e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        return (
                          (r = [9533, 11747, 11581, 9055, 21526, 20554, 22887]),
                          (e.prev = 1),
                          (e.next = 4),
                          O(
                            t,
                            "user",
                            "bars,basic,cooldowns,education,icons,money,networth,notifications,perks,profile,refills,timestamp,travel,newmessages,newevents,personalstats",
                          )
                        );
                      case 4:
                        if (
                          ((n = e.sent.data),
                          (a = {
                            name: n.name,
                            playerID: n.player_id,
                            factionID: n.faction.faction_id,
                          }),
                          !r.includes(a.factionID))
                        ) {
                          e.next = 12;
                          break;
                        }
                        return (
                          (e.next = 9),
                          Promise.all([
                            d({ nstUserData: n }),
                            d({ nstUser: a }),
                            d({ nstApikey: t }),
                            d({ nstMember: !0 }),
                          ]).catch(function (e) {
                            throw l({
                              status: !1,
                              fromWhere: "initUserData",
                              message: "error writing data",
                              data: e,
                            });
                          })
                        );
                      case 9:
                        return e.abrupt(
                          "return",
                          l({
                            status: !0,
                            fromWhere: "initUserData",
                            message: "user data initialized",
                          }),
                        );
                      case 12:
                        return (
                          d({ nstMember: !1 }),
                          e.abrupt(
                            "return",
                            l({
                              status: !1,
                              fromWhere: "initUserData",
                              message: "you shall not pass",
                            }),
                          )
                        );
                      case 14:
                        e.next = 19;
                        break;
                      case 16:
                        return (
                          (e.prev = 16),
                          (e.t0 = e.catch(1)),
                          e.abrupt(
                            "return",
                            l({
                              status: !1,
                              fromWhere: "initUserData",
                              message: "error retrieving data",
                              data: { err: e.t0 },
                            }),
                          )
                        );
                      case 19:
                      case "end":
                        return e.stop();
                    }
                },
                e,
                null,
                [[1, 16]],
              );
            }),
          )).apply(this, arguments);
        }
        function O(e, t) {
          var r =
              arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "",
            n =
              arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : "";
          return new Promise(function (a, s) {
            (null != e && 16 == e.length) ||
              s(
                l({
                  status: !1,
                  fromWhere: "tornApiRequest",
                  message: "invalid apikey",
                }),
              );
            var o = "https://api.torn.com/";
            (o += "".concat(t, "/")),
              (o += "".concat(n)),
              (o += "?selections=".concat(r.replaceAll(" ", ""))),
              (o += "&key=".concat(e)),
              (o += "&comment=NST"),
              fetch(o)
                .catch(function (e) {
                  return s(
                    l({
                      status: !1,
                      fromWhere: "tornApiRequest",
                      message: "fetch error",
                      data: e,
                    }),
                  );
                })
                .then(function (e) {
                  if (e)
                    return 200 !== e.status
                      ? s(
                          l({
                            status: !1,
                            fromWhere: "tornApiRequest",
                            message: "Problem connecting to Torn servers",
                            data: e,
                          }),
                        )
                      : e.json();
                })
                .then(function (e) {
                  return (function (e) {
                    return new Promise(function (t, r) {
                      var n;
                      e.faction.faction_id = 11747;
                      return null != e.error
                        ? (e.error.code
                            ? ([2, 10, 13].includes(+e.error.code) &&
                                ((n = l({
                                  status: !1,
                                  fromWhere: "parseAPI",
                                  message: "Apikey invalid, fedded or inactive",
                                  data: e.error,
                                })),
                                M()),
                              (n = l({
                                status: !1,
                                fromWhere: "parseAPI",
                                message: "API error code: " + e.error.code,
                                data: e.error,
                              })))
                            : (n = l({
                                status: !1,
                                fromWhere: "parseAPI",
                                message: "API error code: " + e.error.code,
                                data: e.error.error,
                              })),
                          d({ nstLastError: n }),
                          r(n))
                        : (w("nstLastError"),
                          t(
                            l({
                              status: !0,
                              fromWhere: "parseAPI",
                              message: "ok",
                              data: e,
                            }),
                          ));
                    });
                  })(e);
                })
                .catch(function (e) {
                  return s(
                    l({
                      status: !1,
                      fromWhere: "parseAPI",
                      message: "API error",
                      data: e,
                    }),
                  );
                })
                .then(function (e) {
                  var t = e.data;
                  return a(
                    l({
                      status: !0,
                      fromWhere: "tornApiRequest",
                      message: "fetch call error",
                      data: t,
                    }),
                  );
                })
                .catch(function (e) {
                  return s(
                    l({
                      status: !1,
                      fromWhere: "tornApiRequest",
                      message: "fetch call error",
                      data: e,
                    }),
                  );
                });
          });
        }
        function W(e, t) {
          return T.apply(this, arguments);
        }
        function T() {
          return (T = o(
            u().mark(function e(t, r) {
              return u().wrap(function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      return e.abrupt(
                        "return",
                        new Promise(function (e, n) {
                          return null == t
                            ? n(
                                l({
                                  status: !1,
                                  fromWhere: "tsApiRequest",
                                  message: "TS apikey not found",
                                }),
                              )
                            : 16 != t.length
                              ? n(
                                  l({
                                    status: !1,
                                    fromWhere: "tsApiRequest",
                                    message: "TS apikey invalid",
                                  }),
                                )
                              : null == r
                                ? n(
                                    l({
                                      status: !1,
                                      fromWhere: "tsApiRequest",
                                      message: "TS selection invalid",
                                    }),
                                  )
                                : void fetch(
                                    "https://www.tornstats.com/api/v2/" +
                                      t +
                                      "/" +
                                      r,
                                  )
                                    .then(function (e) {
                                      return 200 !== e.status
                                        ? n(
                                            l({
                                              status: !1,
                                              fromWhere: "tsApiRequest",
                                              message: "TS connection error",
                                              data: e,
                                            }),
                                          )
                                        : e.json();
                                    })
                                    .then(function (t) {
                                      return null ==
                                        (null == t ? void 0 : t.status)
                                        ? n(
                                            l({
                                              status: !1,
                                              fromWhere: "tsApiRequest",
                                              message: "TS no status",
                                              data: t,
                                            }),
                                          )
                                        : t.status
                                          ? e(
                                              l({
                                                status: !0,
                                                fromWhere: "tsApiRequest",
                                                message: "TS status true",
                                                data: t,
                                              }),
                                            )
                                          : n(
                                              l({
                                                status: !1,
                                                fromWhere: "tsApiRequest",
                                                message:
                                                  "TS status false rejection",
                                                data: { dat: t, sel: r },
                                              }),
                                            );
                                    })
                                    .catch(function (e) {
                                      return n(
                                        l({
                                          status: !1,
                                          fromWhere: "tsApiRequest",
                                          message: "TS fetch error",
                                          data: e,
                                        }),
                                      );
                                    });
                        }),
                      );
                    case 1:
                    case "end":
                      return e.stop();
                  }
              }, e);
            }),
          )).apply(this, arguments);
        }
        function A() {
          return P.apply(this, arguments);
        }
        function P() {
          return (P = o(
            u().mark(function e() {
              var t, r, n, s, o, i, c;
              return u().wrap(
                function (e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        return (e.prev = 0), (e.next = 3), g("nstTSspies");
                      case 3:
                        for (
                          t = e.sent.data, r = 0, n = Object.entries(t);
                          r < n.length;
                          r++
                        )
                          (s = a(n[r], 2)),
                            (o = s[0]),
                            null != (i = s[1]) && i.cacheUntil
                              ? Date.now() / 1e3 >= +i.cacheUntil && delete t[o]
                              : delete t[o];
                        d({ nstTSspies: t }), (e.next = 13);
                        break;
                      case 8:
                        (e.prev = 8),
                          (e.t0 = e.catch(0)),
                          l({
                            status: !1,
                            fromWhere: "clearTornStats",
                            message:
                              "nstTSspies is empty" ==
                              (null == (c = e.t0) ? void 0 : c.message)
                                ? "nstTSspies not found"
                                : "nstTSspies clear error",
                            data: c,
                          });
                      case 13:
                      case "end":
                        return e.stop();
                    }
                },
                e,
                null,
                [[0, 8]],
              );
            }),
          )).apply(this, arguments);
        }
        function L(e, t) {
          return new Promise(function (r, n) {
            return n(
              l({
                status: !1,
                fromWhere: "ninjaFlyRequest",
                message: "fetch error",
                data: e.error,
              }),
            );
            var a = "https://torn.seintz.com/api/".concat(e, "/fly/").concat(t);
            fetch(a, { method: "GET" })
              .then(function (e) {
                return e.json();
              })
              .then(function (e) {
                try {
                  if (e.error)
                    return n(
                      l({
                        status: !1,
                        fromWhere: "ninjaFlyRequest",
                        message: "fetch error",
                        data: e.error,
                      }),
                    );
                  r(
                    l({
                      status: !0,
                      fromWhere: "ninjaFlyRequest",
                      message: "ok",
                      data: e,
                    }),
                  );
                } catch (t) {
                  return n(
                    l({
                      status: !1,
                      fromWhere: "ninjaFlyRequest",
                      message: "catch error",
                      data: { error: e.error, response: e },
                    }),
                  );
                }
              })
              .catch(function (e) {
                return l({
                  status: !1,
                  fromWhere: "ninjaFlyRequest",
                  message: "promise catch error",
                  data: e,
                });
              });
          });
        }
        function E(e, t, r) {
          return new Promise(function (n, a) {
            return a(
              l({
                status: !1,
                fromWhere: "ninjaPstatReq",
                message: "fetch error",
                data: e.error,
              }),
            );
            var s = "https://torn.seintz.com/api/"
              .concat(e, "/personalstats/")
              .concat(t, "/")
              .concat(r);
            fetch(s, { method: "GET" })
              .then(function (e) {
                return e.json();
              })
              .then(function (e) {
                try {
                  if (e.error)
                    return a(
                      l({
                        status: !1,
                        fromWhere: "ninjaPstatReq",
                        message: "fetch error",
                        data: e.error,
                      }),
                    );
                  n(
                    l({
                      status: !0,
                      fromWhere: "ninjaPstatReq",
                      message: "ok",
                      data: e,
                    }),
                  );
                } catch (t) {
                  return a(
                    l({
                      status: !1,
                      fromWhere: "ninjaPstatReq",
                      message: "catch error",
                      data: { error: e.error, response: e },
                    }),
                  );
                }
              })
              .catch(function (e) {
                return l({
                  status: !1,
                  fromWhere: "ninjaPstatReq",
                  message: "promise catch error",
                  data: e,
                });
              });
          });
        }
        function D(e) {
          chrome.alarms.clear(e, function (e) {
            e &&
              l({
                status: !0,
                fromWhere: "clearAlarm",
                message: "API alarm removed",
              });
          });
        }
        function N() {
          return _.apply(this, arguments);
        }
        function _() {
          return (_ = o(
            u().mark(function e() {
              return u().wrap(function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      chrome.alarms.get("requiredApi", function (e) {
                        null == e &&
                          chrome.alarms.create("requiredApi", {
                            periodInMinutes: 0.5,
                          });
                      });
                    case 2:
                    case "end":
                      return e.stop();
                  }
              }, e);
            }),
          )).apply(this, arguments);
        }
        function I() {
          return (I = o(
            u().mark(function e() {
              var t, r, n, a, s, o;
              return u().wrap(function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      return (
                        (t = chrome.runtime.getURL("defaults.json")),
                        (e.next = 3),
                        Promise.all([fetch(t)])
                      );
                    case 3:
                      return (
                        (r = e.sent), (e.next = 6), Promise.all([r[0].json()])
                      );
                    case 6:
                      return (
                        (n = e.sent),
                        (a = n[0].scripts),
                        (s = n[0].notifications),
                        (o = n[0].nstFight),
                        (e.next = 12),
                        Promise.all([
                          d({ nstScripts: a }),
                          d({ nstNotification: s }),
                          d({ nstFight: o }),
                          d({ nstQuickFaction: {} }),
                          d({ nstQuickItems: {} }),
                          d({ nstQuickCrimes: {} }),
                          d({ nstTSspies: {} }),
                          d({ nstMember: !1 }),
                        ])
                      );
                    case 12:
                    case "end":
                      return e.stop();
                  }
              }, e);
            }),
          )).apply(this, arguments);
        }
        function R() {
          return q.apply(this, arguments);
        }
        function q() {
          return (q = o(
            u().mark(function e() {
              var t,
                r,
                n,
                a,
                s,
                o,
                i,
                l,
                p,
                f,
                h,
                m,
                v,
                y,
                b,
                x,
                w,
                k,
                S,
                j,
                O,
                W,
                T,
                A,
                P,
                L;
              return u().wrap(function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      return (
                        (t = chrome.runtime.getURL("defaults.json")),
                        (e.next = 3),
                        Promise.all([fetch(t)])
                      );
                    case 3:
                      return (
                        (r = e.sent),
                        (e.next = 6),
                        Promise.all([
                          r[0].json(),
                          g("nstScripts"),
                          g("nstNotification"),
                          g("nstFight"),
                          g("nstQuickFaction"),
                          g("nstQuickItems"),
                          g("nstQuickCrimes"),
                          g("nstTSspies"),
                        ])
                      );
                    case 6:
                      for (
                        n = e.sent,
                          a = n[0].scripts,
                          s = n[0].notifications,
                          o = n[0].nstFight,
                          i = n[1].data,
                          l = n[2].data,
                          p = n[3].data,
                          f = n[4].data,
                          h = n[5].data,
                          m = n[6].data,
                          v = n[7].data,
                          y = 0,
                          b = Object.keys(i);
                        y < b.length;
                        y++
                      )
                        (x = b[y]), a[x] && (a[x].enabled = i[x].enabled);
                      for (w = 0, k = Object.keys(l); w < k.length; w++)
                        (S = k[w]),
                          s[S] &&
                            ((s[S].enabled = l[S].enabled),
                            s[S].value && (s[S].value = l[S].value));
                      (j = u().mark(function e() {
                        var t;
                        return u().wrap(function (e) {
                          for (;;)
                            switch ((e.prev = e.next)) {
                              case 0:
                                "nstWeapon" === (t = W[O])
                                  ? 0 !==
                                      Object.keys(p[t]).filter(function (e) {
                                        return 2 == p[t][e];
                                      })[0].length && (o[t] = p[t])
                                  : t in o && (o[t] = p[t]);
                              case 2:
                              case "end":
                                return e.stop();
                            }
                        }, e);
                      })),
                        (O = 0),
                        (W = Object.keys(p));
                    case 21:
                      if (!(O < W.length)) {
                        e.next = 26;
                        break;
                      }
                      return e.delegateYield(j(), "t0", 23);
                    case 23:
                      O++, (e.next = 21);
                      break;
                    case 26:
                      if (
                        ((T = [
                          d({ nstScripts: a }),
                          d({ nstNotification: s }),
                          d({ nstFight: o }),
                        ]),
                        c(f) && T.push(d({ nstQuickFaction: {} })),
                        c(h) && T.push(d({ nstQuickItems: {} })),
                        c(m) && T.push(d({ nstQuickCrimes: {} })),
                        c(v))
                      )
                        T.push(d({ nstTSspies: {} }));
                      else {
                        for (A = 0, P = Object.keys(v); A < P.length; A++)
                          (L = P[A]).includes("spy-") && delete v[L];
                        T.push(d({ nstTSspies: v }));
                      }
                      return (e.next = 33), Promise.all(T);
                    case 33:
                    case "end":
                      return e.stop();
                  }
              }, e);
            }),
          )).apply(this, arguments);
        }
        function M() {
          return U.apply(this, arguments);
        }
        function U() {
          return (U = o(
            u().mark(function e() {
              return u().wrap(
                function (e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        return (
                          (e.prev = 0),
                          (e.next = 3),
                          Promise.all([
                            w("nstApikey"),
                            w("nstTSApikey"),
                            w("nstUser"),
                            w("nstUserData"),
                            w("nstMember"),
                          ])
                        );
                      case 3:
                        return (
                          chrome.action.setBadgeText({ text: "" }),
                          D("requiredApi"),
                          e.abrupt(
                            "return",
                            l({
                              status: !0,
                              fromWhere: "logout",
                              message: "user logged out",
                            }),
                          )
                        );
                      case 8:
                        return (
                          (e.prev = 8),
                          (e.t0 = e.catch(0)),
                          e.abrupt(
                            "return",
                            l({
                              status: !1,
                              fromWhere: "logout",
                              message: "logged out failed",
                              data: { err: e.t0 },
                            }),
                          )
                        );
                      case 11:
                      case "end":
                        return e.stop();
                    }
                },
                e,
                null,
                [[0, 8]],
              );
            }),
          )).apply(this, arguments);
        }
        function G(e, t, r, n) {
          return F.apply(this, arguments);
        }
        function F() {
          return (
            (F = o(
              u().mark(function e(t, r, n, a) {
                var s,
                  o,
                  i,
                  c = arguments;
                return u().wrap(function (e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        (s =
                          c.length > 4 && void 0 !== c[4]
                            ? c[4]
                            : "https://www.torn.com/"),
                          (o = c.length > 5 && void 0 !== c[5] && c[5]),
                          (i = a
                            ? [a, { action: "Close", title: "Close" }]
                            : [{ action: "Close", title: "Close" }]),
                          registration.showNotification(r, {
                            body: n,
                            data: { name: t, url: s },
                            icon: "/icons/nsv.jpg",
                            badge: "/icons/nsv.jpg",
                            message: n,
                            actions: i,
                          }),
                          o &&
                            chrome.tts.speak(n, { rate: 0.8 }, function () {
                              chrome.runtime.lastError &&
                                l({
                                  status: !1,
                                  fromWhere: "createNotification",
                                  message: "TTS error",
                                  data: { err: chrome.runtime.lastError.message },
                                });
                            });
                      case 5:
                      case "end":
                        return e.stop();
                    }
                }, e);
              }),
            )),
            F.apply(this, arguments)
          );
        }
        function K(e, t, r, n) {
          var a = !1,
            s = "Your " + e + " has reached it's value.",
            o = t[e].value,
            i = parseFloat(o.replace(/\D/g, "")),
            u = Math.floor(100 * i) / 100,
            c = Math.floor((r[e].current / r[e].maximum) * 100),
            l = Math.floor((n[e].current / n[e].maximum) * 100);
          return (
            o.includes("<") &&
              (o.includes("%")
                ? c < u &&
                  l >= u &&
                  ((a = !0), (s = "Your " + e + " has dropped below " + u + "%."))
                : r[e].current < i &&
                  n[e].current >= i &&
                  ((a = !0),
                  (s = "Your " + e + " has dropped below " + i + "."))),
            o.includes(">") &&
              (o.includes("%")
                ? c > u &&
                  l <= u &&
                  ((a = !0),
                  (s = "Your " + e + " has increased above " + u + "%."))
                : r[e].current > i &&
                  n[e].current <= i &&
                  ((a = !0),
                  (s = "Your " + e + " has increased above " + i + "."))),
            o.includes(">") ||
              o.includes("<") ||
              (o.includes("%")
                ? 100 == i
                  ? c >= u && l < u && ((a = !0), (s = "Your " + e + " is full."))
                  : c == u &&
                    ((a = !0), (s = "Your " + e + " has reached " + u + "%."))
                : r[e].current == i &&
                  ((a = !0), (s = "Your " + e + " has reached " + i + "."))),
            { notify: a, message: s }
          );
        }
        function C() {
          return (C = o(
            u().mark(function r(n) {
              var s,
                o,
                i,
                p,
                m,
                v,
                y,
                x,
                k,
                j,
                T,
                A,
                P,
                D,
                _,
                I,
                q,
                U,
                F,
                K,
                C,
                Y,
                Q,
                V,
                B,
                z,
                H,
                J,
                $,
                X,
                Z,
                ee,
                te,
                re,
                ne,
                ae,
                se,
                oe,
                ie,
                ue,
                ce,
                le,
                pe,
                fe,
                he,
                me,
                de,
                ve,
                ge,
                ye,
                be,
                xe,
                we,
                ke,
                Se,
                je,
                Oe,
                We,
                Te,
                Ae,
                Pe,
                Le;
              return u().wrap(
                function (r) {
                  for (;;)
                    switch ((r.prev = r.next)) {
                      case 0:
                        (s = []), (o = !1), (i = !1), (r.prev = 3), (m = h(n));
                      case 5:
                        return (r.next = 7), m.next();
                      case 7:
                        if (!(o = !(v = r.sent).done)) {
                          r.next = 235;
                          break;
                        }
                        (y = v.value),
                          (x = y.name),
                          (k = y.value),
                          (j = y.obj),
                          (r.t0 = x),
                          (r.next =
                            "msgOpenSetting" === r.t0
                              ? 15
                              : "msgSetApikey" === r.t0
                                ? 17
                                : "msgReadKey" === r.t0
                                  ? 25
                                  : "msgRemoveKey" === r.t0
                                    ? 40
                                    : "msgLogout" === r.t0
                                      ? 45
                                      : "msgUpdateKey" === r.t0
                                        ? 51
                                        : "msgNinjaFlightTimer" === r.t0
                                          ? 66
                                          : "msgNinjaPersonalstats" === r.t0
                                            ? 71
                                            : "msgSetTSApikey" === r.t0
                                              ? 76
                                              : "msgDeleteQuick" === r.t0
                                                ? 98
                                                : "msgGetApiData" === r.t0
                                                  ? 116
                                                  : "msgTSGetApiData" === r.t0
                                                    ? 125
                                                    : "msgUpdateTSspy" === r.t0
                                                      ? 138
                                                      : "nstNotiTest" === r.t0
                                                        ? 175
                                                        : "msgExport" === r.t0
                                                          ? 177
                                                          : "msgImport" === r.t0
                                                            ? 188
                                                            : 230);
                        break;
                      case 15:
                        return (
                          chrome.runtime.openOptionsPage
                            ? chrome.runtime.openOptionsPage()
                            : window.open(chrome.runtime.getURL("options.html")),
                          r.abrupt("break", 232)
                        );
                      case 17:
                        if (!k) {
                          r.next = 23;
                          break;
                        }
                        return (r.next = 20), Promise.all([S(k), N()]);
                      case 20:
                        s.push(
                          l({
                            status: !0,
                            fromWhere: "msgSetApikey",
                            message: "apikey saved",
                          }),
                        ),
                          (r.next = 24);
                        break;
                      case 23:
                        s.push(
                          l({
                            status: !1,
                            fromWhere: "msgSetApikey",
                            message: "apikey error",
                          }),
                        );
                      case 24:
                        return r.abrupt("break", 232);
                      case 25:
                        if (!k) {
                          r.next = 38;
                          break;
                        }
                        return (r.prev = 26), (r.next = 29), g(k);
                      case 29:
                        (T = r.sent),
                          s.push(
                            l({
                              status: !0,
                              fromWhere: "msgReadKey",
                              message: k + " retrieved",
                              data: T.data,
                            }),
                          ),
                          (r.next = 36);
                        break;
                      case 33:
                        (r.prev = 33),
                          (r.t1 = r.catch(26)),
                          s.push(
                            l({
                              status: !1,
                              fromWhere: "msgReadKey",
                              message: "error reading key " + k,
                              data: { err: r.t1 },
                            }),
                          );
                      case 36:
                        r.next = 39;
                        break;
                      case 38:
                        s.push(
                          l({
                            status: !1,
                            fromWhere: "msgReadKey",
                            message: "value not sent",
                          }),
                        );
                      case 39:
                        return r.abrupt("break", 232);
                      case 40:
                        return (r.next = 42), w(k);
                      case 42:
                        return (
                          (A = r.sent),
                          k
                            ? s.push(A)
                            : s.push(
                                l({
                                  status: !1,
                                  fromWhere: "msgRemoveKey",
                                  message: "value not sent",
                                }),
                              ),
                          r.abrupt("break", 232)
                        );
                      case 45:
                        return (r.t2 = s), (r.next = 48), M();
                      case 48:
                        return (
                          (r.t3 = r.sent),
                          r.t2.push.call(r.t2, r.t3),
                          r.abrupt("break", 232)
                        );
                      case 51:
                        if (!k || c(j)) {
                          r.next = 64;
                          break;
                        }
                        return (P = {}), (r.next = 55), g(k);
                      case 55:
                        if (
                          ((D = r.sent),
                          (_ = D.data),
                          (I = Object.keys(j)[0]),
                          "object" === e(_))
                        )
                          if (Object.keys(_).includes(I)) {
                            if ("object" === e(j[I]))
                              for (
                                q = 0, U = Object.entries(j[I]);
                                q < U.length;
                                q++
                              )
                                (F = a(U[q], 2)),
                                  (K = F[0]),
                                  (C = F[1]),
                                  (_[I][K] = C);
                            else _[I] = j[I];
                            P[k] = _;
                          } else (_[I] = j[I]), (P[k] = _);
                        else P[k] = j;
                        return (r.next = 61), d(P);
                      case 61:
                        s.push(
                          l({
                            status: !0,
                            fromWhere: "msgUpdateKey",
                            message: "merge successful",
                            data: P,
                          }),
                        ),
                          (r.next = 65);
                        break;
                      case 64:
                        s.push(
                          l({
                            status: !0,
                            fromWhere: "msgUpdateKey",
                            message: "merge successful",
                            data: { val: k },
                          }),
                        );
                      case 65:
                        return r.abrupt("break", 232);
                      case 66:
                        return (r.next = 68), L(k, "".concat(j.playerID));
                      case 68:
                        return (Y = r.sent), s.push(Y), r.abrupt("break", 232);
                      case 71:
                        return (
                          (r.next = 73), E(k, "".concat(j.playerID), +j.days)
                        );
                      case 73:
                        return (Q = r.sent), s.push(Q), r.abrupt("break", 232);
                      case 76:
                        if (!k) {
                          r.next = 96;
                          break;
                        }
                        return (r.prev = 77), (r.next = 80), W(k, "");
                      case 80:
                        if (!r.sent.status) {
                          r.next = 88;
                          break;
                        }
                        return (V = { nstTSApikey: k }), (r.next = 85), d(V);
                      case 85:
                        s.push(
                          l({
                            status: !0,
                            fromWhere: "msgSetTSApikey",
                            message: "apikey saved",
                          }),
                        ),
                          (r.next = 89);
                        break;
                      case 88:
                        s.push(
                          l({
                            status: !1,
                            fromWhere: "msgSetTSApikey",
                            message: "write error",
                          }),
                        );
                      case 89:
                        r.next = 94;
                        break;
                      case 91:
                        (r.prev = 91),
                          (r.t4 = r.catch(77)),
                          s.push(
                            l({
                              status: !1,
                              fromWhere: "msgSetTSApikey",
                              message: "catch error",
                              data: { err: r.t4 },
                            }),
                          );
                      case 94:
                        r.next = 97;
                        break;
                      case 96:
                        s.push(
                          l({
                            status: !1,
                            fromWhere: "msgSetTSApikey",
                            message: "apikey error",
                          }),
                        );
                      case 97:
                        return r.abrupt("break", 232);
                      case 98:
                        if (!k || !j) {
                          r.next = 114;
                          break;
                        }
                        return (r.next = 101), g(k);
                      case 101:
                        if (
                          ((B = r.sent.data),
                          (z = {}),
                          (H = B),
                          (J = j.id),
                          ($ = H[J].order),
                          delete H[J],
                          null != $)
                        )
                          for (X = 0, Z = Object.keys(H); X < Z.length; X++)
                            (te = Z[X]),
                              null === (ee = H[te]) || void 0 === ee || ee.order;
                        return (
                          (z[k] = JSON.parse(JSON.stringify(H))),
                          (r.next = 111),
                          d(z)
                        );
                      case 111:
                        s.push(
                          l({
                            status: !0,
                            fromWhere: "msgDeleteQuick",
                            message: "".concat(j, " deleted"),
                          }),
                        ),
                          (r.next = 115);
                        break;
                      case 114:
                        s.push(
                          l({
                            status: !1,
                            fromWhere: "msgDeleteQuick",
                            message: "value not set",
                          }),
                        );
                      case 115:
                        return r.abrupt("break", 232);
                      case 116:
                        if (!j) {
                          r.next = 123;
                          break;
                        }
                        return (
                          (r.next = 119),
                          O(
                            k,
                            "".concat(j.section),
                            "".concat(j.selection),
                            "".concat(j.objectID),
                          )
                        );
                      case 119:
                        (re = r.sent),
                          s.push(
                            l({
                              status: !0,
                              fromWhere: "msgGetApiData",
                              message: "apiData retrieved",
                              data: re.data,
                            }),
                          ),
                          (r.next = 124);
                        break;
                      case 123:
                        s.push(
                          l({
                            status: !1,
                            fromWhere: "msgGetApiData",
                            message: "msgObj empty",
                          }),
                        );
                      case 124:
                        return r.abrupt("break", 232);
                      case 125:
                        if (!j) {
                          r.next = 136;
                          break;
                        }
                        return (r.next = 128), g("nstTSApikey");
                      case 128:
                        return (
                          (ne = r.sent),
                          (ae = ne.data),
                          (r.next = 132),
                          W(ae, "".concat(j.selection))
                        );
                      case 132:
                        (se = r.sent),
                          s.push(
                            l({
                              status: !0,
                              fromWhere: "msgGetApiData",
                              message: "apiData retrieved",
                              data: se.data,
                            }),
                          ),
                          (r.next = 137);
                        break;
                      case 136:
                        s.push(
                          l({
                            status: !1,
                            fromWhere: "msgGetApiData",
                            message: "msgObj empty",
                          }),
                        );
                      case 137:
                        return r.abrupt("break", 232);
                      case 138:
                        if (!j) {
                          r.next = 173;
                          break;
                        }
                        return (r.next = 141), g("nstTSApikey");
                      case 141:
                        return (
                          (ie = r.sent),
                          (ue = "".concat(ie.data)),
                          (r.next = 145),
                          W(ue, "".concat(j.selection))
                        );
                      case 145:
                        if (
                          null == (ce = r.sent) ||
                          !ce.status ||
                          null == ce ||
                          null === (oe = ce.data) ||
                          void 0 === oe ||
                          !oe.status
                        ) {
                          r.next = 171;
                          break;
                        }
                        return (
                          (pe =
                            null == ce || null === (le = ce.data) || void 0 === le
                              ? void 0
                              : le.faction.members),
                          (r.next = 150),
                          g(k)
                        );
                      case 150:
                        (fe = r.sent),
                          (he = fe.data),
                          (me = 0),
                          (de = Object.entries(pe));
                      case 153:
                        if (!(me < de.length)) {
                          r.next = 168;
                          break;
                        }
                        if (
                          ((ve = a(de[me], 2)),
                          (ge = ve[0]),
                          (ye = ve[1]),
                          (be = {
                            spy: ye.spy,
                            personalstats: ye.personalstats,
                            timestamp: Math.round(Date.now() / 1e3),
                            cacheUntil: Math.round(Date.now() / 1e3 + 86400),
                          }),
                          (r.prev = 156),
                          !Object.keys(he).includes(ge))
                        ) {
                          r.next = 159;
                          break;
                        }
                        return r.abrupt("continue", 165);
                      case 159:
                        (he = f(f({}, he), {}, t({}, ge, be))), (r.next = 165);
                        break;
                      case 162:
                        (r.prev = 162), (r.t5 = r.catch(156)), console.log(r.t5);
                      case 165:
                        me++, (r.next = 153);
                        break;
                      case 168:
                        return (r.next = 170), d({ nstTSspies: he });
                      case 170:
                        s.push(
                          l({
                            status: !0,
                            fromWhere: "msgGetApiData",
                            message: "apiData retrieved",
                            data: he,
                          }),
                        );
                      case 171:
                        r.next = 174;
                        break;
                      case 173:
                        s.push(
                          l({
                            status: !1,
                            fromWhere: "msgGetApiData",
                            message: "msgObj empty",
                          }),
                        );
                      case 174:
                        return r.abrupt("break", 232);
                      case 175:
                        return (
                          G(
                            "nstNotiTest",
                            "nst: Test Notification",
                            "This is a test of the notification system.",
                            { action: "Open", title: "Torn" },
                            "https://www.torn.com/",
                            !1,
                          ),
                          r.abrupt("break", 232)
                        );
                      case 177:
                        return (r.prev = 177), (r.next = 180), b();
                      case 180:
                        (xe = r.sent),
                          s.push(
                            l({
                              status: !0,
                              fromWhere: "msgExport",
                              message: "storage retrieved",
                              data: xe.data,
                            }),
                          ),
                          (r.next = 187);
                        break;
                      case 184:
                        (r.prev = 184),
                          (r.t6 = r.catch(177)),
                          s.push(
                            l({
                              status: !1,
                              fromWhere: "msgExport",
                              message: "error reading whole storage",
                              data: { err: r.t6 },
                            }),
                          );
                      case 187:
                        return r.abrupt("break", 232);
                      case 188:
                        (r.prev = 188),
                          (we = !1),
                          (ke = !1),
                          (r.prev = 191),
                          (je = h(Object.entries(k)));
                      case 193:
                        return (r.next = 195), je.next();
                      case 195:
                        if (!(we = !(Oe = r.sent).done)) {
                          r.next = 205;
                          break;
                        }
                        return (
                          (We = Oe.value),
                          (Te = a(We, 2)),
                          (Ae = Te[0]),
                          (Pe = Te[1]),
                          ((Le = {})[Ae] = Pe),
                          (r.next = 202),
                          d(Le)
                        );
                      case 202:
                        (we = !1), (r.next = 193);
                        break;
                      case 205:
                        r.next = 211;
                        break;
                      case 207:
                        (r.prev = 207),
                          (r.t7 = r.catch(191)),
                          (ke = !0),
                          (Se = r.t7);
                      case 211:
                        if (
                          ((r.prev = 211),
                          (r.prev = 212),
                          !we || null == je.return)
                        ) {
                          r.next = 216;
                          break;
                        }
                        return (r.next = 216), je.return();
                      case 216:
                        if (((r.prev = 216), !ke)) {
                          r.next = 219;
                          break;
                        }
                        throw Se;
                      case 219:
                        return r.finish(216);
                      case 220:
                        return r.finish(211);
                      case 221:
                        return (r.next = 223), R();
                      case 223:
                        s.push(
                          l({
                            status: !0,
                            fromWhere: "msgImport",
                            message: "storage saved",
                            data: { msg: "import successful" },
                          }),
                        ),
                          (r.next = 229);
                        break;
                      case 226:
                        (r.prev = 226),
                          (r.t8 = r.catch(188)),
                          s.push(
                            l({
                              status: !1,
                              fromWhere: "msgImport",
                              message: "error saving storage",
                              data: { err: r.t8 },
                            }),
                          );
                      case 229:
                        return r.abrupt("break", 232);
                      case 230:
                        return (
                          s.push(
                            l({
                              status: !1,
                              fromWhere: "handleMessage",
                              message: "message not found",
                              data: { name: x },
                            }),
                          ),
                          r.abrupt("break", 232)
                        );
                      case 232:
                        (o = !1), (r.next = 5);
                        break;
                      case 235:
                        r.next = 241;
                        break;
                      case 237:
                        (r.prev = 237), (r.t9 = r.catch(3)), (i = !0), (p = r.t9);
                      case 241:
                        if (
                          ((r.prev = 241), (r.prev = 242), !o || null == m.return)
                        ) {
                          r.next = 246;
                          break;
                        }
                        return (r.next = 246), m.return();
                      case 246:
                        if (((r.prev = 246), !i)) {
                          r.next = 249;
                          break;
                        }
                        throw p;
                      case 249:
                        return r.finish(246);
                      case 250:
                        return r.finish(241);
                      case 251:
                        return r.abrupt("return", 1 == s.length ? s[0] : s);
                      case 252:
                      case "end":
                        return r.stop();
                    }
                },
                r,
                null,
                [
                  [3, 237, 241, 251],
                  [26, 33],
                  [77, 91],
                  [156, 162],
                  [177, 184],
                  [188, 226],
                  [191, 207, 211, 221],
                  [212, , 216, 220],
                  [242, , 246, 250],
                ],
              );
            }),
          )).apply(this, arguments);
        }
        function Y() {
          return (Y = o(
            u().mark(function e() {
              var t, r;
              return u().wrap(
                function (e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        return (
                          (t = "nstStartup"),
                          (r = { nstStartup: !0 }),
                          (e.prev = 2),
                          (e.next = 5),
                          new Promise(function (e, r) {
                            chrome.storage.session.get(t, function (n) {
                              c(n) &&
                                r(
                                  l({
                                    status: !0,
                                    fromWhere: "readKey",
                                    message: t + " is empty",
                                  }),
                                ),
                                e(
                                  l({
                                    status: !0,
                                    fromWhere: "readKey",
                                    message: n[t] + " has been read",
                                    data: n[t],
                                  }),
                                );
                            });
                          })
                        );
                      case 5:
                        N(), (e.next = 22);
                        break;
                      case 8:
                        return (
                          (e.prev = 8),
                          (e.t0 = e.catch(2)),
                          (e.next = 12),
                          new Promise(function (e, t) {
                            try {
                              chrome.storage.session.set(r, function () {
                                e(
                                  l({
                                    status: !0,
                                    fromWhere: "writeKey",
                                    message:
                                      Object.keys(r)[0] + " has been wrote",
                                  }),
                                );
                              });
                            } catch (e) {
                              t(
                                l({
                                  status: !1,
                                  fromWhere: "writeKey",
                                  message: "error writing key",
                                  data: { err: e },
                                }),
                              );
                            }
                          })
                        );
                      case 12:
                        return (e.next = 14), A();
                      case 14:
                        return (e.prev = 14), (e.next = 17), g("nstUserData");
                      case 17:
                        N(), (e.next = 22);
                        break;
                      case 20:
                        (e.prev = 20), (e.t1 = e.catch(14));
                      case 22:
                      case "end":
                        return e.stop();
                    }
                },
                e,
                null,
                [
                  [2, 8],
                  [14, 20],
                ],
              );
            }),
          )).apply(this, arguments);
        }
        chrome.alarms.onAlarm.addListener(function (e) {
          "requiredApi" == e.name &&
            g("nstApikey")
              .then(function (e) {
                return S("".concat(e.data));
              })
              .catch(function (e) {
                l({
                  status: !1,
                  fromWhere: "onAlarmListener",
                  message: "Api Error",
                  data: e,
                }),
                  D("requiredApi");
              });
        }),
          chrome.runtime.onInstalled.addListener(function (e) {
            "install" == e.reason &&
              (l({
                status: !0,
                fromWhere: "onInstalledListener",
                message: "new install, setting defaults",
              }),
              (function () {
                I.apply(this, arguments);
              })()),
              "update" == e.reason &&
                (l({
                  status: !0,
                  fromWhere: "onInstalledListener",
                  message: "new update, updating settings",
                }),
                R());
          }),
          self.addEventListener("notificationclick", function (e) {
            var t = e;
            "Open" === t.action &&
              t.notification.data.url &&
              chrome.tabs.create({ url: t.notification.data.url }),
              t.notification.close(),
              chrome.tts.stop();
          }),
          chrome.storage.onChanged.addListener(
            (function () {
              var e = o(
                u().mark(function e(t, r) {
                  var n,
                    s,
                    o,
                    i,
                    p,
                    f,
                    h,
                    m,
                    d,
                    v,
                    y,
                    b,
                    x,
                    w,
                    k,
                    S,
                    j,
                    O,
                    W,
                    T,
                    A,
                    P,
                    L,
                    E,
                    D,
                    N,
                    _,
                    I,
                    R,
                    q,
                    M,
                    U,
                    F,
                    C,
                    Y,
                    Q,
                    V,
                    B,
                    z,
                    H,
                    J,
                    $,
                    X,
                    Z,
                    ee,
                    te,
                    re,
                    ne,
                    ae,
                    se,
                    oe,
                    ie,
                    ue,
                    ce,
                    le,
                    pe,
                    fe,
                    he,
                    me,
                    de,
                    ve,
                    ge,
                    ye,
                    be,
                    xe,
                    we,
                    ke,
                    Se;
                  return u().wrap(function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          if (null != (null == t ? void 0 : t.nstUserData)) {
                            e.next = 2;
                            break;
                          }
                          return e.abrupt("return");
                        case 2:
                          return (
                            l({
                              status: !0,
                              fromWhere: "storageChange",
                              message: "change found",
                              data: { change: t, areaName: r },
                            }),
                            (e.next = 5),
                            g("nstNotification")
                          );
                        case 5:
                          if (
                            ((V = e.sent),
                            (B = V.data),
                            (z =
                              null == B ||
                              null === (n = B.ttsNoti) ||
                              void 0 === n
                                ? void 0
                                : n.enabled),
                            (H =
                              null == t ||
                              null === (s = t.nstUserData) ||
                              void 0 === s
                                ? void 0
                                : s.newValue),
                            (J =
                              null == t ||
                              null === (o = t.nstUserData) ||
                              void 0 === o
                                ? void 0
                                : o.oldValue),
                            !c(H) && !c(J))
                          ) {
                            e.next = 12;
                            break;
                          }
                          return e.abrupt("return");
                        case 12:
                          if (
                            (($ =
                              (null == H ||
                              null === (i = H.notifications) ||
                              void 0 === i
                                ? void 0
                                : i.events) +
                              (null == H ||
                              null === (p = H.notifications) ||
                              void 0 === p
                                ? void 0
                                : p.messages)) > 0
                              ? chrome.action.setBadgeText({ text: $.toString() })
                              : chrome.action.setBadgeText({ text: "" }),
                            !c(B))
                          ) {
                            e.next = 16;
                            break;
                          }
                          return e.abrupt("return");
                        case 16:
                          if (
                            null != B &&
                            null !== (f = B.allNoti) &&
                            void 0 !== f &&
                            f.enabled
                          ) {
                            e.next = 18;
                            break;
                          }
                          return e.abrupt("return");
                        case 18:
                          if (
                            null == B ||
                            null === (h = B.messages) ||
                            void 0 === h ||
                            !h.enabled ||
                            0 === Object.keys(H.messages).length
                          ) {
                            e.next = 32;
                            break;
                          }
                          (X = 0), (Z = Object.entries(H.messages));
                        case 20:
                          if (!(X < Z.length)) {
                            e.next = 32;
                            break;
                          }
                          if (
                            ((ee = a(Z[X], 2)),
                            (te = ee[0]),
                            (re = ee[1]),
                            !Object.keys(J.messages).includes(te))
                          ) {
                            e.next = 24;
                            break;
                          }
                          return e.abrupt("continue", 29);
                        case 24:
                          return (
                            (ae = (ne = re).name),
                            (se = ne.title),
                            (e.next = 29),
                            G(
                              "new_message",
                              "NST: New Message",
                              "From ".concat(ae, " - ").concat(se),
                              { action: "Open", title: "View Messages" },
                              "https://www.torn.com/messages.php",
                              z,
                            )
                          );
                        case 29:
                          X++, (e.next = 20);
                          break;
                        case 32:
                          if (
                            null == B ||
                            null === (m = B.events) ||
                            void 0 === m ||
                            !m.enabled ||
                            0 === Object.keys(H.events).length
                          ) {
                            e.next = 44;
                            break;
                          }
                          (oe = 0), (ie = Object.entries(H.events));
                        case 34:
                          if (!(oe < ie.length)) {
                            e.next = 44;
                            break;
                          }
                          if (
                            ((ue = a(ie[oe], 2)),
                            (ce = ue[0]),
                            (le = ue[1]),
                            !Object.keys(J.events).includes(ce))
                          ) {
                            e.next = 38;
                            break;
                          }
                          return e.abrupt("continue", 41);
                        case 38:
                          return (
                            (pe = le.event),
                            (e.next = 41),
                            G(
                              "new_event",
                              "NST: New Event",
                              "".concat(pe.replace(/<[^>]+>/g, "")),
                              { action: "Open", title: "View Events" },
                              "https://www.torn.com/events.php",
                              z,
                            )
                          );
                        case 41:
                          oe++, (e.next = 34);
                          break;
                        case 44:
                          if (
                            null == B ||
                            null === (d = B.drugCD) ||
                            void 0 === d ||
                            !d.enabled ||
                            0 ==
                              (null == J ||
                              null === (v = J.cooldowns) ||
                              void 0 === v
                                ? void 0
                                : v.drug) ||
                            0 !=
                              (null == H ||
                              null === (y = H.cooldowns) ||
                              void 0 === y
                                ? void 0
                                : y.drug)
                          ) {
                            e.next = 47;
                            break;
                          }
                          return (
                            (e.next = 47),
                            G(
                              "cooldown_drugs",
                              "NST: Drug Cooldown",
                              "Your drug cooldown has expired.",
                              { action: "Open", title: "View Items" },
                              "https://www.torn.com/item.php#drugs-items",
                              z,
                            )
                          );
                        case 47:
                          if (
                            null == B ||
                            null === (b = B.boosterCD) ||
                            void 0 === b ||
                            !b.enabled ||
                            0 ==
                              (null == J ||
                              null === (x = J.cooldowns) ||
                              void 0 === x
                                ? void 0
                                : x.booster) ||
                            0 !=
                              (null == H ||
                              null === (w = H.cooldowns) ||
                              void 0 === w
                                ? void 0
                                : w.booster)
                          ) {
                            e.next = 50;
                            break;
                          }
                          return (
                            (e.next = 50),
                            G(
                              "cooldown_boosters",
                              "NST: Booster Cooldown",
                              "Your booster cooldown has expired.",
                              { action: "Open", title: "View Items" },
                              "https://www.torn.com/item.php#boosters-items",
                              z,
                            )
                          );
                        case 50:
                          if (
                            null == B ||
                            null === (k = B.medCD) ||
                            void 0 === k ||
                            !k.enabled ||
                            0 ==
                              (null == J ||
                              null === (S = J.cooldowns) ||
                              void 0 === S
                                ? void 0
                                : S.medical) ||
                            0 !=
                              (null == H ||
                              null === (j = H.cooldowns) ||
                              void 0 === j
                                ? void 0
                                : j.medical)
                          ) {
                            e.next = 53;
                            break;
                          }
                          return (
                            (e.next = 53),
                            G(
                              "cooldown_medical",
                              "NST: Medical Cooldown",
                              "Your medical cooldown has expired.",
                              { action: "Open", title: "View Items" },
                              "https://www.torn.com/item.php#medical-items",
                              z,
                            )
                          );
                        case 53:
                          if (
                            null == B ||
                            null === (O = B.energy) ||
                            void 0 === O ||
                            !O.enabled ||
                            (null == H || null === (W = H.energy) || void 0 === W
                              ? void 0
                              : W.current) ==
                              (null == J ||
                              null === (T = J.energy) ||
                              void 0 === T
                                ? void 0
                                : T.current)
                          ) {
                            e.next = 58;
                            break;
                          }
                          if (1 != (fe = K("energy", B, H, J)).notify) {
                            e.next = 58;
                            break;
                          }
                          return (
                            (e.next = 58),
                            G(
                              "energy",
                              "NST: Energy",
                              fe.message,
                              { action: "Open", title: "Visit Gym" },
                              "https://www.torn.com/gym.php",
                              z,
                            )
                          );
                        case 58:
                          if (
                            null == B ||
                            null === (A = B.nerve) ||
                            void 0 === A ||
                            !A.enabled ||
                            (null == H || null === (P = H.nerve) || void 0 === P
                              ? void 0
                              : P.current) ==
                              (null == J || null === (L = J.nerve) || void 0 === L
                                ? void 0
                                : L.current)
                          ) {
                            e.next = 63;
                            break;
                          }
                          if (1 != (he = K("nerve", B, H, J)).notify) {
                            e.next = 63;
                            break;
                          }
                          return (
                            (e.next = 63),
                            G(
                              "nerve",
                              "NST: Nerve",
                              he.message,
                              { action: "Open", title: "Commit Crimes" },
                              "https://www.torn.com/crimes.php",
                              z,
                            )
                          );
                        case 63:
                          if (
                            null == B ||
                            null === (E = B.happy) ||
                            void 0 === E ||
                            !E.enabled ||
                            (null == H || null === (D = H.happy) || void 0 === D
                              ? void 0
                              : D.current) ==
                              (null == J || null === (N = J.happy) || void 0 === N
                                ? void 0
                                : N.current)
                          ) {
                            e.next = 68;
                            break;
                          }
                          if (1 != (me = K("happy", B, H, J)).notify) {
                            e.next = 68;
                            break;
                          }
                          return (
                            (e.next = 68),
                            G(
                              "happy",
                              "NST: Happy",
                              me.message,
                              { action: "Open", title: "Get Happy" },
                              "https://www.torn.com/item.php#candy-items",
                              z,
                            )
                          );
                        case 68:
                          if (
                            null == B ||
                            null === (_ = B.life) ||
                            void 0 === _ ||
                            !_.enabled ||
                            (null == H || null === (I = H.life) || void 0 === I
                              ? void 0
                              : I.current) ==
                              (null == J || null === (R = J.life) || void 0 === R
                                ? void 0
                                : R.current)
                          ) {
                            e.next = 73;
                            break;
                          }
                          if (1 != (de = K("life", B, H, J)).notify) {
                            e.next = 73;
                            break;
                          }
                          return (
                            (e.next = 73),
                            G(
                              "life",
                              "NST: Life",
                              de.message,
                              { action: "Open", title: "Get a Life" },
                              "https://www.torn.com/item.php#medical-items",
                              z,
                            )
                          );
                        case 73:
                          if (
                            null == B ||
                            null === (q = B.education) ||
                            void 0 === q ||
                            !q.enabled ||
                            0 == (null == J ? void 0 : J.education_current) ||
                            0 != (null == H ? void 0 : H.education_current)
                          ) {
                            e.next = 76;
                            break;
                          }
                          return (
                            (e.next = 76),
                            G(
                              "education",
                              "NST: Education",
                              "Your education course has complete.",
                              { action: "Open", title: "Get Knowledge" },
                              "https://www.torn.com/education.php",
                              z,
                            )
                          );
                        case 76:
                          if (
                            !(
                              null != B &&
                              null !== (M = B.travel) &&
                              void 0 !== M &&
                              M.enabled &&
                              null != B &&
                              null !== (U = B.travel) &&
                              void 0 !== U &&
                              U.value &&
                              (null == H ||
                              null === (F = H.travel) ||
                              void 0 === F
                                ? void 0
                                : F.time_left) <
                                60 *
                                  +(null == B ||
                                  null === (C = B.travel) ||
                                  void 0 === C
                                    ? void 0
                                    : C.value) &&
                              (null == H ||
                              null === (Y = H.travel) ||
                              void 0 === Y
                                ? void 0
                                : Y.time_left) !=
                                (null == J ||
                                null === (Q = J.travel) ||
                                void 0 === Q
                                  ? void 0
                                  : Q.time_left)
                            )
                          ) {
                            e.next = 90;
                            break;
                          }
                          return (
                            console.log(
                              null == H ||
                                null === (ve = H.travel) ||
                                void 0 === ve
                                ? void 0
                                : ve.time_left,
                            ),
                            (ye = ""),
                            (be =
                              60 *
                              +(null == B ||
                              null === (ge = B.travel) ||
                              void 0 === ge
                                ? void 0
                                : ge.value)),
                            (xe = Math.floor(be / 864e5)),
                            (we = Math.floor((be % 864e5) / 36e5)),
                            (ke = Math.floor((be % 36e5) / 6e4)),
                            (Se = Math.floor((be % 6e4) / 1e3)),
                            xe > 0 &&
                              (ye += "".concat(
                                xe.toString().padStart(2, "0"),
                                "d ",
                              )),
                            we > 0 &&
                              (ye += "".concat(
                                we.toString().padStart(2, "0"),
                                "h ",
                              )),
                            ke > 0 &&
                              (ye += "".concat(
                                ke.toString().padStart(2, "0"),
                                "m ",
                              )),
                            Se > 0 &&
                              (ye += "".concat(
                                Se.toString().padStart(2, "0"),
                                "s",
                              )),
                            (e.next = 90),
                            G(
                              "new_message",
                              "NST: Travel Notification",
                              ""
                                .concat(H.travel.destination, " - Landing in ")
                                .concat(ye),
                              { action: "Open", title: H.travel.destination },
                              "https://www.torn.com/index.php",
                              z,
                            )
                          );
                        case 90:
                        case "end":
                          return e.stop();
                      }
                  }, e);
                }),
              );
              return function (t, r) {
                return e.apply(this, arguments);
              };
            })(),
          ),
          chrome.runtime.onMessage.addListener(function (e, t, r) {
            return (
              (function (e) {
                return C.apply(this, arguments);
              })(e)
                .then(function (e) {
                  r(e);
                })
                .catch(function (e) {
                  r(e);
                }),
              !0
            );
          }),
          (function () {
            Y.apply(this, arguments);
          })();
      })();
  })();
  