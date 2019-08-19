import React from 'react';
import * as firebase from "firebase/app";
import "firebase/auth";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import c from 'classnames';
import Cookies from 'js-cookie';
import uuidv4 from 'uuid/v1';

import db from './db';
import GameState from './GameState';

import Field from './Field';
import Btn, { BtnSingleLine, BtnInvisible, BtnCuboid } from './Btn';
import LoadingIndicator, { LoadingScreen } from './LoadingIndicator';

import Logo from '../assets/images/conu-logo.svg';


export default class GameLoader extends React.PureComponent {

	constructor( props ) {
		super( props );

		this.collapseMenuTimeoutAfterAppLoaded = null;
		this.collapseMenuTimeoutAfterNewGameLoaded = null;

		this.state = {
			appLoading: true,
			newGameLoading: false,
			error: null,
			cells: [],
			menuCollapsed: false,
			waitingForLoadingScreenToFade: true
		}
	}

	componentDidMount() {

		// Authenticate user anonymously to get an uid for referencing the game
		this.authenticate()
			.then( ( user ) => {

				console.debug( user.uid );

				this.user = user;

				// With our uid, we can now look up the users latest game, or create a
				// new one in case the user hasn't played yet.
				this.getCurrentOrNewGameRef( this.user )
					.then( ( gameRef ) => {

						// Set the game ref to be used in other functions.
						this.gameRef = gameRef;

						// finally, we register a listener for listening to changes in the
						// database on the game we created or found for the user. We hook
						// the listener to our components state.
						this.registerGameStateListener()

					})
					.catch( ( error ) => {
						this.setErrorState( error );
					});

			})
			.catch( ( error ) => {
				this.setErrorState( error );
			})
	}

	componentDidUpdate( prevProps, prevState ) {
		// Collapse the menu after a while when the app is loaded an rendered
		// This is to hint the user where to find the 'New Game' button
		if(
			prevState.appLoading === true &&
			this.state.appLoading === false
		) {
			this.collapseMenuTimeoutAfterAppLoaded = setTimeout(
				() => this.setState( {
					menuCollapsed: true
				} ),
				1300
			);
			setTimeout(
				() => this.setState( {
					waitingForLoadingScreenToFade: false
				} ),
				300
			);
		}

		// After the user started a new game and it is completely loaded and
		// rendered, we hide the menu again to be in a more aestheticaly pleasing
		// state.
		if(
			prevState.newGameLoading === true &&
			this.state.newGameLoading === false
		) {
			this.collapseMenuTimeoutAfterNewGameLoaded = setTimeout(
				() => this.setState( { menuCollapsed: true } )
				, 300 );
		}
	}

	componentWillUnmount() {
		this.unsubscribeGameStateListener();

		clearTimeout( this.collapseMenuTimeoutAfterAppLoaded );
		clearTimeout( this.collapseMenuTimeoutAfterNewGameLoaded );
	}

	setErrorState( error ) {
		this.setState({
			appLoading: false,
			newGameLoading: false,
			error: error
		});
	}

	authenticate() {
		return new Promise( ( resolve, reject ) => {
			// Authenticate the user anonymously
			firebase.auth().signInAnonymously()
				.then( ( userCredential ) => {
					resolve( userCredential.user )
				})
				.catch( ( error ) => {
					reject( error );
				});
		});
	}

	getCurrentOrNewGameRef( user ) {
		return new Promise( ( resolve, reject ) => {
			let gameQuery = db.collection( 'games' )
				.where( "owner", "==", user.uid )
				.orderBy( "created_at", "desc" )
				.limit( 1 );

			gameQuery.get()
				.then( ( querySnapshot ) => {
					if ( querySnapshot.empty ) {
						this.initializeNewGame()
							.then( ( gameRef ) => {
								resolve( gameRef );
							})
							.catch( ( error ) => {
								reject( error );
							});
					} else {
						resolve( db.collection( 'games' ).doc( querySnapshot.docs[0].id ) );
					}
				})
				.catch( ( error ) => {
					reject( error );
				});
		});
	}

	initializeNewGame() {
		return new Promise( ( resolve, reject ) => {
			let newGameId = uuidv4();
			let gameRef = db.collection( 'games' ).doc( newGameId );

			gameRef
				.set({
					cells: GameState.DEFAULT_START_VALUES,
					owner: this.user.uid,
					created_at: firebase.firestore.Timestamp.now()
				})
				.then( () => {
					resolve( gameRef );
				})
				.catch( ( error ) => {
					reject( error );
				});
		})
	}

