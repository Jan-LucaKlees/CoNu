import React from 'react';
import c from 'classnames';

const Btn = ( { onClick, disabled, className, children } ) => (
	<button
		className={ c( 'btn', className ) }
		disabled={ disabled }
		onClick={ onClick }>
		{ children }
	</button>
);

const BtnSingleLine = ( { onClick, disabled, className, children } ) => (
	<Btn
		className={ c( 'btn--single-line', className ) }
		disabled={ disabled }
		onClick={ onClick }>
		{ children }
	</Btn>
);

const BtnInvisible = ( { onClick, disabled, className, children } ) => (
	<Btn
		className={ c( 'btn--invisible', className ) }
		disabled={ disabled }
		onClick={ onClick }>
		{ children }
	</Btn>
);

export { Btn as default, BtnSingleLine, BtnInvisible };

