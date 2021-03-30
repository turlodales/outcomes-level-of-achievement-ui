import '../d2l-outcomes-coa-eval-override.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('<d2l-outcomes-coa-eval-override>', () => {
	let element;

	beforeEach(async() => {
		element = await fixture(html`
			<d2l-outcomes-coa-eval-override></d2l-outcomes-coa-eval-override>
		`);
	});

	describe('smoke test', () => {
		it('can be instantiated', () => {
			expect(element.tagName).to.equal('D2L-OUTCOMES-COA-EVAL-OVERRIDE');
		});
	});

	describe('accessibility tests', () => {
		it('should pass all axe tests', () => {
			expect(element).to.be.accessible();
		});
	});
});
