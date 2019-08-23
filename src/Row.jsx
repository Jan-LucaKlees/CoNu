import React from 'react';
import { connect } from 'react-redux'

import * as GameLogic from './GameLogic';

import Cell from './Cell';


const Row = ({ cellIndices }) => (
	<div className="field__row">
		{
			cellIndices.map( cellIndex => (
				<Cell key={ `cell_${ cellIndex }` } index={ cellIndex } />
			))
		}
	</div>
);

const mapStateToProps = ( state, props ) => {
	return {
		cellIndices: Array.from( GameLogic.getCellIndicesForRow( state.game.get( 'cells' ), props.index ) ),
	}
}

export default connect(
	mapStateToProps
)( Row )

