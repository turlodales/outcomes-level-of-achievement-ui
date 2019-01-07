import 'd2l-localize-behavior/d2l-localize-behavior.js';
import './lang/ar.js';
import './lang/de.js';
import './lang/en.js';
import './lang/es.js';
import './lang/fr.js';
import './lang/ja.js';
import './lang/ko.js';
import './lang/nl.js';
import './lang/pt.js';
import './lang/sv.js';
import './lang/tr.js';
import './lang/zh-tw.js';
import './lang/zh.js';
window.D2L = window.D2L || {};
window.D2L.PolymerBehaviors = window.D2L.PolymerBehaviors || {};
window.D2L.PolymerBehaviors.OutcomesLOA = window.D2L.PolymerBehaviors.OutcomesLOA || {};
/** @polymerBehavior D2L.PolymerBehaviors.OutcomesLOA.LocalizeBehavior */
D2L.PolymerBehaviors.OutcomesLOA.LocalizeBehaviorImpl = {
	properties: {
		resources: {
			value: function() {
				return {
					'ar': this.ar,
					'de': this.de,
					'en': this.en,
					'es': this.es,
					'fr': this.fr,
					'ja': this.ja,
					'ko': this.ko,
					'nl': this.nl,
					'pt': this.pt,
					'sv': this.sv,
					'tr': this.tr,
					'zh': this.zh,
					'zh-TW': this.zhTw
				};
			}
		}
	}
};
/** @polymerBehavior */
D2L.PolymerBehaviors.OutcomesLOA.LocalizeBehavior = [
	D2L.PolymerBehaviors.LocalizeBehavior,
	D2L.PolymerBehaviors.OutcomesLOA.LocalizeBehaviorImpl,
	D2L.PolymerBehaviors.OutcomesLOA.LocalizeBehavior.LangArBehavior,
	D2L.PolymerBehaviors.OutcomesLOA.LocalizeBehavior.LangDeBehavior,
	D2L.PolymerBehaviors.OutcomesLOA.LocalizeBehavior.LangEnBehavior,
	D2L.PolymerBehaviors.OutcomesLOA.LocalizeBehavior.LangEsBehavior,
	D2L.PolymerBehaviors.OutcomesLOA.LocalizeBehavior.LangFrBehavior,
	D2L.PolymerBehaviors.OutcomesLOA.LocalizeBehavior.LangJaBehavior,
	D2L.PolymerBehaviors.OutcomesLOA.LocalizeBehavior.LangKoBehavior,
	D2L.PolymerBehaviors.OutcomesLOA.LocalizeBehavior.LangNlBehavior,
	D2L.PolymerBehaviors.OutcomesLOA.LocalizeBehavior.LangPtBehavior,
	D2L.PolymerBehaviors.OutcomesLOA.LocalizeBehavior.LangSvBehavior,
	D2L.PolymerBehaviors.OutcomesLOA.LocalizeBehavior.LangTrBehavior,
	D2L.PolymerBehaviors.OutcomesLOA.LocalizeBehavior.LangZhBehavior,
	D2L.PolymerBehaviors.OutcomesLOA.LocalizeBehavior.LangZhTwBehavior
];
