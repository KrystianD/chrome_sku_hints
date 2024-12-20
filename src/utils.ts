type StorageData = { [p: string]: any };

export async function loadFromStorage<T extends StorageData>(
  defaults: T,
): Promise<T> {
  return new Promise((resolve) => {
    chrome.storage.sync.get(defaults, function (items) {
      resolve(items as T);
    });
  });
}

export async function saveToStorage(data: StorageData) {
  return new Promise<void>((resolve) => chrome.storage.sync.set(data, resolve));
}

export function copyToClipboard(textCopy: string) {
  var copyFrom = document.createElement("textarea");

  copyFrom.textContent = `${textCopy}`;
  document.body.appendChild(copyFrom);

  copyFrom.select();
  document.execCommand(`copy`);

  copyFrom.blur();
  document.body.removeChild(copyFrom);
}

export async function addHint(valuesToAdd: string) {
  let values = await chunkedKeyRead("values");

  values += "\n" + valuesToAdd;

  await chunkedKeyWrite("values", values);
}

export function chunkedKeyWrite(key: string, value: string): Promise<void> {
  return new Promise<void>((resolve) => {
    const str = JSON.stringify(value);
    const len =
      chrome.storage.sync.QUOTA_BYTES_PER_ITEM - key.length - 4 - 1000;
    const num = Math.ceil(str.length / len);
    const obj: any = {};
    obj[key + "#"] = num;
    for (let i = 0; i < num; i++) {
      obj[key + i] = str.substr(i * len, len);
    }
    console.log(obj);
    chrome.storage.sync.set(obj, resolve);
  });
}

export function chunkedKeyRead(key: string): Promise<string> {
  return new Promise<string>((resolve) => {
    const keyNum = key + "#";
    chrome.storage.sync.get(keyNum, (data) => {
      const num = data[keyNum];
      const keys = [];
      for (let i = 0; i < num; i++) {
        keys[i] = key + i;
      }
      chrome.storage.sync.get(keys, (data) => {
        const chunks = [];
        for (let i = 0; i < num; i++) {
          chunks.push(data[key + i] || "");
        }
        const str = chunks.join("");
        resolve(str ? JSON.parse(str) : undefined);
      });
    });
  });
}
