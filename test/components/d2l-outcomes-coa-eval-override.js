/* global suite, test, fixture, expect, describe, it, suiteSetup, suiteTeardown, sinon */

'use strict';
describe('<d2l-outcomes-coa-eval-override>', function() {

	var element, sandbox;

	suiteSetup(function() {
		sandbox = sinon.sandbox.create();
		element = fixture('basic');
	});

	suiteTeardown(function() {
		sandbox.restore();
	});

	suite('smoke test', function() {

		test('can be instantiated', function() {
			expect(element.tagName).to.equal('D2L-OUTCOMES-COA-EVAL-OVERRIDE');
		});

	});

	describe('Accessibility Tests', () => {

		it('should pass all axe tests', () => {
			expect(element).to.be.accessible();
		});

	});
});
