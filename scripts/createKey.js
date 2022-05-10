import languages from "./languages.js";

const fucctionalKey = ['AltLeft', 'AltRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight', 
'Backspace', 'CapsLock', 'ControlLeft', 'ControlRight', 'Delete', 'Enter', 'ShiftLeft', 'ShiftRight', 'Tab', 'Lang', 'Space'];

function createElement(tag, className, dataName, data, textContent) {
  const element = document.createElement(tag);
  if (className) element.classList.add(className);
  if (data) element.dataset[dataName] = data;
  if (textContent) element.textContent = textContent;

  return element;
}
class Key {
  constructor(langCode, code) {
    function findKeyObj() {
      return languages[langCode].find(element => element.code === code);
    }

    this.min = findKeyObj().min;
    this.shift = findKeyObj().shift;
    this.code = code;

    if (code === 'Lang') {
      this.min = langCode;
      this.shift = langCode;
    }
    this.keyHTML = createElement('div', 'key', 'code', this.code, this.min);
    this.isfucctionalKey = fucctionalKey.includes(code);
    
    if (this.isfucctionalKey) {
      this.keyHTML.classList.add(this.code);
      this.keyHTML.dataset.isfucctionalKey = 'true';
    }
  }
}
export default Key;