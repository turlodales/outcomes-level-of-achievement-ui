/**
`d2l-outcomes-coa-eval-override`
Polymer Web-Component to display controls for course overall achievements

@demo demo/d2l-outcomes-coa-eval-override.html
*/
import '@polymer/polymer/polymer-legacy.js';

import '@brightspace-ui/core/components/typography/typography.js';
import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/button/button-icon.js';
import '@brightspace-ui/core/components/button/button-subtle.js';
import '@brightspace-ui/core/components/dialog/dialog.js';

import 'd2l-polymer-siren-behaviors/store/entity-store.js';
import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';
import 'd2l-polymer-siren-behaviors/store/siren-action-behavior.js';
import { Actions, Classes } from 'd2l-hypermedia-constants';

import './d2l-outcomes-level-of-achievements.js';

import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import './localize-behavior.js';
const $_documentContainer = document.createElement('template');

const KEYCODE_ENTER = 13;
const KEYCODE_SPACE = 32;

$_documentContainer.innerHTML = `<dom-module id="d2l-outcomes-coa-eval-override">
	<template strip-whitespace="">
		<style include="d2l-typography">

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

			:dir(rtl) .page-heading {
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
			:dir(rtl) .title-container {
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
			:dir(rtl) .calculate-button-container {
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
			:dir(rtl) .calculation-label {
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

			:dir(rtl) .decaying-average-info {
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

			:dir(rtl) #help-button {
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
		</style>
		<div class="flex-box">
			<h3 class="page-heading">Select Overall Achievement</h3>
			<template is="dom-if" if="[[_isCalculationUpdateNeeded(_calculationMethod, _newAssessmentsAdded, _isOverrideActive)]]">
				<span class="calculate-button-container">
					<d2l-button-icon id="calculate-button" onclick="[[_onCalcButtonClicked]]" text="[[localize('recalculateOverallAchievement')]]" icon="tier1:calculate"></d2l-button-icon>
				</span>
			</template>
		</div>

		<div style="clear: both;"></div>

		<template is="dom-if" if="[[_hasCalculation(_calculationMethod)]]">
			<div class="calculation-info">
				<span class="calculation-label">
					Calculation method: [[_calculationMethod]]
				</span>
				<template is="dom-if" if="[[_hasHelpMenu(_helpPopupItems)]]">
					<d2l-button-icon id="help-button" onclick="[[_onHelpButtonClicked]]" text="[[localize('calculationMethodDetails')]]" icon="tier1:help"></d2l-button-icon>
					<d2l-dialog id="help-dialog" title-text="[[localize('calculationMethodDetails')]]">
						<style>
							p {
								@apply --d2l-body-text;
								display: block;
								content: "";
								margin-top: 30px;
							}
			
							br {
								display: block;
								content: "";
								margin-top: 18px;
							}
						</style>
						<template is="dom-repeat" items="[[_helpPopupItems]]">
							<p><b>[[item.label]]:</b><br>[[item.content]]</p>
						</template>
						<d2l-button slot="footer" primary data-dialog-action="done">OK</d2l-button>
					</d2l-dialog>
				</template>
			</div>
		</template>

		<div style="clear: both;"></div>

		<template is="dom-if" if="[[_isDecayingAverageVisible(_calculationMethod)]]">
			<div class="decaying-average-info">
				[[_calculationMethod]]: [[_calculatedAchievementValue]]
			</div>
		</template>

		<d2l-outcomes-level-of-achievements id="level-selector" tooltip-position="top" read-only="[[!_canEditLevel(_isOverrideActive, _calculationMethod)]]" has-calculation="[[_hasCalculation(_calculationMethod)]]" token="[[token]]" href="[[href]]"></d2l-outcomes-level-of-achievements>
	
		<template is="dom-if" if="[[_shouldShowOverrideButton(_isOverrideAllowed, _calculationMethod)]]">
			<d2l-button-subtle id="override-button" onclick="[[_onOverrideButtonClicked]]" text="[[_getOverrideButtonText(_isOverrideActive)]]" icon="[[_getOverrideButtonIcon(_isOverrideActive)]]"></d2l-button-subtle>
		</template>

	</template>

</dom-module>`;

