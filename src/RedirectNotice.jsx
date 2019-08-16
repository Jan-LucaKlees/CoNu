import React from 'react';

import Btn from './Btn';


const RedirectNotice = () =>
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

export default RedirectNotice;

