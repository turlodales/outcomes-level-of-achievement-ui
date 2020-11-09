/**
`d2l-outcomes-coa-eval-override`
LitElement component to display controls for course overall achievements

@demo demo/d2l-outcomes-coa-eval-override.html
*/

import '@brightspace-ui/core/components/typography/typography.js';
import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/button/button-icon.js';
import '@brightspace-ui/core/components/button/button-subtle.js';
import '@brightspace-ui/core/components/dialog/dialog.js';

import './d2l-outcomes-level-of-achievements.js';

import { css, html, LitElement } from 'lit-element/lit-element.js';
import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit.js';
import { bodySmallStyles, bodyStandardStyles, heading3Styles, labelStyles } from '@brightspace-ui/core/components/typography/styles';
import { LocalizeMixin } from './localize-mixin.js';
import { DemonstrationEntity } from './entities/DemonstrationEntity';
import { keyCodes, calcMethods } from './consts.js';

export class D2lOutcomesCOAEvalOverride extends EntityMixinLit(LocalizeMixin(LitElement)) {

	static get properties() {
		return {
			_isOverrideActive: { attribute: false },

			_isOverrideAllowed: { attribute: false },

			_newAssessmentsAdded: { attribute: false },

			_calculationMethod: { attribute: false },

			_calculationMethodKey: {attribute: false},

			_calculatedAchievementValue: { attribute: false },

			_levelSelector: { attribute: false },

			_helpPopupItems: { attribute: false }
		};
	}

	static get styles() {
		return [
			css`
				.d2l-suggestion-text {
					margin: 0.3rem 0 0.3rem 0;
				}

				.page-heading {
					margin: 0;
					float: left;
				}

				:host([dir="rtl"]) .page-heading {
					margin: 0;
					float: right;
				}

				.flex-box {
					width: 100%;
				}

				.title-container {
					float: left;
					margin-top: 0;
					margin-bottom: 0;
				}

				:host([dir="rtl"]) .title-container {
					float: right;
					margin-top: 0;
					margin-bottom: 0;
				}

				.calculate-button-container {
					float: right;
					width: 2.2rem;
					height: 2.2rem;
					margin-top: 1.2rem;
				}

				:host([dir="rtl"]) .calculate-button-container {
					float: left;
				}

				.calculation-label {
					float: left;
					padding-bottom: 0.6rem;
				}

				:host([dir="rtl"]) .calculation-label {
					float: right;
				}

				.decaying-average-info {
					padding-bottom: 0.5rem;
				}

				#help-button {
					float: left;
					margin-left: 0.3rem;
					margin-top: -0.6rem;
				}

				:host([dir="rtl"]) #help-button {
					float: right;
				}

				.help-item-label {
					display: block;
					margin-bottom: 0.9rem;
				}

				.help-item-content {
					display: block;
					margin-bottom: 1.5rem;
				}

				d2l-outcomes-level-of-achievements {
					width: 100%;
					margin-bottom: 0.6rem;
					margin-top: 0.3rem;
				}

				:host {
					display: block;
				}
			`,
			bodySmallStyles,
			bodyStandardStyles,
			heading3Styles,
			labelStyles
		];
	}

	_renderElementHeading() {
		return html`
			<div class="flex-box">
				<h2 class="page-heading d2l-heading-3">${this.localize('selectOverallAchievement')}</h2>
				${this._renderCalcButton()}
			</div>
		<div style="clear: both;"></div>`;
	}

	_renderCalcButton() {
		if (this._isCalculationUpdateNeeded()) {
			return html`
			<span class="calculate-button-container">
				<d2l-button-icon id="calculate-button"
					@click=${this._onCalcButtonClicked}
					text="${this.localize('recalculateOverallAchievement')}"
					icon="tier1:calculate">
				</d2l-button-icon>
			</span>`;
		}
		return null;
	}

	_renderCalculationMethod(calcMethod) {
		if (calcMethod) {
			return html`
			<div class="calculation-info">
				<span class="calculation-label d2l-body-small">
					${this.localize('calculationMethod', 'calcMethod', calcMethod)}
				</span>
				${this._renderCalculationHelp()}
			</div>
			
			<div style="clear: both;"></div>`;
		}
		return null;
	}

	_renderCalculationHelp() {
		if (this._helpPopupItems.length > 0) {
			return html`
			<d2l-button-icon id="help-button"
				@click=${this._onHelpButtonClicked}
				text="${this.localize('calculationMethodDetails')}"
				icon="tier1:help">
			</d2l-button-icon>
			<d2l-dialog id="help-dialog" title-text="${this.localize('calculationMethodDetails')}">
				${this._helpPopupItems.map((item) => html`
					<div class="help-item-label d2l-label"><b>${item.label}:</b></div>
					<div class="help-item-content d2l-body-standard">${item.content}</div>
				`)}
				<d2l-button slot="footer" primary data-dialog-action="done">OK</d2l-button>
			</d2l-dialog>`;
		}
		return null;
	}

	_renderCalculatedValue(calcMethod, methodKey, value) {
		if (methodKey === calcMethods.decayingAverage) {
			return html`
			<div class="decaying-average-info d2l-body-small">
				${this.localize('calculatedValue', 'calcMethod', calcMethod, 'value', value)}
			</div>`;
		}
		return null;
	}

