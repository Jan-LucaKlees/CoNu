import React, { useState } from 'react';
import c from 'classnames';


const Btn = React.memo( ({ onClick, disabled, className, children }) => {
	const [ active, setActive ] = useState( false );

	return (
		<button
			className    = { c( 'btn', { 'btn--active': active }, className ) }
			disabled     = { disabled }
			onClick      = { onClick }
			onTouchStart = { () => !disabled && setActive( true ) }
			onTouchEnd   = { () => !disabled && setActive( false ) } >
			{ children }
		</button>
	);
});

/**
 * Button with fixed height so only one line of text fits in
 */
const BtnSingleLine = React.memo( ({ onClick, disabled, className, children }) =>
	<Btn
		className={ c( 'btn--single-line', className ) }
		disabled={ disabled }
		onClick={ onClick }>
		{ children }
	</Btn>
);

/**
 * Button that is not styled as such to allow for clicable images / icons.
 */
const BtnInvisible = React.memo( ({ onClick, disabled, className, children }) =>
	<Btn
		className={ c( 'btn--invisible', className ) }
		disabled={ disabled }
		onClick={ onClick }>
		{ children }
	</Btn>
);

/**
 * Animated wrapper for swapping out one button with another, all being nicely
 * animated
 */
const BtnCuboid = React.memo( ({ Front, Top, Bottom, Back, showFace, className }) =>
	<div className={ c( 'btn-cuboid', className ) } >
		<div className={ "btn-cuboid__cuboid btn-cuboid__cuboid--show-" + showFace } >
			<div className="btn-cuboid__face   btn-cuboid__face--front" >{ Front  }</div>
			<div className="btn-cuboid__face   btn-cuboid__face--top"   >{ Top    }</div>
			<div className="btn-cuboid__face   btn-cuboid__face--bottom">{ Bottom }</div>
			<div className="btn-cuboid__face   btn-cuboid__face--back"  >{ Back   }</div>
		</div>
	</div>
);

export { Btn as default, BtnSingleLine, BtnInvisible, BtnCuboid };

