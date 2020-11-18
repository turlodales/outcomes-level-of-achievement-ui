/**
	keycodes to help with component accessibility/keyboard navigation
*/
export const keyCodes = {
	enter: 13,
	space: 32,
	leftArrow: 37,
	rightArrow: 39
};

export const calcMethods = {
	decayingAverage: 'DecayingAverage',
	highest: 'Highest',
	mostCommon: 'MostCommon',
	mostRecent: 'MostRecent',
	none: 'None'
};

export const evalTypes = {
	automatic: 'automatic',	// No manual override and no feedback (unlocked)
	snapshot: 'snapshot',	// No manual override but has feedback (locked)
	override: 'override'	// Manual override (locked)
}
