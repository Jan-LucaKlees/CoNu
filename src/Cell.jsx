import React from 'react';
import c from 'classnames'

const Cell = ({ number, paired, selected, onClick }) =>
	<button
		className={ c( 'cell', { 'active': selected, 'disabled': paired } ) }
		onClick={ onClick }>
		{ number }
	</button>;

export default Cell;

