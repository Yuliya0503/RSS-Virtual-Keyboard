import Key from './createKey.js';
import languages from './languages.js';

function createElement(tag, className, dataName, data, textContent) {
  const element = document.createElement(tag);
  if (className) element.classList.add(className);
  if (data) element.dataset[dataName] = data;
  if (textContent) element.textContent = textContent;

  return element;
}

class Keyboard {
  constructor(langCode) {
    this.keysMap = [
      ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace'],
      ['Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash', 'Delete'],
      ['CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter'],
      ['ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ArrowUp', 'ShiftRight'],
      ['ControlLeft', 'Lang', 'AltLeft', 'Space', 'AltRight', 'ArrowLeft', 'ArrowDown', 'ArrowRight', 'ControlRight'],
    ];
    this.arrowKeys = ['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];
    this.specChars = {
      Space: ' ',
      Enter: '\n',
      Tab: '\t',
    };
    this.langList = Object.keys(languages);
    this.nowlang = langCode;
    this.keyboardKeysArr = [];
    this.isCaps = false;
    this.isShiftPressed = false;
    this.isControlLeftPressed = false;
    this.isAltLeftPressed = false;
  }
  
  init() {
    const title = createElement('h1', 'title', null, null, 'Virtual keyboard');
    const keyboard = this.createKeyboard();
    const pOS = createElement('p', 'pOS', null, null, 'Keyboard for Windows operating system');
    const pLang = createElement('p', 'language', null, null, 'Switch language on click: left ctrl + alt');
    this.textarea = createElement('textarea', 'textarea');
    document.body.prepend(title, pOS, pLang, this.textarea, keyboard);
    this.textarea.focus();
    document.addEventListener('keydown', this.handleEvents);
    document.addEventListener('keyup', this.handleEvents);
    keyboard.addEventListener('mousedown', this.handleEvents);
  }

  createKeyboard() {
    const keyboard = createElement('div', 'keyboard');
    this.keysMap.forEach((rowKeys) => {
      const row = createElement('div', 'row');
      rowKeys.forEach((keys) => {
        const newKey = new Key(this.nowlang, keys);
        this.keyboardKeysArr.push(newKey);
        if (keys === 'Lang') {
          newKey.min = this.nowlang;
          newKey.shift = this.nowlang;
        }
        row.append(newKey.keyHTML);
      });
      keyboard.append(row);
    });
    return keyboard;
  }

  handleEvents = (event) => {
    event.preventDefault();
    let key;
    if ((!event.code && !event.target.classList.contains('key')) || event.repeat) return;
    try {
      key = (event.classList.contains('key'))?event.target:this.keyboardKeysArr.find((element)=> element.code == element.code).keyHTML;
    }
    catch(error) {return};
    key.addEventListener('mouseup', this.handleEvents);
    key.addEventListener('mouseleave', this.handleEvents);
   
    
  }
}
const langCode = localStorage.getItem('keyboardLang') || 'en';
const keyboard = new Keyboard(langCode);
keyboard.init();