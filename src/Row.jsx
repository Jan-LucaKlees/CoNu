import React from 'react';
import { connect } from 'react-redux'

import * as GameLogic from './GameLogic';

import Cell from './Cell'

const Row = ({ cells }) =>
	<div className="field__row">
		{
			cells.map( ( cell ) =>
				<Cell key={ `cell_${ cell.index }` } index={ cell.index } />
			)
		}
	</div>

const mapStateToProps = ( state, props ) => {
	return {
		cells: Array.from( GameLogic.getCellsForRow( state.game.get( 'cells' ), props.index ) ),
	}
}

export default connect(
	mapStateToProps
)( Row )

