import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { List, is } from 'immutable';

import * as GameLogic from './GameLogic';

import Cell from './Cell';


const compareProps = ( prevProps, nextProps ) => prevProps.index == nextProps.index;

export default React.memo( ({ index }) => {
	const cellIndices = useSelector( state => List(
		GameLogic.getCellIndicesForRow( state.game.get( 'cells' ), index )
	), is );

	return (
		<div className="field__row">
			{
				cellIndices.map( cellIndex => (
					<Cell key={ `cell_${ cellIndex }` } index={ cellIndex } />
				))
			}
		</div>
	);
}, compareProps );

