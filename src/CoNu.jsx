import React from 'react';
import ReactDOM from 'react-dom';
import WebFont from 'webfontloader';

import './scss/main.scss';

import UrlBasedContentSwitcher from './UrlBasedContentSwitcher';
import Logo from '../assets/images/conu-logo.svg';


WebFont.load({
	google: {
		families: [ 'Share Tech Mono' ],
	}
});

class CoNu extends React.PureComponent {
	render() {
		return (
			<main className="conu">

				<header className="conu__header">
					<img src={ Logo } className="conu__logo" />
				</header>

				<UrlBasedContentSwitcher />

			</main>
		);
	}
}

ReactDOM.render(
	<CoNu />,
	document.getElementById('react-root')
);

if( DEV_SERVER ) {
	module.hot.accept();
}

