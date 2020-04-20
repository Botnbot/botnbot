import { LitElement, css, html } from 'lit-element';
import '@material/mwc-button/mwc-button';
import '@material/mwc-textfield';
import './bnb-auth-form';
import { connect } from 'pwa-helpers';
import { store } from '../store';
import { forgotPassword } from '../actions/auth';
import { getFullPath } from '../common';

class BnbForgotPassword extends connect(store)(LitElement) {
  static get styles() {
    return css`
    mwc-textfield {
      width: 100%;
    }
    `;
  }

  render() {
    return html`
    <bnb-auth-form id="forgot" title="Password forgotten" .buttons="${this.forgotButtons}">
      <mwc-textfield id="email" label="E-mail" type="email" outlined value="${this.email}">
      </mwc-textfield>

      <div class="actions">
        <mwc-button id="forgotBtn">Reset password</mwc-button>
      </div>
    </bnb-auth-form>
    `;
  }

  static get properties() {
    return {
      forgotButtons: { type: Array },
      email: { type: String },
    };
  }

  _stateChanged() {
    // nothing to do
  }

  constructor() {
    super();
    this.email = '';
    this.forgotButtons = [{ text: 'Sign up', path: '/signup' }, { text: 'Sign in', path: '/signin' }];
  }

  firstUpdated() {
    this.shadowRoot.getElementById('forgotBtn').addEventListener('tap', () => this.submitTapped());
  }

  submitTapped() {
    const email = this.shadowRoot.getElementById('email').value;
    store.dispatch(forgotPassword(email, getFullPath('edit-password')));
  }
}

window.customElements.define('bnb-forgot-password', BnbForgotPassword);
