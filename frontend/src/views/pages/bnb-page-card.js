import { LitElement, css, html } from 'lit-element';
import '@material/mwc-icon';
import '@material/mwc-ripple';
import { connect } from 'pwa-helpers';
import { store } from '../../state/store';
import { getRequestUrl } from '../../utilities/api';
import { updateRoute } from '../../state/app/actions';
import { styles } from '../components/bnb-styles';
import '../components/bnb-card';
import '../components/bnb-lazy-image';
import './bnb-down-alert';
import './bnb-gauge';

class BnbPageCard extends connect(store)(LitElement) {
  static get properties() {
    return {
      page: { type: Object },
    };
  }

  static get styles() {
    return [
      styles,
      css`
      bnb-card {
        display: block;
        cursor: pointer;
        padding: 0;
        width: 100%;
      }

      mwc-icon {
        display: inline-block;
        padding-right: 4px;
        vertical-align: sub;
      }

      .cardContent {
        display: flex;
        flex-direction: row;
        padding: 16px 0 16px 16px;
      }

      .leftContent {
        max-width: calc(100% - 50px);
        flex-grow: 1;
      }

      h2 {
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      a {
        display: block;
        color: #9e9e9e;
        text-decoration: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      a:hover {
        text-decoration: underline;
      }

      .locked {
        filter: blur(3px);
      }

      .hurt {
        animation: pulse 5s infinite;
        filter: grayscale(0);
      }

      @keyframes pulse {
        0% {filter: grayscale(0)}
        50% {filter: grayscale(100%)}
        100% {filter: grayscale(0)}
      }
      `,
    ];
  }

  render() {
    return html`
    <bnb-card
      class="${this.computeCardClass(this.page)}"
      @click="${this.cardTapped}"
      @focus="${this.handleRippleFocus}"
      @blur="${this.handleRippleBlur}"
      @mousedown="${this.handleRippleActivate}"
      @mouseup="${this.handleRippleDeactivate}"
      @mouseenter="${this.handleRippleMouseEnter}"
      @mouseleave="${this.handleRippleMouseLeave}"
      @touchstart="${this.handleRippleActivate}"
      @touchend="${this.handleRippleDeactivate}"
      @touchcancel="${this.handleRippleDeactivate}">
      <bnb-lazy-image src="${this.getScreenshotUrl(this.page)}"></bnb-lazy-image>
      <div class="cardContent">
        <div class="leftContent">
          <h2><mwc-icon>${this.computeIcon(this.page)}</mwc-icon>${this.page.name}</h2>
          <a href="${this.page.url}" @click="${this.urlTapped}" target="_blank" title="Open url in a new tab" rel="noopener">${this.page.url}</a>
        </div>       
        ${this.renderDownAlert()}
        ${this.renderGauge()}
      </div>
      <mwc-ripple id="ripple"></mwc-ripple>
    </bnb-card>
    `;
  }

  renderDownAlert() {
    return this.page.uptime_status === 0 ? html`<bnb-down-alert class="hurt rightContent" lastDowntime="${this.page.last_downtime}"></bnb-down-alert>` : html``;
  }

  renderGauge() {
    return this.page.uptime_status !== 0 ? html`<bnb-gauge class="rightContent" score="${this.page.current_week_lh_score}" lastScore="${this.page.last_week_lh_score}"></bnb-gauge>` : html``;
  }

  stateChanged() {
    // Nothing to do
  }

  cardTapped() {
    store.dispatch(updateRoute(`page/${this.page.id}`));
  }

  urlTapped(e) {
    e.stopPropagation();
  }

  getScreenshotUrl(item) {
    return getRequestUrl(`pages/${item.id}/screenshot?style=thumb`);
  }

  computeIcon(item) {
    return item.device === 'mobile' ? 'smartphone' : 'computer';
  }

  computeCardClass(item) {
    if (item.locked) {
      return 'locked';
    }

    if (item.uptime_status === 0) {
      return 'hurt';
    }

    return '';
  }

  get ripple() {
    return this.shadowRoot.getElementById('ripple');
  }

  handleRippleActivate(e) {
    this.ripple.startPress(e);
  }

  handleRippleDeactivate() {
    this.ripple.endPress();
  }

  handleRippleMouseEnter() {
    this.ripple.startHover();
  }

  handleRippleMouseLeave() {
    this.ripple.endHover();
  }

  handleRippleFocus() {
    this.ripple.startFocus();
  }

  handleRippleBlur() {
    this.ripple.endFocus();
  }
}
window.customElements.define('bnb-page-card', BnbPageCard);
