!(function (e) {
    const n = window.WebSocket;
    window.WebSocket = function () {
      const e = new n(...arguments);
      return (
        e.addEventListener("message", (e) => {
          "wss://ws-centrifugo.torn.com/connection/websocket" === e.target.url &&
            window.dispatchEvent(
              new CustomEvent("nstWebSo", { detail: JSON.parse(e.data) }),
            );
        }),
        e
      );
    };
  })();
  