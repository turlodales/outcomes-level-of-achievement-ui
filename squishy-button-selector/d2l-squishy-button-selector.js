/**
`d2l-squishy-button-selector`
LitElement component for a responsive list of selectable buttons

@demo demo/d2l-squishy-button-selector.html
*/

import { css, html, LitElement } from 'lit-element/lit-element.js';
import { ArrowKeysMixin } from '@brightspace-ui/core/mixins/arrow-keys-mixin.js';

export class D2lSquishyButtonSelector extends ArrowKeysMixin(LitElement) {

	static get properties() {
		return {
			selectedIndex: {
				type: Number,
				attribute: 'selected-index',
				reflect: true
			},
			_focused: Boolean,
			disabled: {
				type: Boolean,
				attribute: 'disabled',
				reflect: true
			},
			tooltipPosition: {
				type: String,
				attribute: 'tooltip-position'
			},
			focusWhenDisabled: {
				type: Boolean,
				attribute: 'focus-when-disabled'
			},
			_buttons: { attribute: false }
		};
	}

	static get styles() {
		return css`
			:host {
				display: flex;
				height: 1.6rem;
				position: relative;
			}
			.arrow-keys-container {
				display: flex;
				height: 1.6rem;
				position: relative;
				border-radius: 6px;
				width: 100%;
			}

			::slotted(d2l-squishy-button) {
				display: inline-block;
				height: 100%;
				object-fit: fill;
				flex: 1;
			}
			::slotted(d2l-squishy-button:last-of-type) {
				border-top-right-radius: 6px;
				border-bottom-right-radius: 6px;
			}

			:host([dir="rtl"]) ::slotted(d2l-squishy-button:last-of-type) {
				border-top-left-radius: 6px;
				border-bottom-left-radius: 6px;
				border-top-right-radius: 0;
				border-bottom-right-radius: 0;
			}

			::slotted(d2l-squishy-button:first-of-type) {
				border-top-left-radius: 6px;
				border-bottom-left-radius: 6px;
			}

			:host([dir="rtl"]) ::slotted(d2l-squishy-button:first-of-type) {
				border-top-right-radius: 6px;
				border-bottom-right-radius: 6px;
				border-top-left-radius: 0;
				border-bottom-left-radius: 0;
				margin-left: -1px;
			}

			:host([disabled]) {
				cursor: default;
				pointer-events: none;
			}

			[hidden] {
				display: none !important;
			}
		`;
	}

	constructor() {
		super();
		this.addEventListener('d2l-squishy-button-selection-changed', this._onItemSelected);
		this.addEventListener('squishy-button-text-changed', this._setShortTextIfAppropriate);
		this.addEventListener('squishy-button-focus-changed', this._setShortTextIfAppropriate);
		this._getListOfAllButtons = this._getListOfAllButtons.bind(this);
		this.shadowRoot.addEventListener('slotchange', this._getListOfAllButtons, true);
		this.arrowKeysDirection = 'leftright';
		this.arrowKeysNoWrap = true;
		this._focused = false;
		this.focusWhenDisabled = false;
		this._pushTabIndex('0');
		this._buttons = [];
	}

	set disabled(disabled) {
		const buttonList = this;

		this._setButtonProperties();
		if (!this.focusWhenDisabled) {
			if (disabled && buttonList.getAttribute('tabindex') === '-1'
				|| !disabled && buttonList.getAttribute('tabindex') === '0'
			) {
				return;
			}

			if (disabled) {
				this._pushTabIndex('-1');
			} else if (this._prevTabIndex !== null && this._prevTabIndex !== '-1') {
				this._popTabIndex();
			} else {
				buttonList.setAttribute('tabindex', '0');
			}
		}

		if (disabled) {
			this.setAttribute('aria-disabled', 'true');
		}
		else {
			this.removeAttribute('aria-disabled');
		}
	}

	firstUpdated() {
		this.addEventListener('focus', this._onFocus, true);
		this.addEventListener('blur', this._onBlur, true);
		this.addEventListener('mouseover', this._onHover, true);
	}

	render() {
		return this.arrowKeysContainer(html`<slot></slot>`);
	}

