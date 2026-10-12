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
              s = "function" == typeof Symbol ? Symbol : {},
              u = s.iterator || "@@iterator",
              c = s.asyncIterator || "@@asyncIterator",
              l = s.toStringTag || "@@toStringTag";
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
            function p(t, e, n, r) {
              var o = e && e.prototype instanceof y ? e : y,
                i = Object.create(o.prototype),
                s = new j(r || []);
              return a(i, "_invoke", { value: O(t, n, s) }), i;
            }
            function d(t, e, n) {
              try {
                return { type: "normal", arg: t.call(e, n) };
              } catch (t) {
                return { type: "throw", arg: t };
              }
            }
            e.wrap = p;
            var h = {};
            function y() {}
            function v() {}
            function m() {}
            var g = {};
            f(g, u, function () {
              return this;
            });
            var b = Object.getPrototypeOf,
              x = b && b(b(k([])));
            x && x !== n && i.call(x, u) && (g = x);
            var w = (m.prototype = y.prototype = Object.create(g));
            function L(t) {
              ["next", "throw", "return"].forEach(function (e) {
                f(t, e, function (t) {
                  return this._invoke(e, t);
                });
              });
            }
            function E(t, e) {
              function n(o, a, s, u) {
                var c = d(t[o], t, a);
                if ("throw" !== c.type) {
                  var l = c.arg,
                    f = l.value;
                  return f && "object" == r(f) && i.call(f, "__await")
                    ? e.resolve(f.__await).then(
                        function (t) {
                          n("next", t, s, u);
                        },
                        function (t) {
                          n("throw", t, s, u);
                        },
                      )
                    : e.resolve(f).then(
                        function (t) {
                          (l.value = t), s(l);
                        },
                        function (t) {
                          return n("throw", t, s, u);
                        },
                      );
                }
                u(c.arg);
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
            function O(t, e, n) {
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
                    var s = S(a, n);
                    if (s) {
                      if (s === h) continue;
                      return s;
                    }
                  }
                  if ("next" === n.method) n.sent = n._sent = n.arg;
                  else if ("throw" === n.method) {
                    if ("suspendedStart" === r) throw ((r = "completed"), n.arg);
                    n.dispatchException(n.arg);
                  } else "return" === n.method && n.abrupt("return", n.arg);
                  r = "executing";
                  var u = d(t, e, n);
                  if ("normal" === u.type) {
                    if (
                      ((r = n.done ? "completed" : "suspendedYield"), u.arg === h)
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
                  h
                );
              var o = d(r, t.iterator, e.arg);
              if ("throw" === o.type)
                return (
                  (e.method = "throw"), (e.arg = o.arg), (e.delegate = null), h
                );
              var i = o.arg;
              return i
                ? i.done
                  ? ((e[t.resultName] = i.value),
                    (e.next = t.nextLoc),
                    "return" !== e.method &&
                      ((e.method = "next"), (e.arg = void 0)),
                    (e.delegate = null),
                    h)
                  : i
                : ((e.method = "throw"),
                  (e.arg = new TypeError("iterator result is not an object")),
                  (e.delegate = null),
                  h);
            }
            function _(t) {
              var e = { tryLoc: t[0] };
              1 in t && (e.catchLoc = t[1]),
                2 in t && ((e.finallyLoc = t[2]), (e.afterLoc = t[3])),
                this.tryEntries.push(e);
            }
            function T(t) {
              var e = t.completion || {};
              (e.type = "normal"), delete e.arg, (t.completion = e);
            }
            function j(t) {
              (this.tryEntries = [{ tryLoc: "root" }]),
                t.forEach(_, this),
                this.reset(!0);
            }
            function k(t) {
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
              (v.prototype = m),
              a(w, "constructor", { value: m, configurable: !0 }),
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
                  (t.prototype = Object.create(w)),
                  t
                );
              }),
              (e.awrap = function (t) {
                return { __await: t };
              }),
              L(E.prototype),
              f(E.prototype, c, function () {
                return this;
              }),
              (e.AsyncIterator = E),
              (e.async = function (t, n, r, o, i) {
                void 0 === i && (i = Promise);
                var a = new E(p(t, n, r, o), i);
                return e.isGeneratorFunction(n)
                  ? a
                  : a.next().then(function (t) {
                      return t.done ? t.value : a.next();
                    });
              }),
              L(w),
              f(w, l, "Generator"),
              f(w, u, function () {
                return this;
              }),
              f(w, "toString", function () {
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
              (e.values = k),
              (j.prototype = {
                constructor: j,
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
                      var s = i.call(o, "catchLoc"),
                        u = i.call(o, "finallyLoc");
                      if (s && u) {
                        if (this.prev < o.catchLoc) return n(o.catchLoc, !0);
                        if (this.prev < o.finallyLoc) return n(o.finallyLoc);
                      } else if (s) {
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
                      ? ((this.method = "next"), (this.next = o.finallyLoc), h)
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
                    h
                  );
                },
                finish: function (t) {
                  for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                    var n = this.tryEntries[e];
                    if (n.finallyLoc === t)
                      return this.complete(n.completion, n.afterLoc), T(n), h;
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
                      iterator: k(t),
                      resultName: e,
                      nextLoc: n,
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
    !(function () {
      "use strict";
      function t(e) {
        return (
          (t =
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
          t(e)
        );
      }
      function e(e) {
        var n = (function (e, n) {
          if ("object" !== t(e) || null === e) return e;
          var r = e[Symbol.toPrimitive];
          if (void 0 !== r) {
            var o = r.call(e, "string");
            if ("object" !== t(o)) return o;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return String(e);
        })(e);
        return "symbol" === t(n) ? n : String(n);
      }
      function r() {
        for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++)
          e[n] = arguments[n];
        return new Promise(function (t) {
          chrome.runtime.sendMessage(e, function (e) {
            t(e);
          });
        });
      }
      function o(t, e) {
        return Object.assign(document.createElement(t), e);
      }
      function i(t, e) {
        var n;
        return null === (n = document) ||
          void 0 === n ||
          null === (n = n.getElementById(t)) ||
          void 0 === n
          ? void 0
          : n.appendChild(e);
      }
      function a(t) {
        return document.body.appendChild(t);
      }
      function s(t) {
        if (t) {
          var e = document.getElementById("nstMessage");
          if (!e) return;
          (n = {
            status: !1,
            fromWhere: "errorMessage - popup",
            message: t.message,
            data: t,
          }).status || console.log(n),
            (e.innerText = t.message);
        }
        var n;
      }
      function u() {
        var t = document.getElementById("nstMessage");
        if (t) {
           //c(true);
            //return;
          var e = document.getElementById("nstApikey").value;
          (t.innerText = ""),
            16 == (null == e ? void 0 : e.length)
              ? r({ name: "msgSetApikey", value: e })
                  .then(function (t) {
                    Array.isArray(t) ||
                      (t.status ? c(t.status) : s({ message: t.message }));
                  })
                  .catch(function (t) {
                    return s(t);
                  })
              : s({ message: "invalid apikey" });
        }
      }
      function c(t) {
        var n;
        (document.body.innerHTML = ""),
          a(o("div", {}))
            .appendChild(o("span", { classList: "title" }))
            .appendChild(o("span", { classList: "logo" }))
            .appendChild(o("span", { classList: "nstMain" }))
            .appendChild(o("b", { innerText: "NST" })),
          a(o("div", { classList: "messages" })).appendChild(
            o("span", { id: "nstMessage", classList: "error" }),
          ),
          t
            ? (function () {
                document.body.appendChild(
                  o("div", { id: "nstAfterLogin", classList: "buttons" }),
                ),
                  i(
                    "nstAfterLogin",
                    o("button", { id: "nstSetting", innerText: "settings" }),
                  ),
                  i(
                    "nstAfterLogin",
                    o("button", {
                      id: "nstNotify",
                      innerText: "on",
                      classList: "allOn",
                      title: "toggle notifications",
                    }),
                  ),
                  i(
                    "nstAfterLogin",
                    o("button", { id: "nstLogout", innerText: "logout" }),
                  );
                var t = document.getElementById("nstSetting"),
                  n = document.getElementById("nstNotify"),
                  a = document.getElementById("nstLogout");
                null == t ||
                  t.addEventListener("click", function () {
                    r({ name: "msgOpenSetting", value: "" }),
                      chrome.runtime.openOptionsPage();
                  }),
                  null == a ||
                    a.addEventListener("click", function () {
                      r({ name: "msgLogout", value: "" })
                        .then(function (t) {
                          t.status ? c(!1) : s(t);
                        })
                        .catch(function (t) {
                          return s(t);
                        });
                    }),
                  null == n ||
                    n.addEventListener("click", function () {
                      var t,
                        o,
                        i,
                        a = n.classList.contains("allOn");
                      a
                        ? (n.classList.replace("allOn", "allOff"),
                          (n.innerText = "off"))
                        : (n.classList.replace("allOff", "allOn"),
                          (n.innerText = "on")),
                        r({
                          name: "msgUpdateKey",
                          value: "nstNotification",
                          obj:
                            ((t = {}),
                            (o = "allNoti"),
                            (i = { enabled: (a = !a) }),
                            (o = e(o)) in t
                              ? Object.defineProperty(t, o, {
                                  value: i,
                                  enumerable: !0,
                                  configurable: !0,
                                  writable: !0,
                                })
                              : (t[o] = i),
                            t),
                        }).catch(function (t) {
                          return console.error(t);
                        });
                    }),
                  r({ name: "msgReadKey", value: "nstNotification" })
                    .then(function (t) {
                      if (!Array.isArray(t)) {
                        var e,
                          r =
                            null == t ||
                            null === (e = t.data) ||
                            void 0 === e ||
                            null === (e = e.allNoti) ||
                            void 0 === e
                              ? void 0
                              : e.enabled;
                        if (!n) return;
                        r
                          ? (n.classList.replace("allOff", "allOn"),
                            (n.innerText = "on"))
                          : (n.classList.replace("allOn", "allOff"),
                            (n.innerText = "off"));
                      }
                    })
                    .catch(function (t) {
                      return s(t);
                    });
              })()
            : (a(o("div", { id: "nstFresh" })).appendChild(
                o("p", {
                  innerHTML: 'Enter a \n      <a href="'
                    .concat(
                      "https://www.torn.com/preferences.php#tab=api",
                      '" target="_blank" class="yellow">limited</a> \n      apikey or \n      <a href="',
                    )
                    .concat(
                      "https://www.torn.com/preferences.php#tab=api?&step=addNewKey&title=nst&type=3",
                      '" target="_blank" class="nstMain">create</a>\n      one ad-hoc',
                    ),
                }),
              ),
              i(
                "nstFresh",
                o("input", {
                  id: "nstApikey",
                  type: "password",
                  maxLength: 16,
                  required: !0,
                }),
              ),
              i("nstFresh", o("button", { id: "nstLogin", innerText: "Login" })),
              null === (n = document.getElementById("nstLogin")) ||
                void 0 === n ||
                n.addEventListener("click", u));
      }
      n(687),
        r({ name: "msgReadKey", value: "nstUser" })
          .then(function (t) {
            Array.isArray(t) || c(t.status);
          })
          .catch(function (t) {
            return s(t);
          });
    })();
  })();
  