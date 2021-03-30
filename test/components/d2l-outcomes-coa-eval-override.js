/* global suite, test, fixture, expect, describe, it, suiteSetup, suiteTeardown, sinon */

describe('<d2l-outcomes-coa-eval-override>', () => {

	let element, sandbox;

	suiteSetup(() => {
		sandbox = sinon.sandbox.create();
		element = fixture('basic');
	});

	suiteTeardown(() => {
		sandbox.restore();
	});

	suite('smoke test', () => {

		test('can be instantiated', () => {
			expect(element.tagName).to.equal('D2L-OUTCOMES-COA-EVAL-OVERRIDE');
		});

	});

	describe('Accessibility Tests', () => {

		it('should pass all axe tests', () => {
			expect(element).to.be.accessible();
		});

	});
});
