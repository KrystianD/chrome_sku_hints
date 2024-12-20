import * as ReactDOM from "react-dom/client";
import React from "react";
import { StyleSheetManager } from "styled-components";
import { SKUHintPopup } from "../components/SKUHintPopup";

let mouseX = 0,
  mouseY = 0;
let ctxMouseX = 0,
  ctxMouseY = 0;

(window as any).showPopup = (initialText: string) => {
  const w = 400 + 100;
  const pageWidth = document.body.getBoundingClientRect().width;
  const x = Math.min(ctxMouseX, pageWidth - w);

  const d = document.createElement("div");
  d.style.zIndex = "99999999";
  d.style.position = "absolute";
  d.style.display = "block";
  d.style.left = `${x}px`;
  d.style.top = `${ctxMouseY}px`;
  document.body.appendChild(d);

  const shadowOpen = d.attachShadow({ mode: "open" });
  const myShadowDom = d.shadowRoot!;

  const styleSlot = document.createElement("section");
  myShadowDom.appendChild(styleSlot);

  const root = ReactDOM.createRoot(myShadowDom);

  const el = React.createElement(
    StyleSheetManager,
    { target: styleSlot },
    React.createElement(SKUHintPopup, {
      initial: initialText,
      onClose: () => {
        d.remove();
      },
    }),
  );
  root.render(el);
};

export function startPopupHandler() {
  let clickedEl: any = null;

  document.addEventListener(
    "contextmenu",
    function (event) {
      clickedEl = event.target;
      ctxMouseX = mouseX;
      ctxMouseY = mouseY;
    },
    true,
  );

  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      if (request == "get_clicked_element") {
        sendResponse({ value: clickedEl.innerText });
      }
    },
  );

  document.addEventListener(
    "mousemove",
    function (event) {
      mouseX = event.pageX;
      mouseY = event.pageY;
    },
    true,
  );
}
