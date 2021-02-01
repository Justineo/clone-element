# clone-element

Clone HTML elements with styles.

## Installation

```sh
npm i -save clone-element
```

## Usage

```js
import { cloneElement } from 'clone-element'

document.body.appendChild(cloneElement(document.querySelector('h1'))
```

## Features and limitations

* ✅ Clone with styles.

  > ⭕️ Default style for native inputs may work unexpectedly, as they ususally rely on browsers' private CSS extensions thus computed styles become not useful under certain conditions.

* ✅ Support styles for psuedo elements (listed below).

  * `::after`
  * `::before`
  * `::first-letter`
  * `::first-line`
  * `::marker`
  * `::placeholder`

    > ⭕️ Only works for Firefox. Chrome/Safari do not report correct computed style for `::placeholder`.

  * `::selection`

* ✅ Copy content from an existing `<canvas>` element.
* ✅ Include fixes for grouped `<input type="radio">`s.
* ✅ Copy input `value`s to cloned element.

  > ⭕️ `<input type="file">` is not supported.

* ✅ Try to synchronize state between `<video>` elements.

  > ⭕️ May not work for cross domain videos without `crossorigin` and CORS settings.

* ✅ Fix “contextual” HTML attributes like `lang`/`dir`/`disabled`.
