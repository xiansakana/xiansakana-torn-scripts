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
            function d(t, e, r, n) {
              var o = e && e.prototype instanceof y ? e : y,
                a = Object.create(o.prototype),
                u = new O(n || []);
              return i(a, "_invoke", { value: S(t, r, u) }), a;
            }
            function p(t, e, r) {
              try {
                return { type: "normal", arg: t.call(e, r) };
              } catch (t) {
                return { type: "throw", arg: t };
              }
            }
            e.wrap = d;
            var h = {};
            function y() {}
            function v() {}
            function m() {}
            var g = {};
            f(g, c, function () {
              return this;
            });
            var b = Object.getPrototypeOf,
              w = b && b(b(j([])));
            w && w !== r && a.call(w, c) && (g = w);
            var x = (m.prototype = y.prototype = Object.create(g));
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
            function S(t, e, r) {
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
                    var u = _(i, r);
                    if (u) {
                      if (u === h) continue;
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
                      ((n = r.done ? "completed" : "suspendedYield"), c.arg === h)
                    )
                      continue;
                    return { value: c.arg, done: r.done };
                  }
                  "throw" === c.type &&
                    ((n = "completed"), (r.method = "throw"), (r.arg = c.arg));
                }
              };
            }
            function _(t, e) {
              var r = e.method,
                n = t.iterator[r];
              if (void 0 === n)
                return (
                  (e.delegate = null),
                  ("throw" === r &&
                    t.iterator.return &&
                    ((e.method = "return"),
                    (e.arg = void 0),
                    _(t, e),
                    "throw" === e.method)) ||
                    ("return" !== r &&
                      ((e.method = "throw"),
                      (e.arg = new TypeError(
                        "The iterator does not provide a '" + r + "' method",
                      )))),
                  h
                );
              var o = p(n, t.iterator, e.arg);
              if ("throw" === o.type)
                return (
                  (e.method = "throw"), (e.arg = o.arg), (e.delegate = null), h
                );
              var a = o.arg;
              return a
                ? a.done
                  ? ((e[t.resultName] = a.value),
                    (e.next = t.nextLoc),
                    "return" !== e.method &&
                      ((e.method = "next"), (e.arg = void 0)),
                    (e.delegate = null),
                    h)
                  : a
                : ((e.method = "throw"),
                  (e.arg = new TypeError("iterator result is not an object")),
                  (e.delegate = null),
                  h);
            }
            function A(t) {
              var e = { tryLoc: t[0] };
              1 in t && (e.catchLoc = t[1]),
                2 in t && ((e.finallyLoc = t[2]), (e.afterLoc = t[3])),
                this.tryEntries.push(e);
            }
            function k(t) {
              var e = t.completion || {};
              (e.type = "normal"), delete e.arg, (t.completion = e);
            }
            function O(t) {
              (this.tryEntries = [{ tryLoc: "root" }]),
                t.forEach(A, this),
                this.reset(!0);
            }
            function j(t) {
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
              return { next: q };
            }
            function q() {
              return { value: void 0, done: !0 };
            }
            return (
              (v.prototype = m),
              i(x, "constructor", { value: m, configurable: !0 }),
              i(m, "constructor", { value: v, configurable: !0 }),
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
              (e.async = function (t, r, n, o, a) {
                void 0 === a && (a = Promise);
                var i = new E(d(t, r, n, o), a);
                return e.isGeneratorFunction(r)
                  ? i
                  : i.next().then(function (t) {
                      return t.done ? t.value : i.next();
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
              (e.values = j),
              (O.prototype = {
                constructor: O,
                reset: function (t) {
                  if (
                    ((this.prev = 0),
                    (this.next = 0),
                    (this.sent = this._sent = void 0),
                    (this.done = !1),
                    (this.delegate = null),
                    (this.method = "next"),
                    (this.arg = void 0),
                    this.tryEntries.forEach(k),
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
                      ? ((this.method = "next"), (this.next = o.finallyLoc), h)
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
                    h
                  );
                },
                finish: function (t) {
                  for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                    var r = this.tryEntries[e];
                    if (r.finallyLoc === t)
                      return this.complete(r.completion, r.afterLoc), k(r), h;
                  }
                },
                catch: function (t) {
                  for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                    var r = this.tryEntries[e];
                    if (r.tryLoc === t) {
                      var n = r.completion;
                      if ("throw" === n.type) {
                        var o = n.arg;
                        k(r);
                      }
                      return o;
                    }
                  }
                  throw new Error("illegal catch attempt");
                },
                delegateYield: function (t, e, r) {
                  return (
                    (this.delegate = {
                      iterator: j(t),
                      resultName: e,
                      nextLoc: r,
                    }),
                    "next" === this.method && (this.arg = void 0),
                    h
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
          return (s = e(
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
        var l = [];
        new MutationObserver(function (t) {
          t.forEach(function (t) {
            for (var e = 0, r = Array.from(t.addedNodes); e < r.length; e++) {
              var n = r[e];
              if (n.querySelector)
                for (var o = l.length; o--; ) {
                  var a = l[o];
                  n.querySelector(a[0]) && (a[1](), l.splice(o, 1));
                }
            }
          });
        }).observe(document.documentElement, { childList: !0, subtree: !0 }),
          (function () {
            return s.apply(this, arguments);
          })().then(function (t) {
            if (t && Array.isArray(t)) {
              var e = t[0].data,
                r = "".concat(t[2].data);
              e.ezMoneyDeposit.enabled &&
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
                  t && e(t);
                  var r = document.querySelector(".manage-company");
                  r &&
                    new MutationObserver(function (t) {
                      t.forEach(function (t) {
                        for (
                          var r = 0, n = Array.from(t.addedNodes);
                          r < n.length;
                          r++
                        ) {
                          var o = n[r],
                            a =
                              o.querySelector &&
                              o.querySelector(
                                ".deposit-box .input-money-symbol, .deposit .input-money-symbol, .donate .input-money-symbol",
                              );
                          a && e(a);
                        }
                      });
                    }).observe(r, { childList: !0, subtree: !0 });
                })(),
                e.companyRestock.enabled &&
                  document.addEventListener("dblclick", function (t) {
                    var e,
                      r,
                      n,
                      o = null == t ? void 0 : t.target;
                    "INPUT" === (null == o ? void 0 : o.tagName) &&
                      o.className.includes("input-money") &&
                      (e = o).closest("LI") &&
                      ((r = +(
                        null == e ||
                        null === (n = e.closest("LI")) ||
                        void 0 === n
                          ? void 0
                          : n.querySelector("div.sold-daily")
                      ).innerText.replaceAll(",", "")),
                      (function (t, e) {
                        var r = new Event("input", {
                          bubbles: !0,
                          simulated: !0,
                        });
                        (t.value = "".concat(e)), t.dispatchEvent(r), t.select();
                      })(e, r));
                  }),
                e.employeesLastAction.enabled &&
                  (function (t) {
                    a({
                      name: "msgGetApiData",
                      value: t,
                      obj: { section: "company", selection: "employees" },
                    })
                      .then(function (t) {
                        var e, r;
                        Array.isArray(t) ||
                          ((e = ".manage-company"),
                          (r = function () {
                            if (t.data) {
                              var e = document.querySelector(".manage-company");
                              if (e) {
                                var r = t.data.company_employees,
                                  n = (Date.now() - 864e5) / 1e3,
                                  o = (Date.now() - 1728e5) / 1e3;
                                new MutationObserver(function (t) {
                                  t.forEach(function (t) {
                                    for (
                                      var e = 0, a = Array.from(t.addedNodes);
                                      e < a.length;
                                      e++
                                    ) {
                                      var i,
                                        u = a[e];
                                      if (
                                        (null == u
                                          ? void 0
                                          : u.querySelectorAll) &&
                                        (null == u ||
                                        null ===
                                          (i =
                                            u.querySelectorAll("a.user.name")) ||
                                        void 0 === i
                                          ? void 0
                                          : i.length)
                                      )
                                        for (
                                          var c = 0,
                                            s = Array.from(
                                              document.querySelectorAll(
                                                "a.user.name",
                                              ),
                                            );
                                          c < s.length;
                                          c++
                                        ) {
                                          var l,
                                            f,
                                            d = s[c],
                                            p =
                                              null == d ||
                                              null ===
                                                (l = d.getAttribute("href")) ||
                                              void 0 === l ||
                                              null === (l = l.match(/\d+/)) ||
                                              void 0 === l
                                                ? void 0
                                                : l[0];
                                          if (p) {
                                            var h =
                                                null === (f = r[p]) ||
                                                void 0 === f ||
                                                null === (f = f.last_action) ||
                                                void 0 === f
                                                  ? void 0
                                                  : f.timestamp,
                                              y = d.parentElement;
                                            y &&
                                              (h < o
                                                ? y.classList.contains(
                                                    "redBack",
                                                  ) || y.classList.add("redBack")
                                                : h < n &&
                                                  (y.classList.contains(
                                                    "yellowBack",
                                                  ) ||
                                                    y.classList.add(
                                                      "yellowBack",
                                                    )));
                                          }
                                        }
                                    }
                                  });
                                }).observe(e, { childList: !0, subtree: !0 });
                              }
                            }
                          }),
                          document.querySelector(e) ? r() : l.push([e, r]));
                      })
                      .catch(function (t) {
                        return i({
                          status: !1,
                          fromWhere: "employeesLastAction",
                          message: "error retrieving employees info",
                          data: t,
                        });
                      });
                  })(r);
            }
          });
      })();
  })();
  