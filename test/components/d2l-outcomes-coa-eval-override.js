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
			expect(element.is).to.equal('d2l-outcomes-coa-eval-override');
		});

	});

	describe('Accessibility Tests', () => {

		it('should pass all axe tests', async() => {
			await expect(element).to.be.accessible();
		});

	});
});
