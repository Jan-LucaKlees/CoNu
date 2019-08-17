import React from 'react';
import c from 'classnames'

import { BtnSingleLine } from './Btn';


const Cell = ({ number, paired, selected, onClick }) =>
	<div className="field__cell-wrapper">
		<BtnSingleLine
			className={ c( 'btn--cell', { 'btn--selected': selected } ) }
			disabled={ paired }
			onClick={ onClick }>
			{ number }
		</BtnSingleLine>
	</div>

export default Cell;

