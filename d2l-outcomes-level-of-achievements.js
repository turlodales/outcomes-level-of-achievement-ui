/**
`d2l-outcomes-level-of-achievements`
LitElement component to display levels of achievements
@demo demo/d2l-outcomes-level-of-achievements.html
*/

import { performSirenAction } from 'siren-sdk/src/es6/SirenAction.js';
import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit.js';

import './squishy-button-selector/d2l-squishy-button.js';
import './squishy-button-selector/d2l-squishy-button-selector.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { DemonstrationEntity } from './entities/DemonstrationEntity';
import { LocalizeMixin } from './localize-mixin.js';
export class D2lOutcomesLevelOfAchievements extends EntityMixinLit(LocalizeMixin(LitElement)) {

	static get properties() {
		return {
			readOnly: {
				type: Boolean,
				attribute: 'read-only'
			},
			_hasAction: { attribute: false },
			_demonstrationLevels: { attribute: false },
			_suggestedLevel: { attribute: false },
			disableSuggestion: {
				type: Boolean,
				attribute: 'disable-suggestion'
			},
			disableAutoSave: {
				type: Boolean,
				attribute: 'disable-auto-save'
			}
		};
	}

	static get styles() {
		return css`
			d2l-squishy-button-selector {
				width: 100%;
			}
			d2l-squishy-button {
				max-width: 9rem;
			}
			.d2l-suggestion-text {
				@apply --d2l-body-small-text;
				margin: 0.3rem 0 0.3rem 0;
			}
			:host {
				display: block;
			}
		`;
	}

	connectedCallback() {
		super.connectedCallback();
		window.addEventListener('refresh-outcome-demonstrations', this._refresh);
	}

	disconnectedCallback() {
		window.removeEventListener('refresh-outcome-demonstrations', this._refresh);
		super.disconnectedCallback();
	}

	_renderSuggestedLevel() {
		if (this._shouldShowSuggestion()) {
			return html`
			<div id="suggestion-label">
				<p class="d2l-suggestion-text">${this.localize('suggestedLevel', 'level', this._suggestedLevel.text)}</p>
			</div>`;
		}
		return null;
	}

	_renderDemonstrationLevel(item, index) {
		return html`
		<d2l-squishy-button color="${item.color}" ?selected="${item.selected}" .buttonData="${{ action: item.action }}" index="${index}" id="item-${index}">
			${item.text}
		</d2l-squishy-button>`;
	}

	render() {
		return html`
			${this._renderSuggestedLevel()}
			<d2l-squishy-button-selector tooltip-position="top" ?disabled=${this.readOnly || !this._hasAction}>
				${this._demonstrationLevels.map((item, i) => this._renderDemonstrationLevel(item, i))}
			</d2l-squishy-button-selector>`;
	}

	constructor() {
		super();

		this._setEntityType(DemonstrationEntity);

		this.readOnly = false;
		this.disableSuggestion = false;
		this.hasAction = false;
		this.disableAutoSave = false;
		this._demonstrationLevels = [];
		this._suggestedLevel = null;
		this._refresh = this._refresh.bind(this);
	}

	firstUpdated() {
		this._onItemSelected = this._onItemSelected.bind(this);
		this.shadowRoot.querySelector('d2l-squishy-button-selector').addEventListener('d2l-squishy-button-selected', this._onItemSelected);
	}

	set _entity(entity) {
		if (this._entityHasChanged(entity)) {
			this._onEntityChanged(entity);
			super._entity = entity;
		}
	}
	_onEntityChanged(entity) {
		if (!entity) {
			return;
		}
		const demonstratableLevelEntities = entity.getAllDemonstratableLevels();
		const demonstratableLevels = [];
		for (var i = 0; i < demonstratableLevelEntities.length; i++) {
			const level = demonstratableLevelEntities[i];
			level.onLevelChanged(achievementLevel => {
				var levelObj = {
					action: level.getAction(this.disableAutoSave),
					selected: level.isSelected(),
					color: achievementLevel.getColor(),
					text: achievementLevel.getName(),
					isSuggested: level.isSuggested(),
					sortOrder: achievementLevel.getSortOrder()
				};
				demonstratableLevels.push(levelObj);
			});
		}
		entity.subEntitiesLoaded().then(() => {
			demonstratableLevels.sort((left, right) => {
				return left.sortOrder - right.sortOrder;
			});
			this._demonstrationLevels = demonstratableLevels;
			var firstSuggested = undefined;
			var firstSuggestedIndex = null;
			for (var i = 0; i < this._demonstrationLevels.length; i++) {
				const level = this._demonstrationLevels[i];
				if (level.isSuggested) {
					firstSuggested = level;
					firstSuggestedIndex = i;
					break;
				}

			}
			if (typeof firstSuggested !== 'undefined') {
				const newSuggestedLevel = {
					text: firstSuggested.text,
					index: firstSuggestedIndex
				};
				this._suggestedLevel = newSuggestedLevel;
			}
			this._hasAction = this._demonstrationLevels.some(level => !!level.action);
		});
	}

	_shouldShowSuggestion() {
		return (!this.readOnly && this._hasAction && !this.disableSuggestion && !!this._suggestedLevel);
	}

	_onItemSelected(event) {
		this.dispatchEvent(new CustomEvent('d2l-outcomes-level-of-achievements-item-selected', {
			bubbles: true,
			composed: true
		}));
		var action = event.detail.data.action;
		if (!this.token || !action) {
			return;
		}
		performSirenAction(this.token, action)
			.catch(function() { });
	}

	_getSuggestedLevelText(level) {
		return this.localize('suggestedLevel', 'level', level);
	}

	enableAndFocus() {
		this.readOnly = false;
		const selector = this.shadowRoot.querySelector('d2l-squishy-button-selector');
		selector.removeAttribute('disabled');
		selector.focus();
	}

	resetToSuggested() {
		var suggestedLevelElement = this.shadowRoot.getElementById('item-' + this._suggestedLevel.index.toString());
		suggestedLevelElement.click();
	}

	_refresh() {
		const newEntity = window.D2L.Siren.EntityStore.fetch(this.href, this.token, true);
		this.entity = null;
		this.entity = newEntity;
	}
}

customElements.define('d2l-outcomes-level-of-achievements', D2lOutcomesLevelOfAchievements);
