import React from 'react';
import { useSelector } from 'react-redux'
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { List, is } from 'immutable';

import * as GameLogic from './GameLogic';

import Row from './Row'


export default () => {
	const activeRowIndices = useSelector( getActiveRowIndices, is );

	return (
		<TransitionGroup className="field">
			{
				activeRowIndices.map( rowIndex => (
					<CSSTransition
						key={ `row_transition_${ rowIndex }` }
						timeout={ 300 }
						classNames="field__row"
					>
						<Row key={ `row_${ rowIndex }` } index={ rowIndex } />
					</CSSTransition>
				))
			}
		</TransitionGroup>
	);
};

function getActiveRowIndices( state ) {
	let cells = state.game.get( 'cells' );
	let activeRowIndices = Array.from( GameLogic.getRowIndicesWithPairableCells( cells ) );

	// We want to display the last row, even when it is not containing any
	// pairable cells. This is to make the extension of the game field not
	// surprising in the way that suddenly your half last row appears again with
	// the rest of its space filled with the new numbers. Or in other words:
	// hiding the last row when it is not completely filled with cells gives the
	// impression, that new cells would be appended in a completely new row,
	// starting from index 0 in that new row.
	// But this only applies for games that are not finished, so we check if we
	// have any active rows in the beginning. Otherwise jsut the empty last row
	// would be displayed together with a won message.
	if( activeRowIndices.length && !hasLastRowPairableCells( cells ) && !isLastRowFullWidth( cells ) ) {
		// append the last row index to the active rows
		let lastRowIndex = GameLogic.getRowCount( cells ) -1;
		activeRowIndices.push( lastRowIndex );
	}

	return List( activeRowIndices );
}

function hasLastRowPairableCells( cells ) {
	return GameLogic.hasRowPairableCells( cells, GameLogic.getRowCount( cells ) -1 );
}

function isLastRowFullWidth( cells ) {
	return GameLogic.getCellCount( cells ) % GameLogic.DEFAULT_WIDTH == 0;
}

