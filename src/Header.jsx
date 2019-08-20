import React from 'react';
import { connect } from 'react-redux'
import { CSSTransition } from 'react-transition-group';

import { toggleMenu, collapseMenuWithTimeout } from './redux/header';

import Btn, { BtnInvisible } from './Btn';

import Logo from '../assets/images/conu-logo.svg';


class Header extends React.PureComponent {

	componentDidMount() {
		this.collapseMenuTimeout = this.props.collapseMenuWithTimeout( 1300 );
	}

	componentWillUnmount() {
		clearTimeout( this.collapseMenuTimeout );
	}

	render() {
		return (
			<header className="conu__header">

				<BtnInvisible className="btn--logo" onClick={ this.props.toggleMenu } >
					<img className="conu__logo" src={ Logo } />
				</BtnInvisible>

				<CSSTransition
					in={ this.props.showMenu }
					timeout={ 300 }
					classNames="conu__menu-wrapper">

					<nav className={ "conu__menu-wrapper" }>
						<div className="menu">
							<Btn
								className="btn--menu-item"
								onClick={ () => { /* this.onStartNewGame() */ } } >
								New Game
							</Btn>
						</div>
					</nav>

				</CSSTransition>

			</header>
		);
	}
}

const mapStateToProps = ( state ) => {
	return {
		showMenu: state.header.get( 'showMenu' ),
	}
};

const mapDispatchToProps = { toggleMenu, collapseMenuWithTimeout };

export default connect(
	mapStateToProps,
	mapDispatchToProps
)( Header )

