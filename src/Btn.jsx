import React from 'react';
import c from 'classnames';

class Btn extends React.PureComponent {
	constructor( props ) {
		super( props );

		this.state = {
			active: false
		}
	}
	onTouchStart() {
		if( !this.props.disabled ) {
			this.setState({
				active: true
			});
		}
	}
	onTouchEnd() {
		if( !this.props.disabled ) {
			this.setState({
				active: false
			});
		}
	}
	render() {
		let { onClick, disabled, className, children } = this.props;

		return (
			<button
				className={ c( 'btn', { 'btn--active': this.state.active }, className ) }
				disabled={ disabled }
				onClick={ onClick }
				onTouchStart={ () => this.onTouchStart() }
				onTouchEnd={ () => this.onTouchEnd() } >
				{ children }
			</button>
		);
	}
}

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

const BtnCuboid = ( { Front, Top, Bottom, Back, showFace, className } ) => (
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