	registerGameStateListener() {
		this.unsubscribeGameStateListener = this.gameRef
			.onSnapshot( ( gameSnapshot ) => {
				this.setState( {
					appLoading: false,
					newGameLoading: false,
					cells: gameSnapshot.data().cells
				});
			}, ( error ) => {
				this.setErrorState( error );
			});
	}

	onToggleMenu() {
		// Clear timeouts in case the user interacts with the menu to prevent the
		// menu from collapsing when the user intentionally opened it.
		clearTimeout( this.collapseMenuTimeoutAfterAppLoaded );
		clearTimeout( this.collapseMenuTimeoutAfterNewGameLoaded );

		this.setState({
			menuCollapsed: !this.state.menuCollapsed
		})
	}

	onGameStateChange( newCells ) {
		this.gameRef.update({
			cells: newCells
		})
	}

	onStartNewGame() {
		// No class function, just set when I register the snapshot listener
		this.unsubscribeGameStateListener()

		this.setState({
			newGameLoading: true,
			error: null,
			cells: [],
		});

		this.initializeNewGame()
			.then( ( gameRef ) => {
				this.gameRef = gameRef;

				this.onGameStateChangePersisted()
			} )
	}

	render() {
		if( this.state.appLoading ) {
			return <LoadingScreen key="loading-screen" />
		} else if( this.state.error ) {
			return "error: " + this.state.error
		} else {
			return (
				<>
					{ this.state.waitingForLoadingScreenToFade &&
					<LoadingScreen
						key="loading-screen"
						faded={
							!this.state.appLoading &&
								this.state.waitingForLoadingScreenToFade
						} />
					}

					<header className="conu__header">

						<BtnInvisible
							className="btn--logo"
							onClick={ () => this.onToggleMenu() } >
							<img
								src={ Logo }
								className="conu__logo" />
						</BtnInvisible>

						<nav
							className={ c( "conu__menu-wrapper", {
								"conu__menu-wrapper--collapsed": this.state.menuCollapsed
							} ) }>
							<div className="menu">
								<Btn
									className="btn--menu-item"
									onClick={ () => { this.onStartNewGame() } } >
									New Game
								</Btn>
							</div>
						</nav>

					</header>

					{ this.state.newGameLoading ? (
						<LoadingScreen className="loading-screen--content" />
					) : (
						<Game
							cells={ this.state.cells }
							onChange={ ( newCells ) => this.onGameStateChange( newCells ) }
							onStartNewGame={ () => this.onStartNewGame() } />
					) }
				</>
			);
		}
	}
}

class Game extends React.PureComponent {

	constructor( props ) {
		super( props );

		this.gameState = new GameState( props.cells );

		this.state = {
			finished: this.gameState.isFinished(),
			waitingForFieldToCollapse: false,
			waitingForWonMessageToShow: false,
			selectedCell: null
		}
	}
	componentDidUpdate( prevProps ) {
		// Update the game states cells; yes, this is hacky
		this.gameState.cells = this.props.cells;

		if( this.gameState.isFinished() && !this.state.finished ) {
			this.setState({
				finished: true,
				waitingForFieldToCollapse: true,
				waitingForWonMessageToShow: true,
			});

			setTimeout( () => {
				this.setState({
					waitingForFieldToCollapse: false,
				});
			}, 300);

			setTimeout( () => {
				this.setState({
					waitingForWonMessageToShow: false,
				});
			}, 1000);
		}
	}
	onSelectCell( index ) {
		if(
			this.state.selectedCell !== null &&
			this.gameState.areCellsPairable( this.state.selectedCell, index )
		){
			this.gameState.pairCells( this.state.selectedCell, index );
			this.props.onChange( this.gameState.cells );
		} else {
			this.setState({
				selectedCell: index
			});
		}
	}
	onExtendField() {
		this.gameState.extendField();
		this.props.onChange( this.gameState.cells );
	}
	render() {
		return (
			<div className="game">

				<div className="game__content">
					{ this.state.finished && !this.state.waitingForFieldToCollapse ? (
						<h2 className="game__won-message">You Won!</h2>
					) : (
						<Field
							state={ this.gameState.field }
							selectedCell={ this.state.selectedCell }
							onSelectCell={ ( index ) => this.onSelectCell( index ) } />
					) }
				</div>

				<BtnCuboid
					className="btn-cuboid--cell-matching-width"
					showFace={ this.state.finished &&
							!this.state.waitingForWonMessageToShow ? "top" : "front" }
							Front={(
								<BtnSingleLine
									disabled={ this.state.finished }
									onClick={ () => this.onExtendField() }>
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

