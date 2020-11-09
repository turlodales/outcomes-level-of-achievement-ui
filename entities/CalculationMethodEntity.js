import { Entity } from 'siren-sdk/src/es6/Entity';
import { SelflessEntity } from 'siren-sdk/src/es6/SelflessEntity';

export class CalculationMethodEntity extends Entity {
	static get class() { return 'calculation-method'; }

	getKey() {
		return this._entity && this._entity.properties && this._entity.properties.key;
	}

	getName() {
		return this._entity && this._entity.properties && this._entity.properties.name;
	}

	getSettings() {
		if (!this._entity) {
			return;
		}
		const settings = this._entity.getSubEntitiesByClass(CalculationSettingEntity.class);
		return settings.map(setting => new CalculationSettingEntity(this, setting));
	}
}

export class CalculationSettingEntity extends SelflessEntity {
	static get class() { return 'calculation-setting'; }

	getName() {
		return this._entity && this._entity.properties && this._entity.properties.name;
	}

	getContent() {
		return this._entity && this._entity.properties && this._entity.properties.content;
	}

}
