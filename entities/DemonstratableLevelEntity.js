import { SelflessEntity } from 'siren-sdk/src/es6/SelflessEntity';
import { AchievementLevelEntity } from './AchievementLevelEntity';

export class DemonstratableLevelEntity extends SelflessEntity {
	static get class() { return 'demonstratable-level'; }

	static get classes() {
		return {
			selected: 'selected',
			suggested: 'suggested'
		};
	}

	static get links() {
		return {
			level: 'https://achievements.api.brightspace.com/rels/level'
		};
	}

	isSelected() {
		return this._entity.hasClass(DemonstratableLevelEntity.classes.selected);
	}

	isSuggested() {
		return this._entity.hasClass(DemonstratableLevelEntity.classes.suggested);
	}

	getAction() {
		return this._entity && (this._entity.getActionByName('select') || this._entity.getActionByName('deselect'));
	}

	getSelectAction() {
		return this._entity && this._entity.getActionByName('select');
	}

	onLevelChanged(onChange) {
		const href = this._levelHref();
		href && this._subEntity(AchievementLevelEntity, href, onChange);
	}

	_levelHref() {
		if (!this._entity || !this._entity.hasLinkByRel(DemonstratableLevelEntity.links.level)) {
			return;
		}

		return this._entity.getLinkByRel(DemonstratableLevelEntity.links.level).href;
	}
}
