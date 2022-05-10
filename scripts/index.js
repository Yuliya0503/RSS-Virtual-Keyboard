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
    this.keyboardKeysObj = [];
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
      rowKeys.forEach((key) => {
        const newKey = new Key(this.nowlang, key);
        this.keyboardKeysObj.push(newKey);
        if (key === 'Lang') {
          newKey.min = this.nowlang;
          newKey.shift = this.nowlang;
        }
        row.append(newKey.keyHTML);
      });
      keyboard.append(row);
    });
    return keyboard;
  }

  handleEvents = (e) => {
    e.preventDefault();
    if ((!e.target.classList.contains('key') && !e.code) || e.repeat) return;
    let key;
    try {
      key = (e.target.classList.contains('key')) ? e.target : this.keyboardKeysObj.find((el) => el.code === e.code).keyHTML;
    } catch (err) {
      return;
    }

    const keyCode = key.dataset.code;

    key.addEventListener('mouseleave', this.handleEvents);
    key.addEventListener('mouseup', this.handleEvents);

    const rebuildKeyboard = () => {//+
      const noCapsKeys = (this.isShiftPressed) ? 'shift' : 'min';
      const capsKeys = ((this.isCaps && !this.isShiftPressed) || (!this.isCaps && this.isShiftPressed)) ? 'shift' : 'min';

      this.keyboardKeysObj.forEach((keyObj) => {
        if (keyObj.isfucctionalKey) return;
        const k = keyObj;
        k.keyHTML.textContent = languages[this.nowlang]
          .find((el) => el.code === keyObj.code)[(languages[this.nowlang][0]
            .noCapsKeys
            .includes(k.code)) ? noCapsKeys : capsKeys];
      });
    };

    const shiftCapsKeyboard = (keycode) => {//+
      const code = (keycode === 'CapsLock') ? 'isCaps' : 'isShiftPressed';
      this[code] = (!this[code]);
      if (code === 'isShiftPressed' && e.type === 'keydown') {
        this[code] = true;
      } else if (code === 'isShiftPressed' && e.type === 'keyup') {
        this[code] = false;
      }
      rebuildKeyboard();
    };

    const switchLang = () => {//+
      const langIndex = this.langList.indexOf(this.nowlang);
      this.nowlang = this.langList[(langIndex === this.langList.length - 1)
        ? 0 : langIndex + 1];
      localStorage.setItem('keyboardLang', this.nowlang);
      this.keyboardKeysObj.find((el) => el.code === 'Lang').keyHTML.textContent = this.nowlang;
      rebuildKeyboard();
    };

    const deactivateKey = () => {//+
      if (!(['ShiftLeft', 'ShiftRight', 'CapsLock'].includes(keyCode)) || (keyCode === 'CapsLock' && !this.isCaps)
          || (['ShiftLeft', 'ShiftRight'].includes(keyCode) && (!this.isShiftPressed || e.type === 'keyup'))) key.classList.remove('active');

      if (['ShiftLeft', 'ShiftRight'].includes(keyCode)) {
        if (!['mouseup', 'mouseleave'].includes(e.type)) shiftCapsKeyboard();
      }
      if (['ControlLeft', 'AltLeft'].includes(keyCode)) {
        this[`is${keyCode}Pressed`] = false;
      }
      key.removeEventListener('mouseleave', this.handleEvents);
      key.removeEventListener('mouseup', this.handleEvents);
      this.textarea.focus();
    };

    const insertChar = (char) =>{
      this.textarea.setRangeText(char, this.textarea.selectionStart, this.textarea.selectionEnd, 'end');
    };

    const deleteChar = (delKeyCode) => {
      const cursorPosition = this.textarea.selectionStart;
      const { selectionStart, selectionEnd } = this.textarea;
      const output = this.textarea.value;
      const setCursorPosition = (shift = 0) => {
        ['Start', 'End'].forEach((el) => {
          this.textarea[`selection${el}`] = cursorPosition - shift;
        });
      };

      if (selectionStart !== selectionEnd) {
        this.textarea.value = output.slice(0, selectionStart)
            + output.slice(selectionEnd, output.length);
        setCursorPosition();
      } else if (delKeyCode === 'Backspace' && selectionStart !== 0) {
        this.textarea.value = output.slice(0, selectionStart - 1)
            + output.slice(selectionEnd, output.length);
        setCursorPosition(1);
      } else if (delKeyCode === 'Delete' && selectionEnd !== output.length) {
        this.textarea.value = output.slice(0, selectionStart)
            + output.slice(selectionEnd + 1, output.length);
        setCursorPosition();
      }
    };

    if (['mousedown', 'keydown'].includes(e.type)) {
      key.classList.add('active');
      this.textarea.focus();

      if (!key.dataset.isfucctionalKey
          || this.arrowKeys.includes(keyCode)) {
        insertChar(key.textContent);
      } else 
      
      if (this.specChars[keyCode]) {
        insertChar(this.specChars[keyCode]);
      } else 
      
      if (['Backspace', 'Delete'].includes(keyCode)) {
        deleteChar(keyCode);
      } else 
      
      if (['ShiftLeft', 'ShiftRight', 'CapsLock'].includes(keyCode)) {
        shiftCapsKeyboard(keyCode);
      } else 
      
      if (['ControlLeft', 'AltLeft'].includes(keyCode)) {
        this[`is${keyCode}Pressed`] = true;
        if (this.isControlLeftPressed && this.isAltLeftPressed) switchLang();
      } else
      
      if (keyCode === 'Lang') {
        switchLang();
      }
    } else if (['mouseup', 'mouseleave', 'keyup'].includes(e.type)) {
      deactivateKey();
    }
  };
};
const langCode = localStorage.getItem('keyboardLang') || 'en';
const keyboard = new Keyboard(langCode);
keyboard.init();