!(function () {
    var t,
      e,
      n,
      r,
      o = {
        694: function (t, e, n) {
          "use strict";
          n.a(t, async function (t, e) {
            try {
              var r = n(324),
                o = n(861),
                a = n(687),
                i = n.n(a),
                u = n(805),
                c = n(579),
                s = n(375),
                l = t([c]);
              function d(t, e, n) {
                return p.apply(this, arguments);
              }
              function p() {
                return (p = (0, o.Z)(
                  i().mark(function t(e, n, r) {
                    var o, a, c, s, l, d, p, h, v, y;
                    return i().wrap(function (t) {
                      for (;;)
                        switch ((t.prev = t.next)) {
                          case 0:
                            for (
                              a =
                                (null === (o = e.innerText.match(/\d+/)) ||
                                void 0 === o
                                  ? void 0
                                  : o[0]) || "",
                                c = r.playerID,
                                s = ["xantaken", "refills", "useractivity"],
                                l = [7, 31],
                                f(document.querySelector(".profile-wrapper")),
                                (d = (0, u.be)(
                                  "nstAvgTable",
                                  (0, u.NQ)("tr", {}),
                                )).appendChild(
                                  (0, u.NQ)("th", { innerText: "Stat" }),
                                ),
                                p = 0,
                                h = l;
                              p < h.length;
                              p++
                            )
                              (v = h[p]),
                                d.appendChild(
                                  (0, u.NQ)("th", {
                                    innerText: "".concat(v, " days"),
                                    colSpan: 2,
                                  }),
                                );
                            return (
                              (y = (0, u.be)("nstAvgTable", (0, u.NQ)("tr", {}))),
                              (t.next = 11),
                              (0, u.kD)(c, a, l, n)
                                .then(function (t) {
                                  if (t)
                                    if (Array.isArray(t)) {
                                      var e, n, r, o, a, i, c, l;
                                      y.appendChild(
                                        (0, u.NQ)("td", { innerText: "" }),
                                      ),
                                        y.appendChild(
                                          (0, u.NQ)("td", { innerText: "Them" }),
                                        ),
                                        y.appendChild(
                                          (0, u.NQ)("td", { innerText: "You" }),
                                        ),
                                        y.appendChild(
                                          (0, u.NQ)("td", { innerText: "Them" }),
                                        ),
                                        y.appendChild(
                                          (0, u.NQ)("td", { innerText: "You" }),
                                        );
                                      var d =
                                          null === (e = t[0]) || void 0 === e
                                            ? void 0
                                            : e.data,
                                        p =
                                          null === (n = t[1]) || void 0 === n
                                            ? void 0
                                            : n.data,
                                        f =
                                          null === (r = t[2]) || void 0 === r
                                            ? void 0
                                            : r.data,
                                        h =
                                          null === (o = t[3]) || void 0 === o
                                            ? void 0
                                            : o.data;
                                      if (
                                        !(
                                          null !== (a = t[0]) &&
                                          void 0 !== a &&
                                          a.status &&
                                          null !== (i = t[1]) &&
                                          void 0 !== i &&
                                          i.status &&
                                          null !== (c = t[2]) &&
                                          void 0 !== c &&
                                          c.status &&
                                          null !== (l = t[3]) &&
                                          void 0 !== l &&
                                          l.status
                                        )
                                      )
                                        return;
                                      for (var v = 0, m = s; v < m.length; v++) {
                                        var g = m[v],
                                          b = +(null == f ? void 0 : f[g]),
                                          x = +(null == d ? void 0 : d[g]),
                                          w = +(null == h ? void 0 : h[g]),
                                          S = +(null == p ? void 0 : p[g]),
                                          T = "";
                                        x < b
                                          ? (T = "red")
                                          : x > b && (T = "green");
                                        var N = "";
                                        S < w
                                          ? (N = "red")
                                          : S > w && (N = "green");
                                        var C =
                                            "useractivity" == g
                                              ? +(b / 60).toFixed(2) + " min"
                                              : "".concat(b.toFixed(2)),
                                          Q =
                                            "useractivity" == g
                                              ? +(x / 60).toFixed(2) + " min"
                                              : "".concat(x.toFixed(2)),
                                          _ =
                                            "useractivity" == g
                                              ? +(w / 60).toFixed(2) + " min"
                                              : "".concat(w.toFixed(2)),
                                          L =
                                            "useractivity" == g
                                              ? +(S / 60).toFixed(2) + " min"
                                              : "".concat(S.toFixed(2)),
                                          j = (0, u.be)(
                                            "nstAvgTable",
                                            (0, u.NQ)("tr", {}),
                                          );
                                        j.appendChild(
                                          (0, u.NQ)("td", {
                                            innerHTML: "<b>".concat(g, "</b>"),
                                          }),
                                        ),
                                          j.appendChild(
                                            (0, u.NQ)("td", {
                                              innerText: "".concat(C),
                                            }),
                                          ),
                                          j.appendChild(
                                            (0, u.NQ)("td", {
                                              innerText: "".concat(Q),
                                              classList: T,
                                            }),
                                          ),
                                          j.appendChild(
                                            (0, u.NQ)("td", {
                                              innerText: "".concat(_),
                                            }),
                                          ),
                                          j.appendChild(
                                            (0, u.NQ)("td", {
                                              innerText: "".concat(L),
                                              classList: N,
                                            }),
                                          );
                                      }
                                    } else
                                      y.appendChild(
                                        (0, u.NQ)("td", {
                                          innerText: "No data found",
                                          colSpan: 5,
                                        }),
                                      );
                                })
                                .catch(function (t) {
                                  return (0, u.yo)({
                                    status: !1,
                                    fromWhere: "avgXanax",
                                    message: "some error",
                                    data: t,
                                  });
                                })
                            );
                          case 11:
                          case "end":
                            return t.stop();
                        }
                    }, t);
                  }),
                )).apply(this, arguments);
              }
              function f(t) {
                if (t && !document.querySelector(".nstBox")) {
                  (0, u.Nc)(t, "afterEnd", "User Stats Compare");
                  var e = document.querySelector(".nstBoxContent");
                  (e.style.display = localStorage.nstTScontentFolded || ""),
                    null == e ||
                      e.appendChild(
                        (0, u.NQ)("div", {
                          id: "nstTScontent",
                          classList: "nstRow",
                        }),
                      ),
                    (0, u.be)(
                      "nstTScontent",
                      (0, u.NQ)("div", { id: "nstCompare" }),
                    ),
                    (0, u.be)("nstTScontent", (0, u.NQ)("div", { id: "nstSpy" })),
                    (0, u.be)(
                      "nstCompare",
                      (0, u.NQ)("table", { id: "nstCompTable" }),
                    ),
                    (0, u.be)(
                      "nstSpy",
                      (0, u.NQ)("table", { id: "nstSpyTable" }),
                    ),
                    (0, u.be)(
                      "nstSpy",
                      (0, u.NQ)("table", { id: "nstAvgTable" }),
                    ),
                    null == e ||
                      e.appendChild((0, u.NQ)("p", { id: "nstMessage" }));
                }
              }
              function h(t, e) {
                if (t && e) {
                  for (
                    var n = (0, u.be)("nstCompTable", (0, u.NQ)("tr", {})),
                      r = 0,
                      o = ["Stat", "Them", "You"];
                    r < o.length;
                    r++
                  ) {
                    var a = o[r];
                    n.appendChild((0, u.NQ)("th", { innerText: a }));
                  }
                  for (var i = 0, c = Object.keys(t); i < c.length; i++) {
                    var s = c[i];
                    if ("timestamp" !== s) {
                      var l = "",
                        d = +e[s] - +t[s];
                      d < 0 ? (l = "red") : d > 0 && (l = "green");
                      var p = (0, u.be)("nstCompTable", (0, u.NQ)("tr", {}));
                      p.appendChild((0, u.NQ)("td", { innerText: "".concat(s) })),
                        p.appendChild(
                          (0, u.NQ)("td", {
                            innerText: "".concat((0, u.x5)(+t[s])),
                          }),
                        ),
                        p.appendChild(
                          (0, u.NQ)("td", {
                            classList: l,
                            innerText: "".concat((0, u.x5)(+e[s])),
                          }),
                        );
                    }
                  }
                  (0, u.be)("nstCompTable", (0, u.NQ)("tr", {}))
                    .appendChild((0, u.NQ)("td", { colSpan: 3 }))
                    .appendChild(
                      (0, u.NQ)("a", {
                        href: "https://www.tornstats.com/settings/script",
                        target: "_blank",
                        innerText: "Change your script settings here",
                      }),
                    );
                }
              }
              function v(t, e) {
                if (t && e) {
                  for (
                    var n = (0, u.be)("nstSpyTable", (0, u.NQ)("tr", {})),
                      r = 0,
                      o = ["Stat", "Them", "You"];
                    r < o.length;
                    r++
                  ) {
                    var a = o[r];
                    n.appendChild((0, u.NQ)("th", { innerText: a }));
                  }
                  for (
                    var i = 0,
                      c = ["Strength", "Defense", "Speed", "Dexterity", "Total"];
                    i < c.length;
                    i++
                  ) {
                    var s = c[i],
                      l = "",
                      d = s.toLowerCase(),
                      p = +e[d] - +t[d];
                    p < 0 ? (l = "red") : p > 0 && (l = "green");
                    var f = (0, u.be)("nstSpyTable", (0, u.NQ)("tr", {}));
                    f.appendChild((0, u.NQ)("td", { innerText: "".concat(s) })),
                      f.appendChild(
                        (0, u.NQ)("td", {
                          innerText: "".concat((0, u.x5)(+t[d])),
                        }),
                      ),
                      f.appendChild(
                        (0, u.NQ)("td", {
                          classList: l,
                          innerText: "".concat((0, u.x5)(+e[d])),
                        }),
                      );
                  }
                  var h = (0, u.rJ)(Date.now(), 1e3 * +t.timestamp),
                    v = (0, u.be)("nstSpyTable", (0, u.NQ)("tr", {}));
                  v.appendChild((0, u.NQ)("td", { innerText: "Last Update" })),
                    v.appendChild(
                      (0, u.NQ)("td", { innerHTML: "<b>".concat(h, "</b>") }),
                    );
                }
              }
              function y(t, e) {
                return m.apply(this, arguments);
              }
              function m() {
                return (m = (0, o.Z)(
                  i().mark(function t(e, n) {
                    var o, a, s, l, d, p, y;
                    return i().wrap(function (t) {
                      for (;;)
                        switch ((t.prev = t.next)) {
                          case 0:
                            return (
                              (a = "".concat(
                                null === (o = e.innerText.match(/\[\d+\]/)) ||
                                  void 0 === o ||
                                  null === (o = o[0].match(/\d+/)) ||
                                  void 0 === o
                                  ? void 0
                                  : o[0],
                              )),
                              (s = n.playerID),
                              f(document.querySelector(".profile-wrapper")),
                              (t.next = 5),
                              (0, u.wX)(c.o0, a, s)
                            );
                          case 5:
                            if (
                              ((l = t.sent),
                              (d = (0, r.Z)(l, 2)),
                              (p = d[0]),
                              (y = d[1]),
                              p && y)
                            ) {
                              t.next = 11;
                              break;
                            }
                            return t.abrupt("return");
                          case 11:
                            h(
                              null == p ? void 0 : p.personalstats,
                              null == y ? void 0 : y.personalstats,
                            ),
                              v(
                                null == p ? void 0 : p.spy,
                                null == y ? void 0 : y.spy,
                              );
                          case 13:
                          case "end":
                            return t.stop();
                        }
                    }, t);
                  }),
                )).apply(this, arguments);
              }
              function g(t) {
                document.querySelector("#skip-to-content").innerText =
                  t.innerText;
              }
              (c = (l.then ? (await l)() : l)[0]),
                (0, u.Cl)().then(function (t) {
                  if (Array.isArray(t)) {
                    var e = t[0].data,
                      n = t[1].data,
                      r = "".concat(t[2].data);
                    (0, s.b)(".user-info-value", function () {
                      var t = document.querySelector(".user-info-value");
                      document.head.appendChild(
                        (0, u.NQ)("style", {
                          innerText: ".medals-wrapper {\n    display: none;\n  }",
                        }),
                      ),
                        g(t),
                        e.statCompare.enabled && y(t, n),
                        e.averageXanax.enabled && d(t, r, n);
                    });
                  }
                }),
                e();
            } catch (b) {
              e(b);
            }
          });
        },
        805: function (t, e, n) {
          "use strict";
          n.d(e, {
            Cl: function () {
              return y;
            },
            NQ: function () {
              return d;
            },
            Nc: function () {
              return f;
            },
            bG: function () {
              return u;
            },
            be: function () {
              return p;
            },
            kD: function () {
              return w;
            },
            rJ: function () {
              return T;
            },
            wX: function () {
              return b;
            },
            x5: function () {
              return l;
            },
            yo: function () {
              return s;
            },
          });
          var r = n(324),
            o = n(861),
            a = n(687),
            i = n.n(a);
          function u() {
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
          function s(t) {
            return t.status || console.log(t), t;
          }
          function l(t) {
            return Math.round(t)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }
          function d(t, e) {
            return Object.assign(document.createElement(t), e);
          }
          function p(t, e) {
            var n;
            return null === (n = document) ||
              void 0 === n ||
              null === (n = n.getElementById(t)) ||
              void 0 === n
              ? void 0
              : n.appendChild(e);
          }
          function f(t, e, n) {
            if (t) {
              var r;
              r =
                "crimes" == n
                  ? "Quick Crimes"
                  : "items" == n
                    ? "Quick Items"
                    : "".concat(n);
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
                })(r),
                '\n    <div class="nstBoxContent">\n    </div>\n  </div>',
              );
              t.insertAdjacentHTML(e, o);
              var a = document.querySelector(".nstBoxHeader");
              null == a ||
                a.addEventListener("click", function () {
                  var t,
                    e = a.nextElementSibling,
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
          }
          function h() {
            return v.apply(this, arguments);
          }
          function v() {
            return (v = (0, o.Z)(
              i().mark(function t() {
                return i().wrap(function (t) {
                  for (;;)
                    switch ((t.prev = t.next)) {
                      case 0:
                        return (
                          (t.next = 2),
                          u({ name: "msgReadKey", value: "nstMember" })
                            .then(function (t) {
                              return (
                                !Array.isArray(t) &&
                                !(!t.status || !t.data) &&
                                t.data
                              );
                            })
                            .catch(function (t) {
                              return s({
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
          function y() {
            return m.apply(this, arguments);
          }
          function m() {
            return (m = (0, o.Z)(
              i().mark(function t() {
                return i().wrap(function (t) {
                  for (;;)
                    switch ((t.prev = t.next)) {
                      case 0:
                        return (t.next = 2), h();
                      case 2:
                        if (t.sent) {
                          t.next = 5;
                          break;
                        }
                        return t.abrupt("return", !1);
                      case 5:
                        return t.abrupt(
                          "return",
                          u(
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
          var g = 86400;
          function b(t, e, n) {
            return x.apply(this, arguments);
          }
          function x() {
            return (x = (0, o.Z)(
              i().mark(function t(e, n, o) {
                var a,
                  l,
                  d,
                  p,
                  f,
                  h,
                  v,
                  y,
                  m,
                  b,
                  x,
                  w,
                  S,
                  T,
                  N,
                  C,
                  Q,
                  _,
                  L,
                  j,
                  k,
                  E,
                  A,
                  O,
                  M,
                  Z,
                  D,
                  P,
                  F,
                  I,
                  U;
                return i().wrap(function (t) {
                  for (;;)
                    switch ((t.prev = t.next)) {
                      case 0:
                        if (n && o && e) {
                          t.next = 2;
                          break;
                        }
                        return t.abrupt("return", [!1, !1]);
                      case 2:
                        if (
                          ((f = e[n]),
                          (h = e[o]),
                          (v =
                            !c(
                              null === (a = f) || void 0 === a ? void 0 : a.spy,
                            ) &&
                            !c(
                              null === (l = f) || void 0 === l
                                ? void 0
                                : l.personalstats,
                            )),
                          (y =
                            !c(
                              null === (d = h) || void 0 === d ? void 0 : d.spy,
                            ) &&
                            !c(
                              null === (p = h) || void 0 === p
                                ? void 0
                                : p.personalstats,
                            )),
                          !v || !y)
                        ) {
                          t.next = 8;
                          break;
                        }
                        return t.abrupt("return", [f, h]);
                      case 8:
                        return (
                          (t.next = 10),
                          u({
                            name: "msgTSGetApiData",
                            value: "",
                            obj: { selection: "spy/user/".concat(n) },
                          })
                            .then(function (t) {
                              return (
                                !Array.isArray(t) &&
                                !(!t.data || !t.data.status) &&
                                (console.log(n, t), t)
                              );
                            })
                            .catch(function (t) {
                              return s({
                                status: !1,
                                fromWhere: "updateUserSpies",
                                message: "error getting TS api data",
                                data: t,
                              });
                            })
                        );
                      case 10:
                        if ((m = t.sent)) {
                          t.next = 13;
                          break;
                        }
                        return t.abrupt("return", [!1, !1]);
                      case 13:
                        if (
                          ((b = m.data),
                          (x = {}),
                          (w = {}),
                          (S = {}),
                          (T = {}),
                          b.compare.status)
                        )
                          for (
                            N = 0, C = Object.entries(b.compare.data);
                            N < C.length;
                            N++
                          )
                            (Q = (0, r.Z)(C[N], 2)),
                              (_ = Q[0]),
                              (L = Q[1]),
                              (x[_] = L.amount),
                              (w[_] = +L.amount + +L.difference);
                        return (
                          b.spy.status &&
                            ((j = +b.spy.strength),
                            (k = +b.spy.defense),
                            (E = +b.spy.speed),
                            (A = +b.spy.dexterity),
                            (O = +b.spy.total),
                            (M = +b.spy.deltaStrength),
                            (Z = +b.spy.deltaDefense),
                            (D = +b.spy.deltaSpeed),
                            (P = +b.spy.deltaDexterity),
                            (F = +b.spy.deltaTotal),
                            (S = {
                              strength: j,
                              defense: k,
                              speed: E,
                              dexterity: A,
                              total: O,
                              timestamp: b.spy.timestamp,
                            }),
                            (T = {
                              strength: j + M,
                              defense: k + Z,
                              speed: E + D,
                              dexterity: A + P,
                              total: O + F,
                              timestamp: Math.round(Date.now() / 1e3),
                            })),
                          v ||
                            (f = {
                              spy: S,
                              personalstats: x,
                              timestamp: Math.round(Date.now() / 1e3),
                              cacheUntil: Math.round(Date.now() / 1e3 + g),
                            }),
                          y ||
                            (h = {
                              spy: T,
                              personalstats: w,
                              timestamp: Math.round(Date.now() / 1e3),
                              cacheUntil: Math.round(Date.now() / 1e3 + g),
                            }),
                          ((I = {})[n] = f),
                          u({
                            name: "msgUpdateKey",
                            value: "nstTSspies",
                            obj: I,
                          }).catch(function (t) {
                            return s({
                              status: !1,
                              fromWhere: "updateUserSpies",
                              message: "error updating cached spies",
                              data: t,
                            });
                          }),
                          ((U = {})[o] = h),
                          u({
                            name: "msgUpdateKey",
                            value: "nstTSspies",
                            obj: U,
                          }).catch(function (t) {
                            return s({
                              status: !1,
                              fromWhere: "updateUserSpies",
                              message: "error updating cached spies",
                              data: t,
                            });
                          }),
                          t.abrupt("return", [f, h])
                        );
                      case 29:
                      case "end":
                        return t.stop();
                    }
                }, t);
              }),
            )).apply(this, arguments);
          }
          function w(t, e, n, r) {
            return S.apply(this, arguments);
          }
          function S() {
            return (S = (0, o.Z)(
              i().mark(function t(e, n, r, o) {
                return i().wrap(function (t) {
                  for (;;)
                    switch ((t.prev = t.next)) {
                      case 0:
                        return t.abrupt(
                          "return",
                          u(
                            {
                              name: "msgNinjaPersonalstats",
                              value: o,
                              obj: { playerID: e, days: r[0] },
                            },
                            {
                              name: "msgNinjaPersonalstats",
                              value: o,
                              obj: { playerID: e, days: r[1] },
                            },
                            {
                              name: "msgNinjaPersonalstats",
                              value: o,
                              obj: { playerID: n, days: r[0] },
                            },
                            {
                              name: "msgNinjaPersonalstats",
                              value: o,
                              obj: { playerID: n, days: r[1] },
                            },
                          ),
                        );
                      case 1:
                      case "end":
                        return t.stop();
                    }
                }, t);
              }),
            )).apply(this, arguments);
          }
          function T(t, e) {
            var n = "",
              r = t - e,
              o = Math.floor(r / 864e5),
              a = Math.floor((r % 864e5) / 36e5),
              i = Math.floor((r % 36e5) / 6e4),
              u = Math.floor((r % 6e4) / 1e3);
            return (
              o > 0 && (n += "".concat(o.toString().padStart(2, "0"), "d ")),
              a > 0 && (n += "".concat(a.toString().padStart(2, "0"), "h ")),
              i > 0 && (n += "".concat(i.toString().padStart(2, "0"), "m ")),
              u > 0 && (n += "".concat(u.toString().padStart(2, "0"), "s")),
              "".concat(n)
            );
          }
        },
        375: function (t, e, n) {
          "use strict";
          n.d(e, {
            b: function () {
              return o;
            },
          });
          var r = [];
          function o(t, e) {
            document.querySelector(t) ? e() : r.push([t, e]);
          }
          new MutationObserver(function (t) {
            t.forEach(function (t) {
              for (var e = 0, n = Array.from(t.addedNodes); e < n.length; e++) {
                var o = n[e];
                if (o.querySelector)
                  for (var a = r.length; a--; ) {
                    var i = r[a];
                    o.querySelector(i[0]) && (i[1](), r.splice(a, 1));
                  }
              }
            });
          }).observe(document.documentElement, { childList: !0, subtree: !0 });
        },
        579: function (t, e, n) {
          "use strict";
          n.a(
            t,
            async function (t, r) {
              try {
                n.d(e, {
                  o0: function () {
                    return i;
                  },
                });
                var o = n(805),
                  a = await (0, o.bG)({ name: "msgReadKey", value: "nstTSspies" })
                    .then(function (t) {
                      return !Array.isArray(t) && !!t.data && t;
                    })
                    .catch(function (t) {
                      return (0, o.yo)({
                        status: !1,
                        fromWhere: "tmpBSCache",
                        message: "error getting cached spies",
                        data: t,
                      });
                    }),
                  i = a
                    ? a.data
                    : { 96: { cacheUntil: 0, personalstats: {}, timestamp: 0 } };
                r();
              } catch (t) {
                r(t);
              }
            },
            1,
          );
        },
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
              a = n.hasOwnProperty,
              i =
                Object.defineProperty ||
                function (t, e, n) {
                  t[e] = n.value;
                },
              u = "function" == typeof Symbol ? Symbol : {},
              c = u.iterator || "@@iterator",
              s = u.asyncIterator || "@@asyncIterator",
              l = u.toStringTag || "@@toStringTag";
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
            function p(t, e, n, r) {
              var o = e && e.prototype instanceof v ? e : v,
                a = Object.create(o.prototype),
                u = new L(r || []);
              return i(a, "_invoke", { value: N(t, n, u) }), a;
            }
            function f(t, e, n) {
              try {
                return { type: "normal", arg: t.call(e, n) };
              } catch (t) {
                return { type: "throw", arg: t };
              }
            }
            e.wrap = p;
            var h = {};
            function v() {}
            function y() {}
            function m() {}
            var g = {};
            d(g, c, function () {
              return this;
            });
            var b = Object.getPrototypeOf,
              x = b && b(b(j([])));
            x && x !== n && a.call(x, c) && (g = x);
            var w = (m.prototype = v.prototype = Object.create(g));
            function S(t) {
              ["next", "throw", "return"].forEach(function (e) {
                d(t, e, function (t) {
                  return this._invoke(e, t);
                });
              });
            }
            function T(t, e) {
              function n(o, i, u, c) {
                var s = f(t[o], t, i);
                if ("throw" !== s.type) {
                  var l = s.arg,
                    d = l.value;
                  return d && "object" == r(d) && a.call(d, "__await")
                    ? e.resolve(d.__await).then(
                        function (t) {
                          n("next", t, u, c);
                        },
                        function (t) {
                          n("throw", t, u, c);
                        },
                      )
                    : e.resolve(d).then(
                        function (t) {
                          (l.value = t), u(l);
                        },
                        function (t) {
                          return n("throw", t, u, c);
                        },
                      );
                }
                c(s.arg);
              }
              var o;
              i(this, "_invoke", {
                value: function (t, r) {
                  function a() {
                    return new e(function (e, o) {
                      n(t, r, e, o);
                    });
                  }
                  return (o = o ? o.then(a, a) : a());
                },
              });
            }
            function N(t, e, n) {
              var r = "suspendedStart";
              return function (o, a) {
                if ("executing" === r)
                  throw new Error("Generator is already running");
                if ("completed" === r) {
                  if ("throw" === o) throw a;
                  return { value: void 0, done: !0 };
                }
                for (n.method = o, n.arg = a; ; ) {
                  var i = n.delegate;
                  if (i) {
                    var u = C(i, n);
                    if (u) {
                      if (u === h) continue;
                      return u;
                    }
                  }
                  if ("next" === n.method) n.sent = n._sent = n.arg;
                  else if ("throw" === n.method) {
                    if ("suspendedStart" === r) throw ((r = "completed"), n.arg);
                    n.dispatchException(n.arg);
                  } else "return" === n.method && n.abrupt("return", n.arg);
                  r = "executing";
                  var c = f(t, e, n);
                  if ("normal" === c.type) {
                    if (
                      ((r = n.done ? "completed" : "suspendedYield"), c.arg === h)
                    )
                      continue;
                    return { value: c.arg, done: n.done };
                  }
                  "throw" === c.type &&
                    ((r = "completed"), (n.method = "throw"), (n.arg = c.arg));
                }
              };
            }
            function C(t, e) {
              var n = e.method,
                r = t.iterator[n];
              if (void 0 === r)
                return (
                  (e.delegate = null),
                  ("throw" === n &&
                    t.iterator.return &&
                    ((e.method = "return"),
                    (e.arg = void 0),
                    C(t, e),
                    "throw" === e.method)) ||
                    ("return" !== n &&
                      ((e.method = "throw"),
                      (e.arg = new TypeError(
                        "The iterator does not provide a '" + n + "' method",
                      )))),
                  h
                );
              var o = f(r, t.iterator, e.arg);
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
            function Q(t) {
              var e = { tryLoc: t[0] };
              1 in t && (e.catchLoc = t[1]),
                2 in t && ((e.finallyLoc = t[2]), (e.afterLoc = t[3])),
                this.tryEntries.push(e);
            }
            function _(t) {
              var e = t.completion || {};
              (e.type = "normal"), delete e.arg, (t.completion = e);
            }
            function L(t) {
              (this.tryEntries = [{ tryLoc: "root" }]),
                t.forEach(Q, this),
                this.reset(!0);
            }
            function j(t) {
              if (t) {
                var e = t[c];
                if (e) return e.call(t);
                if ("function" == typeof t.next) return t;
                if (!isNaN(t.length)) {
                  var n = -1,
                    r = function e() {
                      for (; ++n < t.length; )
                        if (a.call(t, n))
                          return (e.value = t[n]), (e.done = !1), e;
                      return (e.value = void 0), (e.done = !0), e;
                    };
                  return (r.next = r);
                }
              }
              return { next: k };
            }
            function k() {
              return { value: void 0, done: !0 };
            }
            return (
              (y.prototype = m),
              i(w, "constructor", { value: m, configurable: !0 }),
              i(m, "constructor", { value: y, configurable: !0 }),
              (y.displayName = d(m, l, "GeneratorFunction")),
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
                    : ((t.__proto__ = m), d(t, l, "GeneratorFunction")),
                  (t.prototype = Object.create(w)),
                  t
                );
              }),
              (e.awrap = function (t) {
                return { __await: t };
              }),
              S(T.prototype),
              d(T.prototype, s, function () {
                return this;
              }),
              (e.AsyncIterator = T),
              (e.async = function (t, n, r, o, a) {
                void 0 === a && (a = Promise);
                var i = new T(p(t, n, r, o), a);
                return e.isGeneratorFunction(n)
                  ? i
                  : i.next().then(function (t) {
                      return t.done ? t.value : i.next();
                    });
              }),
              S(w),
              d(w, l, "Generator"),
              d(w, c, function () {
                return this;
              }),
              d(w, "toString", function () {
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
              (e.values = j),
              (L.prototype = {
                constructor: L,
                reset: function (t) {
                  if (
                    ((this.prev = 0),
                    (this.next = 0),
                    (this.sent = this._sent = void 0),
                    (this.done = !1),
                    (this.delegate = null),
                    (this.method = "next"),
                    (this.arg = void 0),
                    this.tryEntries.forEach(_),
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
                  function n(n, r) {
                    return (
                      (i.type = "throw"),
                      (i.arg = t),
                      (e.next = n),
                      r && ((e.method = "next"), (e.arg = void 0)),
                      !!r
                    );
                  }
                  for (var r = this.tryEntries.length - 1; r >= 0; --r) {
                    var o = this.tryEntries[r],
                      i = o.completion;
                    if ("root" === o.tryLoc) return n("end");
                    if (o.tryLoc <= this.prev) {
                      var u = a.call(o, "catchLoc"),
                        c = a.call(o, "finallyLoc");
                      if (u && c) {
                        if (this.prev < o.catchLoc) return n(o.catchLoc, !0);
                        if (this.prev < o.finallyLoc) return n(o.finallyLoc);
                      } else if (u) {
                        if (this.prev < o.catchLoc) return n(o.catchLoc, !0);
                      } else {
                        if (!c)
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
                      a.call(r, "finallyLoc") &&
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
                    var n = this.tryEntries[e];
                    if (n.finallyLoc === t)
                      return this.complete(n.completion, n.afterLoc), _(n), h;
                  }
                },
                catch: function (t) {
                  for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                    var n = this.tryEntries[e];
                    if (n.tryLoc === t) {
                      var r = n.completion;
                      if ("throw" === r.type) {
                        var o = r.arg;
                        _(n);
                      }
                      return o;
                    }
                  }
                  throw new Error("illegal catch attempt");
                },
                delegateYield: function (t, e, n) {
                  return (
                    (this.delegate = {
                      iterator: j(t),
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
        907: function (t, e, n) {
          "use strict";
          function r(t, e) {
            (null == e || e > t.length) && (e = t.length);
            for (var n = 0, r = new Array(e); n < e; n++) r[n] = t[n];
            return r;
          }
          n.d(e, {
            Z: function () {
              return r;
            },
          });
        },
        878: function (t, e, n) {
          "use strict";
          function r(t) {
            if (Array.isArray(t)) return t;
          }
          n.d(e, {
            Z: function () {
              return r;
            },
          });
        },
        861: function (t, e, n) {
          "use strict";
          function r(t, e, n, r, o, a, i) {
            try {
              var u = t[a](i),
                c = u.value;
            } catch (t) {
              return void n(t);
            }
            u.done ? e(c) : Promise.resolve(c).then(r, o);
          }
          function o(t) {
            return function () {
              var e = this,
                n = arguments;
              return new Promise(function (o, a) {
                var i = t.apply(e, n);
                function u(t) {
                  r(i, o, a, u, c, "next", t);
                }
                function c(t) {
                  r(i, o, a, u, c, "throw", t);
                }
                u(void 0);
              });
            };
          }
          n.d(e, {
            Z: function () {
              return o;
            },
          });
        },
        902: function (t, e, n) {
          "use strict";
          function r(t, e) {
            var n =
              null == t
                ? null
                : ("undefined" != typeof Symbol && t[Symbol.iterator]) ||
                  t["@@iterator"];
            if (null != n) {
              var r,
                o,
                a,
                i,
                u = [],
                c = !0,
                s = !1;
              try {
                if (((a = (n = n.call(t)).next), 0 === e)) {
                  if (Object(n) !== n) return;
                  c = !1;
                } else
                  for (
                    ;
                    !(c = (r = a.call(n)).done) &&
                    (u.push(r.value), u.length !== e);
                    c = !0
                  );
              } catch (t) {
                (s = !0), (o = t);
              } finally {
                try {
                  if (
                    !c &&
                    null != n.return &&
                    ((i = n.return()), Object(i) !== i)
                  )
                    return;
                } finally {
                  if (s) throw o;
                }
              }
              return u;
            }
          }
          n.d(e, {
            Z: function () {
              return r;
            },
          });
        },
        267: function (t, e, n) {
          "use strict";
          function r() {
            throw new TypeError(
              "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
            );
          }
          n.d(e, {
            Z: function () {
              return r;
            },
          });
        },
        324: function (t, e, n) {
          "use strict";
          n.d(e, {
            Z: function () {
              return u;
            },
          });
          var r = n(878),
            o = n(902),
            a = n(181),
            i = n(267);
          function u(t, e) {
            return (0, r.Z)(t) || (0, o.Z)(t, e) || (0, a.Z)(t, e) || (0, i.Z)();
          }
        },
        181: function (t, e, n) {
          "use strict";
          n.d(e, {
            Z: function () {
              return o;
            },
          });
          var r = n(907);
          function o(t, e) {
            if (t) {
              if ("string" == typeof t) return (0, r.Z)(t, e);
              var n = Object.prototype.toString.call(t).slice(8, -1);
              return (
                "Object" === n && t.constructor && (n = t.constructor.name),
                "Map" === n || "Set" === n
                  ? Array.from(t)
                  : "Arguments" === n ||
                      /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                    ? (0, r.Z)(t, e)
                    : void 0
              );
            }
          }
        },
      },
      a = {};
    function i(t) {
      var e = a[t];
      if (void 0 !== e) return e.exports;
      var n = (a[t] = { exports: {} });
      return o[t](n, n.exports, i), n.exports;
    }
    (t =
      "function" == typeof Symbol
        ? Symbol("webpack queues")
        : "__webpack_queues__"),
      (e =
        "function" == typeof Symbol
          ? Symbol("webpack exports")
          : "__webpack_exports__"),
      (n =
        "function" == typeof Symbol
          ? Symbol("webpack error")
          : "__webpack_error__"),
      (r = function (t) {
        t &&
          t.d < 1 &&
          ((t.d = 1),
          t.forEach(function (t) {
            t.r--;
          }),
          t.forEach(function (t) {
            t.r-- ? t.r++ : t();
          }));
      }),
      (i.a = function (o, a, i) {
        var u;
        i && ((u = []).d = -1);
        var c,
          s,
          l,
          d = new Set(),
          p = o.exports,
          f = new Promise(function (t, e) {
            (l = e), (s = t);
          });
        (f[e] = p),
          (f[t] = function (t) {
            u && t(u), d.forEach(t), f.catch(function () {});
          }),
          (o.exports = f),
          a(
            function (o) {
              var a;
              c = (function (o) {
                return o.map(function (o) {
                  if (null !== o && "object" == typeof o) {
                    if (o[t]) return o;
                    if (o.then) {
                      var a = [];
                      (a.d = 0),
                        o.then(
                          function (t) {
                            (i[e] = t), r(a);
                          },
                          function (t) {
                            (i[n] = t), r(a);
                          },
                        );
                      var i = {};
                      return (
                        (i[t] = function (t) {
                          t(a);
                        }),
                        i
                      );
                    }
                  }
                  var u = {};
                  return (u[t] = function () {}), (u[e] = o), u;
                });
              })(o);
              var i = function () {
                  return c.map(function (t) {
                    if (t[n]) throw t[n];
                    return t[e];
                  });
                },
                s = new Promise(function (e) {
                  (a = function () {
                    e(i);
                  }).r = 0;
                  var n = function (t) {
                    t !== u &&
                      !d.has(t) &&
                      (d.add(t), t && !t.d && (a.r++, t.push(a)));
                  };
                  c.map(function (e) {
                    e[t](n);
                  });
                });
              return a.r ? s : i();
            },
            function (t) {
              t ? l((f[n] = t)) : s(p), r(u);
            },
          ),
          u && u.d < 0 && (u.d = 0);
      }),
      (i.n = function (t) {
        var e =
          t && t.__esModule
            ? function () {
                return t.default;
              }
            : function () {
                return t;
              };
        return i.d(e, { a: e }), e;
      }),
      (i.d = function (t, e) {
        for (var n in e)
          i.o(e, n) &&
            !i.o(t, n) &&
            Object.defineProperty(t, n, { enumerable: !0, get: e[n] });
      }),
      (i.o = function (t, e) {
        return Object.prototype.hasOwnProperty.call(t, e);
      }),
      i(694);
  })();
  