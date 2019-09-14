import React from 'react';
import { connect } from 'react-redux'
import c from 'classnames'

import * as GameLogic from './GameLogic';
import { selectOrPairCell } from './redux/gameReducer';

import { BtnSingleLine } from './Btn';


const Cell = ({ index, number, selected, pairing, paired, selectOrPairCell }) =>
	<div className="field__cell-wrapper">
		<BtnSingleLine
			className={ c( 'btn--cell', {
				'btn--cell-selected': selected,
				'btn--cell-pairing': pairing
			} ) }
			disabled={ paired }
			onClick={ () => selectOrPairCell( index ) }>
			{ number }
		</BtnSingleLine>
	</div>

const mapStateToProps = ( state, props ) => {
	return {
		number: GameLogic.getCellNumber( state.game.get( 'cells' ), props.index ),
		selected: state.game.get( 'selectedCell' ) == props.index,
		pairing: state.game.get( 'pairingCells' ).includes( props.index ),
		paired: GameLogic.isCellPaired( state.game.get( 'cells' ), props.index ),
	}
}

const mapDispatchToProps = { selectOrPairCell }

export default connect(
	mapStateToProps,
	mapDispatchToProps
)( Cell )

