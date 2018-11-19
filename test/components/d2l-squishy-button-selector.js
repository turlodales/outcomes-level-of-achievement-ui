
/* global it, fixture, expect, beforeEach, afterEach, describe, sinon */

'use strict';

describe('<d2l-squishy-button-selector>', function() {

	var element, sandbox;

	beforeEach(function(done) {
		sandbox = sinon.sandbox.create();
		element = fixture('basic');
		Polymer.RenderStatus.afterNextRender(element, function() {
			done();
		});
	});

	afterEach(function() {
		sandbox.restore();
	});

	describe('smoke test', function() {
		it('can be instantiated', function() {
			expect(element.is).to.equal('d2l-squishy-button-selector');
		});
	});

	describe('_buttons', function() {
		it('Is an empty array if there are no buttons', function(done) {
			element = fixture('empty');

			Polymer.RenderStatus.afterNextRender(element, function() {
				expect(element._buttons.length).to.equal(0);
				done();
			});
		});

		it('Is a list of all the buttons', function() {
			expect(element._buttons.length).to.equal(3);
			expect(element._buttons[0].getAttribute('text').trim()).to.equal('BUTTON 1');
			expect(element._buttons[1].getAttribute('text').trim()).to.equal('BUTTON 2');
			expect(element._buttons[2].getAttribute('text').trim()).to.equal('BUTTON 3');
		});
	});

	describe('_updateButtonSelectedAttribute', function() {
		function verifyButtonsSelected(b1, b2, b3) {
			expect(element._buttons[0].hasAttribute('selected')).to.equal(b1);
			expect(element._buttons[1].hasAttribute('selected')).to.equal(b2);
			expect(element._buttons[2].hasAttribute('selected')).to.equal(b3);
		}

		it('selects the button which corresponds with the selectedIndex', function(done) {
			element.setAttribute('selected-index', 1);
			element._handleDomChanges();
			Polymer.RenderStatus.afterNextRender(element, function() {
				verifyButtonsSelected(false, true, false);
				done();
			});
		});

		it('selects nothing if the selectedIndex is out of range', function(done) {
			element.selectedIndex = 12;
			Polymer.RenderStatus.afterNextRender(element, function() {
				verifyButtonsSelected(false, false, false);
				done();
			});
		});

		it('deselects everything if selectedIndex is null', function(done) {
			element.selectedIndex = 1;

			Polymer.RenderStatus.afterNextRender(element, function() {
				verifyButtonsSelected(false, true, false);

				element.selectedIndex = null;

				Polymer.RenderStatus.afterNextRender(element, function() {
					verifyButtonsSelected(false, false, false);
					done();
				});

			});
		});
	});

	describe('d2l-squishy-button-selected event', function() {
		it('should set selectedIndex to the selected button', function() {
			[0, 1, 2].forEach(function(num) {
				element._buttons[num]._dispatchItemSelectedEvent(false, true);
				expect(element.selectedIndex).to.equal(num);
			});
		});
	});

	describe('_disabledChanged', function() {
		function verifyTabindex(num) {
			expect(element.getAttribute('tabindex')).to.equal(num.toString());
		}

		it('sets the tabindex to -1 when readonly', function() {
			verifyTabindex(0);
			element.setAttribute('disabled', true);
			verifyTabindex(-1);
		});

		it('sets the tabindex to 0 when changing back from readonly', function() {
			element.setAttribute('disabled', true);
			verifyTabindex(-1);
			element.removeAttribute('disabled');
			verifyTabindex(0);
		});

		it('If possible, sets the tabindex to its previous value when changing back from readonly', function() {
			element.setAttribute('tabindex', '3');
			element.setAttribute('disabled', true);
			verifyTabindex(-1);
			element.removeAttribute('disabled');
			verifyTabindex(3);
		});
	});

	describe('_onFocus', function() {
		it('focuses the first element if nothing is selected', function() {
			element._buttons[0].focus = sinon.spy();
			element._onFocus({ target: element });
			expect(element._buttons[0].focus.called).to.equal(true);
		});

		it('focuses the selected element', function() {
			element.selectedIndex = 1;
			element._buttons[1].focus = sinon.spy();
			element._onFocus({ target: element });
			expect(element._buttons[1].focus.called).to.equal(true);
		});

		it('focuses nothing if disabled is true', function() {
			element.setAttribute('disabled', true);
			element.selectedIndex = 1;
			element._buttons[1].focus = sinon.spy();
			element._onFocus({ target: element });
			expect(element._buttons[1].focus.called).to.equal(false);
		});

		it('focuses nothing if a button is selected rather than the list', function() {
			element.selectedIndex = 1;
			element._buttons[1].focus = sinon.spy();
			element._onFocus({ target: element._buttons[0] });
			expect(element._buttons[1].focus.called).to.equal(false);
		});
	});

});
