import { copyToClipboard } from "./utils";
import Tab = chrome.tabs.Tab;

function openPopup(tab: Tab, initialText: string) {
  const param = JSON.stringify(initialText + ",");
  const code = `window.showPopup(${param});`;

  chrome.tabs.executeScript(tab.id!, { code: code });
}

chrome.contextMenus.create({
  title: "Add %s to hints",
  contexts: ["selection"],
  onclick: (info, tab) => {
    if (!tab || !tab.id) return;

    const selectedText = info.selectionText as string;

    openPopup(tab, selectedText);
  },
});

chrome.contextMenus.create({
  title: "Copy text",
  contexts: ["link"],
  onclick: (info, tab) => {
    chrome.tabs.sendMessage(
      tab.id!,
      "get_clicked_element",
      { frameId: info.frameId },
      (message) => {
        copyToClipboard(message.value);
      },
    );
  },
});
