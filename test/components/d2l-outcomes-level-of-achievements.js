/* global suite, test, fixture, expect, suiteSetup, suiteTeardown, sinon */

suite('<d2l-outcomes-level-of-achievements>', () => {

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
			expect(element.tagName).to.equal('D2L-OUTCOMES-LEVEL-OF-ACHIEVEMENTS');
		});

	});
});
