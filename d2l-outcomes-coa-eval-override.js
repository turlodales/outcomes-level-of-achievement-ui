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
import { LocalizeMixin } from './localize-mixin.js';
import { DemonstrationEntity } from './entities/DemonstrationEntity';
import { KEYCODES } from './keycodes.js';

export class D2lOutcomesCOAEvalOverride extends EntityMixinLit(LocalizeMixin(LitElement)) {

	static get properties() {
		return {
			_isOverrideActive: { attribute: false },

			_isOverrideAllowed: { attribute: false },

			_newAssessmentsAdded: { attribute: false },

			_calculationMethod: { attribute: false },

			_calculatedAchievementValue: { attribute: false },

			_levelSelector: { attribute: false },

			_helpPopupItems: { attribute: false }
		};
	}

	static get styles() {
		return css`
			.d2l-suggestion-text {
				@apply --d2l-body-small-text;
				margin: 0.3rem 0 0.3rem 0;
			}

			.page-heading {
				@apply --d2l-heading-3;
				margin: 0;
				padding-top: 36px;
				padding-bottom: 10px;
				float: left;
			}

			:host([dir="rtl"]) .page-heading {
				@apply --d2l-heading-3;
				margin: 0;
				padding-top: 36px;
				padding-bottom: 10px;
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
				width: 44px;
				height: 44px;
				margin: 0px;
				padding-top: 24px;
			}
			:host([dir="rtl"]) .calculate-button-container {
				float: left;
				width: 44px;
				height: 44px;
				margin: 0px;
				padding-top: 24px;
			}

			.calculation-label {
				@apply --d2l-body-small-text;
				float: left;
				margin-top: 20px;
				margin-bottom: 12px;
			}
			:host([dir="rtl"]) .calculation-label {
				@apply --d2l-body-small-text;
				float: right;
				margin-top: 20px;
				margin-bottom: 12px;
			}

			.decaying-average-info {
				@apply --d2l-body-small-text;
				margin-top: 0px;
				margin-bottom: 12px;				
			}

			:host([dir="rtl"]) .decaying-average-info {
				@apply --d2l-body-small-text;
				margin-top: 0px;
				margin-bottom: 12px;				
			}

			#help-button {
				float: left;
				margin-bottom: 0px;
				margin-top: 6px;
				margin-left: 6px;
			}

			d2l-dialog p {
				@apply --d2l-body-text;
				display: block;
				content: "";
				margin-top: 30px;
			}

			d2l-dialog br {
				display: block;
				content: "";
				margin-top: 18px;
			}

			:host([dir="rtl"]) #help-button {
				float: right;
				margin-bottom: 0px;
				margin-top: 6px;
				margin-right: 6px;
			}

			.decaying-average-info {
				@apply --d2l-body-small-text;
				padding-bottom: 12px;
				padding-top: 0px;
			}

			d2l-outcomes-level-of-achievements {
				width: 100%;
				padding-bottom: 12px;
				padding-top: 0px;
			}

			:host {
				display: block;
			}
		`;
	}

	_renderElementHeading() {
		return html`
			<div class="flex-box">
				<h3 class="page-heading">Select Overall Achievement</h3>
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

	_renderCalculationMethod() {
		if (this._calculationMethod) {
			return html`
			<div class="calculation-info">
				<span class="calculation-label">
					Calculation method: ${this._calculationMethod}
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
					<p><b>${item.label}:</b><br>${item.content}</p>
				`)}
				<d2l-button slot="footer" primary data-dialog-action="done">OK</d2l-button>
			</d2l-dialog>`;
		}
		return null;
	}

	_renderCalculatedValue() {
		if (this._calculationMethod === 'Decaying Average') {
			return html`
			<div class="decaying-average-info">
				${this._calculationMethod}: ${this._calculatedAchievementValue}
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
			token="${this.getAttribute('token')}"
			href="${this.getAttribute('href')}">
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
		${this._renderCalculationMethod()}
		${this._renderCalculatedValue()}
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

		let calcMethod;
		let helpMenuEntities = [];
		const calcAchievementValue = entity.getCalculatedValue();
		const newAssessments = entity.hasNewAssessments();

		const levels = entity.getAllDemonstratableLevels();

		entity.onCalcMethodChanged(method => {
			if (!method) {
				return;
			}
			calcMethod = method.getName();
			helpMenuEntities = method.getSettings();
		});

		entity.subEntitiesLoaded().then(() => {

			this._calculationMethod = calcMethod;
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
		if (event.keyCode === KEYCODES.ENTER || event.keyCode === KEYCODES.SPACE) {
			this.shadowRoot.activeElement.click();
			event.preventDefault();
		}
	}

	_onOverrideButtonClicked() {
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
}

customElements.define('d2l-outcomes-coa-eval-override', D2lOutcomesCOAEvalOverride);
