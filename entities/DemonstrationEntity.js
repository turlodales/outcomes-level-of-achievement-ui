import { Entity } from 'siren-sdk/src/es6/Entity';
import { CalculationMethodEntity } from './CalculationMethodEntity';
import { DemonstratableLevelEntity } from './DemonstratableLevelEntity';
import { DemonstrationOutdatedStatusEntity } from './DemonstrationOutdatedStatusEntity';

export class DemonstrationEntity extends Entity {

	static get actions() {
		return {
			publish: 'publish'
		};
	}

	static get class() { return 'demonstration'; }

	static get classes() {
		return {
			masteryOverride: 'mastery-override',
			masterySnapshot: 'mastery-snapshot'
		};
	}

	static get links() {
		return {
			calculationMethod: 'calculation-method',
			outdatedStatus: 'outdated-status'
		};
	}

	getAllDemonstratableLevels() {
		if (!this._entity) {
			return;
		}
		const levels = this._entity.getSubEntitiesByClass(DemonstratableLevelEntity.class);
		return levels.map(level => new DemonstratableLevelEntity(this, level));
	}

	getCalculatedValue() {
		return this._entity && this._entity.properties && this._entity.properties.calculatedValue;
	}

	getDemonstratedLevel() {
		if (!this._entity) {
			return;
		}

		const levelEntity = this._entity.getSubEntityByClasses([DemonstratableLevelEntity.class, DemonstratableLevelEntity.classes.selected]);
		return new DemonstratableLevelEntity(this, levelEntity);
	}

	getPublishAction() {
		return this._entity.getActionByName(DemonstrationEntity.actions.publish);
	}

	isManualOverride() {
		return this._entity.hasClass(DemonstrationEntity.classes.masteryOverride);
	}

	onCalcMethodChanged(onChange) {
		const href = this._calcMethodHref();
		href && this._subEntity(CalculationMethodEntity, href, onChange);
	}

	onOutdatedStatusChanged(onChange) {
		const href = this._outdatedStatusHref();
		href && this._subEntity(DemonstrationOutdatedStatusEntity, href, onChange);
	}

	_calcMethodHref() {
		if (!this._entity || !this._entity.hasLinkByRel(DemonstrationEntity.links.calculationMethod)) {
			return;
		}

		return this._entity.getLinkByRel(DemonstrationEntity.links.calculationMethod).href;
	}

	_outdatedStatusHref() {
		if (!this._entity || !this._entity.hasLinkByRel(DemonstrationEntity.links.outdatedStatus)) {
			return;
		}

		return this._entity.getLinkByRel(DemonstrationEntity.links.outdatedStatus).href;
	}

}
