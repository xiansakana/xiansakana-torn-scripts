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
              i = n.hasOwnProperty,
              a =
                Object.defineProperty ||
                function (t, e, n) {
                  t[e] = n.value;
                },
              l = "function" == typeof Symbol ? Symbol : {},
              s = l.iterator || "@@iterator",
              c = l.asyncIterator || "@@asyncIterator",
              u = l.toStringTag || "@@toStringTag";
            function d(t, e, n) {
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
              d({}, "");
            } catch (t) {
              d = function (t, e, n) {
                return (t[e] = n);
              };
            }
            function h(t, e, n, r) {
              var o = e && e.prototype instanceof v ? e : v,
                i = Object.create(o.prototype),
                l = new C(r || []);
              return a(i, "_invoke", { value: T(t, n, l) }), i;
            }
            function f(t, e, n) {
              try {
                return { type: "normal", arg: t.call(e, n) };
              } catch (t) {
                return { type: "throw", arg: t };
              }
            }
            e.wrap = h;
            var p = {};
            function v() {}
            function m() {}
            function g() {}
            var y = {};
            d(y, s, function () {
              return this;
            });
            var b = Object.getPrototypeOf,
              w = b && b(b(O([])));
            w && w !== n && i.call(w, s) && (y = w);
            var E = (g.prototype = v.prototype = Object.create(y));
            function S(t) {
              ["next", "throw", "return"].forEach(function (e) {
                d(t, e, function (t) {
                  return this._invoke(e, t);
                });
              });
            }
            function x(t, e) {
              function n(o, a, l, s) {
                var c = f(t[o], t, a);
                if ("throw" !== c.type) {
                  var u = c.arg,
                    d = u.value;
                  return d && "object" == r(d) && i.call(d, "__await")
                    ? e.resolve(d.__await).then(
                        function (t) {
                          n("next", t, l, s);
                        },
                        function (t) {
                          n("throw", t, l, s);
                        },
                      )
                    : e.resolve(d).then(
                        function (t) {
                          (u.value = t), l(u);
                        },
                        function (t) {
                          return n("throw", t, l, s);
                        },
                      );
                }
                s(c.arg);
              }
              var o;
              a(this, "_invoke", {
                value: function (t, r) {
                  function i() {
                    return new e(function (e, o) {
                      n(t, r, e, o);
                    });
                  }
                  return (o = o ? o.then(i, i) : i());
                },
              });
            }
            function T(t, e, n) {
              var r = "suspendedStart";
              return function (o, i) {
                if ("executing" === r)
                  throw new Error("Generator is already running");
                if ("completed" === r) {
                  if ("throw" === o) throw i;
                  return { value: void 0, done: !0 };
                }
                for (n.method = o, n.arg = i; ; ) {
                  var a = n.delegate;
                  if (a) {
                    var l = _(a, n);
                    if (l) {
                      if (l === p) continue;
                      return l;
                    }
                  }
                  if ("next" === n.method) n.sent = n._sent = n.arg;
                  else if ("throw" === n.method) {
                    if ("suspendedStart" === r) throw ((r = "completed"), n.arg);
                    n.dispatchException(n.arg);
                  } else "return" === n.method && n.abrupt("return", n.arg);
                  r = "executing";
                  var s = f(t, e, n);
                  if ("normal" === s.type) {
                    if (
                      ((r = n.done ? "completed" : "suspendedYield"), s.arg === p)
                    )
                      continue;
                    return { value: s.arg, done: n.done };
                  }
                  "throw" === s.type &&
                    ((r = "completed"), (n.method = "throw"), (n.arg = s.arg));
                }
              };
            }
            function _(t, e) {
              var n = e.method,
                r = t.iterator[n];
              if (void 0 === r)
                return (
                  (e.delegate = null),
                  ("throw" === n &&
                    t.iterator.return &&
                    ((e.method = "return"),
                    (e.arg = void 0),
                    _(t, e),
                    "throw" === e.method)) ||
                    ("return" !== n &&
                      ((e.method = "throw"),
                      (e.arg = new TypeError(
                        "The iterator does not provide a '" + n + "' method",
                      )))),
                  p
                );
              var o = f(r, t.iterator, e.arg);
              if ("throw" === o.type)
                return (
                  (e.method = "throw"), (e.arg = o.arg), (e.delegate = null), p
                );
              var i = o.arg;
              return i
                ? i.done
                  ? ((e[t.resultName] = i.value),
                    (e.next = t.nextLoc),
                    "return" !== e.method &&
                      ((e.method = "next"), (e.arg = void 0)),
                    (e.delegate = null),
                    p)
                  : i
                : ((e.method = "throw"),
                  (e.arg = new TypeError("iterator result is not an object")),
                  (e.delegate = null),
                  p);
            }
            function L(t) {
              var e = { tryLoc: t[0] };
              1 in t && (e.catchLoc = t[1]),
                2 in t && ((e.finallyLoc = t[2]), (e.afterLoc = t[3])),
                this.tryEntries.push(e);
            }
            function D(t) {
              var e = t.completion || {};
              (e.type = "normal"), delete e.arg, (t.completion = e);
            }
            function C(t) {
              (this.tryEntries = [{ tryLoc: "root" }]),
                t.forEach(L, this),
                this.reset(!0);
            }
            function O(t) {
              if (t) {
                var e = t[s];
                if (e) return e.call(t);
                if ("function" == typeof t.next) return t;
                if (!isNaN(t.length)) {
                  var n = -1,
                    r = function e() {
                      for (; ++n < t.length; )
                        if (i.call(t, n))
                          return (e.value = t[n]), (e.done = !1), e;
                      return (e.value = void 0), (e.done = !0), e;
                    };
                  return (r.next = r);
                }
              }
              return { next: A };
            }
            function A() {
              return { value: void 0, done: !0 };
            }
            return (
              (m.prototype = g),
              a(E, "constructor", { value: g, configurable: !0 }),
              a(g, "constructor", { value: m, configurable: !0 }),
              (m.displayName = d(g, u, "GeneratorFunction")),
              (e.isGeneratorFunction = function (t) {
                var e = "function" == typeof t && t.constructor;
                return (
                  !!e &&
                  (e === m || "GeneratorFunction" === (e.displayName || e.name))
                );
              }),
              (e.mark = function (t) {
                return (
                  Object.setPrototypeOf
                    ? Object.setPrototypeOf(t, g)
                    : ((t.__proto__ = g), d(t, u, "GeneratorFunction")),
                  (t.prototype = Object.create(E)),
                  t
                );
              }),
              (e.awrap = function (t) {
                return { __await: t };
              }),
              S(x.prototype),
              d(x.prototype, c, function () {
                return this;
              }),
              (e.AsyncIterator = x),
              (e.async = function (t, n, r, o, i) {
                void 0 === i && (i = Promise);
                var a = new x(h(t, n, r, o), i);
                return e.isGeneratorFunction(n)
                  ? a
                  : a.next().then(function (t) {
                      return t.done ? t.value : a.next();
                    });
              }),
              S(E),
              d(E, u, "Generator"),
              d(E, s, function () {
                return this;
              }),
              d(E, "toString", function () {
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
              (e.values = O),
              (C.prototype = {
                constructor: C,
                reset: function (t) {
                  if (
                    ((this.prev = 0),
                    (this.next = 0),
                    (this.sent = this._sent = void 0),
                    (this.done = !1),
                    (this.delegate = null),
                    (this.method = "next"),
                    (this.arg = void 0),
                    this.tryEntries.forEach(D),
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
                  function n(n, r) {
                    return (
                      (a.type = "throw"),
                      (a.arg = t),
                      (e.next = n),
                      r && ((e.method = "next"), (e.arg = void 0)),
                      !!r
                    );
                  }
                  for (var r = this.tryEntries.length - 1; r >= 0; --r) {
                    var o = this.tryEntries[r],
                      a = o.completion;
                    if ("root" === o.tryLoc) return n("end");
                    if (o.tryLoc <= this.prev) {
                      var l = i.call(o, "catchLoc"),
                        s = i.call(o, "finallyLoc");
                      if (l && s) {
                        if (this.prev < o.catchLoc) return n(o.catchLoc, !0);
                        if (this.prev < o.finallyLoc) return n(o.finallyLoc);
                      } else if (l) {
                        if (this.prev < o.catchLoc) return n(o.catchLoc, !0);
                      } else {
                        if (!s)
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
                      i.call(r, "finallyLoc") &&
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
                  var a = o ? o.completion : {};
                  return (
                    (a.type = t),
                    (a.arg = e),
                    o
                      ? ((this.method = "next"), (this.next = o.finallyLoc), p)
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
                    p
                  );
                },
                finish: function (t) {
                  for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                    var n = this.tryEntries[e];
                    if (n.finallyLoc === t)
                      return this.complete(n.completion, n.afterLoc), D(n), p;
                  }
                },
                catch: function (t) {
                  for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                    var n = this.tryEntries[e];
                    if (n.tryLoc === t) {
                      var r = n.completion;
                      if ("throw" === r.type) {
                        var o = r.arg;
                        D(n);
                      }
                      return o;
                    }
                  }
                  throw new Error("illegal catch attempt");
                },
                delegateYield: function (t, e, n) {
                  return (
                    (this.delegate = {
                      iterator: O(t),
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
      var i = (e[r] = { exports: {} });
      return t[r](i, i.exports, n), i.exports;
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
        function t(t, e, n, r, o, i, a) {
          try {
            var l = t[i](a),
              s = l.value;
          } catch (t) {
            return void n(t);
          }
          l.done ? e(s) : Promise.resolve(s).then(r, o);
        }
        function e(t) {
          return (
            (e =
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
            e(t)
          );
        }
        function r(t, n, r) {
          return (
            (n = (function (t) {
              var n = (function (t, n) {
                if ("object" !== e(t) || null === t) return t;
                var r = t[Symbol.toPrimitive];
                if (void 0 !== r) {
                  var o = r.call(t, "string");
                  if ("object" !== e(o)) return o;
                  throw new TypeError(
                    "@@toPrimitive must return a primitive value.",
                  );
                }
                return String(t);
              })(t);
              return "symbol" === e(n) ? n : String(n);
            })(n)) in t
              ? Object.defineProperty(t, n, {
                  value: r,
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                })
              : (t[n] = r),
            t
          );
        }
        function o(t, e) {
          (null == e || e > t.length) && (e = t.length);
          for (var n = 0, r = new Array(e); n < e; n++) r[n] = t[n];
          return r;
        }
        function i(t, e) {
          return (
            (function (t) {
              if (Array.isArray(t)) return t;
            })(t) ||
            (function (t, e) {
              var n =
                null == t
                  ? null
                  : ("undefined" != typeof Symbol && t[Symbol.iterator]) ||
                    t["@@iterator"];
              if (null != n) {
                var r,
                  o,
                  i,
                  a,
                  l = [],
                  s = !0,
                  c = !1;
                try {
                  if (((i = (n = n.call(t)).next), 0 === e)) {
                    if (Object(n) !== n) return;
                    s = !1;
                  } else
                    for (
                      ;
                      !(s = (r = i.call(n)).done) &&
                      (l.push(r.value), l.length !== e);
                      s = !0
                    );
                } catch (t) {
                  (c = !0), (o = t);
                } finally {
                  try {
                    if (
                      !s &&
                      null != n.return &&
                      ((a = n.return()), Object(a) !== a)
                    )
                      return;
                  } finally {
                    if (c) throw o;
                  }
                }
                return l;
              }
            })(t, e) ||
            (function (t, e) {
              if (t) {
                if ("string" == typeof t) return o(t, e);
                var n = Object.prototype.toString.call(t).slice(8, -1);
                return (
                  "Object" === n && t.constructor && (n = t.constructor.name),
                  "Map" === n || "Set" === n
                    ? Array.from(t)
                    : "Arguments" === n ||
                        /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                      ? o(t, e)
                      : void 0
                );
              }
            })(t, e) ||
            (function () {
              throw new TypeError(
                "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
              );
            })()
          );
        }
        var a = n(687),
          l = n.n(a);
        function s() {
          for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++)
            e[n] = arguments[n];
          return new Promise(function (t) {
            chrome.runtime.sendMessage(e, function (e) {
              t(e);
            });
          });
        }
        function c(t) {
          return !t || null == t || 0 === Object.keys(t).length;
        }
        function u(t) {
          return t.status || console.log(t), t;
        }
        function d(t, e) {
          return Object.assign(document.createElement(t), e);
        }
        function h(t, e) {
          var n;
          return null === (n = document) ||
            void 0 === n ||
            null === (n = n.getElementById(t)) ||
            void 0 === n
            ? void 0
            : n.appendChild(e);
        }
        function f(t) {
          return document.body.appendChild(t);
        }
        function p(t, e) {
          var n,
            r =
              null === (n = document) || void 0 === n
                ? void 0
                : n.getElementById(t);
          if (r && r.parentElement) return r.parentElement.insertBefore(e, r);
        }
        function v(t, e) {
          var n = Object.keys(t);
          if (Object.getOwnPropertySymbols) {
            var r = Object.getOwnPropertySymbols(t);
            e &&
              (r = r.filter(function (e) {
                return Object.getOwnPropertyDescriptor(t, e).enumerable;
              })),
              n.push.apply(n, r);
          }
          return n;
        }
        function m(t) {
          for (var e = 1; e < arguments.length; e++) {
            var n = null != arguments[e] ? arguments[e] : {};
            e % 2
              ? v(Object(n), !0).forEach(function (e) {
                  y(t, e, n[e]);
                })
              : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n))
                : v(Object(n)).forEach(function (e) {
                    Object.defineProperty(
                      t,
                      e,
                      Object.getOwnPropertyDescriptor(n, e),
                    );
                  });
          }
          return t;
        }
        function g(t) {
          return (
            (g =
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
            g(t)
          );
        }
        function y(t, e, n) {
          return (
            e in t
              ? Object.defineProperty(t, e, {
                  value: n,
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                })
              : (t[e] = n),
            t
          );
        }
        function b() {
          return (
            (b =
              Object.assign ||
              function (t) {
                for (var e = 1; e < arguments.length; e++) {
                  var n = arguments[e];
                  for (var r in n)
                    Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r]);
                }
                return t;
              }),
            b.apply(this, arguments)
          );
        }
        function w(t) {
          if ("undefined" != typeof window && window.navigator)
            return !!navigator.userAgent.match(t);
        }
        var E = w(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i),
          S = w(/Edge/i),
          x = w(/firefox/i),
          T = w(/safari/i) && !w(/chrome/i) && !w(/android/i),
          _ = w(/iP(ad|od|hone)/i),
          L = w(/chrome/i) && w(/android/i),
          D = { capture: !1, passive: !1 };
        function C(t, e, n) {
          t.addEventListener(e, n, !E && D);
        }
        function O(t, e, n) {
          t.removeEventListener(e, n, !E && D);
        }
        function A(t, e) {
          if (e) {
            if ((">" === e[0] && (e = e.substring(1)), t))
              try {
                if (t.matches) return t.matches(e);
                if (t.msMatchesSelector) return t.msMatchesSelector(e);
                if (t.webkitMatchesSelector) return t.webkitMatchesSelector(e);
              } catch (t) {
                return !1;
              }
            return !1;
          }
        }
        function I(t) {
          return t.host && t !== document && t.host.nodeType
            ? t.host
            : t.parentNode;
        }
        function k(t, e, n, r) {
          if (t) {
            n = n || document;
            do {
              if (
                (null != e &&
                  (">" === e[0] ? t.parentNode === n && A(t, e) : A(t, e))) ||
                (r && t === n)
              )
                return t;
              if (t === n) break;
            } while ((t = I(t)));
          }
          return null;
        }
        var P,
          N = /\s+/g;
        function M(t, e, n) {
          if (t && e)
            if (t.classList) t.classList[n ? "add" : "remove"](e);
            else {
              var r = (" " + t.className + " ")
                .replace(N, " ")
                .replace(" " + e + " ", " ");
              t.className = (r + (n ? " " + e : "")).replace(N, " ");
            }
        }
        function j(t, e, n) {
          var r = t && t.style;
          if (r) {
            if (void 0 === n)
              return (
                document.defaultView && document.defaultView.getComputedStyle
                  ? (n = document.defaultView.getComputedStyle(t, ""))
                  : t.currentStyle && (n = t.currentStyle),
                void 0 === e ? n : n[e]
              );
            e in r || -1 !== e.indexOf("webkit") || (e = "-webkit-" + e),
              (r[e] = n + ("string" == typeof n ? "" : "px"));
          }
        }
        function F(t, e) {
          var n = "";
          if ("string" == typeof t) n = t;
          else
            do {
              var r = j(t, "transform");
              r && "none" !== r && (n = r + " " + n);
            } while (!e && (t = t.parentNode));
          var o =
            window.DOMMatrix ||
            window.WebKitCSSMatrix ||
            window.CSSMatrix ||
            window.MSCSSMatrix;
          return o && new o(n);
        }
        function R(t, e, n) {
          if (t) {
            var r = t.getElementsByTagName(e),
              o = 0,
              i = r.length;
            if (n) for (; o < i; o++) n(r[o], o);
            return r;
          }
          return [];
        }
        function B() {
          return document.scrollingElement || document.documentElement;
        }
        function Y(t, e, n, r, o) {
          if (t.getBoundingClientRect || t === window) {
            var i, a, l, s, c, u, d;
            if (
              (t !== window && t.parentNode && t !== B()
                ? ((a = (i = t.getBoundingClientRect()).top),
                  (l = i.left),
                  (s = i.bottom),
                  (c = i.right),
                  (u = i.height),
                  (d = i.width))
                : ((a = 0),
                  (l = 0),
                  (s = window.innerHeight),
                  (c = window.innerWidth),
                  (u = window.innerHeight),
                  (d = window.innerWidth)),
              (e || n) && t !== window && ((o = o || t.parentNode), !E))
            )
              do {
                if (
                  o &&
                  o.getBoundingClientRect &&
                  ("none" !== j(o, "transform") ||
                    (n && "static" !== j(o, "position")))
                ) {
                  var h = o.getBoundingClientRect();
                  (a -= h.top + parseInt(j(o, "border-top-width"))),
                    (l -= h.left + parseInt(j(o, "border-left-width"))),
                    (s = a + i.height),
                    (c = l + i.width);
                  break;
                }
              } while ((o = o.parentNode));
            if (r && t !== window) {
              var f = F(o || t),
                p = f && f.a,
                v = f && f.d;
              f && ((s = (a /= v) + (u /= v)), (c = (l /= p) + (d /= p)));
            }
            return { top: a, left: l, bottom: s, right: c, width: d, height: u };
          }
        }
        function X(t, e, n) {
          for (var r = K(t, !0), o = Y(t)[e]; r; ) {
            var i = Y(r)[n];
            if (!("top" === n || "left" === n ? o >= i : o <= i)) return r;
            if (r === B()) break;
            r = K(r, !1);
          }
          return !1;
        }
        function W(t, e, n, r) {
          for (var o = 0, i = 0, a = t.children; i < a.length; ) {
            if (
              "none" !== a[i].style.display &&
              a[i] !== qt.ghost &&
              (r || a[i] !== qt.dragged) &&
              k(a[i], n.draggable, t, !1)
            ) {
              if (o === e) return a[i];
              o++;
            }
            i++;
          }
          return null;
        }
        function H(t, e) {
          for (
            var n = t.lastElementChild;
            n &&
            (n === qt.ghost || "none" === j(n, "display") || (e && !A(n, e)));
  
          )
            n = n.previousElementSibling;
          return n || null;
        }
        function U(t, e) {
          var n = 0;
          if (!t || !t.parentNode) return -1;
          for (; (t = t.previousElementSibling); )
            "TEMPLATE" === t.nodeName.toUpperCase() ||
              t === qt.clone ||
              (e && !A(t, e)) ||
              n++;
          return n;
        }
        function z(t) {
          var e = 0,
            n = 0,
            r = B();
          if (t)
            do {
              var o = F(t),
                i = o.a,
                a = o.d;
              (e += t.scrollLeft * i), (n += t.scrollTop * a);
            } while (t !== r && (t = t.parentNode));
          return [e, n];
        }
        function K(t, e) {
          if (!t || !t.getBoundingClientRect) return B();
          var n = t,
            r = !1;
          do {
            if (
              n.clientWidth < n.scrollWidth ||
              n.clientHeight < n.scrollHeight
            ) {
              var o = j(n);
              if (
                (n.clientWidth < n.scrollWidth &&
                  ("auto" == o.overflowX || "scroll" == o.overflowX)) ||
                (n.clientHeight < n.scrollHeight &&
                  ("auto" == o.overflowY || "scroll" == o.overflowY))
              ) {
                if (!n.getBoundingClientRect || n === document.body) return B();
                if (r || e) return n;
                r = !0;
              }
            }
          } while ((n = n.parentNode));
          return B();
        }
        function G(t, e) {
          return (
            Math.round(t.top) === Math.round(e.top) &&
            Math.round(t.left) === Math.round(e.left) &&
            Math.round(t.height) === Math.round(e.height) &&
            Math.round(t.width) === Math.round(e.width)
          );
        }
        function q(t, e) {
          return function () {
            if (!P) {
              var n = arguments;
              1 === n.length ? t.call(this, n[0]) : t.apply(this, n),
                (P = setTimeout(function () {
                  P = void 0;
                }, e));
            }
          };
        }
        function V(t, e, n) {
          (t.scrollLeft += e), (t.scrollTop += n);
        }
        function $(t) {
          var e = window.Polymer,
            n = window.jQuery || window.Zepto;
          return e && e.dom
            ? e.dom(t).cloneNode(!0)
            : n
              ? n(t).clone(!0)[0]
              : t.cloneNode(!0);
        }
        var J = "Sortable" + new Date().getTime(),
          Z = [],
          Q = { initializeByDefault: !0 },
          tt = {
            mount: function (t) {
              for (var e in Q) Q.hasOwnProperty(e) && !(e in t) && (t[e] = Q[e]);
              Z.forEach(function (e) {
                if (e.pluginName === t.pluginName)
                  throw "Sortable: Cannot mount plugin ".concat(
                    t.pluginName,
                    " more than once",
                  );
              }),
                Z.push(t);
            },
            pluginEvent: function (t, e, n) {
              var r = this;
              (this.eventCanceled = !1),
                (n.cancel = function () {
                  r.eventCanceled = !0;
                });
              var o = t + "Global";
              Z.forEach(function (r) {
                e[r.pluginName] &&
                  (e[r.pluginName][o] &&
                    e[r.pluginName][o](m({ sortable: e }, n)),
                  e.options[r.pluginName] &&
                    e[r.pluginName][t] &&
                    e[r.pluginName][t](m({ sortable: e }, n)));
              });
            },
            initializePlugins: function (t, e, n, r) {
              for (var o in (Z.forEach(function (r) {
                var o = r.pluginName;
                if (t.options[o] || r.initializeByDefault) {
                  var i = new r(t, e, t.options);
                  (i.sortable = t),
                    (i.options = t.options),
                    (t[o] = i),
                    b(n, i.defaults);
                }
              }),
              t.options))
                if (t.options.hasOwnProperty(o)) {
                  var i = this.modifyOption(t, o, t.options[o]);
                  void 0 !== i && (t.options[o] = i);
                }
            },
            getEventProperties: function (t, e) {
              var n = {};
              return (
                Z.forEach(function (r) {
                  "function" == typeof r.eventProperties &&
                    b(n, r.eventProperties.call(e[r.pluginName], t));
                }),
                n
              );
            },
            modifyOption: function (t, e, n) {
              var r;
              return (
                Z.forEach(function (o) {
                  t[o.pluginName] &&
                    o.optionListeners &&
                    "function" == typeof o.optionListeners[e] &&
                    (r = o.optionListeners[e].call(t[o.pluginName], n));
                }),
                r
              );
            },
          },
          et = ["evt"],
          nt = function (t, e) {
            var n =
                arguments.length > 2 && void 0 !== arguments[2]
                  ? arguments[2]
                  : {},
              r = n.evt,
              o = (function (t, e) {
                if (null == t) return {};
                var n,
                  r,
                  o = (function (t, e) {
                    if (null == t) return {};
                    var n,
                      r,
                      o = {},
                      i = Object.keys(t);
                    for (r = 0; r < i.length; r++)
                      (n = i[r]), e.indexOf(n) >= 0 || (o[n] = t[n]);
                    return o;
                  })(t, e);
                if (Object.getOwnPropertySymbols) {
                  var i = Object.getOwnPropertySymbols(t);
                  for (r = 0; r < i.length; r++)
                    (n = i[r]),
                      e.indexOf(n) >= 0 ||
                        (Object.prototype.propertyIsEnumerable.call(t, n) &&
                          (o[n] = t[n]));
                }
                return o;
              })(n, et);
            tt.pluginEvent.bind(qt)(
              t,
              e,
              m(
                {
                  dragEl: ot,
                  parentEl: it,
                  ghostEl: at,
                  rootEl: lt,
                  nextEl: st,
                  lastDownEl: ct,
                  cloneEl: ut,
                  cloneHidden: dt,
                  dragStarted: Tt,
                  putSortable: gt,
                  activeSortable: qt.active,
                  originalEvent: r,
                  oldIndex: ht,
                  oldDraggableIndex: pt,
                  newIndex: ft,
                  newDraggableIndex: vt,
                  hideGhostForTarget: Ut,
                  unhideGhostForTarget: zt,
                  cloneNowHidden: function () {
                    dt = !0;
                  },
                  cloneNowShown: function () {
                    dt = !1;
                  },
                  dispatchSortableEvent: function (t) {
                    rt({ sortable: e, name: t, originalEvent: r });
                  },
                },
                o,
              ),
            );
          };
        function rt(t) {
          !(function (t) {
            var e = t.sortable,
              n = t.rootEl,
              r = t.name,
              o = t.targetEl,
              i = t.cloneEl,
              a = t.toEl,
              l = t.fromEl,
              s = t.oldIndex,
              c = t.newIndex,
              u = t.oldDraggableIndex,
              d = t.newDraggableIndex,
              h = t.originalEvent,
              f = t.putSortable,
              p = t.extraEventProperties;
            if ((e = e || (n && n[J]))) {
              var v,
                g = e.options,
                y = "on" + r.charAt(0).toUpperCase() + r.substr(1);
              !window.CustomEvent || E || S
                ? (v = document.createEvent("Event")).initEvent(r, !0, !0)
                : (v = new CustomEvent(r, { bubbles: !0, cancelable: !0 })),
                (v.to = a || n),
                (v.from = l || n),
                (v.item = o || n),
                (v.clone = i),
                (v.oldIndex = s),
                (v.newIndex = c),
                (v.oldDraggableIndex = u),
                (v.newDraggableIndex = d),
                (v.originalEvent = h),
                (v.pullMode = f ? f.lastPutMode : void 0);
              var b = m(m({}, p), tt.getEventProperties(r, e));
              for (var w in b) v[w] = b[w];
              n && n.dispatchEvent(v), g[y] && g[y].call(e, v);
            }
          })(
            m(
              {
                putSortable: gt,
                cloneEl: ut,
                targetEl: ot,
                rootEl: lt,
                oldIndex: ht,
                oldDraggableIndex: pt,
                newIndex: ft,
                newDraggableIndex: vt,
              },
              t,
            ),
          );
        }
        var ot,
          it,
          at,
          lt,
          st,
          ct,
          ut,
          dt,
          ht,
          ft,
          pt,
          vt,
          mt,
          gt,
          yt,
          bt,
          wt,
          Et,
          St,
          xt,
          Tt,
          _t,
          Lt,
          Dt,
          Ct,
          Ot = !1,
          At = !1,
          It = [],
          kt = !1,
          Pt = !1,
          Nt = [],
          Mt = !1,
          jt = [],
          Ft = "undefined" != typeof document,
          Rt = _,
          Bt = S || E ? "cssFloat" : "float",
          Yt = Ft && !L && !_ && "draggable" in document.createElement("div"),
          Xt = (function () {
            if (Ft) {
              if (E) return !1;
              var t = document.createElement("x");
              return (
                (t.style.cssText = "pointer-events:auto"),
                "auto" === t.style.pointerEvents
              );
            }
          })(),
          Wt = function (t, e) {
            var n = j(t),
              r =
                parseInt(n.width) -
                parseInt(n.paddingLeft) -
                parseInt(n.paddingRight) -
                parseInt(n.borderLeftWidth) -
                parseInt(n.borderRightWidth),
              o = W(t, 0, e),
              i = W(t, 1, e),
              a = o && j(o),
              l = i && j(i),
              s =
                a &&
                parseInt(a.marginLeft) + parseInt(a.marginRight) + Y(o).width,
              c =
                l &&
                parseInt(l.marginLeft) + parseInt(l.marginRight) + Y(i).width;
            if ("flex" === n.display)
              return "column" === n.flexDirection ||
                "column-reverse" === n.flexDirection
                ? "vertical"
                : "horizontal";
            if ("grid" === n.display)
              return n.gridTemplateColumns.split(" ").length <= 1
                ? "vertical"
                : "horizontal";
            if (o && a.float && "none" !== a.float) {
              var u = "left" === a.float ? "left" : "right";
              return !i || ("both" !== l.clear && l.clear !== u)
                ? "horizontal"
                : "vertical";
            }
            return o &&
              ("block" === a.display ||
                "flex" === a.display ||
                "table" === a.display ||
                "grid" === a.display ||
                (s >= r && "none" === n[Bt]) ||
                (i && "none" === n[Bt] && s + c > r))
              ? "vertical"
              : "horizontal";
          },
          Ht = function (t) {
            function e(t, n) {
              return function (r, o, i, a) {
                var l =
                  r.options.group.name &&
                  o.options.group.name &&
                  r.options.group.name === o.options.group.name;
                if (null == t && (n || l)) return !0;
                if (null == t || !1 === t) return !1;
                if (n && "clone" === t) return t;
                if ("function" == typeof t)
                  return e(t(r, o, i, a), n)(r, o, i, a);
                var s = (n ? r : o).options.group.name;
                return (
                  !0 === t ||
                  ("string" == typeof t && t === s) ||
                  (t.join && t.indexOf(s) > -1)
                );
              };
            }
            var n = {},
              r = t.group;
            (r && "object" == g(r)) || (r = { name: r }),
              (n.name = r.name),
              (n.checkPull = e(r.pull, !0)),
              (n.checkPut = e(r.put)),
              (n.revertClone = r.revertClone),
              (t.group = n);
          },
          Ut = function () {
            !Xt && at && j(at, "display", "none");
          },
          zt = function () {
            !Xt && at && j(at, "display", "");
          };
        Ft &&
          !L &&
          document.addEventListener(
            "click",
            function (t) {
              if (At)
                return (
                  t.preventDefault(),
                  t.stopPropagation && t.stopPropagation(),
                  t.stopImmediatePropagation && t.stopImmediatePropagation(),
                  (At = !1),
                  !1
                );
            },
            !0,
          );
        var Kt = function (t) {
            if (ot) {
              t = t.touches ? t.touches[0] : t;
              var e =
                ((o = t.clientX),
                (i = t.clientY),
                It.some(function (t) {
                  var e = t[J].options.emptyInsertThreshold;
                  if (e && !H(t)) {
                    var n = Y(t),
                      r = o >= n.left - e && o <= n.right + e,
                      l = i >= n.top - e && i <= n.bottom + e;
                    return r && l ? (a = t) : void 0;
                  }
                }),
                a);
              if (e) {
                var n = {};
                for (var r in t) t.hasOwnProperty(r) && (n[r] = t[r]);
                (n.target = n.rootEl = e),
                  (n.preventDefault = void 0),
                  (n.stopPropagation = void 0),
                  e[J]._onDragOver(n);
              }
            }
            var o, i, a;
          },
          Gt = function (t) {
            ot && ot.parentNode[J]._isOutsideThisEl(t.target);
          };
        function qt(t, e) {
          if (!t || !t.nodeType || 1 !== t.nodeType)
            throw "Sortable: `el` must be an HTMLElement, not ".concat(
              {}.toString.call(t),
            );
          (this.el = t), (this.options = e = b({}, e)), (t[J] = this);
          var n,
            r,
            o = {
              group: null,
              sort: !0,
              disabled: !1,
              store: null,
              handle: null,
              draggable: /^[uo]l$/i.test(t.nodeName) ? ">li" : ">*",
              swapThreshold: 1,
              invertSwap: !1,
              invertedSwapThreshold: null,
              removeCloneOnHide: !0,
              direction: function () {
                return Wt(t, this.options);
              },
              ghostClass: "sortable-ghost",
              chosenClass: "sortable-chosen",
              dragClass: "sortable-drag",
              ignore: "a, img",
              filter: null,
              preventOnFilter: !0,
              animation: 0,
              easing: null,
              setData: function (t, e) {
                t.setData("Text", e.textContent);
              },
              dropBubble: !1,
              dragoverBubble: !1,
              dataIdAttr: "data-id",
              delay: 0,
              delayOnTouchOnly: !1,
              touchStartThreshold:
                (Number.parseInt ? Number : window).parseInt(
                  window.devicePixelRatio,
                  10,
                ) || 1,
              forceFallback: !1,
              fallbackClass: "sortable-fallback",
              fallbackOnBody: !1,
              fallbackTolerance: 0,
              fallbackOffset: { x: 0, y: 0 },
              supportPointer:
                !1 !== qt.supportPointer && "PointerEvent" in window && !T,
              emptyInsertThreshold: 5,
            };
          for (var i in (tt.initializePlugins(this, t, o), o))
            !(i in e) && (e[i] = o[i]);
          for (var a in (Ht(e), this))
            "_" === a.charAt(0) &&
              "function" == typeof this[a] &&
              (this[a] = this[a].bind(this));
          (this.nativeDraggable = !e.forceFallback && Yt),
            this.nativeDraggable && (this.options.touchStartThreshold = 1),
            e.supportPointer
              ? C(t, "pointerdown", this._onTapStart)
              : (C(t, "mousedown", this._onTapStart),
                C(t, "touchstart", this._onTapStart)),
            this.nativeDraggable &&
              (C(t, "dragover", this), C(t, "dragenter", this)),
            It.push(this.el),
            e.store && e.store.get && this.sort(e.store.get(this) || []),
            b(
              this,
              ((r = []),
              {
                captureAnimationState: function () {
                  (r = []),
                    this.options.animation &&
                      [].slice.call(this.el.children).forEach(function (t) {
                        if ("none" !== j(t, "display") && t !== qt.ghost) {
                          r.push({ target: t, rect: Y(t) });
                          var e = m({}, r[r.length - 1].rect);
                          if (t.thisAnimationDuration) {
                            var n = F(t, !0);
                            n && ((e.top -= n.f), (e.left -= n.e));
                          }
                          t.fromRect = e;
                        }
                      });
                },
                addAnimationState: function (t) {
                  r.push(t);
                },
                removeAnimationState: function (t) {
                  r.splice(
                    (function (t, e) {
                      for (var n in t)
                        if (t.hasOwnProperty(n))
                          for (var r in e)
                            if (e.hasOwnProperty(r) && e[r] === t[n][r])
                              return Number(n);
                      return -1;
                    })(r, { target: t }),
                    1,
                  );
                },
                animateAll: function (t) {
                  var e = this;
                  if (!this.options.animation)
                    return clearTimeout(n), void ("function" == typeof t && t());
                  var o = !1,
                    i = 0;
                  r.forEach(function (t) {
                    var n = 0,
                      r = t.target,
                      a = r.fromRect,
                      l = Y(r),
                      s = r.prevFromRect,
                      c = r.prevToRect,
                      u = t.rect,
                      d = F(r, !0);
                    d && ((l.top -= d.f), (l.left -= d.e)),
                      (r.toRect = l),
                      r.thisAnimationDuration &&
                        G(s, l) &&
                        !G(a, l) &&
                        (u.top - l.top) / (u.left - l.left) ==
                          (a.top - l.top) / (a.left - l.left) &&
                        (n = (function (t, e, n, r) {
                          return (
                            (Math.sqrt(
                              Math.pow(e.top - t.top, 2) +
                                Math.pow(e.left - t.left, 2),
                            ) /
                              Math.sqrt(
                                Math.pow(e.top - n.top, 2) +
                                  Math.pow(e.left - n.left, 2),
                              )) *
                            r.animation
                          );
                        })(u, s, c, e.options)),
                      G(l, a) ||
                        ((r.prevFromRect = a),
                        (r.prevToRect = l),
                        n || (n = e.options.animation),
                        e.animate(r, u, l, n)),
                      n &&
                        ((o = !0),
                        (i = Math.max(i, n)),
                        clearTimeout(r.animationResetTimer),
                        (r.animationResetTimer = setTimeout(function () {
                          (r.animationTime = 0),
                            (r.prevFromRect = null),
                            (r.fromRect = null),
                            (r.prevToRect = null),
                            (r.thisAnimationDuration = null);
                        }, n)),
                        (r.thisAnimationDuration = n));
                  }),
                    clearTimeout(n),
                    o
                      ? (n = setTimeout(function () {
                          "function" == typeof t && t();
                        }, i))
                      : "function" == typeof t && t(),
                    (r = []);
                },
                animate: function (t, e, n, r) {
                  if (r) {
                    j(t, "transition", ""), j(t, "transform", "");
                    var o = F(this.el),
                      i = o && o.a,
                      a = o && o.d,
                      l = (e.left - n.left) / (i || 1),
                      s = (e.top - n.top) / (a || 1);
                    (t.animatingX = !!l),
                      (t.animatingY = !!s),
                      j(t, "transform", "translate3d(" + l + "px," + s + "px,0)"),
                      (this.forRepaintDummy = (function (t) {
                        return t.offsetWidth;
                      })(t)),
                      j(
                        t,
                        "transition",
                        "transform " +
                          r +
                          "ms" +
                          (this.options.easing ? " " + this.options.easing : ""),
                      ),
                      j(t, "transform", "translate3d(0,0,0)"),
                      "number" == typeof t.animated && clearTimeout(t.animated),
                      (t.animated = setTimeout(function () {
                        j(t, "transition", ""),
                          j(t, "transform", ""),
                          (t.animated = !1),
                          (t.animatingX = !1),
                          (t.animatingY = !1);
                      }, r));
                  }
                },
              }),
            );
        }
        function Vt(t, e, n, r, o, i, a, l) {
          var s,
            c,
            u = t[J],
            d = u.options.onMove;
          return (
            !window.CustomEvent || E || S
              ? (s = document.createEvent("Event")).initEvent("move", !0, !0)
              : (s = new CustomEvent("move", { bubbles: !0, cancelable: !0 })),
            (s.to = e),
            (s.from = t),
            (s.dragged = n),
            (s.draggedRect = r),
            (s.related = o || e),
            (s.relatedRect = i || Y(e)),
            (s.willInsertAfter = l),
            (s.originalEvent = a),
            t.dispatchEvent(s),
            d && (c = d.call(u, s, a)),
            c
          );
        }
        function $t(t) {
          t.draggable = !1;
        }
        function Jt() {
          Mt = !1;
        }
        function Zt(t) {
          for (
            var e = t.tagName + t.className + t.src + t.href + t.textContent,
              n = e.length,
              r = 0;
            n--;
  
          )
            r += e.charCodeAt(n);
          return r.toString(36);
        }
        function Qt(t) {
          return setTimeout(t, 0);
        }
        function te(t) {
          return clearTimeout(t);
        }
        (qt.prototype = {
          constructor: qt,
          _isOutsideThisEl: function (t) {
            this.el.contains(t) || t === this.el || (_t = null);
          },
          _getDirection: function (t, e) {
            return "function" == typeof this.options.direction
              ? this.options.direction.call(this, t, e, ot)
              : this.options.direction;
          },
          _onTapStart: function (t) {
            if (t.cancelable) {
              var e = this,
                n = this.el,
                r = this.options,
                o = r.preventOnFilter,
                i = t.type,
                a =
                  (t.touches && t.touches[0]) ||
                  (t.pointerType && "touch" === t.pointerType && t),
                l = (a || t).target,
                s =
                  (t.target.shadowRoot &&
                    ((t.path && t.path[0]) ||
                      (t.composedPath && t.composedPath()[0]))) ||
                  l,
                c = r.filter;
              if (
                ((function (t) {
                  jt.length = 0;
                  for (
                    var e = t.getElementsByTagName("input"), n = e.length;
                    n--;
  
                  ) {
                    var r = e[n];
                    r.checked && jt.push(r);
                  }
                })(n),
                !ot &&
                  !(
                    (/mousedown|pointerdown/.test(i) && 0 !== t.button) ||
                    r.disabled
                  ) &&
                  !s.isContentEditable &&
                  (this.nativeDraggable ||
                    !T ||
                    !l ||
                    "SELECT" !== l.tagName.toUpperCase()) &&
                  !(((l = k(l, r.draggable, n, !1)) && l.animated) || ct === l))
              ) {
                if (
                  ((ht = U(l)), (pt = U(l, r.draggable)), "function" == typeof c)
                ) {
                  if (c.call(this, t, l, this))
                    return (
                      rt({
                        sortable: e,
                        rootEl: s,
                        name: "filter",
                        targetEl: l,
                        toEl: n,
                        fromEl: n,
                      }),
                      nt("filter", e, { evt: t }),
                      void (o && t.cancelable && t.preventDefault())
                    );
                } else if (
                  c &&
                  (c = c.split(",").some(function (r) {
                    if ((r = k(s, r.trim(), n, !1)))
                      return (
                        rt({
                          sortable: e,
                          rootEl: r,
                          name: "filter",
                          targetEl: l,
                          fromEl: n,
                          toEl: n,
                        }),
                        nt("filter", e, { evt: t }),
                        !0
                      );
                  }))
                )
                  return void (o && t.cancelable && t.preventDefault());
                (r.handle && !k(s, r.handle, n, !1)) ||
                  this._prepareDragStart(t, a, l);
              }
            }
          },
          _prepareDragStart: function (t, e, n) {
            var r,
              o = this,
              i = o.el,
              a = o.options,
              l = i.ownerDocument;
            if (n && !ot && n.parentNode === i) {
              var s = Y(n);
              if (
                ((lt = i),
                (it = (ot = n).parentNode),
                (st = ot.nextSibling),
                (ct = n),
                (mt = a.group),
                (qt.dragged = ot),
                (yt = {
                  target: ot,
                  clientX: (e || t).clientX,
                  clientY: (e || t).clientY,
                }),
                (St = yt.clientX - s.left),
                (xt = yt.clientY - s.top),
                (this._lastX = (e || t).clientX),
                (this._lastY = (e || t).clientY),
                (ot.style["will-change"] = "all"),
                (r = function () {
                  nt("delayEnded", o, { evt: t }),
                    qt.eventCanceled
                      ? o._onDrop()
                      : (o._disableDelayedDragEvents(),
                        !x && o.nativeDraggable && (ot.draggable = !0),
                        o._triggerDragStart(t, e),
                        rt({ sortable: o, name: "choose", originalEvent: t }),
                        M(ot, a.chosenClass, !0));
                }),
                a.ignore.split(",").forEach(function (t) {
                  R(ot, t.trim(), $t);
                }),
                C(l, "dragover", Kt),
                C(l, "mousemove", Kt),
                C(l, "touchmove", Kt),
                C(l, "mouseup", o._onDrop),
                C(l, "touchend", o._onDrop),
                C(l, "touchcancel", o._onDrop),
                x &&
                  this.nativeDraggable &&
                  ((this.options.touchStartThreshold = 4), (ot.draggable = !0)),
                nt("delayStart", this, { evt: t }),
                !a.delay ||
                  (a.delayOnTouchOnly && !e) ||
                  (this.nativeDraggable && (S || E)))
              )
                r();
              else {
                if (qt.eventCanceled) return void this._onDrop();
                C(l, "mouseup", o._disableDelayedDrag),
                  C(l, "touchend", o._disableDelayedDrag),
                  C(l, "touchcancel", o._disableDelayedDrag),
                  C(l, "mousemove", o._delayedDragTouchMoveHandler),
                  C(l, "touchmove", o._delayedDragTouchMoveHandler),
                  a.supportPointer &&
                    C(l, "pointermove", o._delayedDragTouchMoveHandler),
                  (o._dragStartTimer = setTimeout(r, a.delay));
              }
            }
          },
          _delayedDragTouchMoveHandler: function (t) {
            var e = t.touches ? t.touches[0] : t;
            Math.max(
              Math.abs(e.clientX - this._lastX),
              Math.abs(e.clientY - this._lastY),
            ) >=
              Math.floor(
                this.options.touchStartThreshold /
                  ((this.nativeDraggable && window.devicePixelRatio) || 1),
              ) && this._disableDelayedDrag();
          },
          _disableDelayedDrag: function () {
            ot && $t(ot),
              clearTimeout(this._dragStartTimer),
              this._disableDelayedDragEvents();
          },
          _disableDelayedDragEvents: function () {
            var t = this.el.ownerDocument;
            O(t, "mouseup", this._disableDelayedDrag),
              O(t, "touchend", this._disableDelayedDrag),
              O(t, "touchcancel", this._disableDelayedDrag),
              O(t, "mousemove", this._delayedDragTouchMoveHandler),
              O(t, "touchmove", this._delayedDragTouchMoveHandler),
              O(t, "pointermove", this._delayedDragTouchMoveHandler);
          },
          _triggerDragStart: function (t, e) {
            (e = e || ("touch" == t.pointerType && t)),
              !this.nativeDraggable || e
                ? this.options.supportPointer
                  ? C(document, "pointermove", this._onTouchMove)
                  : C(document, e ? "touchmove" : "mousemove", this._onTouchMove)
                : (C(ot, "dragend", this), C(lt, "dragstart", this._onDragStart));
            try {
              document.selection
                ? Qt(function () {
                    document.selection.empty();
                  })
                : window.getSelection().removeAllRanges();
            } catch (t) {}
          },
          _dragStarted: function (t, e) {
            if (((Ot = !1), lt && ot)) {
              nt("dragStarted", this, { evt: e }),
                this.nativeDraggable && C(document, "dragover", Gt);
              var n = this.options;
              !t && M(ot, n.dragClass, !1),
                M(ot, n.ghostClass, !0),
                (qt.active = this),
                t && this._appendGhost(),
                rt({ sortable: this, name: "start", originalEvent: e });
            } else this._nulling();
          },
          _emulateDragOver: function () {
            if (bt) {
              (this._lastX = bt.clientX), (this._lastY = bt.clientY), Ut();
              for (
                var t = document.elementFromPoint(bt.clientX, bt.clientY), e = t;
                t &&
                t.shadowRoot &&
                (t = t.shadowRoot.elementFromPoint(bt.clientX, bt.clientY)) !== e;
  
              )
                e = t;
              if ((ot.parentNode[J]._isOutsideThisEl(t), e))
                do {
                  if (
                    e[J] &&
                    e[J]._onDragOver({
                      clientX: bt.clientX,
                      clientY: bt.clientY,
                      target: t,
                      rootEl: e,
                    }) &&
                    !this.options.dragoverBubble
                  )
                    break;
                  t = e;
                } while ((e = e.parentNode));
              zt();
            }
          },
          _onTouchMove: function (t) {
            if (yt) {
              var e = this.options,
                n = e.fallbackTolerance,
                r = e.fallbackOffset,
                o = t.touches ? t.touches[0] : t,
                i = at && F(at, !0),
                a = at && i && i.a,
                l = at && i && i.d,
                s = Rt && Ct && z(Ct),
                c =
                  (o.clientX - yt.clientX + r.x) / (a || 1) +
                  (s ? s[0] - Nt[0] : 0) / (a || 1),
                u =
                  (o.clientY - yt.clientY + r.y) / (l || 1) +
                  (s ? s[1] - Nt[1] : 0) / (l || 1);
              if (!qt.active && !Ot) {
                if (
                  n &&
                  Math.max(
                    Math.abs(o.clientX - this._lastX),
                    Math.abs(o.clientY - this._lastY),
                  ) < n
                )
                  return;
                this._onDragStart(t, !0);
              }
              if (at) {
                i
                  ? ((i.e += c - (wt || 0)), (i.f += u - (Et || 0)))
                  : (i = { a: 1, b: 0, c: 0, d: 1, e: c, f: u });
                var d = "matrix("
                  .concat(i.a, ",")
                  .concat(i.b, ",")
                  .concat(i.c, ",")
                  .concat(i.d, ",")
                  .concat(i.e, ",")
                  .concat(i.f, ")");
                j(at, "webkitTransform", d),
                  j(at, "mozTransform", d),
                  j(at, "msTransform", d),
                  j(at, "transform", d),
                  (wt = c),
                  (Et = u),
                  (bt = o);
              }
              t.cancelable && t.preventDefault();
            }
          },
          _appendGhost: function () {
            if (!at) {
              var t = this.options.fallbackOnBody ? document.body : lt,
                e = Y(ot, !0, Rt, !0, t),
                n = this.options;
              if (Rt) {
                for (
                  Ct = t;
                  "static" === j(Ct, "position") &&
                  "none" === j(Ct, "transform") &&
                  Ct !== document;
  
                )
                  Ct = Ct.parentNode;
                Ct !== document.body && Ct !== document.documentElement
                  ? (Ct === document && (Ct = B()),
                    (e.top += Ct.scrollTop),
                    (e.left += Ct.scrollLeft))
                  : (Ct = B()),
                  (Nt = z(Ct));
              }
              M((at = ot.cloneNode(!0)), n.ghostClass, !1),
                M(at, n.fallbackClass, !0),
                M(at, n.dragClass, !0),
                j(at, "transition", ""),
                j(at, "transform", ""),
                j(at, "box-sizing", "border-box"),
                j(at, "margin", 0),
                j(at, "top", e.top),
                j(at, "left", e.left),
                j(at, "width", e.width),
                j(at, "height", e.height),
                j(at, "opacity", "0.8"),
                j(at, "position", Rt ? "absolute" : "fixed"),
                j(at, "zIndex", "100000"),
                j(at, "pointerEvents", "none"),
                (qt.ghost = at),
                t.appendChild(at),
                j(
                  at,
                  "transform-origin",
                  (St / parseInt(at.style.width)) * 100 +
                    "% " +
                    (xt / parseInt(at.style.height)) * 100 +
                    "%",
                );
            }
          },
          _onDragStart: function (t, e) {
            var n = this,
              r = t.dataTransfer,
              o = n.options;
            nt("dragStart", this, { evt: t }),
              qt.eventCanceled
                ? this._onDrop()
                : (nt("setupClone", this),
                  qt.eventCanceled ||
                    ((ut = $(ot)).removeAttribute("id"),
                    (ut.draggable = !1),
                    (ut.style["will-change"] = ""),
                    this._hideClone(),
                    M(ut, this.options.chosenClass, !1),
                    (qt.clone = ut)),
                  (n.cloneId = Qt(function () {
                    nt("clone", n),
                      qt.eventCanceled ||
                        (n.options.removeCloneOnHide || lt.insertBefore(ut, ot),
                        n._hideClone(),
                        rt({ sortable: n, name: "clone" }));
                  })),
                  !e && M(ot, o.dragClass, !0),
                  e
                    ? ((At = !0),
                      (n._loopId = setInterval(n._emulateDragOver, 50)))
                    : (O(document, "mouseup", n._onDrop),
                      O(document, "touchend", n._onDrop),
                      O(document, "touchcancel", n._onDrop),
                      r &&
                        ((r.effectAllowed = "move"),
                        o.setData && o.setData.call(n, r, ot)),
                      C(document, "drop", n),
                      j(ot, "transform", "translateZ(0)")),
                  (Ot = !0),
                  (n._dragStartId = Qt(n._dragStarted.bind(n, e, t))),
                  C(document, "selectstart", n),
                  (Tt = !0),
                  T && j(document.body, "user-select", "none"));
          },
          _onDragOver: function (t) {
            var e,
              n,
              r,
              o,
              i = this.el,
              a = t.target,
              l = this.options,
              s = l.group,
              c = qt.active,
              u = mt === s,
              d = l.sort,
              h = gt || c,
              f = this,
              p = !1;
            if (!Mt) {
              if (
                (void 0 !== t.preventDefault &&
                  t.cancelable &&
                  t.preventDefault(),
                (a = k(a, l.draggable, i, !0)),
                A("dragOver"),
                qt.eventCanceled)
              )
                return p;
              if (
                ot.contains(t.target) ||
                (a.animated && a.animatingX && a.animatingY) ||
                f._ignoreWhileAnimating === a
              )
                return P(!1);
              if (
                ((At = !1),
                c &&
                  !l.disabled &&
                  (u
                    ? d || (r = it !== lt)
                    : gt === this ||
                      ((this.lastPutMode = mt.checkPull(this, c, ot, t)) &&
                        s.checkPut(this, c, ot, t))))
              ) {
                if (
                  ((o = "vertical" === this._getDirection(t, a)),
                  (e = Y(ot)),
                  A("dragOverValid"),
                  qt.eventCanceled)
                )
                  return p;
                if (r)
                  return (
                    (it = lt),
                    I(),
                    this._hideClone(),
                    A("revert"),
                    qt.eventCanceled ||
                      (st ? lt.insertBefore(ot, st) : lt.appendChild(ot)),
                    P(!0)
                  );
                var v = H(i, l.draggable);
                if (
                  !v ||
                  ((function (t, e, n) {
                    var r = Y(H(n.el, n.options.draggable));
                    return e
                      ? t.clientX > r.right + 10 ||
                          (t.clientX <= r.right &&
                            t.clientY > r.bottom &&
                            t.clientX >= r.left)
                      : (t.clientX > r.right && t.clientY > r.top) ||
                          (t.clientX <= r.right && t.clientY > r.bottom + 10);
                  })(t, o, this) &&
                    !v.animated)
                ) {
                  if (v === ot) return P(!1);
                  if (
                    (v && i === t.target && (a = v),
                    a && (n = Y(a)),
                    !1 !== Vt(lt, i, ot, e, a, n, t, !!a))
                  )
                    return (
                      I(),
                      v && v.nextSibling
                        ? i.insertBefore(ot, v.nextSibling)
                        : i.appendChild(ot),
                      (it = i),
                      N(),
                      P(!0)
                    );
                } else if (
                  v &&
                  (function (t, e, n) {
                    var r = Y(W(n.el, 0, n.options, !0));
                    return e
                      ? t.clientX < r.left - 10 ||
                          (t.clientY < r.top && t.clientX < r.right)
                      : t.clientY < r.top - 10 ||
                          (t.clientY < r.bottom && t.clientX < r.left);
                  })(t, o, this)
                ) {
                  var g = W(i, 0, l, !0);
                  if (g === ot) return P(!1);
                  if (((n = Y((a = g))), !1 !== Vt(lt, i, ot, e, a, n, t, !1)))
                    return I(), i.insertBefore(ot, g), (it = i), N(), P(!0);
                } else if (a.parentNode === i) {
                  n = Y(a);
                  var y,
                    b,
                    w,
                    E = ot.parentNode !== i,
                    S = !(function (t, e, n) {
                      var r = n ? t.left : t.top,
                        o = n ? t.right : t.bottom,
                        i = n ? t.width : t.height,
                        a = n ? e.left : e.top,
                        l = n ? e.right : e.bottom,
                        s = n ? e.width : e.height;
                      return r === a || o === l || r + i / 2 === a + s / 2;
                    })(
                      (ot.animated && ot.toRect) || e,
                      (a.animated && a.toRect) || n,
                      o,
                    ),
                    x = o ? "top" : "left",
                    T = X(a, "top", "top") || X(ot, "top", "top"),
                    _ = T ? T.scrollTop : void 0;
                  if (
                    (_t !== a &&
                      ((b = n[x]), (kt = !1), (Pt = (!S && l.invertSwap) || E)),
                    (y = (function (t, e, n, r, o, i, a, l) {
                      var s = r ? t.clientY : t.clientX,
                        c = r ? n.height : n.width,
                        u = r ? n.top : n.left,
                        d = r ? n.bottom : n.right,
                        h = !1;
                      if (!a)
                        if (l && Dt < c * o) {
                          if (
                            (!kt &&
                              (1 === Lt
                                ? s > u + (c * i) / 2
                                : s < d - (c * i) / 2) &&
                              (kt = !0),
                            kt)
                          )
                            h = !0;
                          else if (1 === Lt ? s < u + Dt : s > d - Dt) return -Lt;
                        } else if (
                          s > u + (c * (1 - o)) / 2 &&
                          s < d - (c * (1 - o)) / 2
                        )
                          return (function (t) {
                            return U(ot) < U(t) ? 1 : -1;
                          })(e);
                      return (h = h || a) &&
                        (s < u + (c * i) / 2 || s > d - (c * i) / 2)
                        ? s > u + c / 2
                          ? 1
                          : -1
                        : 0;
                    })(
                      t,
                      a,
                      n,
                      o,
                      S ? 1 : l.swapThreshold,
                      null == l.invertedSwapThreshold
                        ? l.swapThreshold
                        : l.invertedSwapThreshold,
                      Pt,
                      _t === a,
                    )),
                    0 !== y)
                  ) {
                    var L = U(ot);
                    do {
                      (L -= y), (w = it.children[L]);
                    } while (w && ("none" === j(w, "display") || w === at));
                  }
                  if (0 === y || w === a) return P(!1);
                  (_t = a), (Lt = y);
                  var D = a.nextElementSibling,
                    C = !1,
                    O = Vt(lt, i, ot, e, a, n, t, (C = 1 === y));
                  if (!1 !== O)
                    return (
                      (1 !== O && -1 !== O) || (C = 1 === O),
                      (Mt = !0),
                      setTimeout(Jt, 30),
                      I(),
                      C && !D
                        ? i.appendChild(ot)
                        : a.parentNode.insertBefore(ot, C ? D : a),
                      T && V(T, 0, _ - T.scrollTop),
                      (it = ot.parentNode),
                      void 0 === b || Pt || (Dt = Math.abs(b - Y(a)[x])),
                      N(),
                      P(!0)
                    );
                }
                if (i.contains(ot)) return P(!1);
              }
              return !1;
            }
            function A(l, s) {
              nt(
                l,
                f,
                m(
                  {
                    evt: t,
                    isOwner: u,
                    axis: o ? "vertical" : "horizontal",
                    revert: r,
                    dragRect: e,
                    targetRect: n,
                    canSort: d,
                    fromSortable: h,
                    target: a,
                    completed: P,
                    onMove: function (n, r) {
                      return Vt(lt, i, ot, e, n, Y(n), t, r);
                    },
                    changed: N,
                  },
                  s,
                ),
              );
            }
            function I() {
              A("dragOverAnimationCapture"),
                f.captureAnimationState(),
                f !== h && h.captureAnimationState();
            }
            function P(e) {
              return (
                A("dragOverCompleted", { insertion: e }),
                e &&
                  (u ? c._hideClone() : c._showClone(f),
                  f !== h &&
                    (M(ot, gt ? gt.options.ghostClass : c.options.ghostClass, !1),
                    M(ot, l.ghostClass, !0)),
                  gt !== f && f !== qt.active
                    ? (gt = f)
                    : f === qt.active && gt && (gt = null),
                  h === f && (f._ignoreWhileAnimating = a),
                  f.animateAll(function () {
                    A("dragOverAnimationComplete"),
                      (f._ignoreWhileAnimating = null);
                  }),
                  f !== h && (h.animateAll(), (h._ignoreWhileAnimating = null))),
                ((a === ot && !ot.animated) || (a === i && !a.animated)) &&
                  (_t = null),
                l.dragoverBubble ||
                  t.rootEl ||
                  a === document ||
                  (ot.parentNode[J]._isOutsideThisEl(t.target), !e && Kt(t)),
                !l.dragoverBubble && t.stopPropagation && t.stopPropagation(),
                (p = !0)
              );
            }
            function N() {
              (ft = U(ot)),
                (vt = U(ot, l.draggable)),
                rt({
                  sortable: f,
                  name: "change",
                  toEl: i,
                  newIndex: ft,
                  newDraggableIndex: vt,
                  originalEvent: t,
                });
            }
          },
          _ignoreWhileAnimating: null,
          _offMoveEvents: function () {
            O(document, "mousemove", this._onTouchMove),
              O(document, "touchmove", this._onTouchMove),
              O(document, "pointermove", this._onTouchMove),
              O(document, "dragover", Kt),
              O(document, "mousemove", Kt),
              O(document, "touchmove", Kt);
          },
          _offUpEvents: function () {
            var t = this.el.ownerDocument;
            O(t, "mouseup", this._onDrop),
              O(t, "touchend", this._onDrop),
              O(t, "pointerup", this._onDrop),
              O(t, "touchcancel", this._onDrop),
              O(document, "selectstart", this);
          },
          _onDrop: function (t) {
            var e = this.el,
              n = this.options;
            (ft = U(ot)),
              (vt = U(ot, n.draggable)),
              nt("drop", this, { evt: t }),
              (it = ot && ot.parentNode),
              (ft = U(ot)),
              (vt = U(ot, n.draggable)),
              qt.eventCanceled ||
                ((Ot = !1),
                (Pt = !1),
                (kt = !1),
                clearInterval(this._loopId),
                clearTimeout(this._dragStartTimer),
                te(this.cloneId),
                te(this._dragStartId),
                this.nativeDraggable &&
                  (O(document, "drop", this),
                  O(e, "dragstart", this._onDragStart)),
                this._offMoveEvents(),
                this._offUpEvents(),
                T && j(document.body, "user-select", ""),
                j(ot, "transform", ""),
                t &&
                  (Tt &&
                    (t.cancelable && t.preventDefault(),
                    !n.dropBubble && t.stopPropagation()),
                  at && at.parentNode && at.parentNode.removeChild(at),
                  (lt === it || (gt && "clone" !== gt.lastPutMode)) &&
                    ut &&
                    ut.parentNode &&
                    ut.parentNode.removeChild(ut),
                  ot &&
                    (this.nativeDraggable && O(ot, "dragend", this),
                    $t(ot),
                    (ot.style["will-change"] = ""),
                    Tt &&
                      !Ot &&
                      M(
                        ot,
                        gt ? gt.options.ghostClass : this.options.ghostClass,
                        !1,
                      ),
                    M(ot, this.options.chosenClass, !1),
                    rt({
                      sortable: this,
                      name: "unchoose",
                      toEl: it,
                      newIndex: null,
                      newDraggableIndex: null,
                      originalEvent: t,
                    }),
                    lt !== it
                      ? (ft >= 0 &&
                          (rt({
                            rootEl: it,
                            name: "add",
                            toEl: it,
                            fromEl: lt,
                            originalEvent: t,
                          }),
                          rt({
                            sortable: this,
                            name: "remove",
                            toEl: it,
                            originalEvent: t,
                          }),
                          rt({
                            rootEl: it,
                            name: "sort",
                            toEl: it,
                            fromEl: lt,
                            originalEvent: t,
                          }),
                          rt({
                            sortable: this,
                            name: "sort",
                            toEl: it,
                            originalEvent: t,
                          })),
                        gt && gt.save())
                      : ft !== ht &&
                        ft >= 0 &&
                        (rt({
                          sortable: this,
                          name: "update",
                          toEl: it,
                          originalEvent: t,
                        }),
                        rt({
                          sortable: this,
                          name: "sort",
                          toEl: it,
                          originalEvent: t,
                        })),
                    qt.active &&
                      ((null != ft && -1 !== ft) || ((ft = ht), (vt = pt)),
                      rt({
                        sortable: this,
                        name: "end",
                        toEl: it,
                        originalEvent: t,
                      }),
                      this.save())))),
              this._nulling();
          },
          _nulling: function () {
            nt("nulling", this),
              (lt =
                ot =
                it =
                at =
                st =
                ut =
                ct =
                dt =
                yt =
                bt =
                Tt =
                ft =
                vt =
                ht =
                pt =
                _t =
                Lt =
                gt =
                mt =
                qt.dragged =
                qt.ghost =
                qt.clone =
                qt.active =
                  null),
              jt.forEach(function (t) {
                t.checked = !0;
              }),
              (jt.length = wt = Et = 0);
          },
          handleEvent: function (t) {
            switch (t.type) {
              case "drop":
              case "dragend":
                this._onDrop(t);
                break;
              case "dragenter":
              case "dragover":
                ot &&
                  (this._onDragOver(t),
                  (function (t) {
                    t.dataTransfer && (t.dataTransfer.dropEffect = "move"),
                      t.cancelable && t.preventDefault();
                  })(t));
                break;
              case "selectstart":
                t.preventDefault();
            }
          },
          toArray: function () {
            for (
              var t,
                e = [],
                n = this.el.children,
                r = 0,
                o = n.length,
                i = this.options;
              r < o;
              r++
            )
              k((t = n[r]), i.draggable, this.el, !1) &&
                e.push(t.getAttribute(i.dataIdAttr) || Zt(t));
            return e;
          },
          sort: function (t, e) {
            var n = {},
              r = this.el;
            this.toArray().forEach(function (t, e) {
              var o = r.children[e];
              k(o, this.options.draggable, r, !1) && (n[t] = o);
            }, this),
              e && this.captureAnimationState(),
              t.forEach(function (t) {
                n[t] && (r.removeChild(n[t]), r.appendChild(n[t]));
              }),
              e && this.animateAll();
          },
          save: function () {
            var t = this.options.store;
            t && t.set && t.set(this);
          },
          closest: function (t, e) {
            return k(t, e || this.options.draggable, this.el, !1);
          },
          option: function (t, e) {
            var n = this.options;
            if (void 0 === e) return n[t];
            var r = tt.modifyOption(this, t, e);
            (n[t] = void 0 !== r ? r : e), "group" === t && Ht(n);
          },
          destroy: function () {
            nt("destroy", this);
            var t = this.el;
            (t[J] = null),
              O(t, "mousedown", this._onTapStart),
              O(t, "touchstart", this._onTapStart),
              O(t, "pointerdown", this._onTapStart),
              this.nativeDraggable &&
                (O(t, "dragover", this), O(t, "dragenter", this)),
              Array.prototype.forEach.call(
                t.querySelectorAll("[draggable]"),
                function (t) {
                  t.removeAttribute("draggable");
                },
              ),
              this._onDrop(),
              this._disableDelayedDragEvents(),
              It.splice(It.indexOf(this.el), 1),
              (this.el = t = null);
          },
          _hideClone: function () {
            if (!dt) {
              if ((nt("hideClone", this), qt.eventCanceled)) return;
              j(ut, "display", "none"),
                this.options.removeCloneOnHide &&
                  ut.parentNode &&
                  ut.parentNode.removeChild(ut),
                (dt = !0);
            }
          },
          _showClone: function (t) {
            if ("clone" === t.lastPutMode) {
              if (dt) {
                if ((nt("showClone", this), qt.eventCanceled)) return;
                ot.parentNode != lt || this.options.group.revertClone
                  ? st
                    ? lt.insertBefore(ut, st)
                    : lt.appendChild(ut)
                  : lt.insertBefore(ut, ot),
                  this.options.group.revertClone && this.animate(ot, ut),
                  j(ut, "display", ""),
                  (dt = !1);
              }
            } else this._hideClone();
          },
        }),
          Ft &&
            C(document, "touchmove", function (t) {
              (qt.active || Ot) && t.cancelable && t.preventDefault();
            }),
          (qt.utils = {
            on: C,
            off: O,
            css: j,
            find: R,
            is: function (t, e) {
              return !!k(t, e, t, !1);
            },
            extend: function (t, e) {
              if (t && e) for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
              return t;
            },
            throttle: q,
            closest: k,
            toggleClass: M,
            clone: $,
            index: U,
            nextTick: Qt,
            cancelNextTick: te,
            detectDirection: Wt,
            getChild: W,
          }),
          (qt.get = function (t) {
            return t[J];
          }),
          (qt.mount = function () {
            for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++)
              e[n] = arguments[n];
            e[0].constructor === Array && (e = e[0]),
              e.forEach(function (t) {
                if (!t.prototype || !t.prototype.constructor)
                  throw "Sortable: Mounted plugin must be a constructor function, not ".concat(
                    {}.toString.call(t),
                  );
                t.utils && (qt.utils = m(m({}, qt.utils), t.utils)), tt.mount(t);
              });
          }),
          (qt.create = function (t, e) {
            return new qt(t, e);
          }),
          (qt.version = "1.15.0");
        var ee,
          ne,
          re,
          oe,
          ie,
          ae,
          le = [],
          se = !1;
        function ce() {
          le.forEach(function (t) {
            clearInterval(t.pid);
          }),
            (le = []);
        }
        function ue() {
          clearInterval(ae);
        }
        var de = q(function (t, e, n, r) {
            if (e.scroll) {
              var o,
                i = (t.touches ? t.touches[0] : t).clientX,
                a = (t.touches ? t.touches[0] : t).clientY,
                l = e.scrollSensitivity,
                s = e.scrollSpeed,
                c = B(),
                u = !1;
              ne !== n &&
                ((ne = n),
                ce(),
                (ee = e.scroll),
                (o = e.scrollFn),
                !0 === ee && (ee = K(n, !0)));
              var d = 0,
                h = ee;
              do {
                var f = h,
                  p = Y(f),
                  v = p.top,
                  m = p.bottom,
                  g = p.left,
                  y = p.right,
                  b = p.width,
                  w = p.height,
                  E = void 0,
                  S = void 0,
                  x = f.scrollWidth,
                  T = f.scrollHeight,
                  _ = j(f),
                  L = f.scrollLeft,
                  D = f.scrollTop;
                f === c
                  ? ((E =
                      b < x &&
                      ("auto" === _.overflowX ||
                        "scroll" === _.overflowX ||
                        "visible" === _.overflowX)),
                    (S =
                      w < T &&
                      ("auto" === _.overflowY ||
                        "scroll" === _.overflowY ||
                        "visible" === _.overflowY)))
                  : ((E =
                      b < x &&
                      ("auto" === _.overflowX || "scroll" === _.overflowX)),
                    (S =
                      w < T &&
                      ("auto" === _.overflowY || "scroll" === _.overflowY)));
                var C =
                    E &&
                    (Math.abs(y - i) <= l && L + b < x) -
                      (Math.abs(g - i) <= l && !!L),
                  O =
                    S &&
                    (Math.abs(m - a) <= l && D + w < T) -
                      (Math.abs(v - a) <= l && !!D);
                if (!le[d]) for (var A = 0; A <= d; A++) le[A] || (le[A] = {});
                (le[d].vx == C && le[d].vy == O && le[d].el === f) ||
                  ((le[d].el = f),
                  (le[d].vx = C),
                  (le[d].vy = O),
                  clearInterval(le[d].pid),
                  (0 == C && 0 == O) ||
                    ((u = !0),
                    (le[d].pid = setInterval(
                      function () {
                        r && 0 === this.layer && qt.active._onTouchMove(ie);
                        var e = le[this.layer].vy ? le[this.layer].vy * s : 0,
                          n = le[this.layer].vx ? le[this.layer].vx * s : 0;
                        ("function" == typeof o &&
                          "continue" !==
                            o.call(
                              qt.dragged.parentNode[J],
                              n,
                              e,
                              t,
                              ie,
                              le[this.layer].el,
                            )) ||
                          V(le[this.layer].el, n, e);
                      }.bind({ layer: d }),
                      24,
                    )))),
                  d++;
              } while (e.bubbleScroll && h !== c && (h = K(h, !1)));
              se = u;
            }
          }, 30),
          he = function (t) {
            var e = t.originalEvent,
              n = t.putSortable,
              r = t.dragEl,
              o = t.activeSortable,
              i = t.dispatchSortableEvent,
              a = t.hideGhostForTarget,
              l = t.unhideGhostForTarget;
            if (e) {
              var s = n || o;
              a();
              var c =
                  e.changedTouches && e.changedTouches.length
                    ? e.changedTouches[0]
                    : e,
                u = document.elementFromPoint(c.clientX, c.clientY);
              l(),
                s &&
                  !s.el.contains(u) &&
                  (i("spill"), this.onSpill({ dragEl: r, putSortable: n }));
            }
          };
        function fe() {}
        function pe() {}
        (fe.prototype = {
          startIndex: null,
          dragStart: function (t) {
            var e = t.oldDraggableIndex;
            this.startIndex = e;
          },
          onSpill: function (t) {
            var e = t.dragEl,
              n = t.putSortable;
            this.sortable.captureAnimationState(), n && n.captureAnimationState();
            var r = W(this.sortable.el, this.startIndex, this.options);
            r
              ? this.sortable.el.insertBefore(e, r)
              : this.sortable.el.appendChild(e),
              this.sortable.animateAll(),
              n && n.animateAll();
          },
          drop: he,
        }),
          b(fe, { pluginName: "revertOnSpill" }),
          (pe.prototype = {
            onSpill: function (t) {
              var e = t.dragEl,
                n = t.putSortable || this.sortable;
              n.captureAnimationState(),
                e.parentNode && e.parentNode.removeChild(e),
                n.animateAll();
            },
            drop: he,
          }),
          b(pe, { pluginName: "removeOnSpill" }),
          qt.mount(
            new (function () {
              function t() {
                for (var t in ((this.defaults = {
                  scroll: !0,
                  forceAutoScrollFallback: !1,
                  scrollSensitivity: 30,
                  scrollSpeed: 10,
                  bubbleScroll: !0,
                }),
                this))
                  "_" === t.charAt(0) &&
                    "function" == typeof this[t] &&
                    (this[t] = this[t].bind(this));
              }
              return (
                (t.prototype = {
                  dragStarted: function (t) {
                    var e = t.originalEvent;
                    this.sortable.nativeDraggable
                      ? C(document, "dragover", this._handleAutoScroll)
                      : this.options.supportPointer
                        ? C(
                            document,
                            "pointermove",
                            this._handleFallbackAutoScroll,
                          )
                        : e.touches
                          ? C(
                              document,
                              "touchmove",
                              this._handleFallbackAutoScroll,
                            )
                          : C(
                              document,
                              "mousemove",
                              this._handleFallbackAutoScroll,
                            );
                  },
                  dragOverCompleted: function (t) {
                    var e = t.originalEvent;
                    this.options.dragOverBubble ||
                      e.rootEl ||
                      this._handleAutoScroll(e);
                  },
                  drop: function () {
                    this.sortable.nativeDraggable
                      ? O(document, "dragover", this._handleAutoScroll)
                      : (O(
                          document,
                          "pointermove",
                          this._handleFallbackAutoScroll,
                        ),
                        O(document, "touchmove", this._handleFallbackAutoScroll),
                        O(document, "mousemove", this._handleFallbackAutoScroll)),
                      ue(),
                      ce(),
                      clearTimeout(P),
                      (P = void 0);
                  },
                  nulling: function () {
                    (ie = ne = ee = se = ae = re = oe = null), (le.length = 0);
                  },
                  _handleFallbackAutoScroll: function (t) {
                    this._handleAutoScroll(t, !0);
                  },
                  _handleAutoScroll: function (t, e) {
                    var n = this,
                      r = (t.touches ? t.touches[0] : t).clientX,
                      o = (t.touches ? t.touches[0] : t).clientY,
                      i = document.elementFromPoint(r, o);
                    if (
                      ((ie = t),
                      e || this.options.forceAutoScrollFallback || S || E || T)
                    ) {
                      de(t, this.options, i, e);
                      var a = K(i, !0);
                      !se ||
                        (ae && r === re && o === oe) ||
                        (ae && ue(),
                        (ae = setInterval(function () {
                          var i = K(document.elementFromPoint(r, o), !0);
                          i !== a && ((a = i), ce()), de(t, n.options, i, e);
                        }, 10)),
                        (re = r),
                        (oe = o));
                    } else {
                      if (!this.options.bubbleScroll || K(i, !0) === B())
                        return void ce();
                      de(t, this.options, K(i, !1), !1);
                    }
                  },
                }),
                b(t, { pluginName: "scroll", initializeByDefault: !0 })
              );
            })(),
          ),
          qt.mount(pe, fe);
        var ve = qt;
        function me(t, e) {
          (null == e || e > t.length) && (e = t.length);
          for (var n = 0, r = new Array(e); n < e; n++) r[n] = t[n];
          return r;
        }
        function ge(t, e, n) {
          var r = "",
            o = "",
            i = "",
            a = "",
            l = e.order ? 'style="order: '.concat(e.order, '"') : "";
          return (
            e.value &&
              (o = '<input type="text" id="'
                .concat(t, 'Input" value="')
                .concat(e.value, '">')),
            e.enabled && (i = "checked"),
            "noti" == n
              ? (r =
                  "allNoti" == t
                    ? "all notification"
                    : "ttsNoti" == t
                      ? "text-to-speech"
                      : t)
              : "script" == n &&
                ((r = e.name), (a = e.description.toLowerCase())),
            '\n      <div class="listItem" '
              .concat(l, '>\n      <input type="checkbox" id="')
              .concat(t, '" ')
              .concat(i, '/>\n      <label class="itemLabel" for="')
              .concat(t, '" title="')
              .concat(a, '">')
              .concat(r, "</label>\n      ")
              .concat(o, "\n      ")
              .concat("", "\n      </div>\n      ")
          );
        }
        s({ name: "msgReadKey", value: "nstUser" })
          .then(function (e) {
            Array.isArray(e) ||
              (e.status &&
                (f(
                  d("span", {
                    id: "version",
                    innerText: "NST ".concat(
                      chrome.runtime.getManifest().version,
                    ),
                  }),
                ),
                f(d("div", { id: "mainview", classList: "mainview" })),
                (function () {
                  h(
                    "mainview",
                    d("div", { id: "notifications", classList: "category" }),
                  ).appendChild(
                    d("h3", {
                      classList: "listTitle",
                      innerText: "notifications",
                    }),
                  );
                  var t = h(
                    "notifications",
                    d("div", { id: "notiList", classList: "listFlex" }),
                  );
                  s({ name: "msgReadKey", value: "nstNotification" })
                    .then(function (e) {
                      if (!Array.isArray(e)) {
                        var n = e.data;
                        if (n) {
                          for (
                            var o = 0, a = Object.entries(n);
                            o < a.length;
                            o++
                          ) {
                            var l = i(a[o], 2),
                              d = l[0],
                              h = l[1];
                            t.insertAdjacentHTML("afterbegin", ge(d, h, "noti"));
                          }
                          var f = document.getElementById("energyInput"),
                            p = document.getElementById("nerveInput"),
                            v = document.getElementById("happyInput"),
                            m = document.getElementById("lifeInput"),
                            g = document.getElementById("travelInput"),
                            y = /[^0-9><%]+/g;
                          f.addEventListener("keyup", function () {
                            var t = f.value.replace(y, "");
                            f.value = t;
                          }),
                            p.addEventListener("keyup", function () {
                              var t = p.value.replace(y, "");
                              p.value = t;
                            }),
                            v.addEventListener("keyup", function () {
                              var t = v.value.replace(y, "");
                              v.value = t;
                            }),
                            m.addEventListener("keyup", function () {
                              var t = m.value.replace(y, "");
                              m.value = t;
                            }),
                            g.addEventListener("keyup", function () {
                              var t = g.value.replace(/[^0-9]+/g, "");
                              g.value = t;
                            }),
                            t.addEventListener("change", function (t) {
                              var e,
                                n = t.target;
                              c(
                                (e =
                                  "INPUT" === n.tagName
                                    ? r({}, g.id.replace("Input", ""), {
                                        value: g.value || "3",
                                      })
                                    : r({}, n.id, { enabled: n.checked })),
                              ) ||
                                s({
                                  name: "msgUpdateKey",
                                  value: "nstNotification",
                                  obj: e,
                                })
                                  .then()
                                  .catch(function (t) {
                                    u({
                                      status: !1,
                                      fromWhere: "noti selection",
                                      message: "some error",
                                      data: t,
                                    });
                                  });
                            });
                        }
                      }
                    })
                    .catch(function (t) {
                      u({
                        status: !1,
                        fromWhere: "createNotifications",
                        message: "some error",
                        data: t,
                      });
                    });
                })(),
                (function () {
                  h(
                    "mainview",
                    d("div", { id: "scripts", classList: "category" }),
                  ).appendChild(
                    d("h3", { classList: "listTitle", innerText: "scripts" }),
                  ),
                    h(
                      "scripts",
                      d("div", { id: "scriptsList", classList: "listFlex" }),
                    );
                  var t = document.getElementById("scriptsList");
                  t &&
                    s({ name: "msgReadKey", value: "nstScripts" })
                      .then(function (e) {
                        if (!Array.isArray(e) && e.data) {
                          var n,
                            o = Object.keys(e.data)
                              .sort()
                              .reduce(function (t, n) {
                                var r;
                                return (
                                  (t[n] =
                                    null === (r = e.data) || void 0 === r
                                      ? void 0
                                      : r[n]),
                                  t
                                );
                              }, {}),
                            a = (function (t, e) {
                              var n =
                                ("undefined" != typeof Symbol &&
                                  t[Symbol.iterator]) ||
                                t["@@iterator"];
                              if (!n) {
                                if (
                                  Array.isArray(t) ||
                                  (n = (function (t, e) {
                                    if (t) {
                                      if ("string" == typeof t) return me(t, e);
                                      var n = Object.prototype.toString
                                        .call(t)
                                        .slice(8, -1);
                                      return (
                                        "Object" === n &&
                                          t.constructor &&
                                          (n = t.constructor.name),
                                        "Map" === n || "Set" === n
                                          ? Array.from(t)
                                          : "Arguments" === n ||
                                              /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(
                                                n,
                                              )
                                            ? me(t, e)
                                            : void 0
                                      );
                                    }
                                  })(t))
                                ) {
                                  n && (t = n);
                                  var r = 0,
                                    o = function () {};
                                  return {
                                    s: o,
                                    n: function () {
                                      return r >= t.length
                                        ? { done: !0 }
                                        : { done: !1, value: t[r++] };
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
                                l = !1;
                              return {
                                s: function () {
                                  n = n.call(t);
                                },
                                n: function () {
                                  var t = n.next();
                                  return (a = t.done), t;
                                },
                                e: function (t) {
                                  (l = !0), (i = t);
                                },
                                f: function () {
                                  try {
                                    a || null == n.return || n.return();
                                  } finally {
                                    if (l) throw i;
                                  }
                                },
                              };
                            })(
                              Object.values(o)
                                .map(function (t) {
                                  return t.onPage;
                                })
                                .filter(function (t) {
                                  return void 0 !== t;
                                })
                                .filter(function (t, e, n) {
                                  return n.indexOf(t) == e;
                                })
                                .sort()
                                .reverse(),
                            );
                          try {
                            for (a.s(); !(n = a.n()).done; ) {
                              var l = n.value;
                              t.insertAdjacentHTML(
                                "afterbegin",
                                '<div id="onPage'
                                  .concat(
                                    l,
                                    '">\n            <h4 class="listTitle"> ',
                                  )
                                  .concat(l, "</h4>\n            </div>"),
                              );
                            }
                          } catch (t) {
                            a.e(t);
                          } finally {
                            a.f();
                          }
                          for (
                            var d = 0, h = Object.entries(o);
                            d < h.length;
                            d++
                          ) {
                            var f,
                              p = i(h[d], 2),
                              v = p[0],
                              m = p[1];
                            m.onPage &&
                              (null === (f = document) ||
                                void 0 === f ||
                                null ===
                                  (f = f.getElementById(
                                    "onPage".concat(m.onPage),
                                  )) ||
                                void 0 === f ||
                                f.insertAdjacentHTML(
                                  "beforeend",
                                  ge(v, m, "script"),
                                ));
                          }
                          t.addEventListener("change", function (t) {
                            var e = t.target,
                              n = r({}, e.id, { enabled: e.checked });
                            c(n) ||
                              s({
                                name: "msgUpdateKey",
                                value: "nstScripts",
                                obj: n,
                              })
                                .then()
                                .catch(function (t) {
                                  u({
                                    status: !1,
                                    fromWhere: "save script",
                                    message: "some error",
                                    data: t,
                                  });
                                });
                          });
                        }
                      })
                      .catch(function (t) {
                        u({
                          status: !1,
                          fromWhere: "createScripts",
                          message: "some error",
                          data: t,
                        });
                      });
                })(),
                h(
                  "mainview",
                  d("div", { id: "setting", classList: "category" }),
                ).appendChild(
                  d("h3", { classList: "listTitle", innerText: "setting" }),
                ),
                h(
                  "setting",
                  d("div", { id: "settingList", classList: "listFlex" }),
                ).appendChild(
                  d("div", { id: "allSettings", classList: "allSettings" }),
                ),
                s({ name: "msgReadKey", value: "nstFight" })
                  .then(function (e) {
                    if (!Array.isArray(e)) {
                      var n = e.data;
                      if (!n) return;
                      !(function (t) {
                        var e,
                          n = h(
                            "allSettings",
                            d("div", { classList: "settingItem" }),
                          ).appendChild(
                            d("input", {
                              id: "threshold",
                              type: "text",
                              value: "",
                            }),
                          );
                        p("threshold", d("h4", { innerText: "mug threshold" })),
                          (n.value =
                            ((e = parseInt(t.mugThreshold)),
                            Math.round(e)
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ","))),
                          n.addEventListener("keyup", function (t) {
                            var e = t.target,
                              n = e.value.replace(/[\D\s._-]+/g, ""),
                              r = n ? parseInt(n, 10) : 0,
                              o = 0 === r ? "" : r.toLocaleString("en-US");
                            e.value = o;
                          }),
                          n.addEventListener("change", function (t) {
                            s({
                              name: "msgUpdateKey",
                              value: "nstFight",
                              obj: {
                                mugThreshold: t.target.value.replaceAll(",", ""),
                              },
                            })
                              .then()
                              .catch(function (t) {
                                u({
                                  status: !1,
                                  fromWhere: "createThreshold",
                                  message: "some error",
                                  data: t,
                                });
                              });
                          });
                      })(n),
                        (function (t) {
                          var e,
                            n,
                            r = h(
                              "allSettings",
                              d("div", { classList: "settingItem" }),
                            ).appendChild(
                              d("div", { id: "outcome", classList: "fightList" }),
                            );
                          p("outcome", d("h4", { innerText: "default outcome" }));
                          var o = h(
                            "outcome",
                            d("input", {
                              id: "leave",
                              type: "radio",
                              name: "outcome",
                              value: "leave",
                            }),
                          );
                          h(
                            "outcome",
                            d("label", {
                              classList: "itemLabel",
                              innerText: "leave",
                              htmlFor: "leave",
                            }),
                          );
                          var i = h(
                            "outcome",
                            d("input", {
                              id: "mug",
                              type: "radio",
                              name: "outcome",
                              value: "mug",
                            }),
                          );
                          h(
                            "outcome",
                            d("label", {
                              classList: "itemLabel",
                              innerText: "mug",
                              htmlFor: "mug",
                            }),
                          );
                          var a = h(
                            "outcome",
                            d("input", {
                              id: "hospitalize",
                              type: "radio",
                              name: "outcome",
                              value: "hospitalize",
                            }),
                          );
                          h(
                            "outcome",
                            d("label", {
                              classList: "itemLabel",
                              innerText: "hosp",
                              htmlFor: "hospitalize",
                            }),
                          );
                          var l =
                            null == r ||
                            null === (e = r.parentElement) ||
                            void 0 === e
                              ? void 0
                              : e.appendChild(
                                  d("input", {
                                    id: "hold",
                                    type: "checkbox",
                                    value: "hold",
                                    checked: t.nstHold,
                                  }),
                                );
                          switch (
                            (null == r ||
                              null === (n = r.parentElement) ||
                              void 0 === n ||
                              n.appendChild(
                                d("label", {
                                  classList: "itemLabel",
                                  innerText: "hold",
                                  htmlFor: "hold",
                                }),
                              ),
                            t.nstOutcome)
                          ) {
                            case "leave":
                              (o.checked = !0),
                                (i.checked = !1),
                                (a.checked = !1);
                              break;
                            case "mug":
                              (o.checked = !1),
                                (i.checked = !0),
                                (a.checked = !1);
                              break;
                            case "hospitalize":
                              (o.checked = !1),
                                (i.checked = !1),
                                (a.checked = !0);
                          }
                          r.addEventListener("change", function (t) {
                            s({
                              name: "msgUpdateKey",
                              value: "nstFight",
                              obj: { nstOutcome: t.target.id },
                            })
                              .then()
                              .catch(function (t) {
                                u({
                                  status: !1,
                                  fromWhere: "outcome listener",
                                  message: "some error",
                                  data: t,
                                });
                              });
                          }),
                            l.addEventListener("change", function (t) {
                              s({
                                name: "msgUpdateKey",
                                value: "nstFight",
                                obj: { nstHold: t.target.checked },
                              })
                                .then()
                                .catch(function (t) {
                                  u({
                                    status: !1,
                                    fromWhere: "hold listener",
                                    message: "some error",
                                    data: t,
                                  });
                                });
                            });
                        })(n),
                        (function (t) {
                          var e,
                            n,
                            r = h(
                              "allSettings",
                              d("div", { classList: "settingItem" }),
                            ).appendChild(
                              d("div", { id: "weapon", classList: "fightList" }),
                            );
                          p("weapon", d("h4", { innerText: "weapon order" }));
                          var o = h(
                              "weapon",
                              d("div", {
                                id: "primary",
                                classList: "list-group-item",
                                draggable: !0,
                                innerText: "primary",
                              }),
                            ),
                            i = h(
                              "weapon",
                              d("div", {
                                id: "secondary",
                                classList: "list-group-item",
                                draggable: !0,
                                innerText: "secondary",
                              }),
                            ),
                            a = h(
                              "weapon",
                              d("div", {
                                id: "melee",
                                classList: "list-group-item",
                                draggable: !0,
                                innerText: "melee",
                              }),
                            );
                          o.setAttribute("data-id", "primary"),
                            i.setAttribute("data-id", "secondary"),
                            a.setAttribute("data-id", "melee"),
                            new ve(r, {
                              animation: 150,
                              store: {
                                get: function () {
                                  var e = t.nstWeapon,
                                    n = ["", "", "", ""];
                                  return (
                                    Object.entries(e).forEach(function (t) {
                                      n[t[1]] = t[0];
                                    }),
                                    n
                                  );
                                },
                                set: function (e) {
                                  var n = e.toArray(),
                                    r = t.nstWeapon;
                                  n.forEach(function (t) {
                                    r[t] = n.indexOf(t);
                                  }),
                                    s({
                                      name: "msgUpdateKey",
                                      value: "nstFight",
                                      obj: { nstWeapon: r },
                                    })
                                      .then()
                                      .catch(function (t) {
                                        u({
                                          status: !1,
                                          fromWhere: "weapon order",
                                          message: "some error",
                                          data: t,
                                        });
                                      });
                                },
                              },
                            });
                          var l =
                            null === (e = document.getElementById("weapon")) ||
                            void 0 === e ||
                            null === (e = e.parentElement) ||
                            void 0 === e
                              ? void 0
                              : e.appendChild(
                                  d("input", {
                                    id: "temp",
                                    type: "checkbox",
                                    value: "temp",
                                    checked: t.useTemp,
                                  }),
                                );
                          null === (n = document.getElementById("weapon")) ||
                            void 0 === n ||
                            null === (n = n.parentElement) ||
                            void 0 === n ||
                            n.appendChild(
                              d("label", {
                                classList: "itemLabel",
                                innerText: "use temp first",
                                htmlFor: "temp",
                              }),
                            ),
                            l.addEventListener("change", function (t) {
                              s({
                                name: "msgUpdateKey",
                                value: "nstFight",
                                obj: { useTemp: t.target.checked },
                              })
                                .then()
                                .catch(function (t) {
                                  u({
                                    status: !1,
                                    fromWhere: "temp listener",
                                    message: "some error",
                                    data: t,
                                  });
                                });
                            });
                        })(n),
                        (function (t) {
                          var e = h(
                            "allSettings",
                            d("div", { classList: "settingItem" }),
                          ).appendChild(
                            d("div", { id: "reload", classList: "fightList" }),
                          );
                          p("reload", d("h4", { innerText: "weapon reload" }));
                          var n = e.appendChild(
                            d("input", {
                              id: "reloadPrimary",
                              type: "checkbox",
                              value: "reloadPrimary",
                              checked: t.reloadPrimary,
                            }),
                          );
                          e.appendChild(
                            d("label", {
                              classList: "itemLabel",
                              innerText: "primary",
                              htmlFor: "reloadPrimary",
                            }),
                          );
                          var r = e.appendChild(
                            d("input", {
                              id: "reloadSecondary",
                              type: "checkbox",
                              value: "reloadSecondary",
                              checked: t.reloadSecondary,
                            }),
                          );
                          e.appendChild(
                            d("label", {
                              classList: "itemLabel",
                              innerText: "secondary",
                              htmlFor: "reloadSecondary",
                            }),
                          ),
                            n.addEventListener("change", function (t) {
                              s({
                                name: "msgUpdateKey",
                                value: "nstFight",
                                obj: { reloadPrimary: t.target.checked },
                              })
                                .then()
                                .catch(function (t) {
                                  u({
                                    status: !1,
                                    fromWhere: "reloadPrimary listener",
                                    message: "some error",
                                    data: t,
                                  });
                                });
                            }),
                            r.addEventListener("change", function (t) {
                              s({
                                name: "msgUpdateKey",
                                value: "nstFight",
                                obj: { reloadSecondary: t.target.checked },
                              })
                                .then()
                                .catch(function (t) {
                                  u({
                                    status: !1,
                                    fromWhere: "reloadSecondary listener",
                                    message: "some error",
                                    data: t,
                                  });
                                });
                            });
                        })(n),
                        (function () {
                          h(
                            "allSettings",
                            d("div", { classList: "settingItem" }),
                          ).appendChild(
                            d("div", {
                              id: "tornstats",
                              innerHTML:
                                '<p>torn stats status: <b><span class="tsDisabled" id="nstTSStatus"></span></b></p>',
                            }),
                          );
                          var t = document.getElementById("nstTSStatus"),
                            e = h(
                              "tornstats",
                              d("span", {
                                id: "nstTSInput",
                                innerHTML:
                                  '<b><p>enter the <a href="https://www.torn.com/preferences.php#tab=api" target="_blank">apikey</a> you use in <a href="https://www.tornstats.com/" target="_blank">TornStats</a></p></b>',
                              }),
                            );
                          h(
                            "nstTSInput",
                            d("input", {
                              id: "nstTSApiInput",
                              type: "text",
                              maxLength: 16,
                              required: !0,
                            }),
                          );
                          var n = h(
                            "tornstats",
                            d("button", {
                              id: "tornstatsButton",
                              innerText: "link",
                              value: "0",
                            }),
                          );
                          s({ name: "msgReadKey", value: "nstTSApikey" })
                            .then(function (r) {
                              Array.isArray(r) ||
                                (null != r && r.status
                                  ? ((t.innerText = "Enabled"),
                                    t.classList.replace(
                                      "tsDisabled",
                                      "tsEnabled",
                                    ),
                                    (n.innerText = "unlink"),
                                    (n.value = "1"),
                                    (e.hidden = !0))
                                  : ((t.innerText = "Disabled"),
                                    t.classList.replace(
                                      "tsEnabled",
                                      "tsDisabled",
                                    ),
                                    (n.innerText = "link"),
                                    (n.value = "0"),
                                    (e.hidden = !1)),
                                n.addEventListener("click", function () {
                                  if ("0" == n.value) {
                                    var r =
                                      document.getElementById(
                                        "nstTSApiInput",
                                      ).value;
                                    16 == (null == r ? void 0 : r.length) &&
                                      s({ name: "msgSetTSApikey", value: r })
                                        .then(function (r) {
                                          Array.isArray(r) ||
                                            (r.status
                                              ? ((t.innerText = "Enabled"),
                                                t.classList.replace(
                                                  "tsDisabled",
                                                  "tsEnabled",
                                                ),
                                                (n.innerText = "unlink"),
                                                (n.value = "1"),
                                                (e.hidden = !0))
                                              : ((t.innerText = "Disabled"),
                                                t.classList.replace(
                                                  "tsEnabled",
                                                  "tsDisabled",
                                                ),
                                                (n.innerText = "link"),
                                                (n.value = "0"),
                                                (e.hidden = !1)));
                                        })
                                        .catch(function (t) {
                                          return u({
                                            status: !1,
                                            fromWhere: "TS button setApikey",
                                            message: "some error",
                                            data: t,
                                          });
                                        });
                                  } else
                                    "1" == n.value &&
                                      s({
                                        name: "msgRemoveKey",
                                        value: "nstTSApikey",
                                      })
                                        .then(function () {
                                          (t.innerText = "Disabled"),
                                            t.classList.replace(
                                              "tsEnabled",
                                              "tsDisabled",
                                            ),
                                            (n.innerText = "link"),
                                            (n.value = "0"),
                                            (e.hidden = !1);
                                        })
                                        .catch(function (t) {
                                          return u({
                                            status: !1,
                                            fromWhere: "TS button remove Apikey",
                                            message: "error removing key",
                                            data: t,
                                          });
                                        });
                                }));
                            })
                            .catch(function (t) {
                              u({
                                status: !1,
                                fromWhere: "createTornStats",
                                message: "some error",
                                data: t,
                              });
                            });
                        })(),
                        h("allSettings", d("div", { classList: "settingItem" }))
                          .appendChild(
                            d("button", {
                              id: "nstNotiTest",
                              innerText: "test notification",
                            }),
                          )
                          .addEventListener("click", function () {
                            s({ name: "msgReadKey", value: "nstNotification" })
                              .then(function (t) {
                                var e;
                                Array.isArray(t) ||
                                  (null != t && t.status
                                    ? null != t &&
                                      null !== (e = t.data) &&
                                      void 0 !== e &&
                                      null !== (e = e.allNoti) &&
                                      void 0 !== e &&
                                      e.enabled
                                      ? s({
                                          name: "nstNotiTest",
                                          value: "".concat(!1),
                                        })
                                      : alert(
                                          "You have notifications turned off.",
                                        )
                                    : alert(
                                        "Something went wrong retrieving notification data!",
                                      ));
                              })
                              .catch(function (t) {
                                u({
                                  status: !1,
                                  fromWhere: "notiTestElemListener",
                                  message: "error reading key",
                                  data: t,
                                });
                              });
                          }),
                        (function () {
                          var t = h(
                            "allSettings",
                            d("div", { classList: "settingItem" }),
                          ).appendChild(
                            d("div", { id: "export", classList: "fightList" }),
                          );
                          p("export", d("h4", { innerText: "export settings" }));
                          var e = t.appendChild(
                              d("button", {
                                id: "exportBtn",
                                innerText: "export",
                              }),
                            ),
                            n = t.appendChild(
                              d("a", {
                                innerText: "Download",
                                style: "display: none;",
                              }),
                            );
                          e.addEventListener("click", function () {
                            s({ name: "msgExport", value: "" })
                              .then(function (t) {
                                if (!Array.isArray(t) && t.status) {
                                  var e = JSON.stringify(t.data);
                                  n.setAttribute(
                                    "href",
                                    window.URL.createObjectURL(
                                      new Blob([e], { type: "octet/stream" }),
                                    ),
                                  ),
                                    n.setAttribute("download", "nst-export.json"),
                                    (n.style.display = "");
                                }
                              })
                              .catch(function (t) {
                                return u({
                                  status: !1,
                                  fromWhere: "createExport",
                                  message: "error exporting",
                                  data: t,
                                });
                              });
                          });
                        })(),
                        (function () {
                          var e = h(
                            "allSettings",
                            d("div", { classList: "settingItem" }),
                          ).appendChild(
                            d("div", { id: "import", classList: "fightList" }),
                          );
                          p("import", d("h4", { innerText: "import settings" }));
                          var n = e.appendChild(
                              d("button", {
                                id: "importBtn",
                                innerText: "import",
                              }),
                            ),
                            r = e.appendChild(
                              d("input", {
                                id: "importInput",
                                type: "file",
                                accept: ".json",
                                style: "display: none;",
                              }),
                            ),
                            o = e.appendChild(
                              d("span", {
                                innerText: "",
                                classList: "tsEnabled",
                                style: "display: none;",
                              }),
                            );
                          n.addEventListener("click", function () {
                            r.click();
                          }),
                            r.addEventListener("change", function (e) {
                              var n = new FileReader();
                              n.addEventListener(
                                "load",
                                (function () {
                                  var e,
                                    n =
                                      ((e = l().mark(function t(e) {
                                        var n, r;
                                        return l().wrap(function (t) {
                                          for (;;)
                                            switch ((t.prev = t.next)) {
                                              case 0:
                                                try {
                                                  n = JSON.parse(
                                                    "".concat(
                                                      null === (r = e.target) ||
                                                        void 0 === r
                                                        ? void 0
                                                        : r.result,
                                                    ),
                                                  );
                                                } catch (t) {
                                                  console.log("export error", t);
                                                }
                                                s({ name: "msgImport", value: n })
                                                  .then(function (t) {
                                                    if (!Array.isArray(t)) {
                                                      if (!t.status)
                                                        return (
                                                          (o.style.display = ""),
                                                          (o.innerHTML =
                                                            "<b>Import Unsuccessful</b>"),
                                                          void o.classList.replace(
                                                            "tsEnabled",
                                                            "tsDisabled",
                                                          )
                                                        );
                                                      (o.style.display = ""),
                                                        (o.innerHTML =
                                                          "<b>Import Successful</b>"),
                                                        o.classList.replace(
                                                          "tsDisabled",
                                                          "tsEnabled",
                                                        );
                                                    }
                                                  })
                                                  .catch(function (t) {
                                                    return u({
                                                      status: !1,
                                                      fromWhere: "createImport",
                                                      message: "error importing",
                                                      data: t,
                                                    });
                                                  });
                                              case 2:
                                              case "end":
                                                return t.stop();
                                            }
                                        }, t);
                                      })),
                                      function () {
                                        var n = this,
                                          r = arguments;
                                        return new Promise(function (o, i) {
                                          var a = e.apply(n, r);
                                          function l(e) {
                                            t(a, o, i, l, s, "next", e);
                                          }
                                          function s(e) {
                                            t(a, o, i, l, s, "throw", e);
                                          }
                                          l(void 0);
                                        });
                                      });
                                  return function (t) {
                                    return n.apply(this, arguments);
                                  };
                                })(),
                              ),
                                n.readAsText(e.target.files[0]);
                            });
                        })();
                    }
                  })
                  .catch(function (t) {
                    u({
                      status: !1,
                      fromWhere: "createSettings",
                      message: "some error",
                      data: t,
                    });
                  })));
          })
          .catch(function (t) {
            return u({
              status: !1,
              fromWhere: "initSetting",
              message: "error reading user",
              data: t,
            });
          });
      })();
  })();
  