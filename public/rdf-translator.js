import '@vaadin/horizontal-layout'
import '@vaadin/split-layout'
import { documentStyle } from 'bs-elements'
import { LitElement, css, html, render } from 'lit'
import { hasChangedDataset } from 'rdf-elements/hasChanged.js'
import RdfEditor from 'rdf-elements/RdfEditor.js'
import RdfFormatSelector from 'rdf-elements/RdfFormatSelector.js'
import rdf from 'rdf-ext'
import RdfPrefixes from './lib/RdfPrefixes.js'
import style from './lib/style.js'
import TextInput from './lib/TextInput.js'

documentStyle()

document.getElementById('version').innerHTML = `${__APP_NAME__} version: ${__APP_VERSION__}` // eslint-disable-line no-undef

const defaultBase = 'http://example.org/'

const defaultData = `@base <https://housemd.rdf-ext.org/person/>. 
@prefix schema: <http://schema.org/>.
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.

<gregory-house> a schema:Person;
  schema:birthDate "1959-05-15"^^xsd:date;
  schema:familyName "House";
  schema:givenName "Gregory";
  schema:homeLocation <https://housemd.rdf-ext.org/place/221b-baker-street>;
  schema:jobTitle "Head of Diagnostic Medicine";
  schema:knows
    <allison-cameron>,
    <blythe-house>,
    <dominika-house>,
    <eric-foreman>,
    <james-wilson>,
    <jonathan-house>,
    <lisa-cuddy>,
    <robert-chase>.`

const defaultPrefixes = `schema: http://schema.org/
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.`

const sourceFormats = {
  'text/turtle': 'Turtle',
  'application/ld+json': 'JSON-LD',
  'application/rdf+xml': 'RDF/XML'
}

class RdfTranslator extends LitElement {
  static get styles () {
    return [
      style,
      css`
        vaadin-text-area {
        width: 100%;
        min-height: 100px;
        max-height: 150px;
      }
    `]
  }

  static get properties () {
    return {
      base: {
        type: Object
      },
      dataset: {
        type: Object,
        hasChanged: hasChangedDataset
      },
      mediaTypeInput: {
        type: String
      },
      mediaTypeOutput: {
        type: String
      },
      prefixes: {
        type: Object
      }
    }
  }

  constructor () {
    super()

    this.base = defaultBase
    this.dataset = null
    this.mediaTypeInput = 'text/turtle'
    this.mediaTypeOutput = 'application/ld+json'
    this.prefixes = new Map()
  }

  firstUpdated () {
    super.firstUpdated()
  }

  baseChange (event) {
    const baseValue = event.detail.value

    this.base = baseValue ? rdf.namedNode(baseValue) : null
  }

  dataChange (event) {
    this.dataset = event.detail.dataset
  }

  onMediaTypeInputChange (event) {
    this.mediaTypeInput = event.detail.mediaType
  }

  onMediaTypeOutputChange (event) {
    this.mediaTypeOutput = event.detail.mediaType
  }

  onPrefixChange (event) {
    this.prefixes = event.detail.prefixes
  }

  render () {
    return html`
      <vaadin-app-layout style="height: 100%;">
        <h1 slot="navbar">RDF Translator</h1>
        <vaadin-split-layout>
          <master-content>
            <h2>Input</h2>
            <rdf-format-selector
              .formats=${sourceFormats}
              .mediaType=${this.mediaTypeInput}
              @change=${this.onMediaTypeInputChange}>
            </rdf-format-selector>
            <rdf-editor
              height=800
              .mediaType=${this.mediaTypeInput}
              .factory=${rdf}
              .value=${defaultData}
              @change=${this.dataChange}>
            </rdf-editor>    
          </master-content>
          <detail-content>
            <h2>Output</h2>
            <rdf-format-selector
              .mediaType=${this.mediaTypeOutput}
              @change=${this.onMediaTypeOutputChange}>
            </rdf-format-selector>
            <rdf-editor
              height=800
              .mediaType=${this.mediaTypeOutput}
              .base=${this.base}
              .dataset=${this.dataset}
              .factory=${rdf}
              .prefixes=${this.prefixes}>
            </rdf-editor>    
          </detail-content>
        </vaadin-split-layout>
        <vaadin-split-layout>
          <master-content>
            <h2>Prefixes</h2>
            <rdf-prefixes
              .value=${defaultPrefixes}
              @change=${this.onPrefixChange}>
            </rdf-prefixes>
          </master-content>
          <detail-content>
            <h2>Others</h2>
            <text-input
              label="Base"
              .value=${this.base}
              @change=${this.baseChange}>
            </text-input>>
          </detail-content>
        </vaadin-split-layout>
      </vaadin-app-layout>
    `
  }
}

window.customElements.define('rdf-editor', RdfEditor)
window.customElements.define('rdf-format-selector', RdfFormatSelector)
window.customElements.define('rdf-prefixes', RdfPrefixes)
window.customElements.define('rdf-translator', RdfTranslator)
window.customElements.define('text-input', TextInput)

render(html`<rdf-translator></rdf-translator>`, document.querySelector('#translator'))
