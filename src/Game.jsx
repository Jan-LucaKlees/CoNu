import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { CSSTransition } from 'react-transition-group';

import * as GameLogic from './GameLogic';
import { extendField, startNewGame } from './redux/gameReducer';

import Field from './Field';
import { BtnSingleLine, BtnCuboid } from './Btn';


export default () => {
	const dispatch = useDispatch();

	const extendingField = useSelector( state => state.game.get( 'extendingField' ) );
	const finished       = useSelector( state => GameLogic.isFinished( state.game.get( 'cells' ) ) );

	// Using local state as it is just for timing animations for this very
	// component
	const [ fieldExited, setFieldExited ]             = useState( finished );
	const [ wonMessageEntered, setWonMessageEntered ] = useState( finished );

	return (
		<div className="game">

			<div className="game__content">

				<CSSTransition
					in={ finished && fieldExited }
					timeout={ 200 }
					mountOnEnter={ true }
					onEntered={ () => setWonMessageEntered( true  ) }
					classNames="game__won-message">
					<h2 className="game__won-message">You Won!</h2>
				</CSSTransition>

				<CSSTransition
					in={ !finished }
					timeout={ 300 }
					mountOnEnter={ true }
					onExited={ () => setFieldExited( true ) }
					classNames="field">
					<Field />
				</CSSTransition>

			</div>

			<BtnCuboid
				className="btn-cuboid--cell-matching-width"
				showFace={ finished && wonMessageEntered ? "top" : "front" }
				Front={(
					<BtnSingleLine
						disabled={ finished || extendingField }
						onClick={ () => dispatch( extendField() ) }>
						Extend
					</BtnSingleLine>
				)}
				Top={(
					<BtnSingleLine
						onClick={ () => dispatch( startNewGame() ) }>
						New Game
					</BtnSingleLine>
				)} />

		</div>
	);
}

