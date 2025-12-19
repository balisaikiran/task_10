import { nanoid } from "nanoid";

function getSessionId() {
  const key = "analytics_session_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = nanoid();
    localStorage.setItem(key, id);
  }
  return id;
}

function send(api, payload, debug) {
  const body = JSON.stringify(payload);
  fetch(api, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body
  }).catch(() => {
    if (debug) console.log("send failed");
  });
}

function pageView(api, debug) {
  const session_id = getSessionId();
  const payload = {
    session_id,
    type: "page_view",
    page_url: location.href,
    timestamp: new Date().toISOString()
  };
  if (debug) console.log(payload);
  send(api, payload, debug);
}

function onClick(api, debug) {
  document.addEventListener("click", (e) => {
    const session_id = getSessionId();
    const payload = {
      session_id,
      type: "click",
      page_url: location.href,
      timestamp: new Date().toISOString(),
      x: e.clientX,
      y: e.clientY
    };
    if (debug) console.log(payload);
    send(api, payload, debug);
  });
}

(function init() {
  const el = document.currentScript;
  const api = el?.getAttribute("data-api") || "/api/events";
  const debug = el?.getAttribute("data-debug") === "true";
  pageView(api, debug);
  onClick(api, debug);
})();

