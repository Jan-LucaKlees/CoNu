import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import c from 'classnames'

import * as GameLogic from './GameLogic';
import { selectOrPairCell } from './redux/gameReducer';

import { BtnSingleLine } from './Btn';


export default React.memo( ({ index }) => {
	const dispatch = useDispatch();

	const number   = useSelector( state => GameLogic.getCellNumber( state.game.get( 'cells' ), index ) );
	const selected = useSelector( state => state.game.get( 'selectedCell' ) == index );
	const pairing  = useSelector( state => state.game.get( 'pairingCells' ).includes( index ) );
	const paired   = useSelector( state => GameLogic.isCellPaired( state.game.get('cells' ), index ) );

	return (
		<div className="field__cell-wrapper">
			<BtnSingleLine
				className={ c( 'btn--cell', {
					'btn--cell-selected': selected,
					'btn--cell-pairing': pairing
				} ) }
				disabled={ paired }
				onClick={ () => dispatch( selectOrPairCell( index ) ) }>
				{ number }
			</BtnSingleLine>
		</div>
	);
});

