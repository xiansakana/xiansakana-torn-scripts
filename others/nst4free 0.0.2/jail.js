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
              c = "function" == typeof Symbol ? Symbol : {},
              u = c.iterator || "@@iterator",
              l = c.asyncIterator || "@@asyncIterator",
              s = c.toStringTag || "@@toStringTag";
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
              var o = e && e.prototype instanceof v ? e : v,
                i = Object.create(o.prototype),
                c = new I(n || []);
              return a(i, "_invoke", { value: k(t, r, c) }), i;
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
            function v() {}
            function y() {}
            function m() {}
            var g = {};
            f(g, u, function () {
              return this;
            });
            var b = Object.getPrototypeOf,
              x = b && b(b(O([])));
            x && x !== r && i.call(x, u) && (g = x);
            var w = (m.prototype = v.prototype = Object.create(g));
            function L(t) {
              ["next", "throw", "return"].forEach(function (e) {
                f(t, e, function (t) {
                  return this._invoke(e, t);
                });
              });
            }
            function S(t, e) {
              function r(o, a, c, u) {
                var l = p(t[o], t, a);
                if ("throw" !== l.type) {
                  var s = l.arg,
                    f = s.value;
                  return f && "object" == n(f) && i.call(f, "__await")
                    ? e.resolve(f.__await).then(
                        function (t) {
                          r("next", t, c, u);
                        },
                        function (t) {
                          r("throw", t, c, u);
                        },
                      )
                    : e.resolve(f).then(
                        function (t) {
                          (s.value = t), c(s);
                        },
                        function (t) {
                          return r("throw", t, c, u);
                        },
                      );
                }
                u(l.arg);
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
            function k(t, e, r) {
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
                    var c = E(a, r);
                    if (c) {
                      if (c === h) continue;
                      return c;
                    }
                  }
                  if ("next" === r.method) r.sent = r._sent = r.arg;
                  else if ("throw" === r.method) {
                    if ("suspendedStart" === n) throw ((n = "completed"), r.arg);
                    r.dispatchException(r.arg);
                  } else "return" === r.method && r.abrupt("return", r.arg);
                  n = "executing";
                  var u = p(t, e, r);
                  if ("normal" === u.type) {
                    if (
                      ((n = r.done ? "completed" : "suspendedYield"), u.arg === h)
                    )
                      continue;
                    return { value: u.arg, done: r.done };
                  }
                  "throw" === u.type &&
                    ((n = "completed"), (r.method = "throw"), (r.arg = u.arg));
                }
              };
            }
            function E(t, e) {
              var r = e.method,
                n = t.iterator[r];
              if (void 0 === n)
                return (
                  (e.delegate = null),
                  ("throw" === r &&
                    t.iterator.return &&
                    ((e.method = "return"),
                    (e.arg = void 0),
                    E(t, e),
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
            function B(t) {
              var e = t.completion || {};
              (e.type = "normal"), delete e.arg, (t.completion = e);
            }
            function I(t) {
              (this.tryEntries = [{ tryLoc: "root" }]),
                t.forEach(_, this),
                this.reset(!0);
            }
            function O(t) {
              if (t) {
                var e = t[u];
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
              return { next: j };
            }
            function j() {
              return { value: void 0, done: !0 };
            }
            return (
              (y.prototype = m),
              a(w, "constructor", { value: m, configurable: !0 }),
              a(m, "constructor", { value: y, configurable: !0 }),
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
                  (t.prototype = Object.create(w)),
                  t
                );
              }),
              (e.awrap = function (t) {
                return { __await: t };
              }),
              L(S.prototype),
              f(S.prototype, l, function () {
                return this;
              }),
              (e.AsyncIterator = S),
              (e.async = function (t, r, n, o, i) {
                void 0 === i && (i = Promise);
                var a = new S(d(t, r, n, o), i);
                return e.isGeneratorFunction(r)
                  ? a
                  : a.next().then(function (t) {
                      return t.done ? t.value : a.next();
                    });
              }),
              L(w),
              f(w, s, "Generator"),
              f(w, u, function () {
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
              (e.values = O),
              (I.prototype = {
                constructor: I,
                reset: function (t) {
                  if (
                    ((this.prev = 0),
                    (this.next = 0),
                    (this.sent = this._sent = void 0),
                    (this.done = !1),
                    (this.delegate = null),
                    (this.method = "next"),
                    (this.arg = void 0),
                    this.tryEntries.forEach(B),
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
                      var c = i.call(o, "catchLoc"),
                        u = i.call(o, "finallyLoc");
                      if (c && u) {
                        if (this.prev < o.catchLoc) return r(o.catchLoc, !0);
                        if (this.prev < o.finallyLoc) return r(o.finallyLoc);
                      } else if (c) {
                        if (this.prev < o.catchLoc) return r(o.catchLoc, !0);
                      } else {
                        if (!u)
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
                    var r = this.tryEntries[e];
                    if (r.finallyLoc === t)
                      return this.complete(r.completion, r.afterLoc), B(r), h;
                  }
                },
                catch: function (t) {
                  for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                    var r = this.tryEntries[e];
                    if (r.tryLoc === t) {
                      var n = r.completion;
                      if ("throw" === n.type) {
                        var o = n.arg;
                        B(r);
                      }
                      return o;
                    }
                  }
                  throw new Error("illegal catch attempt");
                },
                delegateYield: function (t, e, r) {
                  return (
                    (this.delegate = {
                      iterator: O(t),
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
      var i = (e[n] = { exports: {} });
      return t[n](i, i.exports, r), i.exports;
    }
    !(function () {
      "use strict";
      function t(t, e) {
        return Object.assign(document.createElement(t), e);
      }
      function e(t, e) {
        var r;
        return null === (r = document) ||
          void 0 === r ||
          null === (r = r.getElementById(t)) ||
          void 0 === r
          ? void 0
          : r.appendChild(e);
      }
      var n, o;
      function i(t) {
        var e = t.value.toLowerCase(),
          r = e.replace(/[^\d]/g, ""),
          n = 1;
        return (
          -1 !== e.indexOf("k")
            ? (n = 1e3)
            : -1 !== e.indexOf("m")
              ? (n = 1e6)
              : -1 !== e.indexOf("b")
                ? (n = 1e9)
                : -1 !== e.indexOf("t") && (n = 1e12),
          (r *= n),
          (t.value = r > 0 ? r.toLocaleString("en-US") : ""),
          r
        );
      }
      function a() {
        var t = +(localStorage.getItem("nstScoreInput") || 0),
          e = document.querySelector("ul.user-info-list-wrap");
        e &&
          Array.from(e.children).forEach(function (e) {
            var r = e.querySelector("span.info-wrap");
            if (r) {
              var n = r.querySelector("span.time").innerText.split(" "),
                o = 0;
              n.forEach(function (t) {
                var e,
                  r = t.includes("h"),
                  n = t.includes("m"),
                  i = +(
                    (null === (e = t.match(/\d+/)) || void 0 === e
                      ? void 0
                      : e[0]) || 0
                  );
                o += r ? 60 * i : n ? i : 0;
              });
              var i =
                +(r.querySelector("span.level").innerText.match(/\d+/) || 0) * o;
              r.setAttribute("title", "score: ".concat(i)),
                (e.style.display = t && i > t ? "none" : ""),
                (function (t) {
                  var e = "true" === localStorage.getItem("nstQuickBail"),
                    r = t.querySelector("a.bye"),
                    n = null == r ? void 0 : r.getAttribute("href"),
                    o = "";
                  if (r && n) {
                    (o = e
                      ? n.replace(/buy$/, "buy1")
                      : n.replace(/buy1$/, "buy")),
                      r.setAttribute("href", o);
                    var i = "true" === localStorage.getItem("nstQuickBust"),
                      a = t.querySelector("a.bust"),
                      c = null == a ? void 0 : a.getAttribute("href"),
                      u = "";
                    a &&
                      c &&
                      ((u = i
                        ? c.replace(/breakout$/, "breakout1")
                        : c.replace(/breakout1$/, "breakout")),
                      a.setAttribute("href", u));
                  }
                })(e);
            }
          });
      }
      function c() {
        if (
          !document.querySelector("#nstQuickJail") &&
          document.querySelector("div.userlist-wrapper")
        ) {
          !(function (t, e, r) {
            if (t) {
              var n;
              n = "".concat("Quick Jail");
              var o = '\n  <div class="nstBox">\n    '.concat(
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
                })(n),
                '\n    <div class="nstBoxContent">\n    </div>\n  </div>',
              );
              t.insertAdjacentHTML("beforebegin", o);
              var i = document.querySelector(".nstBoxHeader");
              null == i ||
                i.addEventListener("click", function () {
                  var t,
                    e = i.nextElementSibling,
                    r = "none" === e.style.display ? "initial" : "none";
                  (e.style.display = r),
                    localStorage.setItem(
                      "".concat(
                        null == e ||
                          null === (t = e.firstElementChild) ||
                          void 0 === t
                          ? void 0
                          : t.id,
                        "Folded",
                      ),
                      r,
                    );
                });
            }
          })(document.querySelector("div.userlist-wrapper"));
          var r = document.querySelector(".nstBoxContent");
          if (r) {
            (r.style.display = localStorage.nstQuickJailFolded || ""),
              r.insertAdjacentElement(
                "afterBegin",
                t("div", { id: "nstQuickJail", classList: "nstRow" }),
              );
            var n = e(
              "nstQuickJail",
              t("div", {
                id: "nstScoreDiv",
                classList: "nstBSFilter input-money-group no-max-value",
              }),
            ).appendChild(
              t("input", {
                id: "nstScoreInput",
                classList: "input-money",
                placeholder: "Max Score",
                value: localStorage.getItem("nstScoreInput") || "",
              }),
            );
            i(n);
            var o = e(
                "nstQuickJail",
                t("div", { id: "nstFilterDiv", classList: "listFlex" }),
              ),
              c = o.appendChild(t("div", { classList: "listItem" })),
              u = c.appendChild(
                t("input", {
                  id: "nstQuickBust",
                  type: "checkbox",
                  value: "quickBust",
                  checked: "true" === localStorage.getItem("nstQuickBust"),
                }),
              );
            c.appendChild(
              t("label", {
                classList: "itemLabel",
                innerText: "quick bust",
                htmlFor: "nstQuickBust",
              }),
            );
            var l = o.appendChild(t("div", { classList: "listItem" })),
              s = l.appendChild(
                t("input", {
                  id: "nstQuickBail",
                  type: "checkbox",
                  value: "quickBail",
                  checked: "true" === localStorage.getItem("nstQuickBail"),
                }),
              );
            l.appendChild(
              t("label", {
                classList: "itemLabel",
                innerText: "quick bail",
                htmlFor: "nstQuickBail",
              }),
            ),
              n.addEventListener("keyup", function (t) {
                var e = +i(t.target);
                localStorage.setItem("nstScoreInput", "".concat(e || "")), a();
              }),
              u.addEventListener("change", function (t) {
                var e = t.target.checked;
                localStorage.setItem("nstQuickBust", "".concat(e || !1)), a();
              }),
              s.addEventListener("change", function (t) {
                var e = t.target.checked;
                localStorage.setItem("nstQuickBail", "".concat(e || !1)), a();
              });
          }
        }
      }
      r(687),
        (n = new MutationObserver(function (t) {
          t.forEach(function (t) {
            var e,
              r = null == t ? void 0 : t.target;
            null != r &&
              null !== (e = r.className) &&
              void 0 !== e &&
              e.includes("users-list") &&
              a();
          });
        })),
        (o = new MutationObserver(function (t) {
          t.forEach(function (t) {
            for (var e = 0, r = Array.from(t.addedNodes); e < r.length; e++) {
              var i = r[e];
              if (
                "DIV" === i.tagName &&
                i.classList.value.includes("userlist-wrapper")
              ) {
                c(), o.disconnect();
                var a = document.querySelector("div.userlist-wrapper");
                if (!a) continue;
                n.observe(a, { childList: !0, subtree: !0 });
              }
            }
          });
        })).observe(document.documentElement, { childList: !0, subtree: !0 });
    })();
  })();
  