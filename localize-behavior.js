import 'd2l-localize-behavior/d2l-localize-behavior.js';
import './build/lang/ar.js';
import './build/lang/de.js';
import './build/lang/en.js';
import './build/lang/es.js';
import './build/lang/fr.js';
import './build/lang/ja.js';
import './build/lang/ko.js';
import './build/lang/nl.js';
import './build/lang/pt.js';
import './build/lang/sv.js';
import './build/lang/tr.js';
import './build/lang/zh-tw.js';
import './build/lang/zh.js';
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
