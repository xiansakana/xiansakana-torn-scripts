!(function () {
    var t = {
        61: function (t, e, r) {
          var n = r(698).default;
          function a() {
            "use strict";
            (t.exports = a =
              function () {
                return e;
              }),
              (t.exports.__esModule = !0),
              (t.exports.default = t.exports);
            var e = {},
              r = Object.prototype,
              o = r.hasOwnProperty,
              i =
                Object.defineProperty ||
                function (t, e, r) {
                  t[e] = r.value;
                },
              s = "function" == typeof Symbol ? Symbol : {},
              u = s.iterator || "@@iterator",
              c = s.asyncIterator || "@@asyncIterator",
              l = s.toStringTag || "@@toStringTag";
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
            function h(t, e, r, n) {
              var a = e && e.prototype instanceof y ? e : y,
                o = Object.create(a.prototype),
                s = new E(n || []);
              return i(o, "_invoke", { value: x(t, r, s) }), o;
            }
            function p(t, e, r) {
              try {
                return { type: "normal", arg: t.call(e, r) };
              } catch (t) {
                return { type: "throw", arg: t };
              }
            }
            e.wrap = h;
            var d = {};
            function y() {}
            function m() {}
            function g() {}
            var k = {};
            f(k, u, function () {
              return this;
            });
            var _ = Object.getPrototypeOf,
              v = _ && _(_(S([])));
            v && v !== r && o.call(v, u) && (k = v);
            var b = (g.prototype = y.prototype = Object.create(k));
            function w(t) {
              ["next", "throw", "return"].forEach(function (e) {
                f(t, e, function (t) {
                  return this._invoke(e, t);
                });
              });
            }
            function P(t, e) {
              function r(a, i, s, u) {
                var c = p(t[a], t, i);
                if ("throw" !== c.type) {
                  var l = c.arg,
                    f = l.value;
                  return f && "object" == n(f) && o.call(f, "__await")
                    ? e.resolve(f.__await).then(
                        function (t) {
                          r("next", t, s, u);
                        },
                        function (t) {
                          r("throw", t, s, u);
                        },
                      )
                    : e.resolve(f).then(
                        function (t) {
                          (l.value = t), s(l);
                        },
                        function (t) {
                          return r("throw", t, s, u);
                        },
                      );
                }
                u(c.arg);
              }
              var a;
              i(this, "_invoke", {
                value: function (t, n) {
                  function o() {
                    return new e(function (e, a) {
                      r(t, n, e, a);
                    });
                  }
                  return (a = a ? a.then(o, o) : o());
                },
              });
            }
            function x(t, e, r) {
              var n = "suspendedStart";
              return function (a, o) {
                if ("executing" === n)
                  throw new Error("Generator is already running");
                if ("completed" === n) {
                  if ("throw" === a) throw o;
                  return { value: void 0, done: !0 };
                }
                for (r.method = a, r.arg = o; ; ) {
                  var i = r.delegate;
                  if (i) {
                    var s = D(i, r);
                    if (s) {
                      if (s === d) continue;
                      return s;
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
                      ((n = r.done ? "completed" : "suspendedYield"), u.arg === d)
                    )
                      continue;
                    return { value: u.arg, done: r.done };
                  }
                  "throw" === u.type &&
                    ((n = "completed"), (r.method = "throw"), (r.arg = u.arg));
                }
              };
            }
            function D(t, e) {
              var r = e.method,
                n = t.iterator[r];
              if (void 0 === n)
                return (
                  (e.delegate = null),
                  ("throw" === r &&
                    t.iterator.return &&
                    ((e.method = "return"),
                    (e.arg = void 0),
                    D(t, e),
                    "throw" === e.method)) ||
                    ("return" !== r &&
                      ((e.method = "throw"),
                      (e.arg = new TypeError(
                        "The iterator does not provide a '" + r + "' method",
                      )))),
                  d
                );
              var a = p(n, t.iterator, e.arg);
              if ("throw" === a.type)
                return (
                  (e.method = "throw"), (e.arg = a.arg), (e.delegate = null), d
                );
              var o = a.arg;
              return o
                ? o.done
                  ? ((e[t.resultName] = o.value),
                    (e.next = t.nextLoc),
                    "return" !== e.method &&
                      ((e.method = "next"), (e.arg = void 0)),
                    (e.delegate = null),
                    d)
                  : o
                : ((e.method = "throw"),
                  (e.arg = new TypeError("iterator result is not an object")),
                  (e.delegate = null),
                  d);
            }
            function L(t) {
              var e = { tryLoc: t[0] };
              1 in t && (e.catchLoc = t[1]),
                2 in t && ((e.finallyLoc = t[2]), (e.afterLoc = t[3])),
                this.tryEntries.push(e);
            }
            function j(t) {
              var e = t.completion || {};
              (e.type = "normal"), delete e.arg, (t.completion = e);
            }
            function E(t) {
              (this.tryEntries = [{ tryLoc: "root" }]),
                t.forEach(L, this),
                this.reset(!0);
            }
            function S(t) {
              if (t) {
                var e = t[u];
                if (e) return e.call(t);
                if ("function" == typeof t.next) return t;
                if (!isNaN(t.length)) {
                  var r = -1,
                    n = function e() {
                      for (; ++r < t.length; )
                        if (o.call(t, r))
                          return (e.value = t[r]), (e.done = !1), e;
                      return (e.value = void 0), (e.done = !0), e;
                    };
                  return (n.next = n);
                }
              }
              return { next: A };
            }
            function A() {
              return { value: void 0, done: !0 };
            }
            return (
              (m.prototype = g),
              i(b, "constructor", { value: g, configurable: !0 }),
              i(g, "constructor", { value: m, configurable: !0 }),
              (m.displayName = f(g, l, "GeneratorFunction")),
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
                    : ((t.__proto__ = g), f(t, l, "GeneratorFunction")),
                  (t.prototype = Object.create(b)),
                  t
                );
              }),
              (e.awrap = function (t) {
                return { __await: t };
              }),
              w(P.prototype),
              f(P.prototype, c, function () {
                return this;
              }),
              (e.AsyncIterator = P),
              (e.async = function (t, r, n, a, o) {
                void 0 === o && (o = Promise);
                var i = new P(h(t, r, n, a), o);
                return e.isGeneratorFunction(r)
                  ? i
                  : i.next().then(function (t) {
                      return t.done ? t.value : i.next();
                    });
              }),
              w(b),
              f(b, l, "Generator"),
              f(b, u, function () {
                return this;
              }),
              f(b, "toString", function () {
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
              (e.values = S),
              (E.prototype = {
                constructor: E,
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
                        o.call(this, e) &&
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
                    var a = this.tryEntries[n],
                      i = a.completion;
                    if ("root" === a.tryLoc) return r("end");
                    if (a.tryLoc <= this.prev) {
                      var s = o.call(a, "catchLoc"),
                        u = o.call(a, "finallyLoc");
                      if (s && u) {
                        if (this.prev < a.catchLoc) return r(a.catchLoc, !0);
                        if (this.prev < a.finallyLoc) return r(a.finallyLoc);
                      } else if (s) {
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
                abrupt: function (t, e) {
                  for (var r = this.tryEntries.length - 1; r >= 0; --r) {
                    var n = this.tryEntries[r];
                    if (
                      n.tryLoc <= this.prev &&
                      o.call(n, "finallyLoc") &&
                      this.prev < n.finallyLoc
                    ) {
                      var a = n;
                      break;
                    }
                  }
                  a &&
                    ("break" === t || "continue" === t) &&
                    a.tryLoc <= e &&
                    e <= a.finallyLoc &&
                    (a = null);
                  var i = a ? a.completion : {};
                  return (
                    (i.type = t),
                    (i.arg = e),
                    a
                      ? ((this.method = "next"), (this.next = a.finallyLoc), d)
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
                    d
                  );
                },
                finish: function (t) {
                  for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                    var r = this.tryEntries[e];
                    if (r.finallyLoc === t)
                      return this.complete(r.completion, r.afterLoc), j(r), d;
                  }
                },
                catch: function (t) {
                  for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                    var r = this.tryEntries[e];
                    if (r.tryLoc === t) {
                      var n = r.completion;
                      if ("throw" === n.type) {
                        var a = n.arg;
                        j(r);
                      }
                      return a;
                    }
                  }
                  throw new Error("illegal catch attempt");
                },
                delegateYield: function (t, e, r) {
                  return (
                    (this.delegate = {
                      iterator: S(t),
                      resultName: e,
                      nextLoc: r,
                    }),
                    "next" === this.method && (this.arg = void 0),
                    d
                  );
                },
              }),
              e
            );
          }
          (t.exports = a),
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
      var a = e[n];
      if (void 0 !== a) return a.exports;
      var o = (e[n] = { exports: {} });
      return t[n](o, o.exports, r), o.exports;
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
        function t(t, e, r, n, a, o, i) {
          try {
            var s = t[o](i),
              u = s.value;
          } catch (t) {
            return void r(t);
          }
          s.done ? e(u) : Promise.resolve(u).then(n, a);
        }
        function e(e) {
          return function () {
            var r = this,
              n = arguments;
            return new Promise(function (a, o) {
              var i = e.apply(r, n);
              function s(e) {
                t(i, a, o, s, u, "next", e);
              }
              function u(e) {
                t(i, a, o, s, u, "throw", e);
              }
              s(void 0);
            });
          };
        }
        var n = r(687),
          a = r.n(n);
        function o() {
          for (var t = arguments.length, e = new Array(t), r = 0; r < t; r++)
            e[r] = arguments[r];
          return new Promise(function (t) {
            chrome.runtime.sendMessage(e, function (e) {
              t(e);
            });
          });
        }
        function i() {
          return s.apply(this, arguments);
        }
        function s() {
          return (s = e(
            a().mark(function t() {
              return a().wrap(function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      return (
                        (t.next = 2),
                        o({ name: "msgReadKey", value: "nstMember" })
                          .then(function (t) {
                            return (
                              !Array.isArray(t) &&
                              !(!t.status || !t.data) &&
                              t.data
                            );
                          })
                          .catch(function (t) {
                            return (
                              (e = {
                                status: !1,
                                fromWhere: "getGlobs",
                                message: "you shall not pass",
                                data: t,
                              }).status || console.log(e),
                              e
                            );
                            var e;
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
        function u() {
          return (u = e(
            a().mark(function t() {
              return a().wrap(function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      return (t.next = 2), i();
                    case 2:
                      if (t.sent) {
                        t.next = 5;
                        break;
                      }
                      return t.abrupt("return", !1);
                    case 5:
                      return t.abrupt(
                        "return",
                        o(
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
        (function () {
          return u.apply(this, arguments);
        })().then(function (t) {
          Array.isArray(t) &&
            t[0].data.missionHelper.enabled &&
            (function () {
              for (
                var t = {
                    a_good_day_to_get_hard: {
                      task: "Achieve a killstreak of 3 - 10.",
                    },
                    a_kimpossible_task: {
                      task: "Defeat (P) using only melee and temporary weapons.",
                    },
                    a_problem_at_the_tracks: {
                      task: "Defeat 3 (P) without using any guns.",
                    },
                    a_thor_loser: {
                      task: "Use Duke's hammer to hit 8 - 16 unique body parts",
                    },
                    against_the_odds: { task: "Defeat 2 (P)." },
                    an_honorary_degree: {
                      task: "Defeat (P) without using any guns",
                    },
                    army_of_one: {
                      task: "Attack (P) 3 times with various masks.",
                    },
                    bakeout_breakout: {
                      task: "Combine a fruitcake and the lock pick, and send 'special fruitcake' to someone in jail.",
                    },
                    bare_knuckle: {
                      task: "Defeat (P) with no weapons or armor equipped.",
                    },
                    batshit_crazy: { task: "Inflict damage with Penelope." },
                    battering_ram: { task: "Attack (P) 3 times." },
                    big_tub_of_muscle: {
                      task: "Defeat (P) despite their gargantuan strength.",
                    },
                    birthday_surprise: {
                      task: "Obtain and send a specific item as a present to Duke.",
                    },
                    bonnie_and_clyde: { task: "Defeat (P), and their spouse." },
                    bountiful: { task: "Successfully claim 2 - 5 bounties" },
                    bounty_on_the_mutiny: {
                      task: "Bounty (P) and wait for the bounty to be claimed.",
                    },
                    bring_it: { task: "Defeat Duke in a group attack" },
                    candy_from_babies: {
                      task: "Collect $50,000 - $250,000 in bounties.",
                    },
                    charity_work: { task: "Mug 2 (P)" },
                    cracking_up: {
                      task: "Defeat and interrogate (P) for the code to unlock Duke's safe and send the content to Duke after opening it.",
                    },
                    critical_education: { task: "Achieve 3 - 9 critical hits" },
                    cut_them_down_to_size: {
                      task: "Defeat any player of your level or higher.",
                    },
                    dirty_little_secret: {
                      task: "Put a bounty on (P), then attack the person who claimed it.",
                    },
                    double_jeopardy: {
                      task: "Put a bounty on (P) and defeat them.",
                    },
                    drug_problem: { task: "Defeat 4 - 7 (P)." },
                    emotional_debt: {
                      task: "Hit (P) with tear gas or pepper spray.",
                    },
                    estranged: { task: "Injure one of (P)'s legs." },
                    family_ties: { task: "Hospitalize (P) 3 times" },
                    field_trip: {
                      task: "Win $100 - $1,000,000 on 3 casino games.",
                    },
                    fireworks: { task: "Expend 250 - 1250 rounds of ammunition" },
                    forgotten_bills: { task: "Defeat (P)" },
                    frenzy: { task: "Defeat any 5 - 15 players." },
                    get_things_jumping: { task: "Deal and receive damage." },
                    graffiti: { task: "Hit (P) with pepper spray." },
                    guardian: { task: "Defeat (P)." },
                    hammer_time: { task: "Defeat (P) with a hammer." },
                    hands_off: { task: "Defeat 3 - 5 (P)." },
                    hare_meet_tortoise: {
                      task: "Defeat (P) despite their lightning fast speed.",
                    },
                    hide_and_seek: {
                      task: "Find (P) from 3 - 5 listed and defeat them.",
                    },
                    hiding_in_plain_view: {
                      task: "Defeat (P) in a random country.",
                    },
                    high_fliers: { task: "Defeat 3 (P) in random countries" },
                    hobgoblin: { task: "Defeat a player of your choice 5 times" },
                    immovable_object: {
                      task: "Defeat (P) despite their impenetrable defense.",
                    },
                    inside_job: {
                      task: "Attack (P) and secrete an item on them.",
                    },
                    introduction_duke: { task: "Complete 10 Duke contracts." },
                    keeping_up_appearances: {
                      task: "Mug (P) and send them back the money.",
                    },
                    kiss_of_death: {
                      task: "Defeat (P) and use the kiss option.",
                    },
                    lack_of_awareness: { task: "Defeat (P)." },
                    lost_and_found: {
                      task: "Put (P) in the hospital for 12 hours.",
                    },
                    loud_and_clear: { task: "Use 3 - 11 explosive grenades." },
                    loyal_customer: { task: "Defeat (P)." },
                    make_it_slow: {
                      task: "Defeat (P) in no fewer than 5 - 9 turns in a single attack.",
                    },
                    marriage_counseling: { task: "Defeat (P)'s spouse." },
                    massacrist: { task: "Defeat (P)." },
                    meeting_the_challenge: {
                      task: "Mug people for a total of $10,000 - $16,000,000.",
                    },
                    motivator: {
                      task: "Lose or stalemate to (P) on the first attempt.",
                    },
                    new_kid_on_the_block: { task: "Defeat 5 players." },
                    no_man_is_an_island: { task: "Mug 2 out of 3 (P)." },
                    no_second_chances: {
                      task: "Defeat (P) on the first attempt.",
                    },
                    out_of_the_frying_pan: {
                      task: "Go to the jail, use Felovax to go to the hospital, then use Zylkene.",
                    },
                    painleth_dentitht: {
                      task: "Defeat (P) with a baseball bat.",
                    },
                    party_tricks: {
                      task: "Defeat (P) despite their nimble dexterity.",
                    },
                    pass_the_word: {
                      task: "Send a message including keyword to (P).",
                    },
                    peak_experience: { task: "Defeat (P)." },
                    proof_of_the_pudding: {
                      task: "Use a specific weapon on (P), then send the weapon to them.",
                    },
                    rabbit_response: {
                      task: "Defeat 3 (P) within 30 - 10 minutes.",
                    },
                    reconstruction: {
                      task: "Equip kitchen knife and leather gloves, defeat (P) then dump both items.",
                    },
                    red_faced: {
                      task: "Defeat (P) with a trout on the finishing hit.",
                    },
                    rising_costs: { task: "Hit (P) with a brick." },
                    rolling_in_it: { task: "Mug (P)." },
                    safari: { task: "Defeat (P) with a rifle in South Africa." },
                    scammer: { task: "Defeat (P)." },
                    sellout_slayer: {
                      task: "Buy a gun, use the gun on any 2 - 6 players, then sell it again.",
                    },
                    sending_a_message: { task: "Defeat (P)." },
                    show_some_muscle: { task: "Attack (P)." },
                    sleep_aid: { task: "Defeat (P)." },
                    some_people: { task: "Send any item as a parcel to (P)." },
                    standard_routine: {
                      task: "Defeat (P) with a clubbed weapon, fists or kick.",
                    },
                    stomach_upset: { task: "Injure (P)'s stomach." },
                    swan_step_too_far: {
                      task: "Get an item from the dump and defeat its previous owner.",
                    },
                    the_executive_game: {
                      task: "Defeat (P) using only fists or kick.",
                    },
                    the_tattoo_artist: {
                      task: "Defeat (P) using only a slashing or piercing weapon.",
                    },
                    three_peat: {
                      task: "Leave any player, mug any player and hospitalize any player.",
                    },
                    training_day: { task: "Use 250 - 1,250 energy in the gym." },
                    tree_huggers: { task: "Defeat 5 - 8 (P)." },
                    undercutters: { task: "Defeat 3 (P)." },
                    unwanted_attention: { task: "Hospitalize 4 (P)." },
                    withdrawal: { task: "Injure (P)'s both arms." },
                    wrath_of_duke: { task: "Defeat 4 (P)." },
                  },
                  e = 0,
                  r = Array.from(
                    document.querySelectorAll(
                      ".giver-cont-wrap > div[id^=mission]:not(.ns-mod)",
                    ),
                  );
                e < r.length;
                e++
              ) {
                var n,
                  a,
                  o,
                  i = r[e],
                  s = (
                    null === (n = i.querySelector(".title-black")) || void 0 === n
                      ? void 0
                      : n.childNodes[0]
                  ).wholeText
                    .replace(/\n/g, "")
                    .trim()
                    .toLowerCase()
                    .replaceAll(/[ -]/g, "_")
                    .replaceAll(/[:!,]/g, "");
                o = s in t ? t[s].task : "mission not found";
                var u = document.createElement("span");
                (u.innerHTML = "<br/><br/><b>todo:</b> ".concat(o)),
                  null === (a = i.querySelector(".max-height-fix")) ||
                    void 0 === a ||
                    a.appendChild(u),
                  i.classList.add("ns-mod");
              }
            })();
        });
      })();
  })();
  