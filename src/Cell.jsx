import React from 'react';
import { connect } from 'react-redux'
import c from 'classnames'

import * as GameLogic from './GameLogic';

import { BtnSingleLine } from './Btn';


const Cell = ({ number, paired, selected, selectCell }) =>
	<div className="field__cell-wrapper">
		<BtnSingleLine
			className={ c( 'btn--cell', { 'btn--selected': selected } ) }
			disabled={ paired }
			onClick={ selectCell }>
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

const mapDispatchToProps = {}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)( Cell )

