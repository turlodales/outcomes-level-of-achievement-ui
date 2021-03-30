/* global it, fixture, expect, beforeEach, afterEach, describe, sinon */

import '../../squishy-button-selector/d2l-squishy-button-selector.js';

describe('<d2l-squishy-button-selector>', () => {

	let element, sandbox;

	beforeEach(async() => {
		sandbox = sinon.sandbox.create();
		element = await fixture('basic');
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('smoke test', () => {
		it('can be instantiated', () => {
			expect(element.tagName).to.equal('D2L-SQUISHY-BUTTON-SELECTOR');
		});
	});

	describe('_buttons', () => {

		it('Is a list of all the buttons', () => {
			expect(element._buttons.length).to.equal(3);
			expect(element._buttons[0].getAttribute('text').trim()).to.equal('BUTTON 1');
			expect(element._buttons[1].getAttribute('text').trim()).to.equal('BUTTON 2');
			expect(element._buttons[2].getAttribute('text').trim()).to.equal('BUTTON 3');
		});

	});

	describe('_updateButtonSelectedAttribute', () => {
		function verifyButtonsSelected(b1, b2, b3) {
			expect(element._buttons[0].hasAttribute('selected')).to.equal(b1);
			expect(element._buttons[1].hasAttribute('selected')).to.equal(b2);
			expect(element._buttons[2].hasAttribute('selected')).to.equal(b3);
		}

		it('selects the button which corresponds with the selectedIndex', async() => {
			element.setAttribute('selected-index', 1);
			element._handleDomChanges();
			await element.updateComplete;
			verifyButtonsSelected(false, true, false);
		});

		it('selects nothing if the selectedIndex is out of range', async() => {
			element.selectedIndex = 12;
			await element.updateComplete;
			verifyButtonsSelected(false, false, false);
		});

		it('deselects everything if selectedIndex is null', async() => {
			element.selectedIndex = 1;
			await element.updateComplete;
			verifyButtonsSelected(false, true, false);

			element.selectedIndex = null;
			await element.updateComplete;
			verifyButtonsSelected(false, false, false);
		});
	});

	describe('d2l-squishy-button-selected event', () => {
		it('should set selectedIndex to the selected button', () => {
			[0, 1, 2].forEach((num) => {
				element._buttons[num]._dispatchItemSelectedEvent(false, true);
				expect(element.selectedIndex).to.equal(num);
			});
		});
	});

	describe('_disabledChanged', () => {
		function verifyTabindex(num) {
			expect(element.getAttribute('tabindex')).to.equal(num.toString());
		}

		it('sets the tabindex to 0 when readonly', () => {
			verifyTabindex(0);
			element.setAttribute('disabled', true);
			verifyTabindex(0);
		});

		it('sets the tabindex to 0 when changing back from readonly', () => {
			element.setAttribute('disabled', true);
			verifyTabindex(0);
			element.removeAttribute('disabled');
			verifyTabindex(0);
		});

		it('If possible, sets the tabindex to its previous value when changing back from readonly', () => {
			element.setAttribute('tabindex', '3');
			element.setAttribute('disabled', true);
			verifyTabindex(0);
			element.removeAttribute('disabled');
			verifyTabindex(3);
		});
	});

	describe('_onFocus', () => {
		it('focuses the first element if nothing is selected', () => {
			element._buttons[0].focus = sinon.spy();
			element._onFocus({ target: element });
			expect(element._buttons[0].focus.called).to.equal(true);
		});

		it('focuses the selected element', () => {
			element.selectedIndex = 1;
			element._buttons[1].focus = sinon.spy();
			element._onFocus({ target: element });
			expect(element._buttons[1].focus.called).to.equal(true);
		});

		it('focuses nothing if disabled is true', async() => {
			element.disabled = true;
			await element.updateComplete;
			element.selectedIndex = 1;
			element._buttons[0].focus = sinon.spy();
			element._onFocus({ target: element });
			expect(element._buttons[0].focus.called).to.equal(false);
		});

		it('focuses nothing if a button is selected rather than the list', () => {
			element.selectedIndex = 1;
			element._buttons[1].focus = sinon.spy();
			element._onFocus({ target: element._buttons[0] });
			expect(element._buttons[1].focus.called).to.equal(false);
		});
	});

});
