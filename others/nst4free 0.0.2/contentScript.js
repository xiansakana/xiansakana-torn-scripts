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
              c = "function" == typeof Symbol ? Symbol : {},
              s = c.iterator || "@@iterator",
              u = c.asyncIterator || "@@asyncIterator",
              l = c.toStringTag || "@@toStringTag";
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
            function f(t, e, n, r) {
              var o = e && e.prototype instanceof h ? e : h,
                i = Object.create(o.prototype),
                c = new P(r || []);
              return a(i, "_invoke", { value: _(t, n, c) }), i;
            }
            function p(t, e, n) {
              try {
                return { type: "normal", arg: t.call(e, n) };
              } catch (t) {
                return { type: "throw", arg: t };
              }
            }
            e.wrap = f;
            var v = {};
            function h() {}
            function m() {}
            function y() {}
            var g = {};
            d(g, s, function () {
              return this;
            });
            var b = Object.getPrototypeOf,
              w = b && b(b(T([])));
            w && w !== n && i.call(w, s) && (g = w);
            var x = (y.prototype = h.prototype = Object.create(g));
            function L(t) {
              ["next", "throw", "return"].forEach(function (e) {
                d(t, e, function (t) {
                  return this._invoke(e, t);
                });
              });
            }
            function S(t, e) {
              function n(o, a, c, s) {
                var u = p(t[o], t, a);
                if ("throw" !== u.type) {
                  var l = u.arg,
                    d = l.value;
                  return d && "object" == r(d) && i.call(d, "__await")
                    ? e.resolve(d.__await).then(
                        function (t) {
                          n("next", t, c, s);
                        },
                        function (t) {
                          n("throw", t, c, s);
                        },
                      )
                    : e.resolve(d).then(
                        function (t) {
                          (l.value = t), c(l);
                        },
                        function (t) {
                          return n("throw", t, c, s);
                        },
                      );
                }
                s(u.arg);
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
            function _(t, e, n) {
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
                    var c = E(a, n);
                    if (c) {
                      if (c === v) continue;
                      return c;
                    }
                  }
                  if ("next" === n.method) n.sent = n._sent = n.arg;
                  else if ("throw" === n.method) {
                    if ("suspendedStart" === r) throw ((r = "completed"), n.arg);
                    n.dispatchException(n.arg);
                  } else "return" === n.method && n.abrupt("return", n.arg);
                  r = "executing";
                  var s = p(t, e, n);
                  if ("normal" === s.type) {
                    if (
                      ((r = n.done ? "completed" : "suspendedYield"), s.arg === v)
                    )
                      continue;
                    return { value: s.arg, done: n.done };
                  }
                  "throw" === s.type &&
                    ((r = "completed"), (n.method = "throw"), (n.arg = s.arg));
                }
              };
            }
            function E(t, e) {
              var n = e.method,
                r = t.iterator[n];
              if (void 0 === r)
                return (
                  (e.delegate = null),
                  ("throw" === n &&
                    t.iterator.return &&
                    ((e.method = "return"),
                    (e.arg = void 0),
                    E(t, e),
                    "throw" === e.method)) ||
                    ("return" !== n &&
                      ((e.method = "throw"),
                      (e.arg = new TypeError(
                        "The iterator does not provide a '" + n + "' method",
                      )))),
                  v
                );
              var o = p(r, t.iterator, e.arg);
              if ("throw" === o.type)
                return (
                  (e.method = "throw"), (e.arg = o.arg), (e.delegate = null), v
                );
              var i = o.arg;
              return i
                ? i.done
                  ? ((e[t.resultName] = i.value),
                    (e.next = t.nextLoc),
                    "return" !== e.method &&
                      ((e.method = "next"), (e.arg = void 0)),
                    (e.delegate = null),
                    v)
                  : i
                : ((e.method = "throw"),
                  (e.arg = new TypeError("iterator result is not an object")),
                  (e.delegate = null),
                  v);
            }
            function A(t) {
              var e = { tryLoc: t[0] };
              1 in t && (e.catchLoc = t[1]),
                2 in t && ((e.finallyLoc = t[2]), (e.afterLoc = t[3])),
                this.tryEntries.push(e);
            }
            function j(t) {
              var e = t.completion || {};
              (e.type = "normal"), delete e.arg, (t.completion = e);
            }
            function P(t) {
              (this.tryEntries = [{ tryLoc: "root" }]),
                t.forEach(A, this),
                this.reset(!0);
            }
            function T(t) {
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
              return { next: O };
            }
            function O() {
              return { value: void 0, done: !0 };
            }
            return (
              (m.prototype = y),
              a(x, "constructor", { value: y, configurable: !0 }),
              a(y, "constructor", { value: m, configurable: !0 }),
              (m.displayName = d(y, l, "GeneratorFunction")),
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
                    ? Object.setPrototypeOf(t, y)
                    : ((t.__proto__ = y), d(t, l, "GeneratorFunction")),
                  (t.prototype = Object.create(x)),
                  t
                );
              }),
              (e.awrap = function (t) {
                return { __await: t };
              }),
              L(S.prototype),
              d(S.prototype, u, function () {
                return this;
              }),
              (e.AsyncIterator = S),
              (e.async = function (t, n, r, o, i) {
                void 0 === i && (i = Promise);
                var a = new S(f(t, n, r, o), i);
                return e.isGeneratorFunction(n)
                  ? a
                  : a.next().then(function (t) {
                      return t.done ? t.value : a.next();
                    });
              }),
              L(x),
              d(x, l, "Generator"),
              d(x, s, function () {
                return this;
              }),
              d(x, "toString", function () {
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
              (e.values = T),
              (P.prototype = {
                constructor: P,
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
                      var c = i.call(o, "catchLoc"),
                        s = i.call(o, "finallyLoc");
                      if (c && s) {
                        if (this.prev < o.catchLoc) return n(o.catchLoc, !0);
                        if (this.prev < o.finallyLoc) return n(o.finallyLoc);
                      } else if (c) {
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
                      ? ((this.method = "next"), (this.next = o.finallyLoc), v)
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
                    v
                  );
                },
                finish: function (t) {
                  for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                    var n = this.tryEntries[e];
                    if (n.finallyLoc === t)
                      return this.complete(n.completion, n.afterLoc), j(n), v;
                  }
                },
                catch: function (t) {
                  for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                    var n = this.tryEntries[e];
                    if (n.tryLoc === t) {
                      var r = n.completion;
                      if ("throw" === r.type) {
                        var o = r.arg;
                        j(n);
                      }
                      return o;
                    }
                  }
                  throw new Error("illegal catch attempt");
                },
                delegateYield: function (t, e, n) {
                  return (
                    (this.delegate = {
                      iterator: T(t),
                      resultName: e,
                      nextLoc: n,
                    }),
                    "next" === this.method && (this.arg = void 0),
                    v
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
            var c = t[i](a),
              s = c.value;
          } catch (t) {
            return void n(t);
          }
          c.done ? e(s) : Promise.resolve(s).then(r, o);
        }
        function e(e) {
          return function () {
            var n = this,
              r = arguments;
            return new Promise(function (o, i) {
              var a = e.apply(n, r);
              function c(e) {
                t(a, o, i, c, s, "next", e);
              }
              function s(e) {
                t(a, o, i, c, s, "throw", e);
              }
              c(void 0);
            });
          };
        }
        var r = n(687),
          o = n.n(r);
        function i() {
          for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++)
            e[n] = arguments[n];
          return new Promise(function (t) {
            chrome.runtime.sendMessage(e, function (e) {
              t(e);
            });
          });
        }
        function a(t) {
          return t.status || console.log(t), t;
        }
        function c(t, e) {
          return Object.assign(document.createElement(t), e);
        }
        function s() {
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
                            return a({
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
        function l() {
          return (l = e(
            o().mark(function t() {
              return o().wrap(function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      return (t.next = 2), s();
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
        var d = !1;
        function f(t) {
          window.addEventListener("nstFetch", t);
        }
        var p = [];
        function v(t, e) {
          document.querySelector(t) ? e() : p.push([t, e]);
        }
        function h(t, e) {
          (null == e || e > t.length) && (e = t.length);
          for (var n = 0, r = new Array(e); n < e; n++) r[n] = t[n];
          return r;
        }
        new MutationObserver(function (t) {
          t.forEach(function (t) {
            for (var e = 0, n = Array.from(t.addedNodes); e < n.length; e++) {
              var r = n[e];
              if (r.querySelector)
                for (var o = p.length; o--; ) {
                  var i = p[o];
                  r.querySelector(i[0]) && (i[1](), p.splice(o, 1));
                }
            }
          });
        }).observe(document.documentElement, { childList: !0, subtree: !0 }),
          (function () {
            if (!d) {
              var t = document.createElement("script");
              (t.type = "text/javascript"),
                (t.src = chrome.runtime.getURL("injectFetch.js")),
                document.documentElement.append(t),
                (d = !0);
            }
          })();
        var m = {},
          y = {};
        function g(t, e) {
          for (
            var n = document.querySelectorAll(
                "".concat(e, ' div[class*="message_"]'),
              ),
              r = 0,
              o = Array.from(n);
            r < o.length;
            r++
          )
            b(o[r], t);
        }
        function b(t, e) {
          var n = t.querySelector("a"),
            r = t.querySelector("span");
          if (n && r) {
            var o = n.innerText.replace(":", "").trim(),
              i = r.innerText.toLowerCase();
            o == e && (n.style.color = "var(--nstMain)"),
              i.includes(e) && (t.style.backgroundColor = "var(--nstMainBG)");
          }
        }
        function w(t, e) {
          try {
            var n, r;
            return (
              !!t.parentNode &&
              (!(
                null == e ||
                !e.class ||
                null == t ||
                null === (n = t.parentNode) ||
                void 0 === n ||
                null === (n = n.classList) ||
                void 0 === n ||
                null === (n = n[0]) ||
                void 0 === n ||
                !n.includes(e.class)
              ) ||
                !(
                  null == e ||
                  !e.id ||
                  (null == t || null === (r = t.parentNode) || void 0 === r
                    ? void 0
                    : r.id) !== (null == e ? void 0 : e.id)
                ) ||
                w(t.parentNode, e))
            );
          } catch (t) {
            console.log(t);
          }
        }
        function x() {
          return (x = e(
            o().mark(function t(e, n, r) {
              var c, s, u, l, d;
              return o().wrap(function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      if (
                        ((c = n.userStatus),
                        (s = c.status.flightType),
                        (u = [
                          "standard",
                          "airstrip",
                          "private",
                          "business",
                        ].includes(s)
                          ? s
                          : "business"),
                        (l = n.user.userID),
                        !c.status.type.startsWith("traveling"))
                      ) {
                        t.next = 16;
                        break;
                      }
                      return (
                        setTimeout(function () {
                          document.querySelector(
                            "miniProfile" === r
                              ? "#profile-mini-root span.sub-desc"
                              : "div.description > span.sub-desc",
                          ).innerText = "(".concat(u || "standard/business", ")");
                        }, 500),
                        t.abrupt("return")
                      );
                    case 9:
                      return (
                        (t.next = 11),
                        i({
                          name: "msgNinjaFlightTimer",
                          value: e,
                          obj: { playerID: l },
                        })
                          .then(function (t) {
                            Array.isArray(t) || (y[l] = t.data);
                          })
                          .catch(function (t) {
                            a({
                              status: !1,
                              fromWhere: "processFlightTimerResponse",
                              message: "error fetching ninja",
                              data: t,
                            });
                          })
                      );
                    case 11:
                      L(l, u, r),
                        m[r] && (clearInterval(m[r]), delete m[r]),
                        (m[r] = setInterval(L, 1e3, l, u, r)),
                        (d = document.querySelector(
                          "div.profile-container > svg",
                        )) &&
                          (d.setAttribute("style", "top: 14px"),
                          (d.nextElementSibling.title =
                            "<div>\n<div class='tooltip-row "
                              .concat("" === u ? "bold" : "", "'>\n  Standard: ")
                              .concat(
                                _(y[l].standard),
                                "</div>\n<div class='tooltip-row ",
                              )
                              .concat(
                                "airstrip" === u ? "bold" : "",
                                "'>\n  Airstrip: ",
                              )
                              .concat(
                                _(y[l].airstrip),
                                "</div>\n<div class='tooltip-row ",
                              )
                              .concat(
                                "private" === u ? "bold" : "",
                                "'>\n  Private: ",
                              )
                              .concat(
                                _(y[l].private),
                                "</div>\n<div class='tooltip-row ",
                              )
                              .concat("" === u ? "bold" : "", "'>\n  Business: ")
                              .concat(_(y[l].business), "</div>\n</div>")));
                    case 16:
                    case "end":
                      return t.stop();
                  }
              }, t);
            }),
          )).apply(this, arguments);
        }
        function L(t, e, n) {
          var r = document.querySelector(
            "miniProfile" === n
              ? "#profile-mini-root span.sub-desc"
              : "div.description > span.sub-desc",
          );
          if (!r) return clearInterval(m[n]), void delete m[n];
          ["standard", "business"].includes(e) &&
            r.addEventListener("click", function () {
              var r = document.querySelector(
                  "miniProfile" === n
                    ? "#profile-mini-root span.sub-desc"
                    : "div.description > span.sub-desc",
                ),
                o = null == r ? void 0 : r.cloneNode(!0);
              o &&
                null != r &&
                r.parentNode &&
                (r.parentNode.replaceChild(o, r),
                L(t, { standard: "business", business: "standard" }[e], n));
            });
          var o,
            i = y[t],
            a = (+S(i, e) - Date.now()) / 1e3,
            c = (+S(i, e, !0) - Date.now()) / 1e3;
          if (a <= 0) {
            var s = c / 60;
            o = "Landing in ".concat(
              (s -= (s / 60) * 60) > 1 ? s + " minutes" : "minute",
            );
          } else o = "Landing after ".concat(_(i, e));
          r.innerText = "".concat(o, " (").concat(e, ")");
        }
        function S(t) {
          var e =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : "standard",
            n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
            r = new Date(t.timestamp).getTime(),
            o =
              +{
                Argentina: 167,
                Canada: 41,
                "Cayman Islands": 35,
                China: 242,
                Hawaii: 134,
                Japan: 225,
                Mexico: 26,
                "South Africa": 297,
                Switzerland: 175,
                UAE: 271,
                "United Kingdom": 159,
              }[t.country] *
              +{ standard: 1, airstrip: 0.7, private: 0.5, business: 0.3 }[e] *
              6e4,
            i = n ? 1e3 * t.variance : 0;
          return new Date(r + o + i);
        }
        function _(t) {
          var e = S(
              t,
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : "standard",
              arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
            ),
            n = "";
          return (
            (n += "".concat(("0" + e.getUTCHours()).slice(-2), ":")),
            (n += "".concat(("0" + e.getUTCMinutes()).slice(-2), ":")) +
              "".concat(("0" + e.getUTCSeconds()).slice(-2), " TCT")
          );
        }
        (function () {
          return l.apply(this, arguments);
        })().then(function (t) {
          var e, n, r, o, i, a, s, u;
          if (t && Array.isArray(t)) {
            var l = t[0].data,
              d = t[1].data,
              p = "".concat(t[2].data);
            (u = {
              energy: {
                name: "Energy",
                selector: "[class*='bar__'][class*='energy__']",
                link: "https://www.torn.com/gym.php",
                refillUsed: (s = null == (a = t[4].data) ? void 0 : a.refills)
                  .energy_refill_used,
              },
              nerve: {
                name: "Nerve",
                selector: "[class*='bar__'][class*='nerve__']",
                link: "https://www.torn.com/crimes.php",
                refillUsed: s.nerve_refill_used,
              },
            }),
              Object.values(u).forEach(function (t) {
                var e = t.name,
                  n = t.selector,
                  r = t.link,
                  o = t.refillUsed,
                  i = "".concat(
                    n,
                    ' div[class^="bar-stats"] p[class^="bar-name"]',
                  );
                v(i, function () {
                  var t,
                    n,
                    a =
                      null === (t = document) || void 0 === t
                        ? void 0
                        : t.querySelector(i),
                    c =
                      null == a || null === (n = a.parentElement) || void 0 === n
                        ? void 0
                        : n.parentElement;
                  null == c || c.removeAttribute("href"),
                    null == c ||
                      c.addEventListener("click", function () {
                        return window.open(r, "_blank");
                      }),
                    o || null == a || a.classList.add("nst".concat(e, "Refill"));
                });
              }),
              null != l &&
                null !== (e = l.leftAlign) &&
                void 0 !== e &&
                e.enabled &&
                (document.head.appendChild(
                  c("style", {
                    innerText:
                      "\n      .nstLeftAlign .d .container {\n        margin-left: 20px !important;\n        justify-content: flex-start !important;\n      }\n\n      .nstLeftAlign .d.without-sidebar .container,\n      .nstLeftAlign .d.without-sidebar .content-wrapper,\n      .nstLeftAlign .d .anonymous .content-wrapper {\n        margin-left: 20px;\n      }",
                  }),
                ),
                document.documentElement.classList.add("nstLeftAlign")),
              null != l &&
                null !== (n = l.hideLevel) &&
                void 0 !== n &&
                n.enabled &&
                document.head.appendChild(
                  c("style", {
                    innerText:
                      "\n      #pointsLevel {\n        display: none !important;\n      }\n\n      .info-msg-cont.green,\n      .info-msg-cont.green + hr {\n        display: none !important;\n      }",
                  }),
                ),
              null != l &&
                null !== (r = l.miniProfileLastAction) &&
                void 0 !== r &&
                r.enabled &&
                f(function (t) {
                  if (t.detail) {
                    var e = t.detail,
                      n = e.page,
                      r = e.json,
                      o = e.fetch,
                      i = new URL(o.url).searchParams.get("step");
                    "profiles" === n &&
                      "getMiniProfile" === i &&
                      (function (t) {
                        var e = Date.now() - 1e3 * t.user.lastAction.seconds,
                          n = (function (t, e) {
                            var n = "",
                              r = t - e,
                              o = Math.floor(r / 864e5),
                              i = Math.floor((r % 864e5) / 36e5),
                              a = Math.floor((r % 36e5) / 6e4),
                              c = Math.floor((r % 6e4) / 1e3);
                            return (
                              o > 0 &&
                                (n += "".concat(
                                  o.toString().padStart(2, "0"),
                                  "d ",
                                )),
                              i > 0 &&
                                (n += "".concat(
                                  i.toString().padStart(2, "0"),
                                  "h ",
                                )),
                              a > 0 &&
                                (n += "".concat(
                                  a.toString().padStart(2, "0"),
                                  "m ",
                                )),
                              c > 0 &&
                                (n += "".concat(
                                  c.toString().padStart(2, "0"),
                                  "s",
                                )),
                              "".concat(n)
                            );
                          })(Date.now(), e);
                        v(".profile-container", function () {
                          if (!document.getElementById("nstLastAction")) {
                            var t = document.querySelector(
                              '[class*="profile-mini-_userProfileWrapper"]',
                            );
                            t &&
                              t.appendChild(
                                Object.assign(document.createElement("span"), {
                                  id: "nstLastAction",
                                  className: "nstLastAction",
                                  textContent: "Last Action: ".concat(n, " ago"),
                                }),
                              );
                          }
                        });
                      })(r);
                  }
                }),
              null != l &&
                null !== (o = l.chatHighlight) &&
                void 0 !== o &&
                o.enabled &&
                (function (t) {
                  var e = t.name,
                    n = '#chatRoot div[class*="overview"]';
                  v(n, function () {
                    g(e, n),
                      document.addEventListener("click", function (t) {
                        w(t.target, { class: "chat-box_" }) && g(e, n);
                      });
                    var t = new MutationObserver(function (t) {
                        var n,
                          r = (function (t, e) {
                            var n =
                              ("undefined" != typeof Symbol &&
                                t[Symbol.iterator]) ||
                              t["@@iterator"];
                            if (!n) {
                              if (
                                Array.isArray(t) ||
                                (n = (function (t, e) {
                                  if (t) {
                                    if ("string" == typeof t) return h(t, e);
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
                                          ? h(t, e)
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
                              c = !1;
                            return {
                              s: function () {
                                n = n.call(t);
                              },
                              n: function () {
                                var t = n.next();
                                return (a = t.done), t;
                              },
                              e: function (t) {
                                (c = !0), (i = t);
                              },
                              f: function () {
                                try {
                                  a || null == n.return || n.return();
                                } finally {
                                  if (c) throw i;
                                }
                              },
                            };
                          })(t);
                        try {
                          for (r.s(); !(n = r.n()).done; ) {
                            var o,
                              i = n.value;
                            null != i &&
                              null !== (o = i.addedNodes) &&
                              void 0 !== o &&
                              null !== (o = o[0]) &&
                              void 0 !== o &&
                              null !== (o = o.classList) &&
                              void 0 !== o &&
                              null !== (o = o[0]) &&
                              void 0 !== o &&
                              o.includes("message_") &&
                              b(i.addedNodes[0], e);
                          }
                        } catch (t) {
                          r.e(t);
                        } finally {
                          r.f();
                        }
                      }),
                      r = document.querySelector("#chatRoot");
                    r && t.observe(r, { childList: !0, subtree: !0 });
                  });
                })(d),
              null != l &&
                null !== (i = l.flightTimer) &&
                void 0 !== i &&
                i.enabled &&
                (function (t) {
                  f(function (e) {
                    if (e.detail) {
                      var n = e.detail,
                        r = n.page,
                        o = n.json,
                        i = n.fetch,
                        a = new URL(i.url).searchParams.get("step");
                      "profiles" === r &&
                        "getMiniProfile" === a &&
                        (m.miniProfile && clearInterval(m.miniProfile),
                        (function (t, e, n) {
                          x.apply(this, arguments);
                        })(t, o, "miniProfile"));
                    }
                  });
                })(p);
          }
        });
      })();
  })();
  