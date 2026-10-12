!(function () {
    var t,
      e,
      n,
      r,
      o = {
        254: function (t, e, n) {
          "use strict";
          n.a(t, async function (t, e) {
            try {
              var r = n(785),
                o = n(942),
                a = n(861),
                i = n(687),
                c = n.n(i),
                l = n(805),
                s = n(579),
                u = n(375),
                d = t([s]);
              function f(t, e) {
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
              function p(t) {
                for (var e = 1; e < arguments.length; e++) {
                  var n = null != arguments[e] ? arguments[e] : {};
                  e % 2
                    ? f(Object(n), !0).forEach(function (e) {
                        (0, o.Z)(t, e, n[e]);
                      })
                    : Object.getOwnPropertyDescriptors
                      ? Object.defineProperties(
                          t,
                          Object.getOwnPropertyDescriptors(n),
                        )
                      : f(Object(n)).forEach(function (e) {
                          Object.defineProperty(
                            t,
                            e,
                            Object.getOwnPropertyDescriptor(n, e),
                          );
                        });
                }
                return t;
              }
              function m() {
                var t = 1;
                function e() {
                  if (!document.getElementById("nstQuickFaction")) {
                    (0, l.Nc)(
                      document.getElementById("faction-armoury-tabs"),
                      "beforeBegin",
                      "faction quick items",
                    );
                    var t = document.querySelector(".nstBoxContent");
                    t &&
                      ((t.style.display =
                        localStorage.nstQuickFactionFolded || ""),
                      t.appendChild(
                        (0, l.NQ)("div", {
                          id: "nstQuickFaction",
                          classList: "nstRow",
                        }),
                      ),
                      t.appendChild(
                        (0, l.NQ)("div", {
                          id: "nstItemResponse",
                          classList: "nstRow action-wrap use-act use-action",
                          style: "display: none;",
                        }),
                      ),
                      n());
                  }
                }
                function n() {
                  (0, l.bG)({ name: "msgReadKey", value: "nstQuickFaction" })
                    .then(function (e) {
                      if (
                        !Array.isArray(e) &&
                        null != e &&
                        e.status &&
                        !(0, l.xb)(null == e ? void 0 : e.data)
                      ) {
                        var o = null == e ? void 0 : e.data;
                        if (!o) return;
                        var a = document.getElementById("nstQuickFaction");
                        if (!a) return;
                        for (; a.lastChild; ) a.removeChild(a.lastChild);
                        for (
                          var i = 0, c = 0, s = Object.values(o);
                          c < s.length;
                          c++
                        ) {
                          var u = s[c],
                            d =
                              '\n              <div id="nstButton" class="nstButton" data-itemID="'
                                .concat(u.id, '" style="order: ')
                                .concat(
                                  u.order,
                                  '">\n                <button id="nstQuickUse">\n                  <img src="/images/items/',
                                )
                                .concat(u.id, '/medium.png" alt="')
                                .concat(
                                  u.name,
                                  '">\n                  <span id="nstQuickName">',
                                )
                                .concat(
                                  u.name,
                                  '</span>\n                  <span id="nstQuickClose"></span>\n                </button>\n              </div>',
                                );
                          i++, a.insertAdjacentHTML("afterBegin", d);
                          var f = a.querySelector("#nstQuickClose");
                          if (f) {
                            f.addEventListener("click", function (t) {
                              var e;
                              t.stopPropagation(), t.preventDefault();
                              var r = t.target,
                                o =
                                  null == r ||
                                  null === (e = r.parentElement) ||
                                  void 0 === e
                                    ? void 0
                                    : e.parentElement;
                              if (o) {
                                var a = o.getAttribute("data-itemID");
                                (0, l.bG)({
                                  name: "msgDeleteQuick",
                                  value: "nstQuickFaction",
                                  obj: { id: a },
                                })
                                  .then(function () {
                                    return n();
                                  })
                                  .catch(function (t) {
                                    return (0, l.yo)({
                                      status: !1,
                                      fromWhere: "loadQuickFaction",
                                      message: "error deleting item",
                                      data: t,
                                    });
                                  });
                              }
                            });
                            var p = a.querySelector("#nstQuickUse");
                            if (!p) return;
                            p.addEventListener("click", function (t) {
                              t.stopPropagation();
                              var e,
                                n = t.target,
                                o = null == n ? void 0 : n.parentElement;
                              if (
                                o &&
                                o.parentElement &&
                                (e =
                                  "button" === n.tagName.toLowerCase()
                                    ? o.getAttribute("data-itemID")
                                    : o.parentElement.getAttribute("data-itemID"))
                              ) {
                                r(e);
                                var a =
                                  document.getElementById("nstItemResponse");
                                a && (a.style.display = "");
                              }
                            });
                          }
                        }
                        (t = i), t++;
                      }
                    })
                    .catch(function (t) {
                      (0, l.yo)({
                        status: !1,
                        fromWhere: "loadQuickFaction",
                        message: "error reading quick items",
                        data: t,
                      });
                    });
                }
                function r(t) {
                  return i.apply(this, arguments);
                }
                function i() {
                  return (i = (0, a.Z)(
                    c().mark(function t(e) {
                      var n;
                      return c().wrap(function (t) {
                        for (;;)
                          switch ((t.prev = t.next)) {
                            case 0:
                              return (
                                (n = {
                                  method: "POST",
                                  headers: {
                                    "x-requested-with": "XMLHttpRequest",
                                  },
                                  body: new URLSearchParams({
                                    step: "useItem",
                                    itemID: e,
                                    fac: "1",
                                  }),
                                }),
                                (t.next = 4),
                                fetch("https://www.torn.com/item.php", p({}, n))
                                  .then(function (t) {
                                    return t.json();
                                  })
                                  .then(function (t) {
                                    var e =
                                      document.getElementById("nstItemResponse");
                                    if (e) {
                                      for (; e.lastChild; )
                                        e.removeChild(e.lastChild);
                                      if (t.success) {
                                        var n = t.links,
                                          r = t.text,
                                          o =
                                            '<p><a class="close-act t-blue h">Close</a>';
                                        if (n)
                                          for (
                                            var a = 0, i = Object.values(n);
                                            a < i.length;
                                            a++
                                          ) {
                                            var c = i[a];
                                            o += '<a class="t-blue h m-left10 '
                                              .concat(
                                                c.class,
                                                '"\n            href="',
                                              )
                                              .concat(c.url, '" ')
                                              .concat(c.attr, ">")
                                              .concat(c.title, "</a>");
                                          }
                                        o += "</p>";
                                        var l = "<div><p>"
                                          .concat(r, "</p>")
                                          .concat(o, "</div>");
                                        e.insertAdjacentHTML("afterbegin", l);
                                        var s = e.querySelector(".counter-wrap");
                                        if (s) {
                                          var u = 864e5,
                                            d = 36e5,
                                            f =
                                              1e3 *
                                              +(s.getAttribute("data-time") || 0),
                                            p = Math.floor(f / u),
                                            m = Math.floor((f % u) / d) + 24 * p,
                                            y = Math.floor((f % d) / 6e4),
                                            h = Math.floor((f % 6e4) / 1e3);
                                          s.innerText = ""
                                            .concat(m, ":")
                                            .concat(y, ":")
                                            .concat(h);
                                        }
                                        var v = document.querySelector(
                                          "#nstItemResponse .close-act",
                                        );
                                        if (!v) return;
                                        v.addEventListener("click", function (t) {
                                          t.target.style.display = "none";
                                        });
                                      }
                                    }
                                  })
                                  .catch(function (t) {
                                    (0, l.yo)({
                                      status: !1,
                                      fromWhere: "useItemRequest",
                                      message: "some error",
                                      data: t,
                                    });
                                  })
                              );
                            case 4:
                            case "end":
                              return t.stop();
                          }
                      }, t);
                    }),
                  )).apply(this, arguments);
                }
                document.head.appendChild(
                  (0, l.NQ)("style", {
                    innerText:
                      "\n      .d .armoury-medical-wrap .item-list .item-action .give,\n      .d .armoury-medical-wrap .item-list .item-action .use {\n        width: 100px !important;\n      }\n\n      ul.item-list > li:not(.item-use-act) {\n        display: flex;\n        justify-content: center;\n        align-items: center;\n        flex-direction: row;\n      }",
                  }),
                ),
                  new MutationObserver(function (r) {
                    r.forEach(function (r) {
                      for (
                        var a = 0, i = Array.from(r.addedNodes);
                        a < i.length;
                        a++
                      ) {
                        var c,
                          s = i[a];
                        "faction-armoury-tabs" === s.id && e(),
                          null != s &&
                            null !== (c = s.parentElement) &&
                            void 0 !== c &&
                            null !== (c = c.id) &&
                            void 0 !== c &&
                            c.match(/armoury-(medical|drugs|boosters)/) &&
                            "UL" === s.tagName &&
                            s.classList.contains("item-list") &&
                            Array.from(s.children).forEach(function (e) {
                              if (!e.querySelector(".nstAddQuickFaction")) {
                                var r = e.querySelector(".use-cont");
                                if (r) {
                                  var a = r.getAttribute("data-itemid"),
                                    i = e
                                      .querySelector(".name")
                                      .innerText.replace(/ x\d+$/, "")
                                      .replace(/[ ]*Blood Bag[ :]*/, "")
                                      .replace(/[ ]*Bottle of[ :]*/, "")
                                      .replace(/[ ]*First Aid[ :]*/, "")
                                      .replace(
                                        /[ ]*Lawyer Business Card[ :]*/,
                                        "LBC",
                                      )
                                      .replace(/[ ]*Can of[ :]*/, ""),
                                    c =
                                      '\n        <div class="nstAddQuickFaction" data-itemname="'
                                        .concat(i, '" data-itemid="')
                                        .concat(
                                          a,
                                          '" title="Add to Quick Items">\n        <button aria-label="Add ',
                                        )
                                        .concat(
                                          i,
                                          ' to Quick Items" class="option-equip wai-btn quickItemButton"></button>\n        </div>',
                                        );
                                  e.insertAdjacentHTML("beforeend", c);
                                  var s = e.querySelector(".nstAddQuickFaction");
                                  s &&
                                    s.addEventListener("click", function (e) {
                                      e.stopPropagation(), e.preventDefault();
                                      var r = e.target.parentElement;
                                      if (null != r && r.parentElement) {
                                        var a = r.getAttribute("data-itemname"),
                                          i = r.getAttribute("data-itemid");
                                        if (
                                          i &&
                                          null ==
                                            document.querySelector(
                                              '#nstQuickFaction div[data-itemID="'.concat(
                                                i,
                                                '"]',
                                              ),
                                            )
                                        ) {
                                          var c = (0, o.Z)({}, i, {
                                            id: i,
                                            name: a,
                                            order: t,
                                          });
                                          (0, l.bG)({
                                            name: "msgUpdateKey",
                                            value: "nstQuickFaction",
                                            obj: c,
                                          })
                                            .then(function () {
                                              return n();
                                            })
                                            .catch(function (t) {
                                              return (0, l.yo)({
                                                status: !1,
                                                fromWhere:
                                                  "quickfaction - add listener",
                                                message: "error merging items",
                                                data: t,
                                              });
                                            });
                                        }
                                      }
                                    });
                                }
                              }
                            });
                      }
                    });
                  }).observe(document.documentElement, {
                    childList: !0,
                    subtree: !0,
                  });
              }
              function y() {
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
                t && e(t),
                  new MutationObserver(function (t) {
                    t.forEach(function (t) {
                      for (
                        var n = 0, r = Array.from(t.addedNodes);
                        n < r.length;
                        n++
                      ) {
                        var o = r[n],
                          a =
                            o.querySelector &&
                            o.querySelector(
                              ".deposit-box .input-money-symbol, .deposit .input-money-symbol, .donate .input-money-symbol",
                            );
                        a && e(a);
                      }
                    });
                  }).observe(document.body, { childList: !0, subtree: !0 });
              }
              function h() {
                function t() {
                  var t = document.querySelector("#faction-main .announcement");
                  t &&
                    (t.style.display = "none" == t.style.display ? "" : "none");
                }
                document.head.appendChild(
                  (0, l.NQ)("style", {
                    innerText:
                      "\n      .faction-title,\n      .faction-description {\n        display: none !important;\n      }",
                  }),
                );
                var e = "#faction-main [data-title^=announcement]";
                (0, u.b)(e, function () {
                  var n = document.querySelector(e);
                  n && n.addEventListener("click", t);
                });
                var n = document.querySelector("#factions");
                n &&
                  new MutationObserver(function (n) {
                    n.forEach(function (n) {
                      var r = n.target;
                      r.id.includes("faction-main") &&
                        r.querySelector &&
                        r.querySelector(e) &&
                        (0, u.b)(e, function () {
                          var n = r.querySelector(e);
                          n && n.addEventListener("click", t);
                        });
                    });
                  }).observe(n, { childList: !0, subtree: !0 });
              }
              function v() {
                if (
                  "listing" !==
                  new URLSearchParams(window.location.search).get("step")
                ) {
                  document.head.appendChild(
                    (0, l.NQ)("style", {
                      innerText:
                        "\n      @media screen and (max-width: 1000px) {\n        .members-cont .bs {\n          display: none;\n        }\n      }\n\n      .d .faction-info-wrap.restyle .status{\n        width: 12% !important;\n      }\n\n      .members-cont .level {\n        width: 27px !important;\n      }\n\n      .members-cont .id {\n        padding-left: 5px !important;\n        width: 27px !important;\n      }\n\n      .members-cont .points {\n        width: 42px !important;\n      }\n\n      .raid-members-list .level:not(.bs) {\n        width: 16px !important;\n      }\n\n      div.desc-wrap:not([class*='warDesc']) .finally-bs-swap {\n        display: none;\n      }",
                    }),
                  );
                  var t,
                    e = 0,
                    n = parseInt(localStorage.getItem("nstWallSort") || "") || 1,
                    o = [],
                    i = [],
                    d = {},
                    f = [],
                    m = !1,
                    y = 0;
                  !(function t() {
                    for (var e = 0, n = f.length; e < n; e++) {
                      var r = f[e],
                        o = r[0],
                        a = r[1];
                      if (a && d[o]) {
                        var i = d[o] - new Date().getTime() / 1e3;
                        if (
                          i &&
                          !(i <= 0) &&
                          !(
                            (i >= 600 && y % 10 != 0) ||
                            (i < 600 && i >= 300 && y % 5 != 0)
                          )
                        ) {
                          var c = Math.floor(i / 3600);
                          i %= 3600;
                          var l = Math.floor(i / 60),
                            s = Math.floor(i % 60);
                          (a.querySelector(".not-ok") || a).textContent =
                            "\n      "
                              .concat(c.toString().padStart(2, "0"), ":\n      ")
                              .concat(l.toString().padStart(2, "0"), ":\n      ")
                              .concat(s.toString().padStart(2, "0"));
                        }
                      }
                    }
                    f.length > 0 && y++, setTimeout(t, 1e3);
                  })(),
                    (0, u.b)(".f-war-list.war-new", k),
                    L(document.querySelector(".members-list")),
                    I(document.querySelector(".f-war-list")),
                    setInterval(x, 2e3),
                    new MutationObserver(function (t) {
                      t.forEach(function (t) {
                        for (
                          var e = 0, n = Array.from(t.addedNodes);
                          e < n.length;
                          e++
                        ) {
                          var r = n[e];
                          L(r.querySelector && r.querySelector(".members-list")),
                            I(r.querySelector && r.querySelector(".f-war-list"));
                        }
                      });
                    }).observe(document.body, { childList: !0, subtree: !0 }),
                    (0, l.d9)(function (e) {
                      if (e.detail) {
                        var n = e.detail,
                          r = n.page,
                          o = n.json,
                          a = n.fetch,
                          i = new URL(a.url).searchParams,
                          c = i.get("step");
                        if (
                          r.includes("faction_wars") &&
                          null != c &&
                          c.includes("getwarusers")
                        ) {
                          t = i.get("warID");
                          var l = null;
                          if (o.warDesc) l = o.warDesc.members;
                          else {
                            if (!o.userStatuses) return;
                            l = o.userStatuses;
                          }
                          Object.keys(l).forEach(function (t) {
                            var e = l[t].status || l[t];
                            (t = l[t].userID || t),
                              "Hospital" == e.text
                                ? (d[t] = e.updateAt)
                                : delete d[t];
                          }),
                            x();
                        }
                      }
                    });
                }
                function h() {
                  return (h = (0, a.Z)(
                    c().mark(function e(n) {
                      var o, a, i, s, u, d;
                      return c().wrap(function (e) {
                        for (;;)
                          switch ((e.prev = e.next)) {
                            case 0:
                              if (document.querySelector(".members-cont")) {
                                e.next = 3;
                                break;
                              }
                              return (
                                (n.innerText = "Wall not available"),
                                e.abrupt("return")
                              );
                            case 3:
                              if (
                                0 !=
                                (o = document.querySelectorAll(
                                  ".faction-war .members-list > li.join",
                                )).length
                              ) {
                                e.next = 7;
                                break;
                              }
                              return (
                                (n.innerText = "Wall is Full"), e.abrupt("return")
                              );
                            case 7:
                              if (
                                ((a = Math.floor(Math.random() * o.length)),
                                (i = o[a]),
                                (s = i.parentElement))
                              ) {
                                e.next = 12;
                                break;
                              }
                              return e.abrupt("return");
                            case 12:
                              return (
                                (u = (0, r.Z)(Array.from(s.children)).indexOf(i)),
                                (d = {
                                  method: "POST",
                                  headers: {
                                    "x-requested-with": "XMLHttpRequest",
                                  },
                                  body: new URLSearchParams({
                                    warID: t,
                                    index: u,
                                  }),
                                }),
                                (e.next = 17),
                                fetch(
                                  "https://www.torn.com/faction_wars.php?redirect=false&step=joinwar&factionID=0",
                                  p({}, d),
                                )
                                  .then(function (t) {
                                    return t.json();
                                  })
                                  .then(function (t) {
                                    t.error && console.log(t.error),
                                      0 == t.success && (n.innerText = t.msg),
                                      1 == t.success &&
                                        (n.innerText = "Wall Joined");
                                  })
                                  .catch(function (t) {
                                    (0, l.yo)({
                                      status: !1,
                                      fromWhere: "joinWall",
                                      message: "some error",
                                      data: t,
                                    });
                                  })
                              );
                            case 17:
                            case "end":
                              return e.stop();
                          }
                      }, e);
                    }),
                  )).apply(this, arguments);
                }
                function v(t, e) {
                  if (
                    (t ||
                      (t = document.querySelector(".f-war-list .members-list")),
                    t)
                  ) {
                    var n = t.parentNode.querySelector(
                      ".bs > [class*='sortIcon']",
                    );
                    if (
                      (e
                        ? (t.finallySort = e)
                        : null == t.finallySort
                          ? (t.finallySort = 2)
                          : ++t.finallySort > 2 && (t.finallySort = n ? 1 : 0),
                      n)
                    )
                      if (t.finallySort > 0) {
                        var r = t.parentNode.querySelector(
                          "[class*='activeIcon']:not([class*='finally-bs-activeIcon'])",
                        );
                        if (r) {
                          var o = r.className.match(
                            /(?:\s|^)(activeIcon(?:[^\s|$]+))(?:\s|$)/,
                          )[1];
                          r.classList.remove(o);
                        }
                        n.classList.add("finally-bs-activeIcon"),
                          1 == t.finallySort
                            ? (n.classList.remove("finally-bs-desc"),
                              n.classList.add("finally-bs-asc"))
                            : (n.classList.remove("finally-bs-asc"),
                              n.classList.add("finally-bs-desc"));
                      } else n.classList.remove("finally-bs-activeIcon");
                    for (
                      var a = Array.from(
                          t.querySelectorAll(
                            ".table-body > .table-row, .your:not(.row-animation-new), .enemy:not(.row-animation-new)",
                          ),
                        ),
                        i = 0;
                      i < a.length;
                      i++
                    )
                      null == a[i].finallyPos && (a[i].finallyPos = i);
                    a = a.sort(function (e, n) {
                      var r,
                        o,
                        a,
                        i,
                        c,
                        l,
                        u = e.finallyPos,
                        d = e
                          .querySelector('a[href*="XID"]')
                          .href.replace(/.*?XID=(\d+)/i, "$1"),
                        f =
                          ((null === (r = s.o0[d]) || void 0 === r
                            ? void 0
                            : r.spy) &&
                            "number" ==
                              typeof (null === (o = s.o0[d]) || void 0 === o
                                ? void 0
                                : o.spy.total) &&
                            (null === (a = s.o0[d]) || void 0 === a
                              ? void 0
                              : a.spy.total)) ||
                          u,
                        p = n.finallyPos,
                        m = n
                          .querySelector('a[href*="XID"]')
                          .href.replace(/.*?XID=(\d+)/i, "$1"),
                        y =
                          ((null === (i = s.o0[m]) || void 0 === i
                            ? void 0
                            : i.spy) &&
                            "number" ==
                              typeof (null === (c = s.o0[m]) || void 0 === c
                                ? void 0
                                : c.spy.total) &&
                            (null === (l = s.o0[m]) || void 0 === l
                              ? void 0
                              : l.spy.total)) ||
                          p;
                      switch (t.finallySort) {
                        case 1:
                          return f <= 100 && y <= 100
                            ? y > f
                              ? 1
                              : -1
                            : f > y
                              ? 1
                              : -1;
                        case 2:
                          return y > f ? 1 : -1;
                        default:
                          return u > p ? 1 : -1;
                      }
                    });
                    for (var c = 0; c < a.length; c++)
                      a[c].parentNode.appendChild(a[c]);
                    e ||
                      document
                        .querySelectorAll(".members-list")
                        .forEach(function (e) {
                          t != e && v(e, t.finallySort);
                        });
                  }
                }
                function b(t) {
                  return g.apply(this, arguments);
                }
                function g() {
                  return (g = (0, a.Z)(
                    c().mark(function t(e) {
                      var n;
                      return c().wrap(function (t) {
                        for (;;)
                          switch ((t.prev = t.next)) {
                            case 0:
                              if (!m) {
                                t.next = 3;
                                break;
                              }
                              return (
                                e &&
                                  -1 === i.indexOf(e) &&
                                  -1 === o.indexOf(e) &&
                                  o.push(e),
                                t.abrupt("return")
                              );
                            case 3:
                              if (e || 0 != o.length) {
                                t.next = 6;
                                break;
                              }
                              return x(), t.abrupt("return");
                            case 6:
                              return (
                                (m = !0),
                                (e = e || o.shift()),
                                i.push(e),
                                (t.next = 11),
                                (0, l.Xo)(e)
                              );
                            case 11:
                              (n = t.sent) && (0, s.yQ)(n), (m = !1), b();
                            case 14:
                            case "end":
                              return t.stop();
                          }
                      }, t);
                    }),
                  )).apply(this, arguments);
                }
                function S() {
                  return (
                    "your" ===
                      new URLSearchParams(window.location.search).get("step") &&
                    !window.location.hash.includes("war")
                  );
                }
                function w(t) {
                  if (!S() && t) {
                    var e = t
                        .querySelector('a[href*="XID"]')
                        .href.replace(/.*?XID=(\d+)/i, "$1"),
                      n = t.querySelector(".bs") || document.createElement("div"),
                      r = t.querySelector(".status");
                    if (
                      ((0, s.up)(e, n),
                      (function (t, e) {
                        var n,
                          r,
                          o = "",
                          a = +(localStorage.getItem("nstWallFilterFrom") || ""),
                          i = +(localStorage.getItem("nstWallFilterTo") || ""),
                          c =
                            "true" === localStorage.getItem("nstWallFilterHosp"),
                          l =
                            "true" === localStorage.getItem("nstWallFilterWall"),
                          u =
                            "true" ===
                            localStorage.getItem("nstWallFilterWallOn"),
                          d =
                            "true" ===
                            localStorage.getItem("nstWallFilterOffline"),
                          f =
                            "true" === localStorage.getItem("nstWallFilterIdle"),
                          p =
                            e.querySelector(".status .not-ok") ||
                            e.querySelector(".status.not-ok");
                        if (
                          (a &&
                            (null === (n = s.o0[t]) ||
                            void 0 === n ||
                            null === (n = n.spy) ||
                            void 0 === n
                              ? void 0
                              : n.total) <= a &&
                            (o = "none"),
                          i &&
                            (null === (r = s.o0[t]) ||
                            void 0 === r ||
                            null === (r = r.spy) ||
                            void 0 === r
                              ? void 0
                              : r.total) >= i &&
                            (o = "none"),
                          c && p && (o = "none"),
                          e.classList.contains("table-row"))
                        ) {
                          var m = e.querySelector(".member-icons ul"),
                            y = e.querySelector("[class*=userStatusWrap]"),
                            h = e.querySelector("[class*=userStatusWrap]"),
                            v =
                              null == m
                                ? void 0
                                : m.innerHTML.includes("Territory War"),
                            b = null == y ? void 0 : y.id.includes("offline"),
                            g = null == h ? void 0 : h.id.includes("idle");
                          l && !v && (o = "none"),
                            u && v && (o = "none"),
                            d && b && (o = "none"),
                            f && g && (o = "none");
                        }
                        e.style.display = o;
                      })(e, t),
                      (function (t, e) {
                        e &&
                          (f.find(function (e) {
                            return e[0] == t;
                          }) ||
                            f.push([t, e]));
                      })(e, r),
                      !n.classList.contains("bs"))
                    ) {
                      n.className =
                        "table-cell bs level lvl left iconShow finally-bs-col";
                      var o = t.querySelector(
                          ".user-icons, .member-icons, .points",
                        ),
                        a = null == o ? void 0 : o.parentNode;
                      if (a) {
                        a.insertBefore(n, o);
                        var i = !1;
                        n.addEventListener("touchstart", function () {
                          return (i = !0);
                        }),
                          n.addEventListener("click", function () {
                            i ||
                              window.open(
                                "loader.php?sid=attack&user2ID=".concat(e),
                                "_newtab",
                              );
                          }),
                          n.addEventListener("dblclick", function () {
                            window.open(
                              "loader.php?sid=attack&user2ID=".concat(e),
                              "_newtab",
                            );
                          });
                      }
                    }
                  }
                }
                function x(t) {
                  t ||
                    (t = Array.from(
                      document.querySelectorAll(
                        ".f-war-list .members-list, .members-list",
                      ),
                    )),
                    t &&
                      (t instanceof Array || (t = [t]),
                      t.forEach(function (t) {
                        t.querySelectorAll(
                          ".your:not(.row-animation-new), .enemy:not(.row-animation-new), .table-body > .table-row",
                        ).forEach(function (t) {
                          return w(t);
                        });
                      }),
                      (function () {
                        var t,
                          n =
                            null ===
                              (t = document.querySelector(
                                ".f-war-list.members-list .table-body",
                              )) || void 0 === t
                              ? void 0
                              : t.children;
                        if (n) {
                          var r = Array.from(n);
                          (e = 0),
                            r.forEach(function (t) {
                              "none" != t.style.display && e++;
                            });
                          var o = document.getElementById("nstCounterSpan");
                          o && (o.innerText = "".concat(e));
                        }
                      })());
                }
                function L(t) {
                  if (!S() && t) {
                    var e = t.querySelector(".table-header");
                    if (e && !e.querySelector(".bs")) {
                      var r = document.createElement("li");
                      (r.className =
                        "table-cell bs torn-divider divider-vertical"),
                        (r.innerHTML = "BS"),
                        e.insertBefore(r, e.querySelector(".member-icons"));
                      for (
                        var o = function (t) {
                            e.children[t].addEventListener("click", function (e) {
                              var n = t + 1;
                              (n = e.target.querySelector("[class*='asc']")
                                ? -n
                                : n),
                                localStorage.setItem("nstWallSort", "".concat(n));
                            });
                          },
                          a = 0;
                        a < e.children.length;
                        a++
                      )
                        o(a);
                      r.addEventListener("click", function () {
                        v(t);
                      }),
                        n >= 0
                          ? (e.children[n - 1].click(), e.children[n - 1].click())
                          : n < 0 && e.children[-n - 1].click(),
                        t
                          .querySelectorAll(".table-body > .table-row")
                          .forEach(function (t) {
                            return w(t);
                          });
                    }
                  }
                }
                function k() {
                  if (
                    !S() &&
                    !document.querySelector("#nstWallBS") &&
                    document.querySelector(".f-war-list.war-new")
                  ) {
                    (0, l.Nc)(
                      document.querySelector(".f-war-list.war-new"),
                      "beforebegin",
                      "Wall Filters",
                    );
                    var t = document.querySelector(".nstBoxContent");
                    if (t) {
                      (t.style.display = localStorage.nstWallBSFolded || ""),
                        t.insertAdjacentElement(
                          "afterBegin",
                          (0, l.NQ)("div", {
                            id: "nstWallBS",
                            classList: "nstRow",
                          }),
                        );
                      var e = (0, l.be)(
                          "nstWallBS",
                          (0, l.NQ)("div", {
                            id: "nstBSDiv",
                            classList:
                              "nstBSFilter input-money-group no-max-value",
                          }),
                        ),
                        n = e.appendChild(
                          (0, l.NQ)("input", {
                            id: "nstFilterFromInput",
                            classList: "input-money",
                            placeholder: "Filter BS from",
                            value:
                              localStorage.getItem("nstWallFilterFrom") || "",
                          }),
                        );
                      (0, l.Bb)(n);
                      var r = e.appendChild(
                        (0, l.NQ)("input", {
                          id: "nstFilterToInput",
                          classList: "input-money",
                          placeholder: "Filter BS to",
                          value: localStorage.getItem("nstWallFilterTo") || "",
                        }),
                      );
                      (0, l.Bb)(r);
                      var o = (0, l.be)(
                        "nstWallBS",
                        (0, l.NQ)("div", {
                          id: "nstFilterDiv",
                          classList: "listFlex",
                        }),
                      );
                      o.appendChild((0, l.NQ)("h5", { innerText: "Hide" }));
                      var a = o.appendChild(
                          (0, l.NQ)("div", { classList: "listItem" }),
                        ),
                        i = a.appendChild(
                          (0, l.NQ)("input", {
                            id: "fNotOkay",
                            type: "checkbox",
                            value: "fNotOkay",
                            checked:
                              "true" ===
                              localStorage.getItem("nstWallFilterHosp"),
                          }),
                        );
                      a.appendChild(
                        (0, l.NQ)("label", {
                          classList: "itemLabel",
                          innerText: "not Okay",
                          htmlFor: "fNotOkay",
                        }),
                      );
                      var c = o.appendChild(
                          (0, l.NQ)("div", { classList: "listItem" }),
                        ),
                        s = c.appendChild(
                          (0, l.NQ)("input", {
                            id: "fNotWall",
                            type: "checkbox",
                            value: "fNotWall",
                            checked:
                              "true" ===
                              localStorage.getItem("nstWallFilterWall"),
                          }),
                        );
                      c.appendChild(
                        (0, l.NQ)("label", {
                          classList: "itemLabel",
                          innerText: "not on wall",
                          htmlFor: "fNotWall",
                        }),
                      );
                      var u = c.appendChild(
                        (0, l.NQ)("input", {
                          id: "fOnWall",
                          type: "checkbox",
                          value: "fOnWall",
                          checked:
                            "true" ===
                            localStorage.getItem("nstWallFilterWallOn"),
                        }),
                      );
                      c.appendChild(
                        (0, l.NQ)("label", {
                          classList: "itemLabel",
                          innerText: "on wall",
                          htmlFor: "fOnWall",
                        }),
                      );
                      var d = o.appendChild(
                          (0, l.NQ)("div", { classList: "listItem" }),
                        ),
                        f = d.appendChild(
                          (0, l.NQ)("input", {
                            id: "fOffline",
                            type: "checkbox",
                            value: "fOffline",
                            checked:
                              "true" ===
                              localStorage.getItem("nstWallFilterOffline"),
                          }),
                        );
                      d.appendChild(
                        (0, l.NQ)("label", {
                          classList: "itemLabel",
                          innerText: "offline",
                          htmlFor: "fOffline",
                        }),
                      );
                      var p = o.appendChild(
                          (0, l.NQ)("div", { classList: "listItem" }),
                        ),
                        m = p.appendChild(
                          (0, l.NQ)("input", {
                            id: "fIdle",
                            type: "checkbox",
                            value: "fIdle",
                            checked:
                              "true" ===
                              localStorage.getItem("nstWallFilterIdle"),
                          }),
                        );
                      p.appendChild(
                        (0, l.NQ)("label", {
                          classList: "itemLabel",
                          innerText: "idle",
                          htmlFor: "fIdle",
                        }),
                      );
                      var y = (0, l.be)(
                        "nstWallBS",
                        (0, l.NQ)("div", { id: "nstCounterDiv" }),
                      );
                      y.appendChild((0, l.NQ)("h5", { innerText: "Members" })),
                        y.appendChild(
                          (0, l.NQ)("span", {
                            id: "nstCounterSpan",
                            innerText: "",
                          }),
                        );
                      var v = (0, l.be)(
                          "nstWallBS",
                          (0, l.NQ)("div", { id: "nstJoinWallDiv" }),
                        ),
                        b = v.appendChild(
                          (0, l.NQ)("button", {
                            id: "nstJoinWallBtn",
                            classList: "torn-btn",
                            innerText: "Join Wall",
                            disabled: !1,
                          }),
                        ),
                        g = v.appendChild(
                          (0, l.NQ)("span", {
                            id: "nstJoinWallSpan",
                            innerText: "",
                          }),
                        );
                      b.addEventListener("click", function () {
                        (g.innerText = ""),
                          (function (t) {
                            h.apply(this, arguments);
                          })(g);
                      }),
                        n.addEventListener("keyup", function (t) {
                          var e = t.target,
                            n = +(0, l.Bb)(e);
                          localStorage.setItem(
                            "nstWallFilterFrom",
                            "".concat(n || ""),
                          ),
                            x();
                        }),
                        r.addEventListener("keyup", function (t) {
                          var e = t.target,
                            n = +(0, l.Bb)(e);
                          localStorage.setItem(
                            "nstWallFilterTo",
                            "".concat(n || ""),
                          ),
                            x();
                        }),
                        i.addEventListener("change", function (t) {
                          var e = t.target.checked;
                          localStorage.setItem(
                            "nstWallFilterHosp",
                            "".concat(e || !1),
                          ),
                            x();
                        }),
                        s.addEventListener("change", function (t) {
                          var e = t.target.checked;
                          localStorage.setItem(
                            "nstWallFilterWall",
                            "".concat(e || !1),
                          ),
                            x();
                        }),
                        u.addEventListener("change", function (t) {
                          var e = t.target.checked;
                          localStorage.setItem(
                            "nstWallFilterWallOn",
                            "".concat(e || !1),
                          ),
                            x();
                        }),
                        f.addEventListener("change", function (t) {
                          var e = t.target.checked;
                          localStorage.setItem(
                            "nstWallFilterOffline",
                            "".concat(e || !1),
                          ),
                            x();
                        }),
                        m.addEventListener("change", function (t) {
                          var e = t.target.checked;
                          localStorage.setItem(
                            "nstWallFilterIdle",
                            "".concat(e || !1),
                          ),
                            x();
                        }),
                        x();
                    }
                  }
                }
                function E(t) {
                  var e = t.parentNode;
                  if (t && e) {
                    k(),
                      Array.from(
                        document.querySelectorAll(
                          "[href^='/factions.php?step=profile&ID']",
                        ),
                      )
                        .map(function (t) {
                          return t.href.replace(/.*?ID=(\d+)$/, "$1");
                        })
                        .filter(function (t, e, n) {
                          return n.indexOf(t) === e;
                        })
                        .filter(function (t) {
                          return !t.includes("war");
                        })
                        .forEach(function (t) {
                          return b(t);
                        });
                    var r = e.querySelector(".title, .c-pointer");
                    if (r) {
                      var o = r.querySelector(".level");
                      if (o) {
                        if (
                          ((o.childNodes[0].nodeValue = "Lv"),
                          !r.querySelector(".bs"))
                        ) {
                          var a = o.cloneNode(!0);
                          if (
                            (a.classList.add("bs"),
                            (a.childNodes[0].nodeValue = "BS"),
                            r.insertBefore(
                              a,
                              r.querySelector(".user-icons, .points"),
                            ),
                            a.childNodes.length > 1)
                          ) {
                            var i = a.childNodes[1].className.match(
                              /(?:\s|^)((?:asc|desc)(?:[^\s|$]+))(?:\s|$)/,
                            )[1];
                            a.childNodes[1].classList.remove(i);
                            for (
                              var c = function (t) {
                                  r.children[t].addEventListener(
                                    "click",
                                    function (e) {
                                      setTimeout(function () {
                                        var n = t + 1,
                                          r = e.target.querySelector(
                                            "[class*='sortIcon']",
                                          );
                                        (n =
                                          r && -1 === r.className.indexOf("desc")
                                            ? n
                                            : -n),
                                          localStorage.setItem(
                                            "nstWallSort",
                                            "".concat(n),
                                          ),
                                          e.target.classList.contains("bs") ||
                                            document
                                              .querySelectorAll(
                                                "[class*='finally-bs-activeIcon']",
                                              )
                                              .forEach(function (t) {
                                                return t.classList.remove(
                                                  "finally-bs-activeIcon",
                                                );
                                              });
                                      }, 100);
                                    },
                                  );
                                },
                                l = 0;
                              l < r.children.length;
                              l++
                            )
                              c(l);
                            a.addEventListener("click", function () {
                              v(t);
                            });
                            var s = r.children[Math.abs(n) - 1],
                              u = s.querySelector("[class*='sortIcon']"),
                              d = !!u && -1 !== u.className.indexOf("desc"),
                              f = !!u && -1 !== u.className.indexOf("activeIcon"),
                              p = 0;
                            for (
                              s.classList.contains("bs") &&
                              t.querySelector(".enemy")
                                ? (p = 0)
                                : !f && n < 0
                                  ? (p = 1)
                                  : f
                                    ? ((n < 0 && !d) || (n > 0 && d)) && (p = 1)
                                    : (p = 2);
                              p > 0;
                              p--
                            )
                              s.click();
                          }
                        }
                        x(t);
                        var m = "",
                          y = new MutationObserver(function (n) {
                            n.forEach(function (t) {
                              for (
                                var e = 0, n = Array.from(t.addedNodes);
                                e < n.length;
                                e++
                              ) {
                                var r = n[e];
                                r.classList &&
                                  (r.classList.contains("your") ||
                                    r.classList.contains("enemy")) &&
                                  w(r);
                              }
                            });
                            var r = Array.from(
                              t.querySelectorAll('a[href*="XID"]'),
                            )
                              .map(function (t) {
                                return t.href;
                              })
                              .join(",");
                            m != r &&
                              e.querySelector(".finally-bs-activeIcon") &&
                              (y.disconnect(),
                              v(t, t.finallySort),
                              (m = Array.from(
                                t.querySelectorAll('a[href*="XID"]'),
                              )
                                .map(function (t) {
                                  return t.href;
                                })
                                .join(",")),
                              y.takeRecords(),
                              y.observe(t, { childList: !0, subtree: !0 }));
                          });
                        y.observe(t, { childList: !0, subtree: !0 });
                      }
                    }
                  }
                }
                function I(t) {
                  t &&
                    (t.querySelectorAll(".members-list").forEach(function (t) {
                      return E(t);
                    }),
                    new MutationObserver(function (t) {
                      t.forEach(function (t) {
                        for (
                          var e = 0, n = Array.from(t.addedNodes);
                          e < n.length;
                          e++
                        ) {
                          var r = n[e];
                          r.querySelectorAll &&
                            r.querySelectorAll(".members-list") &&
                            r
                              .querySelectorAll(".members-list")
                              .forEach(function (t) {
                                return E(t);
                              });
                        }
                      });
                    }).observe(t, { childList: !0, subtree: !0 }));
                }
              }
              (s = (d.then ? (await d)() : d)[0]),
                (0, l.Cl)().then(function (t) {
                  if (Array.isArray(t)) {
                    if (!t) return;
                    if (!Array.isArray(t)) return;
                    var e = t[0].data;
                    m(),
                      e.hideFactionDesc.enabled && h(),
                      e.ezMoneyDeposit.enabled && y(),
                      e.enhanceWar.enabled && v(),
                      null != e &&
                        e.hideWarGraph.enabled &&
                        document.head.appendChild(
                          (0, l.NQ)("style", {
                            innerText:
                              "\n      .f-war-list .descriptions .faction-war-info,\n      .f-war-list .descriptions .faction-names {\n        display: none !important;\n      }",
                          }),
                        );
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
            Bb: function () {
              return g;
            },
            Cl: function () {
              return m;
            },
            NQ: function () {
              return s;
            },
            Nc: function () {
              return d;
            },
            Xo: function () {
              return h;
            },
            bG: function () {
              return i;
            },
            be: function () {
              return u;
            },
            d9: function () {
              return b;
            },
            xb: function () {
              return c;
            },
            yo: function () {
              return l;
            },
          });
          var r = n(861),
            o = n(687),
            a = n.n(o);
          function i() {
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
          function l(t) {
            return t.status || console.log(t), t;
          }
          function s(t, e) {
            return Object.assign(document.createElement(t), e);
          }
          function u(t, e) {
            var n;
            return null === (n = document) ||
              void 0 === n ||
              null === (n = n.getElementById(t)) ||
              void 0 === n
              ? void 0
              : n.appendChild(e);
          }
          function d(t, e, n) {
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
          function f() {
            return p.apply(this, arguments);
          }
          function p() {
            return (p = (0, r.Z)(
              a().mark(function t() {
                return a().wrap(function (t) {
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
                              return l({
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
          function m() {
            return y.apply(this, arguments);
          }
          function y() {
            return (y = (0, r.Z)(
              a().mark(function t() {
                return a().wrap(function (t) {
                  for (;;)
                    switch ((t.prev = t.next)) {
                      case 0:
                        return (t.next = 2), f();
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
          function h(t) {
            return v.apply(this, arguments);
          }
          function v() {
            return (v = (0, r.Z)(
              a().mark(function t(e) {
                var n;
                return a().wrap(function (t) {
                  for (;;)
                    switch ((t.prev = t.next)) {
                      case 0:
                        if (e) {
                          t.next = 2;
                          break;
                        }
                        return t.abrupt("return");
                      case 2:
                        return (
                          (t.next = 4),
                          i({
                            name: "msgUpdateTSspy",
                            value: "nstTSspies",
                            obj: { selection: "spy/faction/".concat(e) },
                          })
                            .then(function (t) {
                              if (!Array.isArray(t) && t.data && t.data.status)
                                return t;
                            })
                            .catch(function (t) {
                              return l({
                                status: !1,
                                fromWhere: "updateFactionSpies",
                                message: "error getting TS api data",
                                data: t,
                              });
                            })
                        );
                      case 4:
                        return (
                          (n = t.sent),
                          t.abrupt("return", null == n ? void 0 : n.data)
                        );
                      case 6:
                      case "end":
                        return t.stop();
                    }
                }, t);
              }),
            )).apply(this, arguments);
          }
          function b(t) {
            window.addEventListener("nstFetch", t);
          }
          function g(t) {
            var e = t.value.toLowerCase(),
              n = e.replace(/[^\d]/g, ""),
              r = 1;
            return (
              -1 !== e.indexOf("k")
                ? (r = 1e3)
                : -1 !== e.indexOf("m")
                  ? (r = 1e6)
                  : -1 !== e.indexOf("b")
                    ? (r = 1e9)
                    : -1 !== e.indexOf("t") && (r = 1e12),
              (n *= r),
              (t.value = n > 0 ? n.toLocaleString("en-US") : ""),
              n
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
                  up: function () {
                    return l;
                  },
                  yQ: function () {
                    return c;
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
                function c(t) {
                  i = t;
                }
                function l(t, e) {
                  var n;
                  if (e) {
                    var r = "",
                      a = "".concat(t),
                      c = ["N/A", "N/A", "N/A", "N/A", "N/A"];
                    if (
                      !(0, o.xb)(
                        null === (n = i[a]) || void 0 === n ? void 0 : n.spy,
                      )
                    ) {
                      (c[0] = i[a].spy.total),
                        (c[1] = i[a].spy.strength),
                        (c[2] = i[a].spy.defense),
                        (c[3] = i[a].spy.speed),
                        (c[4] = i[a].spy.dexterity);
                      var l = Date.now() / 1e3 - i[a].spy.timestamp;
                      if (l < 0) return;
                      r =
                        l > 31536e3
                          ? Math.floor(l / 31536e3) + " years ago"
                          : l > 2592e3
                            ? Math.floor(l / 2592e3) + " months ago"
                            : l > 86400
                              ? Math.floor(l / 86400) + " days ago"
                              : l > 3600
                                ? Math.floor(l / 3600) + " hours ago"
                                : l > 60
                                  ? Math.floor(l / 60) + " minutes ago"
                                  : Math.floor(l) + " seconds ago";
                    }
                    for (
                      var s = ["K", "M", "B", "T", "Q"], u = 0;
                      u < c.length;
                      u++
                    ) {
                      var d = Number.parseInt(c[u]);
                      if (!Number.isNaN(d) && 0 != d)
                        for (var f = 0; f < s.length; f++)
                          if (!((d /= 1e3) > 1e3)) {
                            (d = +d.toFixed(0 == u ? (d >= 100 ? 0 : 1) : 2)),
                              (c[u] = "".concat(d).concat(s[f]));
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
              } catch (s) {
                r(s);
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
              c = "function" == typeof Symbol ? Symbol : {},
              l = c.iterator || "@@iterator",
              s = c.asyncIterator || "@@asyncIterator",
              u = c.toStringTag || "@@toStringTag";
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
              var o = e && e.prototype instanceof y ? e : y,
                a = Object.create(o.prototype),
                c = new N(r || []);
              return i(a, "_invoke", { value: k(t, n, c) }), a;
            }
            function p(t, e, n) {
              try {
                return { type: "normal", arg: t.call(e, n) };
              } catch (t) {
                return { type: "throw", arg: t };
              }
            }
            e.wrap = f;
            var m = {};
            function y() {}
            function h() {}
            function v() {}
            var b = {};
            d(b, l, function () {
              return this;
            });
            var g = Object.getPrototypeOf,
              S = g && g(g(O([])));
            S && S !== n && a.call(S, l) && (b = S);
            var w = (v.prototype = y.prototype = Object.create(b));
            function x(t) {
              ["next", "throw", "return"].forEach(function (e) {
                d(t, e, function (t) {
                  return this._invoke(e, t);
                });
              });
            }
            function L(t, e) {
              function n(o, i, c, l) {
                var s = p(t[o], t, i);
                if ("throw" !== s.type) {
                  var u = s.arg,
                    d = u.value;
                  return d && "object" == r(d) && a.call(d, "__await")
                    ? e.resolve(d.__await).then(
                        function (t) {
                          n("next", t, c, l);
                        },
                        function (t) {
                          n("throw", t, c, l);
                        },
                      )
                    : e.resolve(d).then(
                        function (t) {
                          (u.value = t), c(u);
                        },
                        function (t) {
                          return n("throw", t, c, l);
                        },
                      );
                }
                l(s.arg);
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
            function k(t, e, n) {
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
                    var c = E(i, n);
                    if (c) {
                      if (c === m) continue;
                      return c;
                    }
                  }
                  if ("next" === n.method) n.sent = n._sent = n.arg;
                  else if ("throw" === n.method) {
                    if ("suspendedStart" === r) throw ((r = "completed"), n.arg);
                    n.dispatchException(n.arg);
                  } else "return" === n.method && n.abrupt("return", n.arg);
                  r = "executing";
                  var l = p(t, e, n);
                  if ("normal" === l.type) {
                    if (
                      ((r = n.done ? "completed" : "suspendedYield"), l.arg === m)
                    )
                      continue;
                    return { value: l.arg, done: n.done };
                  }
                  "throw" === l.type &&
                    ((r = "completed"), (n.method = "throw"), (n.arg = l.arg));
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
                  m
                );
              var o = p(r, t.iterator, e.arg);
              if ("throw" === o.type)
                return (
                  (e.method = "throw"), (e.arg = o.arg), (e.delegate = null), m
                );
              var a = o.arg;
              return a
                ? a.done
                  ? ((e[t.resultName] = a.value),
                    (e.next = t.nextLoc),
                    "return" !== e.method &&
                      ((e.method = "next"), (e.arg = void 0)),
                    (e.delegate = null),
                    m)
                  : a
                : ((e.method = "throw"),
                  (e.arg = new TypeError("iterator result is not an object")),
                  (e.delegate = null),
                  m);
            }
            function I(t) {
              var e = { tryLoc: t[0] };
              1 in t && (e.catchLoc = t[1]),
                2 in t && ((e.finallyLoc = t[2]), (e.afterLoc = t[3])),
                this.tryEntries.push(e);
            }
            function q(t) {
              var e = t.completion || {};
              (e.type = "normal"), delete e.arg, (t.completion = e);
            }
            function N(t) {
              (this.tryEntries = [{ tryLoc: "root" }]),
                t.forEach(I, this),
                this.reset(!0);
            }
            function O(t) {
              if (t) {
                var e = t[l];
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
              return { next: A };
            }
            function A() {
              return { value: void 0, done: !0 };
            }
            return (
              (h.prototype = v),
              i(w, "constructor", { value: v, configurable: !0 }),
              i(v, "constructor", { value: h, configurable: !0 }),
              (h.displayName = d(v, u, "GeneratorFunction")),
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
                    ? Object.setPrototypeOf(t, v)
                    : ((t.__proto__ = v), d(t, u, "GeneratorFunction")),
                  (t.prototype = Object.create(w)),
                  t
                );
              }),
              (e.awrap = function (t) {
                return { __await: t };
              }),
              x(L.prototype),
              d(L.prototype, s, function () {
                return this;
              }),
              (e.AsyncIterator = L),
              (e.async = function (t, n, r, o, a) {
                void 0 === a && (a = Promise);
                var i = new L(f(t, n, r, o), a);
                return e.isGeneratorFunction(n)
                  ? i
                  : i.next().then(function (t) {
                      return t.done ? t.value : i.next();
                    });
              }),
              x(w),
              d(w, u, "Generator"),
              d(w, l, function () {
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
              (e.values = O),
              (N.prototype = {
                constructor: N,
                reset: function (t) {
                  if (
                    ((this.prev = 0),
                    (this.next = 0),
                    (this.sent = this._sent = void 0),
                    (this.done = !1),
                    (this.delegate = null),
                    (this.method = "next"),
                    (this.arg = void 0),
                    this.tryEntries.forEach(q),
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
                      var c = a.call(o, "catchLoc"),
                        l = a.call(o, "finallyLoc");
                      if (c && l) {
                        if (this.prev < o.catchLoc) return n(o.catchLoc, !0);
                        if (this.prev < o.finallyLoc) return n(o.finallyLoc);
                      } else if (c) {
                        if (this.prev < o.catchLoc) return n(o.catchLoc, !0);
                      } else {
                        if (!l)
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
                      ? ((this.method = "next"), (this.next = o.finallyLoc), m)
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
                    m
                  );
                },
                finish: function (t) {
                  for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                    var n = this.tryEntries[e];
                    if (n.finallyLoc === t)
                      return this.complete(n.completion, n.afterLoc), q(n), m;
                  }
                },
                catch: function (t) {
                  for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                    var n = this.tryEntries[e];
                    if (n.tryLoc === t) {
                      var r = n.completion;
                      if ("throw" === r.type) {
                        var o = r.arg;
                        q(n);
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
                    m
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
          function r(t, e, n, r, o, a, i) {
            try {
              var c = t[a](i),
                l = c.value;
            } catch (t) {
              return void n(t);
            }
            c.done ? e(l) : Promise.resolve(l).then(r, o);
          }
          function o(t) {
            return function () {
              var e = this,
                n = arguments;
              return new Promise(function (o, a) {
                var i = t.apply(e, n);
                function c(t) {
                  r(i, o, a, c, l, "next", t);
                }
                function l(t) {
                  r(i, o, a, c, l, "throw", t);
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
        785: function (t, e, n) {
          "use strict";
          function r(t, e) {
            (null == e || e > t.length) && (e = t.length);
            for (var n = 0, r = new Array(e); n < e; n++) r[n] = t[n];
            return r;
          }
          function o(t) {
            return (
              (function (t) {
                if (Array.isArray(t)) return r(t);
              })(t) ||
              (function (t) {
                if (
                  ("undefined" != typeof Symbol && null != t[Symbol.iterator]) ||
                  null != t["@@iterator"]
                )
                  return Array.from(t);
              })(t) ||
              (function (t, e) {
                if (t) {
                  if ("string" == typeof t) return r(t, e);
                  var n = Object.prototype.toString.call(t).slice(8, -1);
                  return (
                    "Object" === n && t.constructor && (n = t.constructor.name),
                    "Map" === n || "Set" === n
                      ? Array.from(t)
                      : "Arguments" === n ||
                          /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                        ? r(t, e)
                        : void 0
                  );
                }
              })(t) ||
              (function () {
                throw new TypeError(
                  "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
                );
              })()
            );
          }
          n.d(e, {
            Z: function () {
              return o;
            },
          });
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
              return a;
            },
          });
          var r = n(2),
            o = n(512);
          function a(t) {
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
        var c;
        i && ((c = []).d = -1);
        var l,
          s,
          u,
          d = new Set(),
          f = o.exports,
          p = new Promise(function (t, e) {
            (u = e), (s = t);
          });
        (p[e] = f),
          (p[t] = function (t) {
            c && t(c), d.forEach(t), p.catch(function () {});
          }),
          (o.exports = p),
          a(
            function (o) {
              var a;
              l = (function (o) {
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
                  var c = {};
                  return (c[t] = function () {}), (c[e] = o), c;
                });
              })(o);
              var i = function () {
                  return l.map(function (t) {
                    if (t[n]) throw t[n];
                    return t[e];
                  });
                },
                s = new Promise(function (e) {
                  (a = function () {
                    e(i);
                  }).r = 0;
                  var n = function (t) {
                    t !== c &&
                      !d.has(t) &&
                      (d.add(t), t && !t.d && (a.r++, t.push(a)));
                  };
                  l.map(function (e) {
                    e[t](n);
                  });
                });
              return a.r ? s : i();
            },
            function (t) {
              t ? u((p[n] = t)) : s(f), r(c);
            },
          ),
          c && c.d < 0 && (c.d = 0);
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
      i(254);
  })();
  