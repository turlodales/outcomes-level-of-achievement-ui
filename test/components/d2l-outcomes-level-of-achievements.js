/* global suite, test, fixture, expect, suiteSetup, suiteTeardown, sinon */

'use strict';

suite('<d2l-outcomes-level-of-achievements>', function() {

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
			expect(element.tagName).to.equal('D2L-OUTCOMES-LEVEL-OF-ACHIEVEMENTS');
		});

	});
});