	_renderAchievementSelector() {
		return html`
		<d2l-outcomes-level-of-achievements
			id="level-selector"
			tooltip-position="top"
			?read-only="${!this._canEditLevel()}"
			disable-suggestion=""
			disable-auto-save=""
			.token="${this.token}"
			href="${this.getAttribute('href')}"
			@d2l-outcomes-level-of-achievements-item-selected=${this._onItemSelected}>
		</d2l-outcomes-level-of-achievements>`;
	}

	_renderOverrideButton() {
		if (this._isOverrideAllowed && !!this._calculationMethod) {
			return html`
	        <d2l-button-subtle id="override-button"
			    @click=${this._onOverrideButtonClicked}
					text="${this.localize(this._isOverrideActive ? 'clearManualOverride' : 'manuallyOverride')}"
                    icon="${this._isOverrideActive ? 'tier1:close-default' : 'tier1:edit'}"
			/>`;
		}
		return null;
	}

	render() {
		return html`
		${this._renderElementHeading()}
		${this._renderCalculationMethod(this._calculationMethod)}
		${this._renderCalculatedValue(this._calculationMethod, this._calculationMethodKey, this._calculatedAchievementValue)}
		${this._renderAchievementSelector()}
		${this._renderOverrideButton()}
		`;
	}

	constructor() {
		super();

		this._setEntityType(DemonstrationEntity);

		this._isOverrideActive = false;
		this._isOverrideAllowed = false;
		this._newAssessmentsAdded = false;
		this._calculationMethod = null;
		this._calculationMethodKey = null;
		this._entity = null;
		this._helpPopupItems = [];

		this._onCalcButtonClicked = this._onCalcButtonClicked.bind(this);
		this._onOverrideButtonClicked = this._onOverrideButtonClicked.bind(this);
		this._onHelpButtonClicked = this._onHelpButtonClicked.bind(this);

		this.addEventListener('d2l-squishy-button-selected', this._onItemSelected);
		this.addEventListener('d2l-coa-manual-override-enabled', this._onOverrideEnabled);
		this.addEventListener('keydown', this._onKeyDown);
	}

	firstUpdated() {
		this._levelSelector = this.shadowRoot.getElementById('level-selector');
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

		let calcMethod, calcMethodKey;
		let helpMenuEntities = [];
		const calcAchievementValue = entity.getCalculatedValue();
		const newAssessments = entity.hasNewAssessments();

		const levels = entity.getAllDemonstratableLevels();
		entity.onCalcMethodChanged(method => {
			if (!method) {
				return;
			}
			calcMethod = method.getName();
			calcMethodKey = method.getKey();
			helpMenuEntities = method.getSettings();
		});

		entity.subEntitiesLoaded().then(() => {

			this._calculationMethod = calcMethod;
			this._calculationMethodKey = calcMethodKey;
			this._calculatedAchievementValue = calcAchievementValue;
			this._newAssessmentsAdded = newAssessments;

			this._helpPopupItems = [];
			helpMenuEntities.forEach((item) => {
				var helpItemObj = {
					label: item.getName(),
					content: item.getContent()
				};
				this._helpPopupItems.push(helpItemObj);
			});

			this._isOverrideAllowed = false;
			this._isOverrideActive = false;
			for (var i = 0; i < levels.length; i++) {
				const level = levels[i];
				const suggested = level.isSuggested();
				const selectAction = level.getSelectAction();

				if (selectAction) {
					this._isOverrideAllowed = true;
				}
				if (suggested && selectAction) {
					this._isOverrideActive = true;
				}
			}
		});
	}

	_isCalculationUpdateNeeded() {
		return !!this._calculationMethod && this._newAssessmentsAdded && this._isOverrideActive;
	}

	_canEditLevel() {
		return (this._isOverrideActive || !this._calculationMethod);
	}
	//For keyboard accessibility
	_onKeyDown(event) {
		if (event.keyCode === keyCodes.enter || event.keyCode === keyCodes.space) {
			this.shadowRoot.activeElement.click();
			event.preventDefault();
		}
	}

	_onItemSelected() {
		this._dispatchChangeEvent();
	}

	_onOverrideButtonClicked() {
		this._dispatchChangeEvent();
		if (!this._isOverrideActive) {
			this._isOverrideActive = true;
			this._levelSelector.enableAndFocus();
		}
		else {
			if (this._isCalculationUpdateNeeded()) {
				this._updateLevelCalculation();
			}
			this._levelSelector.resetToSuggested();
			this._isOverrideActive = false;
		}
	}

	_onCalcButtonClicked() {
		if (this._updateLevelCalculation()) {
			//Calculation successfully updated
			this._dispatchChangeEvent();
			this._levelSelector.resetToSuggested();
			this._isOverrideActive = false;
		}
	}

	_onHelpButtonClicked() {
		var helpDialog = this.shadowRoot.getElementById('help-dialog');
		if (!helpDialog) {
			return;
		}
		if (!helpDialog.opened) {
			helpDialog.opened = true;
		}
	}

	_updateLevelCalculation() {
		//Calculation request will be sent here. This will retrieve a calculated value and any corresponding data
		this._newAssessmentsAdded = false;
		return true;
	}

	_dispatchChangeEvent() {
		this.dispatchEvent(new CustomEvent('d2l-outcomes-coa-eval-override-change', {
			bubbles: true,
			composed: true
		}));
	}
}

customElements.define('d2l-outcomes-coa-eval-override', D2lOutcomesCOAEvalOverride);
