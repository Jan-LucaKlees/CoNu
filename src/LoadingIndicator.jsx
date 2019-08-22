import React from 'react';
import { CSSTransition } from 'react-transition-group';
import c from 'classnames';


const LoadingIndicator = ( { loading } ) => (
	<div className="loading-indicator" >
		<div className="loading-indicator__cube" >
			<div className="loading-indicator__face loading-indicator__face--front" ></div>
			<div className="loading-indicator__face loading-indicator__face--top"   ></div>
			<div className="loading-indicator__face loading-indicator__face--bottom"></div>
			<div className="loading-indicator__face loading-indicator__face--back"  ></div>
			<div className="loading-indicator__face loading-indicator__face--left"  ></div>
			<div className="loading-indicator__face loading-indicator__face--right"  ></div>
		</div>
	</div>
);

const LoadingScreen = ( { loading = true, className } ) => (
	<CSSTransition in={ loading } timeout={ 300 } classNames="loading-screen">
		{ state => state != 'exited' && (
			<div className={ c( "loading-screen", className ) } >
				<LoadingIndicator key="loading-indicator" />
			</div>
		) }
	</CSSTransition>
);

export { LoadingIndicator as default, LoadingScreen };

