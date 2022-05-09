import Key from './createKey.js'
import languages from './languages.js'

function createElement(tag, className, dataName, data, textContent) {
  const element = document.createElement(tag);
  if (className) element.classList.add(className);
  if (data) element.dataset[dataName] = data;
  if (textContent) element.textContent = textContent;

  return element;
}
class Keyboard {
  constructor(langCode) {
    this.specChars = {
      Enter: '\n',
      Space: ' ',
      Tab: '\t',
    };
    this.arrowKeys = ['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];
    this.langList = Object.keys(languages);
    this.currentLang = langCode;
    this.keyboardKeysObj = [];
    this.isCaps = false;
    this.isShiftPressed = false;
    this.isControlLeftPressed = false;
    this.isAltLeftPressed = false;
    this.keysMap = [
      ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace'],
      ['Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash', 'Delete'],
      ['CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter'],
      ['ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ArrowUp', 'ShiftRight'],
      ['ControlLeft', 'Lang', 'AltLeft', 'Space', 'AltRight', 'ArrowLeft', 'ArrowDown', 'ArrowRight', 'ControlRight'],
    ];
  }
}