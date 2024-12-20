import { addHint, loadFromStorage, saveToStorage } from "./utils";

const valuesEl = document.getElementById("values")! as HTMLTextAreaElement;
const saveEl = document.getElementById("save")! as HTMLButtonElement;
const statusEl = document.getElementById("status")! as HTMLDivElement;

async function onLoad() {
  const items = await loadFromStorage({
    popupText: "",
  });

  valuesEl.value = items.popupText;
}

async function saveText() {
  await saveToStorage({
    popupText: valuesEl.value,
  });
}

async function save() {
  const valuesToAdd = valuesEl.value;

  await addHint(valuesToAdd);

  statusEl.textContent = "Options added.";
  valuesEl.value = "";

  await saveText();

  setTimeout(function () {
    statusEl.textContent = "";
  }, 750);
}

document.addEventListener("DOMContentLoaded", onLoad);
saveEl.addEventListener("click", save);
valuesEl.addEventListener("keyup", saveText);

export {};
