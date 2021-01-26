import { Entity } from 'siren-sdk/src/es6/Entity';

export class DemonstrationOutdatedStatusEntity extends Entity {
	static get class() { return 'demonstration-outdated-status'; }

	getOutdatedStatus() {
		return this._entity && this._entity.properties && this._entity.properties.IsOutdated;
	}
}
