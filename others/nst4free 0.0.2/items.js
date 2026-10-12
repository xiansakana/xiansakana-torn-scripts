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
              u = c.iterator || "@@iterator",
              s = c.asyncIterator || "@@asyncIterator",
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
              var o = e && e.prototype instanceof m ? e : m,
                i = Object.create(o.prototype),
                c = new q(r || []);
              return a(i, "_invoke", { value: k(t, n, c) }), i;
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
            function m() {}
            function h() {}
            function y() {}
            var g = {};
            d(g, u, function () {
              return this;
            });
            var b = Object.getPrototypeOf,
              w = b && b(b(O([])));
            w && w !== n && i.call(w, u) && (g = w);
            var x = (y.prototype = m.prototype = Object.create(g));
            function E(t) {
              ["next", "throw", "return"].forEach(function (e) {
                d(t, e, function (t) {
                  return this._invoke(e, t);
                });
              });
            }
            function L(t, e) {
              function n(o, a, c, u) {
                var s = p(t[o], t, a);
                if ("throw" !== s.type) {
                  var l = s.arg,
                    d = l.value;
                  return d && "object" == r(d) && i.call(d, "__await")
                    ? e.resolve(d.__await).then(
                        function (t) {
                          n("next", t, c, u);
                        },
                        function (t) {
                          n("throw", t, c, u);
                        },
                      )
                    : e.resolve(d).then(
                        function (t) {
                          (l.value = t), c(l);
                        },
                        function (t) {
                          return n("throw", t, c, u);
                        },
                      );
                }
                u(s.arg);
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
            function k(t, e, n) {
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
                    var c = S(a, n);
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
                  var u = p(t, e, n);
                  if ("normal" === u.type) {
                    if (
                      ((r = n.done ? "completed" : "suspendedYield"), u.arg === v)
                    )
                      continue;
                    return { value: u.arg, done: n.done };
                  }
                  "throw" === u.type &&
                    ((r = "completed"), (n.method = "throw"), (n.arg = u.arg));
                }
              };
            }
            function S(t, e) {
              var n = e.method,
                r = t.iterator[n];
              if (void 0 === r)
                return (
                  (e.delegate = null),
                  ("throw" === n &&
                    t.iterator.return &&
                    ((e.method = "return"),
                    (e.arg = void 0),
                    S(t, e),
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
            function I(t) {
              var e = { tryLoc: t[0] };
              1 in t && (e.catchLoc = t[1]),
                2 in t && ((e.finallyLoc = t[2]), (e.afterLoc = t[3])),
                this.tryEntries.push(e);
            }
            function j(t) {
              var e = t.completion || {};
              (e.type = "normal"), delete e.arg, (t.completion = e);
            }
            function q(t) {
              (this.tryEntries = [{ tryLoc: "root" }]),
                t.forEach(I, this),
                this.reset(!0);
            }
            function O(t) {
              if (t) {
                var e = t[u];
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
              (h.prototype = y),
              a(x, "constructor", { value: y, configurable: !0 }),
              a(y, "constructor", { value: h, configurable: !0 }),
              (h.displayName = d(y, l, "GeneratorFunction")),
              (e.isGeneratorFunction = function (t) {
                var e = "function" == typeof t && t.constructor;
                return (
                  !!e &&
                  (e === h || "GeneratorFunction" === (e.displayName || e.name))
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
              E(L.prototype),
              d(L.prototype, s, function () {
                return this;
              }),
              (e.AsyncIterator = L),
              (e.async = function (t, n, r, o, i) {
                void 0 === i && (i = Promise);
                var a = new L(f(t, n, r, o), i);
                return e.isGeneratorFunction(n)
                  ? a
                  : a.next().then(function (t) {
                      return t.done ? t.value : a.next();
                    });
              }),
              E(x),
              d(x, l, "Generator"),
              d(x, u, function () {
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
              (e.values = O),
              (q.prototype = {
                constructor: q,
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
                        u = i.call(o, "finallyLoc");
                      if (c && u) {
                        if (this.prev < o.catchLoc) return n(o.catchLoc, !0);
                        if (this.prev < o.finallyLoc) return n(o.finallyLoc);
                      } else if (c) {
                        if (this.prev < o.catchLoc) return n(o.catchLoc, !0);
                      } else {
                        if (!u)
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
                      iterator: O(t),
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
              u = c.value;
          } catch (t) {
            return void n(t);
          }
          c.done ? e(u) : Promise.resolve(u).then(r, o);
        }
        function e(e) {
          return function () {
            var n = this,
              r = arguments;
            return new Promise(function (o, i) {
              var a = e.apply(n, r);
              function c(e) {
                t(a, o, i, c, u, "next", e);
              }
              function u(e) {
                t(a, o, i, c, u, "throw", e);
              }
              c(void 0);
            });
          };
        }
        function r(t) {
          return (
            (r =
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
            r(t)
          );
        }
        function o(t, e, n) {
          return (
            (e = (function (t) {
              var e = (function (t, e) {
                if ("object" !== r(t) || null === t) return t;
                var n = t[Symbol.toPrimitive];
                if (void 0 !== n) {
                  var o = n.call(t, "string");
                  if ("object" !== r(o)) return o;
                  throw new TypeError(
                    "@@toPrimitive must return a primitive value.",
                  );
                }
                return String(t);
              })(t);
              return "symbol" === r(e) ? e : String(e);
            })(e)) in t
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
        var i = n(687),
          a = n.n(i);
        function c() {
          for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++)
            e[n] = arguments[n];
          return new Promise(function (t) {
            chrome.runtime.sendMessage(e, function (e) {
              t(e);
            });
          });
        }
        function u(t) {
          return t.status || console.log(t), t;
        }
        function s(t, e) {
          return Object.assign(document.createElement(t), e);
        }
        function l() {
          return d.apply(this, arguments);
        }
        function d() {
          return (d = e(
            a().mark(function t() {
              return a().wrap(function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      return (
                        (t.next = 2),
                        c({ name: "msgReadKey", value: "nstMember" })
                          .then(function (t) {
                            return (
                              !Array.isArray(t) &&
                              !(!t.status || !t.data) &&
                              t.data
                            );
                          })
                          .catch(function (t) {
                            return u({
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
        function f() {
          return (f = e(
            a().mark(function t() {
              return a().wrap(function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      return (t.next = 2), l();
                    case 2:
                      if (t.sent) {
                        t.next = 5;
                        break;
                      }
                      return t.abrupt("return", !1);
                    case 5:
                      return t.abrupt(
                        "return",
                        c(
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
        var p = !1;
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
                  o(t, e, n[e]);
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
        var h = 1,
          y = ["Primary", "Secondary", "Melee", "Temporary"],
          g = [].concat(
            [
              "Medical",
              "Drug",
              "Energy Drink",
              "Alcohol",
              "Candy",
              "Booster",
              "Supply Pack",
            ],
            y,
          );
        function b() {
          return (b = e(
            a().mark(function t(e, n, r) {
              var o, i, c;
              return a().wrap(function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      if (
                        ((o = "https://www.torn.com/item.php"), !y.includes(r))
                      ) {
                        t.next = 7;
                        break;
                      }
                      return (
                        (i = {
                          method: "POST",
                          headers: {
                            "x-requested-with": "XMLHttpRequest",
                            "content-type":
                              "application/x-www-form-urlencoded; charset=UTF-8",
                          },
                          body: new URLSearchParams({
                            step: "actionForm",
                            item_id: e,
                            type: 5,
                            action: "equip",
                            item: e,
                            id: n,
                            confirm: 1,
                          }),
                        }),
                        (t.next = 5),
                        fetch(o, m({}, i))
                          .then(function (t) {
                            if (200 === t.status) return t.text();
                          })
                          .then(function (t) {
                            var e = document.getElementById("nstItemResponse");
                            if (e) {
                              for (; e.lastChild; ) e.removeChild(e.lastChild);
                              e.innerHTML = "".concat(t);
                            }
                          })
                          .catch(function (t) {
                            u({
                              status: !1,
                              fromWhere: "useItemRequest",
                              message: "some error",
                              data: t,
                            });
                          })
                      );
                    case 5:
                      t.next = 10;
                      break;
                    case 7:
                      return (
                        (c = {
                          method: "POST",
                          headers: { "x-requested-with": "XMLHttpRequest" },
                          body: new URLSearchParams({
                            step: "useItem",
                            itemID: e,
                            item: e,
                          }),
                        }),
                        (t.next = 10),
                        fetch(o, m({}, c))
                          .then(function (t) {
                            return t.json();
                          })
                          .then(function (t) {
                            var e = document.getElementById("nstItemResponse");
                            if (e) {
                              for (; e.lastChild; ) e.removeChild(e.lastChild);
                              if (t.success) {
                                var n,
                                  r = t.links,
                                  o = t.text,
                                  i =
                                    '<p><a class="close-act t-blue h">Close</a>';
                                if (r)
                                  for (
                                    var a = 0, c = Object.values(r);
                                    a < c.length;
                                    a++
                                  ) {
                                    var u = c[a];
                                    i += '<a class="t-blue h m-left10 '
                                      .concat(u.class, '" \n            href="')
                                      .concat(u.url, '" ')
                                      .concat(u.attr, ">")
                                      .concat(u.title, "</a>");
                                  }
                                i += "</p>";
                                var s = "<div><p>"
                                  .concat(o, "</p>")
                                  .concat(i, "</div>");
                                e.insertAdjacentHTML("afterbegin", s);
                                var l = e.querySelector(".counter-wrap");
                                if (l) {
                                  var d =
                                      1e3 * +(l.getAttribute("data-time") || 0),
                                    f = Math.floor(d / 864e5),
                                    p = Math.floor((d % 864e5) / 36e5) + 24 * f,
                                    v = Math.floor((d % 36e5) / 6e4),
                                    m = Math.floor((d % 6e4) / 1e3);
                                  l.innerText = ""
                                    .concat(p, ":")
                                    .concat(v, ":")
                                    .concat(m);
                                }
                                null === (n = document) ||
                                  void 0 === n ||
                                  null ===
                                    (n = n.querySelector(
                                      "#nstItemResponse .close-act",
                                    )) ||
                                  void 0 === n ||
                                  n.addEventListener("click", function (t) {
                                    t.target.style.display = "none";
                                  });
                              }
                            }
                          })
                          .catch(function (t) {
                            u({
                              status: !1,
                              fromWhere: "useItemRequest",
                              message: "some error",
                              data: t,
                            });
                          })
                      );
                    case 10:
                    case "end":
                      return t.stop();
                  }
              }, t);
            }),
          )).apply(this, arguments);
        }
        function w() {
          c({ name: "msgReadKey", value: "nstQuickItems" })
            .then(function (t) {
              if (
                !Array.isArray(t) &&
                null != t &&
                t.status &&
                (s = null == t ? void 0 : t.data) &&
                null != s &&
                0 !== Object.keys(s).length
              ) {
                var e = 0,
                  n = document.getElementById("nstQuickItems");
                if (!n) return;
                for (; n.lastChild; ) n.removeChild(n.lastChild);
                var r = null == t ? void 0 : t.data;
                if (!r) return;
                for (
                  var o = function () {
                      var t,
                        r,
                        o = a[i],
                        s = "".concat(o.strangeID),
                        l = "".concat(o.category),
                        d =
                          '\n            <div id="nstButton" class="nstButton" data-itemID="'
                            .concat(o.id, '" data-qty="')
                            .concat(o.quantity, '" \n            style="order: ')
                            .concat(
                              o.order,
                              '">\n              <button id="nstQuickUse">\n                <img src="/images/items/',
                            )
                            .concat(o.id, '/medium.png" alt="')
                            .concat(
                              o.name,
                              '">\n                <span id="nstQuickName">',
                            )
                            .concat(
                              o.name,
                              '</span>\n                \x3c!--<span id="nstQuickquantity">',
                            )
                            .concat(
                              o.quantity,
                              '</span> --!>\n                <span id="nstQuickClose"></span>\n              </button>\n            </div>',
                            );
                      e++,
                        n.insertAdjacentHTML("afterBegin", d),
                        null == n ||
                          null === (t = n.querySelector("#nstQuickClose")) ||
                          void 0 === t ||
                          t.addEventListener("click", function (t) {
                            var e;
                            t.stopPropagation(), t.preventDefault();
                            var n = t.target;
                            c({
                              name: "msgDeleteQuick",
                              value: "nstQuickItems",
                              obj: {
                                id:
                                  null == n ||
                                  null === (e = n.parentElement) ||
                                  void 0 === e ||
                                  null === (e = e.parentElement) ||
                                  void 0 === e
                                    ? void 0
                                    : e.getAttribute("data-itemID"),
                              },
                            })
                              .then(function () {
                                return w();
                              })
                              .catch(function (t) {
                                return u({
                                  status: !1,
                                  fromWhere: "loadQuickItems",
                                  message: "error deleting item",
                                  data: t,
                                });
                              });
                          }),
                        null == n ||
                          null === (r = n.querySelector("#nstQuickUse")) ||
                          void 0 === r ||
                          r.addEventListener("click", function (t) {
                            var e, n;
                            t.stopPropagation();
                            var r,
                              o = t.target;
                            if (
                              (r =
                                "button" === o.tagName.toLowerCase()
                                  ? null == o ||
                                    null === (e = o.parentElement) ||
                                    void 0 === e
                                    ? void 0
                                    : e.getAttribute("data-itemID")
                                  : null == o ||
                                      null === (n = o.parentElement) ||
                                      void 0 === n ||
                                      null === (n = n.parentElement) ||
                                      void 0 === n
                                    ? void 0
                                    : n.getAttribute("data-itemID"))
                            ) {
                              !(function (t, e, n) {
                                b.apply(this, arguments);
                              })(r, s, l);
                              var i = document.getElementById("nstItemResponse");
                              i && (i.style.display = "");
                            }
                          });
                    },
                    i = 0,
                    a = Object.values(r);
                  i < a.length;
                  i++
                )
                  o();
                (h = e), h++;
              }
              var s;
            })
            .catch(function (t) {
              u({
                status: !1,
                fromWhere: "loadQuickItems",
                message: "error reading quick items",
                data: t,
              });
            });
        }
        (function () {
          return f.apply(this, arguments);
        })().then(function (t) {
          if (Array.isArray(t)) {
            var e,
              n,
              i,
              a,
              l = t[0].data;
            !(function () {
              document.head.appendChild(
                s("style", {
                  innerText:
                    "\n      .d .items-cont .bonuses {\n        right: 174px !important;\n      }",
                }),
              ),
                (function (t, e, n) {
                  if (t) {
                    var r = '\n  <div class="nstBox">\n    '.concat(
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
                      })("Quick Items"),
                      '\n    <div class="nstBoxContent">\n    </div>\n  </div>',
                    );
                    t.insertAdjacentHTML("beforeBegin", r);
                    var o = document.querySelector(".nstBoxHeader");
                    null == o ||
                      o.addEventListener("click", function () {
                        var t,
                          e = o.nextElementSibling,
                          n = "none" === e.style.display ? "initial" : "none";
                        (e.style.display = n),
                          localStorage.setItem(
                            "".concat(
                              null == e ||
                                null === (t = e.firstElementChild) ||
                                void 0 === t
                                ? void 0
                                : t.id,
                              "Folded",
                            ),
                            n,
                          );
                      });
                  }
                })(document.querySelector("div.equipped-items-wrap"));
              var t = document.querySelector(".nstBoxContent");
              if (t) {
                (t.style.display = localStorage.nstQuickItemsFolded || ""),
                  t.insertAdjacentHTML(
                    "afterBegin",
                    '<div class="nstRow" id="nstQuickItems"></div>\n    <div class="nstRow action-wrap use-act use-action" id="nstItemResponse" style="display: none;"></div>\n    <div class="nstRow" id="nstNeedleTimer"></div>\n    ',
                  ),
                  w();
                var e = new MutationObserver(function (t) {
                    t.forEach(function (t) {
                      var e, n, i;
                      if (
                        (null == t || null === (e = t.addedNodes) || void 0 === e
                          ? void 0
                          : e.length) > 0 &&
                        "UL" ===
                          (null == t || null === (n = t.target) || void 0 === n
                            ? void 0
                            : n.nodeName) &&
                        "category-wrap" ==
                          (null == t ||
                          null === (i = t.target) ||
                          void 0 === i ||
                          null === (i = i.parentElement) ||
                          void 0 === i
                            ? void 0
                            : i.id) &&
                        null == t.previousSibling
                      )
                        for (
                          var a = function () {
                              var t,
                                e,
                                n,
                                r = l[s],
                                i = r.dataset.item,
                                a = r.dataset.category || "";
                              if (!g.includes(a)) return { v: void 0 };
                              if (r.querySelector(".nstAddQuickItem"))
                                return { v: void 0 };
                              var d = r.querySelector("span.name-wrap"),
                                f = r.querySelector("ul.actions-wrap");
                              if (!f || !d) return { v: void 0 };
                              null == f ||
                                null === (t = f.parentElement) ||
                                void 0 === t ||
                                t.classList.add("nstItemWrap"),
                                d.classList.add("nstItemWrap");
                              var p = d.querySelector(".name").innerText,
                                v = d
                                  .querySelector(".qty.t-hide")
                                  .innerText.replace("x", ""),
                                m = "" === v ? "1" : v,
                                y =
                                  '\n                    <li class="nstAddQuickItem" data-itemname="'
                                    .concat(p, '" data-itemqty="')
                                    .concat(m, '" data-itemid="')
                                    .concat(i, '" data-itemcategory="')
                                    .concat(
                                      a,
                                      '">\n                      <span class="icon-h" title="Add to Quick Items">\n                        <button aria-label="Add ',
                                    )
                                    .concat(
                                      p,
                                      ' to Quick Items" class="option-equip wai-btn quickItemButton"></button>\n                        <span class="opt-name">\n                            Add <span class="t-hide">to Quick Items</span>\n                        </span>\n                      </span>\n                    </li>',
                                    );
                              null === (e = f.querySelector("li")) ||
                                void 0 === e ||
                                e.insertAdjacentHTML("beforeBegin", y),
                                null == r ||
                                  null ===
                                    (n = r.querySelector(".nstAddQuickItem")) ||
                                  void 0 === n ||
                                  n.addEventListener("click", function (t) {
                                    var e, n;
                                    t.stopPropagation(), t.preventDefault();
                                    var i =
                                        null === (e = t.target) ||
                                        void 0 === e ||
                                        null === (e = e.parentElement) ||
                                        void 0 === e
                                          ? void 0
                                          : e.parentElement,
                                      a =
                                        null == i
                                          ? void 0
                                          : i.getAttribute("data-itemname");
                                    if (a && i) {
                                      var s = a
                                          .replace(/[ ]*Blood Bag[ :]*/, "")
                                          .replace(/[ ]*Bottle of[ :]*/, "")
                                          .replace(/[ ]*First Aid[ :]*/, "")
                                          .replace(
                                            /[ ]*Lawyer Business Card[ :]*/,
                                            "LBC",
                                          )
                                          .replace(/[ ]*Can of[ :]*/, ""),
                                        l = i.getAttribute("data-itemqty"),
                                        d = i.getAttribute("data-itemid");
                                      if (d) {
                                        var f =
                                            i.getAttribute("data-itemcategory"),
                                          p =
                                            null == r ||
                                            null ===
                                              (n = r.querySelector(
                                                '.cont-wrap ul [class*="equipped"]',
                                              )) ||
                                            void 0 === n
                                              ? void 0
                                              : n.getAttribute("data-id");
                                        null ==
                                          document.querySelector(
                                            '#nstQuickItems div[data-itemID="'.concat(
                                              d,
                                              '"]',
                                            ),
                                          ) &&
                                          c({
                                            name: "msgUpdateKey",
                                            value: "nstQuickItems",
                                            obj: o({}, d, {
                                              id: d,
                                              order: h,
                                              name: s,
                                              quantity: l,
                                              category: f,
                                              strangeID: p,
                                            }),
                                          })
                                            .then(function () {
                                              return w();
                                            })
                                            .catch(function (t) {
                                              return u({
                                                status: !1,
                                                fromWhere: "quickitem - observer",
                                                message: "error merging items",
                                                data: t,
                                              });
                                            });
                                      }
                                    }
                                  });
                            },
                            s = 0,
                            l = Array.from(t.addedNodes);
                          s < l.length;
                          s++
                        ) {
                          var d = a();
                          if ("object" === r(d)) return d.v;
                        }
                    });
                  }),
                  n = document.querySelector("div.items-wrap");
                n
                  ? e.observe(n, {
                      attributes: !1,
                      childList: !0,
                      characterData: !1,
                      subtree: !0,
                    })
                  : u({
                      status: !1,
                      fromWhere: "quickItem script",
                      message: "items wrap not found",
                    });
              }
            })(),
              (function () {
                function t(t) {
                  if (t)
                    for (
                      var e = function () {
                          var t = r[n];
                          t.addEventListener("click", function () {
                            var e;
                            (null == t ||
                            null === (e = t.parentNode) ||
                            void 0 === e ||
                            null === (e = e.parentNode) ||
                            void 0 === e
                              ? void 0
                              : e.childNodes[0].childNodes[1].childNodes[1]
                            ).click();
                          });
                        },
                        n = 0,
                        r = Array.from(t);
                      n < r.length;
                      n++
                    )
                      e();
                }
                var e = document.querySelector(".equipped-items-wrap");
                e &&
                  new MutationObserver(function (e) {
                    e.forEach(function (e) {
                      for (
                        var n = 0, r = Array.from(e.addedNodes);
                        n < r.length;
                        n++
                      ) {
                        var o = r[n];
                        o.querySelectorAll &&
                          t(o.querySelectorAll("ul[class*='slotItems']"));
                      }
                    });
                  }).observe(e, { childList: !0, subtree: !0 });
              })(),
              null != l &&
                null !== (e = l.hideResetLoadout) &&
                void 0 !== e &&
                e.enabled &&
                document.head.appendChild(
                  s("style", {
                    innerText:
                      "[aria-label='Reset loadout'] {\n    display: none !important;\n  }",
                  }),
                ),
              null != l &&
                null !== (n = l.equipNoConfirm) &&
                void 0 !== n &&
                n.enabled &&
                ((function () {
                  if (!p) {
                    var t = document.createElement("script");
                    (t.type = "text/javascript"),
                      (t.src = chrome.runtime.getURL("injectXHR.js")),
                      document.documentElement.append(t),
                      (p = !0);
                  }
                })(),
                window.addEventListener("nstXHR", void 0)),
              null != l &&
                null !== (i = l.needleTimer) &&
                void 0 !== i &&
                i.enabled &&
                (function () {
                  var t,
                    e,
                    n = document.getElementById("nstNeedleTimer");
                  function r() {
                    var r = "";
                    Object.entries(e).forEach(function (t) {
                      (r +=
                        t[1] <= 0
                          ? ""
                          : "<div>".concat(t[0], ": ").concat(t[1], "s</div>")),
                        t[1] > 0 && (e[t[0]] = t[1] - 3);
                    }),
                      0 ==
                        Object.values(e).reduce(function (t, e) {
                          return t + e;
                        }, 0) && ((r = ""), clearInterval(t)),
                      n && (n.innerHTML = r);
                  }
                  window.addEventListener("storage", function () {
                    var n = arguments.length <= 0 ? void 0 : arguments[0],
                      o = n.key,
                      i = n.newValue;
                    "nstNeedleTimer" === o &&
                      (clearInterval(t),
                      (e = (function (t) {
                        try {
                          return JSON.parse(t);
                        } catch (t) {
                          console.log(t);
                        }
                        return null;
                      })(i)),
                      (t = setInterval(r, 3e3)));
                  });
                })(),
              null != l &&
                null !== (a = l.uglyImages) &&
                void 0 !== a &&
                a.enabled &&
                new MutationObserver(function (t) {
                  t.forEach(function (t) {
                    for (
                      var e = 0, n = Array.from(t.addedNodes);
                      e < n.length;
                      e++
                    ) {
                      var r,
                        o = n[e];
                      null != o &&
                        o.querySelector &&
                        null != o &&
                        o.querySelector('div[class*="itemPreview"]') &&
                        (null ===
                          (r = o.querySelector('div[class*="itemPreview"]')) ||
                          void 0 === r ||
                          r.remove());
                    }
                  });
                }).observe(document.documentElement, {
                  childList: !0,
                  subtree: !0,
                });
          }
        });
      })();
  })();
  