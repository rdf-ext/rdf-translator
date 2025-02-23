import { LitElement, html } from 'lit'
import style from './style.js'

class TextInput extends LitElement {
  static get styles () {
    return [style]
  }

  static get properties () {
    return {
      label: {
        type: String
      },
      value: {
        type: String
      }
    }
  }

  valueChange (event) {
    const options = {
      detail: {
        value: event.target.value
      }
    }

    this.dispatchEvent(new CustomEvent('change', options))
  }

  render () {
    return html`
      <div class="mb-3">
        <label class="form-label">${this.label}</label>
        <input class="form-control"
          .value=${this.value}
          @input=${this.valueChange}>
      </div>`
  }
}

export default TextInput
