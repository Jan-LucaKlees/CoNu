import React from 'react';
import { connect } from 'react-redux'
import c from 'classnames'

import * as GameLogic from './GameLogic';
import { selectOrPairCell } from './redux/game';

import { BtnSingleLine } from './Btn';


const Cell = ({ index, number, paired, selected, selectOrPairCell }) =>
	<div className="field__cell-wrapper">
		<BtnSingleLine
			className={ c( 'btn--cell', { 'btn--selected': selected } ) }
			disabled={ paired }
			onClick={ () => selectOrPairCell( index ) }>
			{ number }
		</BtnSingleLine>
	</div>

const mapStateToProps = ( state, props ) => {
	return {
		number: GameLogic.getCellNumber( state.game.get( 'cells' ), props.index ),
		paired: GameLogic.isCellPaired( state.game.get( 'cells' ), props.index ),
		selected: state.game.get( 'selectedCell' ) == props.index
	}
}

const mapDispatchToProps = { selectOrPairCell }

export default connect(
	mapStateToProps,
	mapDispatchToProps
)( Cell )

