/**
`d2l-outcomes-level-of-achievements`
LitElement component to display levels of achievements
@demo demo/d2l-outcomes-level-of-achievements.html
*/

import './squishy-button-selector/d2l-squishy-button.js';
import './squishy-button-selector/d2l-squishy-button-selector.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { bodySmallStyles } from '@brightspace-ui/core/components/typography/styles';
import { DemonstrationEntity } from './entities/DemonstrationEntity';
import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit.js';
import { LocalizeMixin } from './localize-mixin.js';
import { performSirenAction } from 'siren-sdk/src/es6/SirenAction.js';

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
			},
			focusWhenDisabled: {
				type: Boolean,
				attribute: 'focus-when-disabled'
			}
		};
	}

	static get styles() {
		return [
			bodySmallStyles,
			css`
				d2l-squishy-button-selector {
					width: 100%;
				}
				d2l-squishy-button {
					max-width: 9rem;
				}
				.d2l-body-small {
					margin: 0.3rem 0 0.3rem 0;
				}
				:host {
					display: block;
				}
			`
		];
	}

	constructor() {
		super();

		this._setEntityType(DemonstrationEntity);

		this.readOnly = false;
		this.disableSuggestion = false;
		this.hasAction = false;
		this.disableAutoSave = false;
		this.focusWhenDisabled = false;
		this._demonstrationLevels = [];
		this._suggestedLevel = null;
		this._refresh = this._refresh.bind(this);
	}

	connectedCallback() {
		super.connectedCallback();
		window.addEventListener('refresh-outcome-demonstrations', this._refresh);
	}

	disconnectedCallback() {
		window.removeEventListener('refresh-outcome-demonstrations', this._refresh);
		super.disconnectedCallback();
	}

	firstUpdated() {
		this._onItemSelected = this._onItemSelected.bind(this);
		this.shadowRoot.querySelector('d2l-squishy-button-selector').addEventListener('d2l-squishy-button-selected', this._onItemSelected);
	}

	render() {
		return html`
			${this._renderSuggestedLevel()}
			<d2l-squishy-button-selector role="radiogroup" tooltip-position="top" ?disabled=${this.readOnly || !this._hasAction} ?focus-when-disabled=${this.focusWhenDisabled}>
				${this._demonstrationLevels.map((item, i) => this._renderDemonstrationLevel(item, i))}
			</d2l-squishy-button-selector>`;
	}

	enableAndFocus() {
		this.readOnly = false;
		const selector = this.shadowRoot.querySelector('d2l-squishy-button-selector');
		selector.removeAttribute('disabled');
		selector.focus();
	}

	resetToSuggested() {
		let suggestedElement;
		this._demonstrationLevels.map((level, i) => {
			const currentElement = this.shadowRoot.getElementById(`item-${  i.toString()}`);
			if (!currentElement) {
				return;
			}

			if (this._suggestedLevel && i === this._suggestedLevel.index) {
				suggestedElement = currentElement;
			}
			else if (currentElement.hasAttribute('selected')) {
				currentElement.click();
			}
		});

		if (suggestedElement) {
			suggestedElement.select();
		}
	}

	set _entity(entity) {
		if (this._entityHasChanged(entity)) {
			this._onEntityChanged(entity);
			super._entity = entity;
		}
	}

	_getSuggestedLevelText(level) {
		return this.localize('suggestedLevel', 'level', level);
	}

	_onEntityChanged(entity) {
		if (!entity) {
			return;
		}
		const demonstratableLevelEntities = entity.getAllDemonstratableLevels();
		const demonstratableLevelsDict = {};
		for (let i = 0; i < demonstratableLevelEntities.length; i++) {
			const level = demonstratableLevelEntities[i];
			level.onLevelChanged(achievementLevel => {
				const levelId = level.getLevelId();
				const levelObj = {
					action: level.getAction(this.disableAutoSave),
					selected: level.isSelected(),
					color: achievementLevel.getColor(),
					text: achievementLevel.getName(),
					isSuggested: level.isSuggested(),
					sortOrder: achievementLevel.getSortOrder()
				};
				demonstratableLevelsDict[levelId] = levelObj;
			});
		}
		entity.subEntitiesLoaded().then(() => {
			this._demonstrationLevels = Object.values(demonstratableLevelsDict).sort((left, right) => {
				return left.sortOrder - right.sortOrder;
			});
			let firstSuggested = undefined;
			let firstSuggestedIndex = null;
			for (let i = 0; i < this._demonstrationLevels.length; i++) {
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
			else {
				this._suggestedLevel = null;
			}
			this._hasAction = this._demonstrationLevels.some(level => !!level.action);
		});
	}

	_onItemSelected(event) {
		const action = event.detail.data.action;
		if (!this.token || !action) {
			return;
		}

		const sirenActionPromise = performSirenAction(this.token, action)
			.catch(() => { });
		this.dispatchEvent(new CustomEvent('d2l-outcomes-level-of-achievements-item-selected', {
			bubbles: true,
			composed: true,
			detail: {
				sirenActionPromise: sirenActionPromise
			}
		}));
	}

	_refresh() {
		const newEntity = window.D2L.Siren.EntityStore.fetch(this.href, this.token, true);
		this.entity = null;
		this.entity = newEntity;
	}

	_renderDemonstrationLevel(item, index) {
		return html`
		<d2l-squishy-button role="radio" color="${item.color}" ?selected="${item.selected}" .buttonData="${{ action: item.action }}" index="${index}" id="item-${index}" tabindex=-1>
			${item.text}
		</d2l-squishy-button>`;
	}

	_renderSuggestedLevel() {
		if (this._shouldShowSuggestion()) {
			return html`
			<div id="suggestion-label">
				<p class="d2l-body-small">${this.localize('suggestedLevel', 'level', this._suggestedLevel.text)}</p>
			</div>`;
		}
		return null;
	}

	_shouldShowSuggestion() {
		return (!this.readOnly && this._hasAction && !this.disableSuggestion && !!this._suggestedLevel);
	}

}

customElements.define('d2l-outcomes-level-of-achievements', D2lOutcomesLevelOfAchievements);
