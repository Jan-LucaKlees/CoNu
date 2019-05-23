import React from 'react';
import ReactDOM from 'react-dom';
import injectSheet from 'react-jss';

import Game from './Game';


const Cell = injectSheet({
	cell: {
		width: '3rem',
		height: '4.5rem',
		borderWidth: '0.25rem',
		borderStyle: 'solid',
		borderColor: ({ number }) => number > 0 ? 'black' : 'grey',

		backgroundColor: ({ selected }) => selected ? '#ffbbbb' : '#fff',

		textAlign: 'center',
		fontSize: '3rem',

		overflow: 'hidden',
		cursor: 'pointer',
	}
})( ({ number, onClick, classes }) => <div className={ classes.cell } onClick={ onClick }>{ Math.abs( number ) }</div> );

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
		this.state = {
			game: new Game(),
			selectedCell: null,
		}
	}
	selectField( fieldIndex ) {
		if( this.state.selectedCell && this.state.game.canFieldsBeCrossedOut( this.state.selectedCell, fieldIndex ) ){
			this.state.game.crossOut( this.state.selectedCell, fieldIndex )
			this.setState({ selectedCell: null });
		} else {
			this.setState({ selectedCell: fieldIndex });
		}
	}
	render() {
		let { classes } = this.props;
		return (
			<div className={ classes.gameField }>
				{ this.state.game.map( ( number, index ) => <Cell
					key={ index }
					number={ number }
					onClick={ () => this.selectField( index ) }
					selected={ this.state.selectedCell == index }/> ) }
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

