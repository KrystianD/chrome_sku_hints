import { chunkedKeyRead } from "../utils";

let replacementsList: [RegExp, string][] | null = null;

function addStyles() {
  const sheet = document.createElement("style");
  sheet.innerHTML = `
.kd-note {
  color: gray;
  font-size: 9px;
  position: relative;
  bottom: -2px;
}`;
  document.body.appendChild(sheet);
}

function processElement(x: HTMLElement) {
  const elements = x.querySelectorAll("span,div,a,h1,h2,h3,h4,h5,h6");

  for (let i = 0; i < elements.length; i++) {
    const divObj = elements[i];

    if (divObj.classList.contains("kd-skip")) continue;

    for (let childNode of Array.from(divObj.childNodes)) {
      if (childNode.nodeType !== Node.TEXT_NODE) continue;

      let newArray: [number, number, any, string, Text][] = [];
      for (let [re, value] of replacementsList!) {
        for (let match of childNode.nodeValue!.matchAll(re)) {
          const start = match.index!;
          const end = match.index! + match[1].length;
          newArray.push([start, end, match[1], value, childNode as Text]);
        }
      }

      newArray.sort((a, b) => b[0] - a[0]);

      for (const [start, end, name, value, textNode] of newArray) {
        const hintNode = document.createElement("span");
        hintNode.className = "kd-note";
        hintNode.innerText = `(${value})`;
        divObj.insertBefore(hintNode, textNode.splitText(end));

        // optional
        const sp = textNode.splitText(start);
        const nameNode = document.createElement("span");
        nameNode.className = "kd-skip";
        nameNode.title = value;
        nameNode.textContent = name;
        sp.replaceWith(nameNode);
      }
    }
  }
}

async function loadListFromMemory() {
  const values = await chunkedKeyRead("values");

  const map: { [key: string]: string } = {};

  for (let entry_ of values.split("\n")) {
    const entry = entry_.trim();
    if (entry.length === 0) continue;

    if (entry.startsWith("#")) continue;

    const [name, ...rest] = entry.split(",");
    map[name] = rest.join(",");
  }

  replacementsList = Object.keys(map)
    .map((x) => [x, map[x]])
    .sort((a, b) => b[0].length - a[0].length)
    .map((x) => [new RegExp("\\b(" + x[0] + ")([ -]|$)", "gi"), x[1]]) as [
    RegExp,
    string,
  ][];
}

export async function startPageHandler() {
  await loadListFromMemory();

  if (!replacementsList || replacementsList.length == 0) return;

  const callback = (
    mutationList: MutationRecord[],
    observer: MutationObserver,
  ) => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        processElement(mutation.target as HTMLElement);
      }
    }
  };

  const config = { attributes: true, childList: true, subtree: true };
  const observer = new MutationObserver(callback);
  observer.observe(document, config);

  document.addEventListener("DOMContentLoaded", () => {
    addStyles();
    processElement(document.body);
  });
}
