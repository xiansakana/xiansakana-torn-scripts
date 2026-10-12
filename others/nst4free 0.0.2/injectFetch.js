!(function (t) {
    const n = window.top.fetch;
    window.top.fetch = function () {
      return new Promise((t, c) => {
        n.apply(this, arguments)
          .then(async (n) => {
            const c = n.url.substring(
              n.url.indexOf("torn.com/") + 9,
              n.url.indexOf(".php"),
            );
            let e;
            try {
              e = await n.clone().json();
            } catch (c) {
              t(n);
            }
            const o = {
              page: c,
              json: e,
              fetch: { url: n.url, status: n.status },
            };
            window.dispatchEvent(new CustomEvent("nstFetch", { detail: o })),
              t(n);
          })
          .catch((t) => {
            c(t);
          });
      });
    };
  })();
  