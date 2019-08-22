import React from 'react';
import { connect } from 'react-redux'
import * as firebase from "firebase/app";
import "firebase/auth";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import c from 'classnames';
import Cookies from 'js-cookie';
import uuidv4 from 'uuid/v1';

import db from './db';
import * as GameLogic from './GameLogic';
import { extendField } from './redux/game';

import Field from './Field';
import Btn, { BtnSingleLine, BtnInvisible, BtnCuboid } from './Btn';
import LoadingIndicator, { LoadingScreen } from './LoadingIndicator';

import Logo from '../assets/images/conu-logo.svg';


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
									onClick={ () => this.props.onStartNewGame() }>
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

const mapDispatchToProps = { extendField };

export default connect(
	mapStateToProps,
	mapDispatchToProps
)( Game )

