!(function () {
    var t,
      e,
      n,
      r,
      o = {
        503: function (t, e, n) {
          "use strict";
          n.a(t, async function (t, e) {
            try {
              var r = n(942),
                o = n(861),
                i = n(687),
                a = n.n(i),
                c = n(805),
                u = n(579),
                s = n(375),
                l = t([u]);
              function f(t, e) {
                var n =
                  ("undefined" != typeof Symbol && t[Symbol.iterator]) ||
                  t["@@iterator"];
                if (!n) {
                  if (
                    Array.isArray(t) ||
                    (n = d(t)) ||
                    (e && t && "number" == typeof t.length)
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
              }
              function d(t, e) {
                if (t) {
                  if ("string" == typeof t) return p(t, e);
                  var n = Object.prototype.toString.call(t).slice(8, -1);
                  return (
                    "Object" === n && t.constructor && (n = t.constructor.name),
                    "Map" === n || "Set" === n
                      ? Array.from(t)
                      : "Arguments" === n ||
                          /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                        ? p(t, e)
                        : void 0
                  );
                }
              }
              function p(t, e) {
                (null == e || e > t.length) && (e = t.length);
                for (var n = 0, r = new Array(e); n < e; n++) r[n] = t[n];
                return r;
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
              function h(t) {
                for (var e = 1; e < arguments.length; e++) {
                  var n = null != arguments[e] ? arguments[e] : {};
                  e % 2
                    ? v(Object(n), !0).forEach(function (e) {
                        (0, r.Z)(t, e, n[e]);
                      })
                    : Object.getOwnPropertyDescriptors
                      ? Object.defineProperties(
                          t,
                          Object.getOwnPropertyDescriptors(n),
                        )
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
              (u = (l.then ? (await l)() : l)[0]),
                (0, c.Cl)().then(function (t) {
                  var e, n;
                  if (t && Array.isArray(t)) {
                    var r,
                      i = t[0].data,
                      l = "".concat(t[2].data),
                      d = t[3].data,
                      p = t[4].data;
                    i.disableRefresh.enabled &&
                      (new MutationObserver(function (t) {
                        t.forEach(function (t) {
                          for (
                            var e = 0, n = Array.from(t.addedNodes);
                            e < n.length;
                            e++
                          ) {
                            var r = n[e];
                            r.querySelector &&
                              r.querySelector("[class*='playerArea']") &&
                              v(r.querySelector("[class*='playerArea']"));
                          }
                        });
                      }).observe(document.documentElement, {
                        childList: !0,
                        subtree: !0,
                      }),
                      v(
                        null === (r = document) || void 0 === r
                          ? void 0
                          : r.querySelector("[class*='playerArea']"),
                      )),
                      i.enhaFight.enabled &&
                        (function () {
                          var t =
                              new URLSearchParams(window.location.search).get(
                                "user2ID",
                              ) || "",
                            e = p.energy.current,
                            n = 'div[class^="bottomSection"]',
                            r = d.nstHold,
                            f = d.nstOutcome;
                          function v() {
                            return (v = (0, o.Z)(
                              a().mark(function n(r) {
                                var o, i, s, l, f, d, p, v;
                                return a().wrap(function (n) {
                                  for (;;)
                                    switch ((n.prev = n.next)) {
                                      case 0:
                                        return (n.next = 2), m();
                                      case 2:
                                        (o = n.sent),
                                          (i = o.htLeft),
                                          (s = o.onWall),
                                          (l = o.lastAction),
                                          (f = o.revive),
                                          (d = r.appendChild(
                                            (0, c.NQ)("div", {
                                              id: "targetStatDiv",
                                              classList: "nstFRowCenter",
                                            }),
                                          )),
                                          (p = r.appendChild(
                                            (0, c.NQ)("div", {
                                              id: "targetStatOptDiv",
                                              classList: "nstFRowCenter",
                                            }),
                                          )),
                                          d.appendChild(
                                            (0, c.NQ)("div", {
                                              innerText: "Energy: ".concat(e),
                                              classList: "nstItemDiv",
                                            }),
                                          ),
                                          (v = (0, c.NQ)("div", {
                                            classList: "nstItemDiv",
                                          })),
                                          (0, u.up)(+t, v),
                                          d.appendChild(v),
                                          d.appendChild(
                                            (0, c.NQ)("div", {
                                              innerText: "".concat(
                                                s ? "ON WALL" : "NOT ON WALL",
                                              ),
                                              classList: "nstItemDiv",
                                            }),
                                          ),
                                          p.appendChild(
                                            (0, c.NQ)("div", {
                                              innerText: "".concat(
                                                1 === f
                                                  ? "Revive ON"
                                                  : "Revive OFF",
                                              ),
                                              classList: "nstItemDiv",
                                            }),
                                          ),
                                          p.appendChild(
                                            (0, c.NQ)("div", {
                                              innerText: "Last Action: ".concat(
                                                (0, c.rJ)(Date.now(), 1e3 * +l),
                                              ),
                                              classList: "nstItemDiv",
                                            }),
                                          ),
                                          p.appendChild(b(i)),
                                          setInterval(function () {
                                            b(i);
                                          }, 2e3);
                                      case 18:
                                      case "end":
                                        return n.stop();
                                    }
                                }, n);
                              }),
                            )).apply(this, arguments);
                          }
                          function m() {
                            return y.apply(this, arguments);
                          }
                          function y() {
                            return (
                              (y = (0, o.Z)(
                                a().mark(function e() {
                                  var n;
                                  return a().wrap(function (e) {
                                    for (;;)
                                      switch ((e.prev = e.next)) {
                                        case 0:
                                          return (
                                            (n = {
                                              htLeft: Number,
                                              onWall: Boolean,
                                            }),
                                            (e.next = 3),
                                            (0, c.bG)({
                                              name: "msgGetApiData",
                                              value: l,
                                              obj: {
                                                section: "user",
                                                selection: "",
                                                objectID: t,
                                              },
                                            })
                                              .then(function (t) {
                                                var e, r, o, i;
                                                Array.isArray(t) ||
                                                  ((n.htLeft = +(null == t ||
                                                  null === (e = t.data) ||
                                                  void 0 === e
                                                    ? void 0
                                                    : e.status.until)),
                                                  (n.onWall =
                                                    0 !=
                                                    Object.values(
                                                      null == t ||
                                                        null === (r = t.data) ||
                                                        void 0 === r
                                                        ? void 0
                                                        : r.basicicons,
                                                    ).filter(function (t) {
                                                      return t.includes(
                                                        "Territory War",
                                                      );
                                                    }).length),
                                                  (n.lastAction =
                                                    null == t ||
                                                    null === (o = t.data) ||
                                                    void 0 === o
                                                      ? void 0
                                                      : o.last_action.timestamp),
                                                  (n.revive =
                                                    null == t ||
                                                    null === (i = t.data) ||
                                                    void 0 === i
                                                      ? void 0
                                                      : i.revivable));
                                              })
                                              .catch(function (t) {
                                                (0, c.yo)({
                                                  status: !1,
                                                  fromWhere: "getStatusData",
                                                  message:
                                                    "error fetching torn api",
                                                  data: t,
                                                });
                                              })
                                          );
                                        case 3:
                                          return e.abrupt("return", n);
                                        case 4:
                                        case "end":
                                          return e.stop();
                                      }
                                  }, e);
                                }),
                              )),
                              y.apply(this, arguments)
                            );
                          }
                          function b(t) {
                            var e =
                              0 == t
                                ? "Okay"
                                : "Out in ".concat(
                                    (0, c.rJ)(1e3 * t, Math.round(Date.now())),
                                  );
                            if (!document.getElementById("nstHospTimer"))
                              return (0, c.NQ)("div", {
                                id: "nstHospTimer",
                                innerText: e,
                                classList: "nstItemDiv",
                              });
                            document.getElementById("nstHospTimer").innerText = e;
                          }
                          (0, s.b)(n, function () {
                            var e;
                            if (
                              !document.getElementById("nstEnhaFight") &&
                              document.querySelector(n)
                            ) {
                              var u = document.querySelector(n);
                              (0, c.Nc)(u, "beforebegin", "Fighterino");
                              var s = document.querySelector(".nstBoxContent");
                              if (s) {
                                if (
                                  ((s.style.display =
                                    localStorage.nstEnhaFightFolded || ""),
                                  s.insertAdjacentElement(
                                    "afterBegin",
                                    (0, c.NQ)("div", {
                                      id: "nstEnhaFight",
                                      classList: "nstRow nstFColCenter",
                                    }),
                                  ),
                                  null != i &&
                                    null !== (e = i.targetStatus) &&
                                    void 0 !== e &&
                                    e.enabled)
                                ) {
                                  var l = (0, c.be)(
                                    "nstEnhaFight",
                                    (0, c.NQ)("div", {
                                      id: "targetStatusDiv",
                                      classList: "nstFRowCenter",
                                    }),
                                  );
                                  !(function (t) {
                                    var e = t.appendChild(
                                        (0, c.NQ)("div", {
                                          id: "fightOptionDiv",
                                          classList: "nstFRowCenter",
                                        }),
                                      ),
                                      n = e.appendChild(
                                        (0, c.NQ)("div", {
                                          id: "outcomeDiv",
                                          classList: "nstItemDiv nstFRowCenter",
                                        }),
                                      ),
                                      o = (0, c.be)(
                                        "outcomeDiv",
                                        (0, c.NQ)("input", {
                                          id: "leave",
                                          type: "radio",
                                          name: "outcome",
                                          value: "leave",
                                        }),
                                      );
                                    (0, c.be)(
                                      "outcomeDiv",
                                      (0, c.NQ)("label", {
                                        classList: "itemLabel",
                                        innerText: "leave",
                                        htmlFor: "leave",
                                      }),
                                    );
                                    var i = (0, c.be)(
                                      "outcomeDiv",
                                      (0, c.NQ)("input", {
                                        id: "mug",
                                        type: "radio",
                                        name: "outcome",
                                        value: "mug",
                                      }),
                                    );
                                    (0, c.be)(
                                      "outcomeDiv",
                                      (0, c.NQ)("label", {
                                        classList: "itemLabel",
                                        innerText: "mug",
                                        htmlFor: "mug",
                                      }),
                                    );
                                    var a = (0, c.be)(
                                      "outcomeDiv",
                                      (0, c.NQ)("input", {
                                        id: "hospitalize",
                                        type: "radio",
                                        name: "outcome",
                                        value: "hospitalize",
                                      }),
                                    );
                                    switch (
                                      ((0, c.be)(
                                        "outcomeDiv",
                                        (0, c.NQ)("label", {
                                          classList: "itemLabel",
                                          innerText: "hosp",
                                          htmlFor: "hospitalize",
                                        }),
                                      ),
                                      d.nstOutcome)
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
                                    n.addEventListener("change", function (t) {
                                      var e = t.target.id;
                                      f = e;
                                      var n = { nstOutcome: e };
                                      (0, c.bG)({
                                        name: "msgUpdateKey",
                                        value: "nstFight",
                                        obj: n,
                                      })
                                        .then()
                                        .catch(function (t) {
                                          (0, c.yo)({
                                            status: !1,
                                            fromWhere: "outcome listener",
                                            message: "some error",
                                            data: t,
                                          });
                                        });
                                    });
                                    var u = e.appendChild(
                                        (0, c.NQ)("div", {
                                          id: "holdDiv",
                                          classList: "nstItemDiv nstFRowCenter",
                                        }),
                                      ),
                                      s = u.appendChild(
                                        (0, c.NQ)("input", {
                                          id: "hold",
                                          type: "checkbox",
                                          value: "HOLD",
                                          checked: d.nstHold,
                                          style: "margin: 4px",
                                        }),
                                      );
                                    u.appendChild(
                                      (0, c.NQ)("label", {
                                        classList: "itemLabel",
                                        innerText: "HOLD",
                                        htmlFor: "hold",
                                      }),
                                    ),
                                      s.addEventListener("change", function (t) {
                                        var e = t.target.checked;
                                        r = e;
                                        var n = { nstHold: e };
                                        (0, c.bG)({
                                          name: "msgUpdateKey",
                                          value: "nstFight",
                                          obj: n,
                                        })
                                          .then()
                                          .catch(function (t) {
                                            (0, c.yo)({
                                              status: !1,
                                              fromWhere: "enhaFight",
                                              message: "some error",
                                              data: t,
                                            });
                                          });
                                      });
                                  })(l),
                                    (function (t) {
                                      v.apply(this, arguments);
                                    })(l);
                                }
                                !(function (e) {
                                  var n = e
                                    .appendChild(
                                      (0, c.NQ)("div", {
                                        id: "fighterinoDiv",
                                        classList: "nstFColCenter",
                                      }),
                                    )
                                    .appendChild(
                                      (0, c.NQ)("button", {
                                        id: "fighterino",
                                        classList: "",
                                        innerText: "fighterino",
                                      }),
                                    );
                                  function i(t) {
                                    var e,
                                      n = !0;
                                    if (
                                      void 0 !==
                                      (null === (e = s) ||
                                      void 0 === e ||
                                      null === (e = e.attackerItems[t]) ||
                                      void 0 === e ||
                                      null === (e = e.item[0]) ||
                                      void 0 === e
                                        ? void 0
                                        : e.ID)
                                    ) {
                                      if (3 !== t) {
                                        var r,
                                          o,
                                          i = "attacker".concat(
                                            1 === t ? "Primary" : "Secondary",
                                            "RoundsLeft",
                                          ),
                                          a = 1 === t ? m : y,
                                          c =
                                            "0" !==
                                            (null === (r = s) ||
                                            void 0 === r ||
                                            null === (r = r.currentClips) ||
                                            void 0 === r
                                              ? void 0
                                              : r[0][i]),
                                          u = !(
                                            null !== (o = s) &&
                                            void 0 !== o &&
                                            o.attackerAmmoStatus[t].includes(
                                              "No ammo",
                                            )
                                          );
                                        ((c || a) && u) || (n = !1);
                                      }
                                    } else n = !1;
                                    return n || p++, n;
                                  }
                                  var u = {},
                                    s = {},
                                    l = !1,
                                    p = 0,
                                    v = d.useTemp,
                                    m = d.reloadPrimary,
                                    y = d.reloadSecondary,
                                    b = d.nstWeapon;
                                  n.addEventListener(
                                    "click",
                                    (0, o.Z)(
                                      a().mark(function e() {
                                        var c, d, m, y, g, w;
                                        return a().wrap(function (e) {
                                          for (;;)
                                            switch ((e.prev = e.next)) {
                                              case 0:
                                                if (
                                                  ((y = function () {
                                                    return (y = (0, o.Z)(
                                                      a().mark(function e() {
                                                        var r,
                                                          o,
                                                          c,
                                                          d,
                                                          h,
                                                          m,
                                                          y,
                                                          g,
                                                          w,
                                                          x,
                                                          S,
                                                          L,
                                                          k,
                                                          E,
                                                          O,
                                                          N,
                                                          D,
                                                          j,
                                                          T,
                                                          I,
                                                          A,
                                                          _;
                                                        return a().wrap(function (
                                                          e,
                                                        ) {
                                                          for (;;)
                                                            switch (
                                                              (e.prev = e.next)
                                                            ) {
                                                              case 0:
                                                                if (
                                                                  ((d =
                                                                    0 !==
                                                                    Object.keys(u)
                                                                      .length),
                                                                  (h =
                                                                    0 !==
                                                                    Object.keys(s)
                                                                      .length),
                                                                  d &&
                                                                    h &&
                                                                    !(
                                                                      "startErrorTitle" in
                                                                      u
                                                                    ))
                                                                ) {
                                                                  e.next = 4;
                                                                  break;
                                                                }
                                                                return e.abrupt(
                                                                  "return",
                                                                  { user2ID: t },
                                                                );
                                                              case 4:
                                                                if (
                                                                  !(
                                                                    (null ===
                                                                      (r = s) ||
                                                                    void 0 ===
                                                                      r ||
                                                                    null ===
                                                                      (r =
                                                                        r.defenderUser) ||
                                                                    void 0 === r
                                                                      ? void 0
                                                                      : r.life) <
                                                                    2
                                                                  )
                                                                ) {
                                                                  e.next = 6;
                                                                  break;
                                                                }
                                                                return e.abrupt(
                                                                  "return",
                                                                  {
                                                                    step: "finish",
                                                                    fightResult:
                                                                      f,
                                                                  },
                                                                );
                                                              case 6:
                                                                if (
                                                                  l ||
                                                                  "notStarted" !=
                                                                    (null ===
                                                                      (o = s) ||
                                                                    void 0 === o
                                                                      ? void 0
                                                                      : o.attackStatus)
                                                                ) {
                                                                  e.next = 11;
                                                                  break;
                                                                }
                                                                return (
                                                                  (n.innerText =
                                                                    "Starting fight"),
                                                                  (l = !0),
                                                                  (n.disabled =
                                                                    !1),
                                                                  e.abrupt(
                                                                    "return",
                                                                    {
                                                                      step: "startFight",
                                                                      user2ID: t,
                                                                    },
                                                                  )
                                                                );
                                                              case 11:
                                                                if (
                                                                  !l &&
                                                                  "process" !=
                                                                    (null ===
                                                                      (c = u) ||
                                                                    void 0 === c
                                                                      ? void 0
                                                                      : c.currentAttackStatus)
                                                                ) {
                                                                  e.next = 31;
                                                                  break;
                                                                }
                                                                if (
                                                                  ((w =
                                                                    null ===
                                                                      (m = s) ||
                                                                    void 0 ===
                                                                      m ||
                                                                    null ===
                                                                      (m =
                                                                        m.defenderUser) ||
                                                                    void 0 === m
                                                                      ? void 0
                                                                      : m.life),
                                                                  (x =
                                                                    null ===
                                                                      (y = s) ||
                                                                    void 0 ===
                                                                      y ||
                                                                    null ===
                                                                      (y =
                                                                        y.defenderUser) ||
                                                                    void 0 === y
                                                                      ? void 0
                                                                      : y.maxlife),
                                                                  (n.innerText =
                                                                    ""
                                                                      .concat(
                                                                        w,
                                                                        " / ",
                                                                      )
                                                                      .concat(x)),
                                                                  (S =
                                                                    void 0 !==
                                                                    (null ===
                                                                      (g = s) ||
                                                                    void 0 ===
                                                                      g ||
                                                                    null ===
                                                                      (g =
                                                                        g.attackerItems) ||
                                                                    void 0 ===
                                                                      g ||
                                                                    null ===
                                                                      (g =
                                                                        g[5]) ||
                                                                    void 0 ===
                                                                      g ||
                                                                    null ===
                                                                      (g =
                                                                        g
                                                                          .item[0]) ||
                                                                    void 0 === g
                                                                      ? void 0
                                                                      : g.ID)),
                                                                  !v || !S)
                                                                ) {
                                                                  e.next = 26;
                                                                  break;
                                                                }
                                                                if (
                                                                  ((v = !1),
                                                                  (E =
                                                                    null ===
                                                                      (L = s) ||
                                                                    void 0 ===
                                                                      L ||
                                                                    null ===
                                                                      (L =
                                                                        L
                                                                          .attackerItems[5]) ||
                                                                    void 0 ===
                                                                      L ||
                                                                    null ===
                                                                      (L =
                                                                        L
                                                                          .item[0]) ||
                                                                    void 0 === L
                                                                      ? void 0
                                                                      : L.ID),
                                                                  (O =
                                                                    null ===
                                                                      (k = s) ||
                                                                    void 0 ===
                                                                      k ||
                                                                    null ===
                                                                      (k =
                                                                        k
                                                                          .defenderItems[6]) ||
                                                                    void 0 ===
                                                                      k ||
                                                                    null ===
                                                                      (k =
                                                                        k
                                                                          .item[0]) ||
                                                                    void 0 === k
                                                                      ? void 0
                                                                      : k.ID),
                                                                  (N = [
                                                                    "670",
                                                                    "348",
                                                                  ].includes(O)),
                                                                  (D = [
                                                                    "642",
                                                                    "644",
                                                                    "655",
                                                                    "670",
                                                                    "348",
                                                                  ].includes(O)),
                                                                  (j =
                                                                    "392" === E &&
                                                                    D),
                                                                  ("256" === E &&
                                                                    N) ||
                                                                    j)
                                                                ) {
                                                                  e.next = 26;
                                                                  break;
                                                                }
                                                                return e.abrupt(
                                                                  "return",
                                                                  {
                                                                    step: "attack",
                                                                    user2ID: t,
                                                                    user1EquipedItemID: 5,
                                                                  },
                                                                );
                                                              case 26:
                                                                T = !0;
                                                                do {
                                                                  (I =
                                                                    Object.keys(
                                                                      b,
                                                                    ).filter(
                                                                      function (
                                                                        t,
                                                                      ) {
                                                                        return (
                                                                          b[t] ==
                                                                          p
                                                                        );
                                                                      },
                                                                    )[0]),
                                                                    (T = i(
                                                                      {
                                                                        primary: 1,
                                                                        secondary: 2,
                                                                        melee: 3,
                                                                        temp: 5,
                                                                      }[I] || 999,
                                                                    )),
                                                                    p >= 3 &&
                                                                      (T = !0);
                                                                } while (!T);
                                                                return (
                                                                  (A =
                                                                    Object.keys(
                                                                      b,
                                                                    ).filter(
                                                                      function (
                                                                        t,
                                                                      ) {
                                                                        return (
                                                                          b[t] ==
                                                                          p
                                                                        );
                                                                      },
                                                                    )[0]),
                                                                  (_ =
                                                                    {
                                                                      primary: 1,
                                                                      secondary: 2,
                                                                      melee: 3,
                                                                      temp: 5,
                                                                    }[A] || 999),
                                                                  e.abrupt(
                                                                    "return",
                                                                    {
                                                                      step: "attack",
                                                                      user2ID: t,
                                                                      user1EquipedItemID:
                                                                        _,
                                                                    },
                                                                  )
                                                                );
                                                              case 31:
                                                              case "end":
                                                                return e.stop();
                                                            }
                                                        }, e);
                                                      }),
                                                    )).apply(this, arguments);
                                                  }),
                                                  (m = function () {
                                                    return y.apply(
                                                      this,
                                                      arguments,
                                                    );
                                                  }),
                                                  !r ||
                                                    1 !=
                                                      (null === (c = s) ||
                                                      void 0 === c ||
                                                      null ===
                                                        (c = c.defenderUser) ||
                                                      void 0 === c
                                                        ? void 0
                                                        : c.life))
                                                ) {
                                                  e.next = 4;
                                                  break;
                                                }
                                                return e.abrupt("return");
                                              case 4:
                                                if (
                                                  ((n.disabled = !0),
                                                  "end" !=
                                                    (null === (d = u) ||
                                                    void 0 === d
                                                      ? void 0
                                                      : d.currentAttackStatus))
                                                ) {
                                                  e.next = 9;
                                                  break;
                                                }
                                                return (
                                                  (n.disabled = !0),
                                                  (n.innerText =
                                                    s.endResult.info),
                                                  e.abrupt("return")
                                                );
                                              case 9:
                                                return (e.next = 11), m();
                                              case 11:
                                                return (
                                                  (g = e.sent),
                                                  (w = {
                                                    method: "POST",
                                                    headers: {
                                                      "x-requested-with":
                                                        "XMLHttpRequest",
                                                    },
                                                    body: new URLSearchParams(g),
                                                  }),
                                                  "error" in s &&
                                                    (n.innerText = s.error),
                                                  (e.next = 17),
                                                  fetch(
                                                    "https://www.torn.com/loader.php?sid=attackData&mode=json",
                                                    h({}, w),
                                                  )
                                                    .then(function (t) {
                                                      return t.json();
                                                    })
                                                    .then(function (t) {
                                                      (u = t),
                                                        (s = t.DB),
                                                        (n.disabled = !1);
                                                    })
                                                    .catch(function (t) {
                                                      return console.log(t);
                                                    })
                                                );
                                              case 17:
                                              case "end":
                                                return e.stop();
                                            }
                                        }, e);
                                      }),
                                    ),
                                  );
                                })(
                                  (0, c.be)(
                                    "nstEnhaFight",
                                    (0, c.NQ)("div", { id: "enhaFightDiv" }),
                                  ),
                                );
                              }
                            }
                          });
                        })(),
                      i.interceptLink.enabled &&
                        (0, c.d9)(function (t) {
                          if (t.detail) {
                            var e = t.detail,
                              n = e.page,
                              r = e.json,
                              o = e.fetch,
                              i = new URL(o.url).searchParams.get("step");
                            "loader" === n &&
                              "poll" === i &&
                              "currentFightStatistics" in r &&
                              Array.from(
                                document.querySelectorAll(
                                  "ul[class^='participants'] div[class^= 'playerWrap'] > span[class^= 'playername']",
                                ),
                              ).forEach(function (t) {
                                Object.values(r.currentFightStatistics).forEach(
                                  function (e) {
                                    !(function (t, e) {
                                      if (t && !t.querySelector("a")) {
                                        var n = t.innerHTML;
                                        if (e.playername == n) {
                                          var r = +e.userID;
                                          !(function (t, e) {
                                            var n = t.parentElement;
                                            if (n) {
                                              var r = n.insertAdjacentElement(
                                                "afterbegin",
                                                (0, c.NQ)("div", {
                                                  classList: "bs",
                                                  style: "margin-right: 4px;",
                                                }),
                                              );
                                              (0, u.up)(e, r);
                                            }
                                          })(t, r),
                                            (t.innerHTML = ""),
                                            t.appendChild(
                                              (0, c.NQ)("a", {
                                                classList: "nstIntercept",
                                                href: "loader.php?sid=attack&user2ID=".concat(
                                                  r,
                                                ),
                                                target: "_blank",
                                                innerText: "".concat(n),
                                              }),
                                            );
                                        }
                                      }
                                    })(t, e);
                                  },
                                );
                              });
                          }
                        }),
                      null != i &&
                        null !== (e = i.needleTimer) &&
                        void 0 !== e &&
                        e.enabled &&
                        ((n = { mela: 0, sero: 0, epi: 0, tyro: 0 }),
                        (localStorage.nstNeedleTimer = JSON.stringify(n)),
                        (0, c.d9)(function (t) {
                          if (t.detail) {
                            var e,
                              r = t.detail,
                              o = r.page,
                              i = r.json,
                              a = r.fetch,
                              c = new URL(a.url).searchParams.get("step");
                            if (
                              "loader" === o &&
                              "poll" === c &&
                              0 !=
                                (null == i ||
                                null === (e = i.DB) ||
                                void 0 === e ||
                                null === (e = e.currentTemporaryEffects) ||
                                void 0 === e
                                  ? void 0
                                  : e.length)
                            ) {
                              var u = i.DB.attackerUser.userID,
                                s = i.DB.currentTemporaryEffects[u];
                              if (!s) return;
                              var l,
                                d = ["107", "108", "106", "109"],
                                p = f(s);
                              try {
                                for (p.s(); !(l = p.n()).done; ) {
                                  var v = l.value,
                                    h = v.effectID || "",
                                    m = v.timeLeft || 0;
                                  if (!d.includes(h)) return;
                                  switch (h) {
                                    case d[0]:
                                      n.mela = m;
                                      break;
                                    case d[1]:
                                      n.sero = m;
                                      break;
                                    case d[2]:
                                      n.epi = m;
                                      break;
                                    case d[3]:
                                      n.tyro = m;
                                  }
                                }
                              } catch (t) {
                                p.e(t);
                              } finally {
                                p.f();
                              }
                              localStorage.nstNeedleTimer = JSON.stringify(n);
                            }
                          }
                        }));
                  }
                  function v(t) {
                    t &&
                      document
                        .evaluate(
                          "//button[contains(., 'Start fight')]",
                          t,
                          null,
                          XPathResult.ANY_TYPE,
                          null,
                        )
                        .iterateNext() &&
                      document.addEventListener("keydown", function (t) {
                        (116 == (t.which || t.keyCode) ||
                          ((t.ctrlKey || t.metaKey) &&
                            82 == (t.which || t.keyCode))) &&
                          t.preventDefault();
                      });
                  }
                }),
                e();
            } catch (m) {
              e(m);
            }
          });
        },
        805: function (t, e, n) {
          "use strict";
          n.d(e, {
            Cl: function () {
              return v;
            },
            NQ: function () {
              return s;
            },
            Nc: function () {
              return f;
            },
            bG: function () {
              return a;
            },
            be: function () {
              return l;
            },
            d9: function () {
              return m;
            },
            rJ: function () {
              return y;
            },
            xb: function () {
              return c;
            },
            yo: function () {
              return u;
            },
          });
          var r = n(861),
            o = n(687),
            i = n.n(o);
          function a() {
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
          function s(t, e) {
            return Object.assign(document.createElement(t), e);
          }
          function l(t, e) {
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
              var i = document.querySelector(".nstBoxHeader");
              null == i ||
                i.addEventListener("click", function () {
                  var t,
                    e = i.nextElementSibling,
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
          function d() {
            return p.apply(this, arguments);
          }
          function p() {
            return (p = (0, r.Z)(
              i().mark(function t() {
                return i().wrap(function (t) {
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
          function v() {
            return h.apply(this, arguments);
          }
          function h() {
            return (h = (0, r.Z)(
              i().mark(function t() {
                return i().wrap(function (t) {
                  for (;;)
                    switch ((t.prev = t.next)) {
                      case 0:
                        return (t.next = 2), d();
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
          function m(t) {
            window.addEventListener("nstFetch", t);
          }
          function y(t, e) {
            var n = "",
              r = t - e,
              o = Math.floor(r / 864e5),
              i = Math.floor((r % 864e5) / 36e5),
              a = Math.floor((r % 36e5) / 6e4),
              c = Math.floor((r % 6e4) / 1e3);
            return (
              o > 0 && (n += "".concat(o.toString().padStart(2, "0"), "d ")),
              i > 0 && (n += "".concat(i.toString().padStart(2, "0"), "h ")),
              a > 0 && (n += "".concat(a.toString().padStart(2, "0"), "m ")),
              c > 0 && (n += "".concat(c.toString().padStart(2, "0"), "s")),
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
                  for (var i = r.length; i--; ) {
                    var a = r[i];
                    o.querySelector(a[0]) && (a[1](), r.splice(i, 1));
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
                  up: function () {
                    return c;
                  },
                });
                var o = n(805),
                  i = await (0, o.bG)({ name: "msgReadKey", value: "nstTSspies" })
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
                  a = i
                    ? i.data
                    : { 96: { cacheUntil: 0, personalstats: {}, timestamp: 0 } };
                function c(t, e) {
                  var n;
                  if (e) {
                    var r = "",
                      i = "".concat(t),
                      c = ["N/A", "N/A", "N/A", "N/A", "N/A"];
                    if (
                      !(0, o.xb)(
                        null === (n = a[i]) || void 0 === n ? void 0 : n.spy,
                      )
                    ) {
                      (c[0] = a[i].spy.total),
                        (c[1] = a[i].spy.strength),
                        (c[2] = a[i].spy.defense),
                        (c[3] = a[i].spy.speed),
                        (c[4] = a[i].spy.dexterity);
                      var u = Date.now() / 1e3 - a[i].spy.timestamp;
                      if (u < 0) return;
                      r =
                        u > 31536e3
                          ? Math.floor(u / 31536e3) + " years ago"
                          : u > 2592e3
                            ? Math.floor(u / 2592e3) + " months ago"
                            : u > 86400
                              ? Math.floor(u / 86400) + " days ago"
                              : u > 3600
                                ? Math.floor(u / 3600) + " hours ago"
                                : u > 60
                                  ? Math.floor(u / 60) + " minutes ago"
                                  : Math.floor(u) + " seconds ago";
                    }
                    for (
                      var s = ["K", "M", "B", "T", "Q"], l = 0;
                      l < c.length;
                      l++
                    ) {
                      var f = Number.parseInt(c[l]);
                      if (!Number.isNaN(f) && 0 != f)
                        for (var d = 0; d < s.length; d++)
                          if (!((f /= 1e3) > 1e3)) {
                            (f = +f.toFixed(0 == l ? (f >= 100 ? 0 : 1) : 2)),
                              (c[l] = "".concat(f).concat(s[d]));
                            break;
                          }
                    }
                    (e.innerHTML = c[0]),
                      (e.title =
                        '\n  <div class="finally-bs-stat">\n      <b>STR</b> <span class="finally-bs-stat">'
                          .concat(
                            c[1],
                            '</span><br/>\n      <b>DEF</b> <span class="finally-bs-stat">',
                          )
                          .concat(
                            c[2],
                            '</span><br/>\n      <b>SPD</b> <span class="finally-bs-stat">',
                          )
                          .concat(
                            c[3],
                            '</span><br/>\n      <b>DEX</b> <span class="finally-bs-stat">',
                          )
                          .concat(c[4], "</span><br/>\n      ")
                          .concat(r, "\n  </div>"));
                  }
                }
                r();
              } catch (u) {
                r(u);
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
            function d(t, e, n, r) {
              var o = e && e.prototype instanceof h ? e : h,
                i = Object.create(o.prototype),
                c = new D(r || []);
              return a(i, "_invoke", { value: k(t, n, c) }), i;
            }
            function p(t, e, n) {
              try {
                return { type: "normal", arg: t.call(e, n) };
              } catch (t) {
                return { type: "throw", arg: t };
              }
            }
            e.wrap = d;
            var v = {};
            function h() {}
            function m() {}
            function y() {}
            var b = {};
            f(b, u, function () {
              return this;
            });
            var g = Object.getPrototypeOf,
              w = g && g(g(j([])));
            w && w !== n && i.call(w, u) && (b = w);
            var x = (y.prototype = h.prototype = Object.create(b));
            function S(t) {
              ["next", "throw", "return"].forEach(function (e) {
                f(t, e, function (t) {
                  return this._invoke(e, t);
                });
              });
            }
            function L(t, e) {
              function n(o, a, c, u) {
                var s = p(t[o], t, a);
                if ("throw" !== s.type) {
                  var l = s.arg,
                    f = l.value;
                  return f && "object" == r(f) && i.call(f, "__await")
                    ? e.resolve(f.__await).then(
                        function (t) {
                          n("next", t, c, u);
                        },
                        function (t) {
                          n("throw", t, c, u);
                        },
                      )
                    : e.resolve(f).then(
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
            function O(t) {
              var e = { tryLoc: t[0] };
              1 in t && (e.catchLoc = t[1]),
                2 in t && ((e.finallyLoc = t[2]), (e.afterLoc = t[3])),
                this.tryEntries.push(e);
            }
            function N(t) {
              var e = t.completion || {};
              (e.type = "normal"), delete e.arg, (t.completion = e);
            }
            function D(t) {
              (this.tryEntries = [{ tryLoc: "root" }]),
                t.forEach(O, this),
                this.reset(!0);
            }
            function j(t) {
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
              return { next: T };
            }
            function T() {
              return { value: void 0, done: !0 };
            }
            return (
              (m.prototype = y),
              a(x, "constructor", { value: y, configurable: !0 }),
              a(y, "constructor", { value: m, configurable: !0 }),
              (m.displayName = f(y, l, "GeneratorFunction")),
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
                    : ((t.__proto__ = y), f(t, l, "GeneratorFunction")),
                  (t.prototype = Object.create(x)),
                  t
                );
              }),
              (e.awrap = function (t) {
                return { __await: t };
              }),
              S(L.prototype),
              f(L.prototype, s, function () {
                return this;
              }),
              (e.AsyncIterator = L),
              (e.async = function (t, n, r, o, i) {
                void 0 === i && (i = Promise);
                var a = new L(d(t, n, r, o), i);
                return e.isGeneratorFunction(n)
                  ? a
                  : a.next().then(function (t) {
                      return t.done ? t.value : a.next();
                    });
              }),
              S(x),
              f(x, l, "Generator"),
              f(x, u, function () {
                return this;
              }),
              f(x, "toString", function () {
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
              (D.prototype = {
                constructor: D,
                reset: function (t) {
                  if (
                    ((this.prev = 0),
                    (this.next = 0),
                    (this.sent = this._sent = void 0),
                    (this.done = !1),
                    (this.delegate = null),
                    (this.method = "next"),
                    (this.arg = void 0),
                    this.tryEntries.forEach(N),
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
                      return this.complete(n.completion, n.afterLoc), N(n), v;
                  }
                },
                catch: function (t) {
                  for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                    var n = this.tryEntries[e];
                    if (n.tryLoc === t) {
                      var r = n.completion;
                      if ("throw" === r.type) {
                        var o = r.arg;
                        N(n);
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
        861: function (t, e, n) {
          "use strict";
          function r(t, e, n, r, o, i, a) {
            try {
              var c = t[i](a),
                u = c.value;
            } catch (t) {
              return void n(t);
            }
            c.done ? e(u) : Promise.resolve(u).then(r, o);
          }
          function o(t) {
            return function () {
              var e = this,
                n = arguments;
              return new Promise(function (o, i) {
                var a = t.apply(e, n);
                function c(t) {
                  r(a, o, i, c, u, "next", t);
                }
                function u(t) {
                  r(a, o, i, c, u, "throw", t);
                }
                c(void 0);
              });
            };
          }
          n.d(e, {
            Z: function () {
              return o;
            },
          });
        },
        942: function (t, e, n) {
          "use strict";
          n.d(e, {
            Z: function () {
              return o;
            },
          });
          var r = n(343);
          function o(t, e, n) {
            return (
              (e = (0, r.Z)(e)) in t
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
        },
        512: function (t, e, n) {
          "use strict";
          n.d(e, {
            Z: function () {
              return o;
            },
          });
          var r = n(2);
          function o(t, e) {
            if ("object" !== (0, r.Z)(t) || null === t) return t;
            var n = t[Symbol.toPrimitive];
            if (void 0 !== n) {
              var o = n.call(t, e || "default");
              if ("object" !== (0, r.Z)(o)) return o;
              throw new TypeError("@@toPrimitive must return a primitive value.");
            }
            return ("string" === e ? String : Number)(t);
          }
        },
        343: function (t, e, n) {
          "use strict";
          n.d(e, {
            Z: function () {
              return i;
            },
          });
          var r = n(2),
            o = n(512);
          function i(t) {
            var e = (0, o.Z)(t, "string");
            return "symbol" === (0, r.Z)(e) ? e : String(e);
          }
        },
        2: function (t, e, n) {
          "use strict";
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
          n.d(e, {
            Z: function () {
              return r;
            },
          });
        },
      },
      i = {};
    function a(t) {
      var e = i[t];
      if (void 0 !== e) return e.exports;
      var n = (i[t] = { exports: {} });
      return o[t](n, n.exports, a), n.exports;
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
      (a.a = function (o, i, a) {
        var c;
        a && ((c = []).d = -1);
        var u,
          s,
          l,
          f = new Set(),
          d = o.exports,
          p = new Promise(function (t, e) {
            (l = e), (s = t);
          });
        (p[e] = d),
          (p[t] = function (t) {
            c && t(c), f.forEach(t), p.catch(function () {});
          }),
          (o.exports = p),
          i(
            function (o) {
              var i;
              u = (function (o) {
                return o.map(function (o) {
                  if (null !== o && "object" == typeof o) {
                    if (o[t]) return o;
                    if (o.then) {
                      var i = [];
                      (i.d = 0),
                        o.then(
                          function (t) {
                            (a[e] = t), r(i);
                          },
                          function (t) {
                            (a[n] = t), r(i);
                          },
                        );
                      var a = {};
                      return (
                        (a[t] = function (t) {
                          t(i);
                        }),
                        a
                      );
                    }
                  }
                  var c = {};
                  return (c[t] = function () {}), (c[e] = o), c;
                });
              })(o);
              var a = function () {
                  return u.map(function (t) {
                    if (t[n]) throw t[n];
                    return t[e];
                  });
                },
                s = new Promise(function (e) {
                  (i = function () {
                    e(a);
                  }).r = 0;
                  var n = function (t) {
                    t !== c &&
                      !f.has(t) &&
                      (f.add(t), t && !t.d && (i.r++, t.push(i)));
                  };
                  u.map(function (e) {
                    e[t](n);
                  });
                });
              return i.r ? s : a();
            },
            function (t) {
              t ? l((p[n] = t)) : s(d), r(c);
            },
          ),
          c && c.d < 0 && (c.d = 0);
      }),
      (a.n = function (t) {
        var e =
          t && t.__esModule
            ? function () {
                return t.default;
              }
            : function () {
                return t;
              };
        return a.d(e, { a: e }), e;
      }),
      (a.d = function (t, e) {
        for (var n in e)
          a.o(e, n) &&
            !a.o(t, n) &&
            Object.defineProperty(t, n, { enumerable: !0, get: e[n] });
      }),
      (a.o = function (t, e) {
        return Object.prototype.hasOwnProperty.call(t, e);
      }),
      a(503);
  })();
  