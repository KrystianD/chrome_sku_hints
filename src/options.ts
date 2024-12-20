import { chunkedKeyRead, chunkedKeyWrite } from "./utils";

const valuesEl = document.getElementById("values")! as HTMLTextAreaElement;
const saveEl = document.getElementById("save")! as HTMLButtonElement;
const statusEl = document.getElementById("status")! as HTMLDivElement;

async function load() {
  const values = await chunkedKeyRead("values");

  valuesEl.value = values;
}

async function save() {
  await chunkedKeyWrite("values", valuesEl.value);

  statusEl.textContent = "Options saved.";
  setTimeout(function () {
    statusEl.textContent = "";
  }, 750);
}

document.addEventListener("DOMContentLoaded", load);
saveEl.addEventListener("click", save);

export {};
