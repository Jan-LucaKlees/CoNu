import React from 'react';
import { connect } from 'react-redux'

import { authenticateUser, USER_AUTHENTICATION_SUCCEEDED } from './redux/user';

import { LoadingScreen } from './LoadingIndicator';

class AppLoader extends React.PureComponent {
	componentDidMount() {
		this.props.authenticateUser();
	}
	render() {
		let loading = !this.props.userAuthenticated;

		if( loading ){
			return(
				<LoadingScreen />
			);
		} else {
			return (
				"Logged in!"
			);
		}
	}
}

const mapStateToProps = ( state ) => {
	return {
		userAuthenticated: state.user.get( 'status' ) === USER_AUTHENTICATION_SUCCEEDED,
	}
}

const mapDispatchToProps = { authenticateUser }

export default connect(
	mapStateToProps,
	mapDispatchToProps
)( AppLoader )