document.head.appendChild($_documentContainer.content);
Polymer({
	is: 'd2l-outcomes-coa-eval-override',

	properties: {

		_isOverrideActive: {
			type: Boolean,
			value: false
		},

		_isOverrideAllowed: {
			type: Boolean,
			value: false
		},

		_newAssessmentsAdded: {
			type: Boolean,
			value: false
		},

		_calculationMethod: {
			type: String,
			value: null
		},

		_calculatedAchievementValue: {
			type: Number,
			value: 0.0
		},

		_levelSelector: {
			type: Object,
			value: null
		},

		_helpPopupItems: {
			type: Array,
			value: []
		},
	},

	listeners: {
		'keydown': '_onKeyDown',
	},

	observers: [
		'_getCalculationDetails(entity)'
	],

	behaviors: [
		D2L.PolymerBehaviors.Siren.EntityBehavior,
		D2L.PolymerBehaviors.Siren.SirenActionBehavior,
		D2L.PolymerBehaviors.OutcomesLOA.LocalizeBehavior
	],

	ready: function() {
		this._onCalcButtonClicked = this._onCalcButtonClicked.bind(this);
		this._onOverrideButtonClicked = this._onOverrideButtonClicked.bind(this);
		this._onHelpButtonClicked = this._onHelpButtonClicked.bind(this);
		this._levelSelector = this.$$('d2l-outcomes-level-of-achievements');
	},

	_getCalculationDetails: function(entity) {
		if (!entity) {
			return null;
		}

		var demonstrationCalculatedValue = entity.properties.calculatedValue;
		if (demonstrationCalculatedValue) {
			this._calculatedAchievementValue = demonstrationCalculatedValue;
		}
		var newAssessments = entity.properties.newAssessments;
		if (newAssessments) {
			this._newAssessmentsAdded = newAssessments;
		}

		var calcMethodHref = entity.getLinkByRel('calculation-method').href;
		window.D2L.Siren.EntityStore.fetch(calcMethodHref, this.token, true).then(calcMethodRequest => {
			var calcMethod = calcMethodRequest.entity;
			this._calculationMethod = calcMethod.properties.name;

			//Help menu population
			this._helpPopupItems = [];
			var helpMenuEntities = calcMethod.getSubEntitiesByClass('calculation-setting');
			helpMenuEntities.forEach((item) => {
				var helpItemObj = {
					label: item.properties.name,
					content: item.properties.content
				};
				this._helpPopupItems.push(helpItemObj);
			});
		});

		//determine if override is allowed and/or enabled
		var levels = entity.getSubEntitiesByClass(Classes.outcomes.demonstratableLevel);
		this._isOverrideAllowed = false;
		this._isOverrideActive = false;
		levels.forEach((level) => {
			var suggested = level.hasClass(Classes.outcomes.suggested);
			var hasSelectAction = !!(level.getActionByName(Actions.outcomes.select));

			if (hasSelectAction) {
				this._isOverrideAllowed = true;
			}
			if (suggested && hasSelectAction) {
				this._isOverrideActive = true;
			}
		});

	},

	_isDecayingAverageVisible: function(calculationMethod) {
		return (calculationMethod === 'Decaying Average');
	},

	_isCalculationUpdateNeeded: function(calculationMethod, newAssessments, overrideActive) {
		return this._hasCalculation(calculationMethod) && overrideActive && newAssessments;
	},

	_hasCalculation: function(calculationMethod) {
		return !!calculationMethod && calculationMethod !== 'None';
	},

	_hasHelpMenu: function(helpItems) {
		return (helpItems.length > 0);
	},

	_shouldShowOverrideButton: function(overrideAllowed, calculationMethod) {
		return (overrideAllowed && this._hasCalculation(calculationMethod));
	},

	_canEditLevel: function(overrideActive, calculationMethod) {
		return overrideActive || !this._hasCalculation(calculationMethod);
	},

	_getOverrideButtonText: function(overrideActive) {
		if (overrideActive) {
			return this.localize('clearManualOverride');
		}
		else {
			return this.localize('manuallyOverride');
		}
	},

	_getOverrideButtonIcon: function(overrideActive) {
		if (overrideActive) {
			return 'tier1:close-default';
		}
		else {
			return 'tier1:edit';
		}
	},

	//For keyboard accessibility
	_onKeyDown: function(event) {
		if (event.keyCode === KEYCODE_ENTER || event.keyCode === KEYCODE_SPACE) {
			this.shadowRoot.activeElement.click();
			event.preventDefault();
		}
	},

	_onOverrideButtonClicked: function() {
		if (!this._isOverrideActive) {
			this._isOverrideActive = true;
			this._levelSelector.setFocus();
		}
		else {
			if (this._isCalculationUpdateNeeded(this._calculationMethod, this._newAssessmentsAdded, true)) {
				this._updateLevelCalculation();
			}
			this._levelSelector.resetToSuggested();
			this._isOverrideActive = false;
		}
	},

	_onCalcButtonClicked: function() {
		if (this._updateLevelCalculation()) {
			//Calculation successfully updated
			this._levelSelector.resetToSuggested();
			this._isOverrideActive = false;
		}
	},

	_onHelpButtonClicked: function() {
		var helpDialog = this.shadowRoot.getElementById('help-dialog');
		if (!helpDialog.opened) {
			helpDialog.opened = true;
		}
	},

	_updateLevelCalculation: function() {
		//Calculation request will be sent here. This will retrieve a calculated value and any corresponding data
		this._newAssessmentsAdded = false;
		return true;
	},
});
