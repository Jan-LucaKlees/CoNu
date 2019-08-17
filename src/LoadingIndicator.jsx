import React from 'react';
import c from 'classnames';


class LoadingIndicator extends React.PureComponent {
	render() {
		return (
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
		)
	}
}

class LoadingScreen extends React.PureComponent {
	render() {
		let { faded, className } = this.props;
		return (
			<div className={ c( "loading-screen", { "loading-screen--faded": faded }, className ) } >
				<LoadingIndicator key="loading-indicator" />
			</div>
		)
	}
}

export { LoadingIndicator as default, LoadingScreen };

