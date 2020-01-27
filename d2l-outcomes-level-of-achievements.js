/**
`d2l-outcomes-level-of-achievements`
Polymer Web-Component to display levels of achievements

@demo demo/d2l-outcomes-level-of-achievements.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import 'd2l-polymer-siren-behaviors/store/entity-store.js';
import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';
import 'd2l-polymer-siren-behaviors/store/siren-action-behavior.js';
import { Actions, Classes } from 'd2l-hypermedia-constants';
import './squishy-button-selector/d2l-squishy-button-selector.js';
import './squishy-button-selector/d2l-squishy-button.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import './localize-behavior.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="d2l-outcomes-level-of-achievements">
	<template strip-whitespace="">
		<style>
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
		</style>

		<template is="dom-if" if="[[_shouldShowSuggestion(readOnly,_hasAction,_suggestedLevel)]]">
			<p class="d2l-suggestion-text">[[_getSuggestedLevelText(_suggestedLevel.text)]]</p>
		</template>

		<d2l-squishy-button-selector tooltip-position="top" disabled="[[_getIsDisabled(readOnly,_hasAction)]]">
			<template is="dom-repeat" items="[[_demonstrationLevels]]">
				<d2l-squishy-button color="[[item.color]]" selected="[[item.selected]]" button-data="[[_getButtonData(item)]]" id="item-[[index]]">
					[[item.text]]
				</d2l-squishy-button>
			</template>
		</d2l-squishy-button-selector>

	</template>

</dom-module>`;

document.head.appendChild($_documentContainer.content);
Polymer({
	is: 'd2l-outcomes-level-of-achievements',

	properties: {
		readOnly: {
			type: Boolean,
			value: false
		},
		_hasAction: Boolean,
		_demonstrationLevels: Array,
		_suggestedLevel: {
			type: Object,
			value: null
		}
	},

	observers: [
		'_getDemonstrationLevels(entity)'
	],

	behaviors: [
		D2L.PolymerBehaviors.Siren.EntityBehavior,
		D2L.PolymerBehaviors.Siren.SirenActionBehavior,
		D2L.PolymerBehaviors.OutcomesLOA.LocalizeBehavior
	],

	ready: function() {
		this._onItemSelected = this._onItemSelected.bind(this);
		this.$$('d2l-squishy-button-selector').addEventListener('d2l-squishy-button-selected', this._onItemSelected);
		this._handleRefresh = this._handleRefresh.bind(this);
	},

	attached: function() {
		window.addEventListener('refresh-outcome-demonstrations', this._handleRefresh);
	},

	detached: function() {
		this.$$('d2l-squishy-button-selector').removeEventListener('d2l-squishy-button-selected', this._onItemSelected);
		window.removeEventListener('refresh-outcome-demonstrations', this._handleRefresh);
	},

	_handleRefresh: function() {
		this.entity = null;
		const newEntity = window.D2L.Siren.EntityStore.fetch(this.href, this.token, true);
		this.entity = newEntity;
	},

	_getDemonstrationLevels: function(entity) {
		if (!entity) {
			return null;
		}

		let newSuggestedLevel;

		Promise.all(entity.getSubEntitiesByClass(Classes.outcomes.demonstratableLevel).map(function(e) {
			var selected = e.hasClass(Classes.outcomes.selected);
			var suggested = e.hasClass(Classes.outcomes.suggested);
			var action = e.getActionByName(Actions.outcomes.select) || e.getActionByName('deselect');
			var entityHref = e.getLinkByRel('https://achievements.api.brightspace.com/rels/level').href;

			return window.D2L.Siren.EntityStore.fetch(entityHref, this.token, true).then(function(levelRequest) {
				var levelEntity = levelRequest.entity;

				return {
					action: action,
					selected: selected,
					color: levelEntity && levelEntity.properties.color,
					text: levelEntity && levelEntity.properties.name,
					isSuggested: suggested
				};
			});
		}.bind(this))).then(function(demonstrationLevels) {
			this._demonstrationLevels = demonstrationLevels;

			var firstSuggested = undefined;
			for (var i = 0; i < demonstrationLevels.length; i++) {
				const level = demonstrationLevels[i];
				if (level.isSuggested) {
					firstSuggested = level;
					break;
				}
			}
			if (typeof firstSuggested !== 'undefined') {
				newSuggestedLevel = {
					text: firstSuggested.text
				};
			}

			this._hasAction = demonstrationLevels.some(function(level) { return !!level.action; });
		}.bind(this)).finally(function() {
			this._suggestedLevel = newSuggestedLevel;
		}.bind(this));

	},
	_getButtonData: function(item) {
		return {
			action: item.action
		};
	},
	_hasSuggestedLevel: function(suggestedLevel) {
		return !!suggestedLevel;
	},
	_shouldShowSuggestion: function(readOnly, hasAction, suggestedLevel) {
		return !this._getIsDisabled(readOnly, hasAction) && this._hasSuggestedLevel(suggestedLevel);
	},
	_onItemSelected: function(event) {
		var action = event.detail.data.action;
		if (!action) {
			return;
		}

		this.performSirenAction(action)
			.catch(function() {});
	},
	_getIsDisabled: function(readOnly, hasAction) {
		return !!readOnly || hasAction === false;
	},
	_getSuggestedLevelText: function(level) {
		return this.localize('suggestedLevel', 'level', level);
	}
});
