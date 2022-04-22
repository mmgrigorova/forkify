import icons from 'url:../../img/icons.svg';
export default class View {
  _data;

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this.#clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // this algorithm is not the most efficient for big projects
  update(data) {
    this._data = data;

    const newMarkup = this._generateMarkup();

    // a virtual dom
    const newDOM = document.createRange().createContextualFragment(newMarkup);

    // select all the elements in the virtual dom
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const currEl = currElements[i];
      // console.log(currEl, newEl.isEqualNode(currEl));

      // update text
      if (!newEl.isEqualNode(currEl) && newEl?.firstChild?.nodeValue.trim() !== '') {
        currEl.textContent = newEl.textContent;
      }

      // updates changed attributes
      if (!newEl.isEqualNode(currEl)) {
        Array.from(newEl.attributes).forEach(attr => currEl.setAttribute(attr.name, attr.value));
      }
    })
  }


  renderSpinner = function () {
    const markup =
      `<div class="spinner">
        <svg>
        <use href="${icons}#icon-loader"></use>
        </svg>
        </div> `;
    this.#clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
        <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;
    this.#clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
        <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;
    this.#clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }


  #clear() {
    this._parentElement.innerHTML = '';
  }
}