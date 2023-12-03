import { LitElement, html } from 'lit'
import style from 'rdf-elements/src/style.js'
import rdf from 'rdf-ext'

class RdfPrefixes extends LitElement {
  static get styles () {
    return style()
  }

  static get properties () {
    return {
      prefixes: {
        type: Object
      },
      value: {
        type: String
      }
    }
  }

  constructor () {
    super()

    this.prefixes = new Map()
  }

  firstUpdated () {
    this.prefixesChange()

    super.firstUpdated()
  }

  prefixesChange (event) {
    const text = this.renderRoot.querySelector('textarea').value
    const matches = [...text.matchAll(/([a-z0-9]+)[\s:<]+(http[s]?[^>^\s]*)/g)]

    this.prefixes = new Map(matches.map(r => [r[1], rdf.namedNode(r[2])]))

    const options = {
      detail: {
        prefixes: this.prefixes
      }
    }

    this.dispatchEvent(new CustomEvent('change', options))
  }

  render () {
    return html`
      <div class="mb-3">
        <label class="form-label">Input</label>
        <textarea class="form-control" rows="6"
          @input=${this.prefixesChange}>${this.value}</textarea>
      </div>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>prefix</th>
            <th>namespace</th>
          </tr>
        </thead>
        <tbody>
          ${this.renderTable()}
        </tbody>
      </table>`
  }

  renderTable () {
    return [...this.prefixes].map(args => this.renderRow(...args))
  }

  renderRow (prefix, namespace) {
    return html`<tr><td>${prefix}</td><td>${namespace.value}</td></tr>`
  }
}

export default RdfPrefixes
