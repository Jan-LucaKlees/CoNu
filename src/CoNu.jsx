import React from 'react';
import ReactDOM from 'react-dom';
import WebFont from 'webfontloader';

import './scss/main.scss';

import UrlBasedContentSwitcher from './UrlBasedContentSwitcher';


WebFont.load({
	google: {
		families: [ 'Share Tech Mono' ],
	}
});

class CoNu extends React.PureComponent {
	render() {
		return (
			<main className="conu">

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

