import React from 'react';
import c from 'classnames'

const Cell = ({ number, paired, selected, onClick }) =>
	<div className="cell-wrapper">
		<button
			className={ c( 'cell', { 'active': selected, 'disabled': paired } ) }
			onClick={ onClick }>
			{ number }
		</button>
	</div>

export default Cell;