	updated() {
		this._handleDomChanges();
		this._setShortTextIfAppropriate();
	}

	async arrowKeysFocusablesProvider() {
		return this._buttons;
	}

	_getListOfAllButtons() {
		const childElements = this.children;
		this._buttons = [];
		for (let i = 0; i < childElements.length; i++) {
			const element = childElements[i];
			if (element.tagName === 'D2L-SQUISHY-BUTTON') {
				this._buttons.push(element);
			}
		}
	}

	_handleDomChanges() {
		this._setButtonProperties();
		this._updateButtonSelectedAttribute();
	}

	_onBlur() {
		this._focused = false;
		this._popTabIndex('-1');
	}

	_onFocus(event) {
		if (this._focused) {
			return;
		}
		this._handleDomChanges();
		this._pushTabIndex('-1');

		const focusIndex = (this.selectedIndex > -1 && this.selectedIndex) || 0;
		if ((this._buttons || [])[focusIndex] && event.target.nodeName === 'D2L-SQUISHY-BUTTON-SELECTOR') {
			this._buttons[focusIndex].focus();
		}
		this._focused = true;
	}

	_onItemSelected(event) {
		if (event.detail.selected) {
			this.selectedIndex = event.detail.index;
		} else if (this.selectedIndex === event.detail.index) {
			this.selectedIndex = undefined;
		}
		event.preventDefault();
	}

	_popTabIndex() {
		this.setAttribute('tabindex', this._prevTabIndex);
		this._prevTabIndex = null;
	}

	_pushTabIndex(tabindex) {
		if (this._prevTabIndex === null || this._prevTabIndex === undefined) {
			this._prevTabIndex = this.hasAttribute('tabindex') ? this.getAttribute('tabindex') : null;
		}
		this.setAttribute('tabindex', tabindex);
	}

	_setButtonProperties() {
		if (!this._buttons) {
			return;
		}
		for (let i = 0; i < this._buttons.length; i++) {
			const button = this._buttons[i];
			button.setAttribute('index', i);
			if (this.hasAttribute('disabled')) {
				button.setAttribute('disabled', '');
			} else {
				button.removeAttribute('disabled');
			}
			if (this.tooltipPosition) {
				button.setAttribute('tooltip-position', this.tooltipPosition);
			}
		}
	}

	_setShortTextIfAppropriate() {
		if (!this._buttons || this._buttons.length === 0) {
			return;
		}

		const regex = /([^\d]*)(\d+)$/;

		let toMatch;
		let prevNum;

		const toSet = [];
		let hasShortText = true;

		for (let i = 0; i < this._buttons.length; i++) {
			const text = this._buttons[i].getAttribute('text');
			const match = regex.exec(text || '');
			if (!match) {
				hasShortText = false;
				break;
			}
			const preText = match[1];
			const num = Number.parseInt(match[2]);
			if (!toMatch) {
				toMatch = preText;
				prevNum = num;
			} else {
				if (preText !== toMatch || num !== ++prevNum) {
					hasShortText = false;
					break;
				}
			}

			toSet.push({
				button: this._buttons[i],
				text: num
			});
		}

		if (hasShortText) {
			toSet.forEach((item) => {
				item.button.setAttribute('short-text', item.text);
			});
		} else {
			this._buttons.forEach((button) => {
				button.removeAttribute('short-text');
			});
		}
	}

	_updateButtonSelectedAttribute() {
		if (!this._buttons) {
			return;
		}

		if (this.selectedIndex === undefined) {
			const selected = this._buttons.filter((button) => {
				return button.hasAttribute('selected');
			});
			if (selected.length > 0) {
				this.selectedIndex = selected[0].index;
				return;
			}
		}

		for (let i = 0; i < this._buttons.length; i++) {
			if (i === this.selectedIndex) {
				this._buttons[i].setAttribute('selected', '');
				this._buttons[i].setAttribute('aria-checked', 'true');
			} else {
				this._buttons[i].removeAttribute('selected');
				this._buttons[i].setAttribute('aria-checked', 'false');
			}
		}
	}

}

customElements.define('d2l-squishy-button-selector', D2lSquishyButtonSelector);
