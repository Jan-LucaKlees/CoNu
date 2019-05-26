import React from 'react';
import ReactDOM from 'react-dom';
import injectSheet from 'react-jss';
import WebFont from 'webfontloader';

import Game from './Game';


WebFont.load({
  google: {
    families: ['Share Tech Mono', 'Sarpanch:900' ],
  }
});

const Cell = injectSheet({
	cell: {
		height: '3.7rem',
		borderWidth: '0.2rem',
		borderStyle: 'solid',
		borderColor: ({ crossedOut }) => crossedOut ? '#a8a9ab' : '#0e1111',
		borderRadius: '0.15rem',

		backgroundColor: ({ selected, crossedOut }) => crossedOut ? '#ebedef' : selected ? '#babcf0' : '#fdfeff',

		textAlign: 'center',
		padding: '0.25rem 0',
		fontSize: '2.5rem',
		fontFamily: '"Share Tech Mono", monospace',
		color: ({ crossedOut }) => crossedOut ? '#a8a9ab' : '#0e1111',

		overflow: 'hidden',
		cursor: 'pointer',
	}
})( ({ number, onClick, classes }) => <div className={ classes.cell } onClick={ onClick }>{ Math.abs( number ) }</div> );

const styles = {
	'@global': {
		html: {
			fontSize: '4vw',
		},
		body: {
			backgroundColor: '#ebedef',
			widht: '100vw',
			minHeight: '100vh',
			color: '#0e1111',
			fontFamily: '"Share Tech Mono", monospace',
		},
	},
	main: {
		width: '100vw',
		margin: '0 auto',
		textAlign: 'center',
	},
	header: {
		marginTop: '',
	},
	title: {
		fontSize: '8rem',
		fontFamily: '"Sarpanch", sans-serif',
		fontWeight: '900',
	},
	gameField: {
		display: 'grid',
		gridTemplateColumns: 'repeat(9, 1fr)',
		gridColumnGap: '0.2rem',
		gridRowGap: '0.2rem',
		padding: '0.4rem',
		marginBottom: '1rem',
	},
	btnExtend: {
		height: '3.7rem',
		borderWidth: '0.2rem',
		borderStyle: 'solid',
		borderColor: '#0e1111',
		borderRadius: '0.15rem',

		backgroundColor: '#fdfeff',

		textAlign: 'center',
		padding: '0.2rem 1rem',
		fontSize: '2.5rem',
		fontFamily: '"Share Tech Mono", monospace',

		overflow: 'hidden',
		cursor: 'pointer',

		marginBottom: '1rem',
		color: '#0e1111',
	}
}

class _App extends React.PureComponent {
	constructor( props ) {
		super( props );
		this.state = {
			game: new Game(),
			selectedCell: null,
			finished: false
		}
	}
	selectCell( fieldIndex ) {
		if( this.state.selectedCell && this.state.game.canCellsBeCrossedOut( this.state.selectedCell, fieldIndex ) ){
			this.state.game.crossOut( this.state.selectedCell, fieldIndex );
			this.setState({
				selectedCell: null,
				finished: this.state.game.isFinished()
			});
		} else {
			this.setState({ selectedCell: fieldIndex });
		}
	}
	extendField() {
		this.state.game.extendField();
		this.forceUpdate();
	}
	render() {
		let { classes } = this.props;
		return (
			<main className={ classes.main }>
				<header>
					<h1 className={ classes.title }>CoNu</h1>
				</header>
				{ this.state.finished && <h2>You won!</h2> }
				<div className={ classes.gameField }>
					{ this.state.game.map( ( number, index ) => <Cell
						key={ index }
						number={ Math.abs( number ) }
						onClick={ () => this.selectCell( index ) }
						crossedOut={ number < 0 }
						selected={ this.state.selectedCell == index }/> ) }
				</div>
				<button
					className={ classes.btnExtend }
					disabled={ this.state.finished }
					onClick={ () => this.extendField() }>
					Extend
				</button>
			</main>
		);
	}
}
const App = injectSheet( styles )( _App );


ReactDOM.render(
	<App />,
	document.getElementById('react-root')
);

module.hot.accept();

