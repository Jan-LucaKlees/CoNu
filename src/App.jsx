import React from 'react';
import ReactDOM from 'react-dom';
import injectSheet from 'react-jss';

import GameField from './GameField';

let gameField = new GameField()


const Cell = injectSheet({
	cell: {
		width: '3rem',
		height: '4.5rem',
		borderWidth: '0.25rem',
		borderStyle: 'solid',
		borderColor: ({ number }) => number > 0 ? 'black' : 'grey',

		textAlign: 'center',
		fontSize: '3rem',

		overflow: 'hidden',
		cursor: 'pointer',
	}
})( ({ number, classes }) => <div className={ classes.cell }>{ Math.abs( number ) }</div> );

const styles = {
	'@global': {
		body: {
			backgroundColor: '#ddd',
		},
	},
	gameField: {
		width: '33rem',
		margin: '12rem auto',
		display: 'grid',
		gridTemplateColumns: 'repeat(9, 1fr)',
		gridColumnGap: '1rem',
		gridRowGap: '1rem',
	}
}

class _App extends React.PureComponent {
	constructor( props ) {
		super( props );
	}
	render() {
		let { classes } = this.props;
		return (
			<div className={ classes.gameField }>
				{ gameField.map( ( number, index ) => <Cell key={index} number={number} /> ) }
			</div>
		);
	}
}
const App = injectSheet( styles )( _App );


ReactDOM.render(
	<App />,
	document.getElementById('react-root')
);

module.hot.accept();

