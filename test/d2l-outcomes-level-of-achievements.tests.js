import '../d2l-outcomes-coa-eval-override.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('<d2l-outcomes-level-of-achievements>', () => {
	let element;

	beforeEach(async() => {
		element = await fixture(html`
			<d2l-outcomes-level-of-achievements>
			</d2l-outcomes-level-of-achievements>
		`);
	});

	describe('smoke test', () => {
		it('can be instantiated', () => {
			expect(element.tagName).to.equal('D2L-OUTCOMES-LEVEL-OF-ACHIEVEMENTS');
		});
	});

	describe('accessibility tests', () => {
		it('should pass all axe tests', () => {
			expect(element).to.be.accessible();
		});
	});
});

