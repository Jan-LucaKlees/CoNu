import React from 'react';
import c from 'classnames'

const Cell = ({ number, crossedOut, selected, onClick }) =>
	<button
		className={ c( 'cell', { 'active': selected, 'disabled': crossedOut } ) }
		onClick={ onClick }>
		{ number }
	</button>;

export default Cell;

