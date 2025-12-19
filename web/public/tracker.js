(function () {
  function getSessionId() {
    var key = "analytics_session_id";
    try {
      var existing = localStorage.getItem(key);
      if (existing) return existing;
      var id =
        (typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID()) ||
        "sid_" + Math.random().toString(16).slice(2) + Date.now().toString(16);
      localStorage.setItem(key, id);
      return id;
    } catch (e) {
      return "sid_" + Math.random().toString(16).slice(2) + Date.now().toString(16);
    }
  }

  function post(api, payload, debug) {
    try {
      var body = JSON.stringify(payload);
      if (navigator.sendBeacon) {
        var ok = navigator.sendBeacon(api, new Blob([body], { type: "application/json" }));
        if (debug) console.log("beacon", ok, payload);
        return;
      }
      fetch(api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body,
        keepalive: true
      }).catch(function () {});
      if (debug) console.log(payload);
    } catch (e) {
      if (debug) console.log("send failed");
    }
  }

  function pageView(api, debug) {
    post(api, { session_id: getSessionId(), type: "page_view", page_url: location.href, timestamp: new Date().toISOString() }, debug);
  }

  function bindClicks(api, debug) {
    document.addEventListener(
      "click",
      function (e) {
        post(
          api,
          {
            session_id: getSessionId(),
            type: "click",
            page_url: location.href,
            timestamp: new Date().toISOString(),
            x: e.clientX,
            y: e.clientY
          },
          debug
        );
      },
      { passive: true }
    );
  }

  var el = document.currentScript;
  var api = (el && el.getAttribute("data-api")) || "/api/events";
  var debug = el && el.getAttribute("data-debug") === "true";
  pageView(api, debug);
  bindClicks(api, debug);
})();

