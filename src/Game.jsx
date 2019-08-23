import React from 'react';
import { connect } from 'react-redux'
import { CSSTransition } from 'react-transition-group';

import * as GameLogic from './GameLogic';
import { extendField, startNewGame } from './redux/game';

import Field from './Field';
import { BtnSingleLine, BtnCuboid } from './Btn';


class Game extends React.PureComponent {

	constructor( props ) {
		super( props );

		this.state = {
			fieldExited: this.props.finished,
			wonMessageEntered: false,
		}
	}

	render() {
		return (
			<div className="game">

				<div className="game__content">

					<CSSTransition
						in={ this.props.finished && this.state.fieldExited }
						timeout={ 200 }
						mountOnEnter={ true }
						onEntered={ () => this.setState({ wonMessageEntered: true }) }
						classNames="game__won-message">
						<h2 className="game__won-message">You Won!</h2>
					</CSSTransition>

					<CSSTransition
						in={ !this.props.finished }
						timeout={ 300 }
						mountOnEnter={ true }
						onExited={ () => this.setState({ fieldExited: true }) }
						classNames="field">
						<Field />
					</CSSTransition>

				</div>

				<BtnCuboid
					className="btn-cuboid--cell-matching-width"
					showFace={ this.props.finished && this.state.wonMessageEntered ? "top" : "front" }
							Front={(
								<BtnSingleLine
									disabled={ this.props.finished || this.props.extendingField }
									onClick={ this.props.extendField }>
									Extend
								</BtnSingleLine>
							)}
							Top={(
								<BtnSingleLine
									onClick={ this.props.startNewGame }>
									New Game
								</BtnSingleLine>
							)} />

					</div>
		);
	}
}

const mapStateToProps = ( state ) => {
	return {
		extendingField: state.game.get( 'extendingField' ),
		finished: GameLogic.isFinished( state.game.get( 'cells' ) ),
	}
};

const mapDispatchToProps = { extendField, startNewGame };

export default connect(
	mapStateToProps,
	mapDispatchToProps
)( Game )

