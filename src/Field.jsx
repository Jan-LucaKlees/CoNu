import React from 'react';
import { connect } from 'react-redux'
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import * as GameLogic from './GameLogic';

import Row from './Row'

const Field = ( { activeRows } ) => (
	<TransitionGroup className="field">
		{
			activeRows.map( rowIndex => (
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

const mapStateToProps = ( state ) => {
	let cells = state.game.get( 'cells' );
	let activeRows = Array.from( GameLogic.getRowIndicesWithPairableCells( cells ) );

	// check if the last row is not containing as much cells as the other rows
	if( !hasLastRowPairableCells( cells ) && !isLastRowFullWidth( cells ) ) {
		// append the last row index to the active rows
		let lastRowIndex = GameLogic.getRowCount( cells ) -1;
		activeRows.push( lastRowIndex );
	}
	return {
		activeRows,
	}
}

export default connect(
	mapStateToProps
)( Field )

function hasLastRowPairableCells( cells ) {
	return GameLogic.hasRowPairableCells( cells, GameLogic.getRowCount( cells ) -1 );
}

function isLastRowFullWidth( cells ) {
	return GameLogic.getCellCount( cells ) % GameLogic.DEFAULT_WIDTH == 0;
}

