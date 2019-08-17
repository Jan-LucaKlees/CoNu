import React from 'react';

import Btn from './Btn';

import Logo from '../assets/images/conu-logo.svg';


const RedirectNotice = () =>
	<>
		<header className="conu__header">
			<img
				src={ Logo }
				className="conu__logo conu__logo--not-interactive" />
		</header>

		<div className="redirect-notice">

			<h2 className="redirect-notice__header">It's official!</h2>

			<p className="redirect-notice__text">
				Conu moved to it's now official website!
			</p>

			<a href="https://conu.app/" className="decoration-none">
				<Btn>
						Play at conu.app
				</Btn>
			</a>

		</div>
	</>

export default RedirectNotice;

