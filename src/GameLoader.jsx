import React from 'react';
import * as firebase from "firebase/app";
import "firebase/firestore";

// import GameState from './GameState';
import Game from './Game';


var firebaseConfig = {
	apiKey: "AIzaSyAclLIP1KzABj7LDojGZ5UaQ62xMSzmR8c",
	authDomain: "connect-numbers.firebaseapp.com",
	databaseURL: "https://connect-numbers.firebaseio.com",
	projectId: "connect-numbers",
	storageBucket: "connect-numbers.appspot.com",
	messagingSenderId: "174348090247",
	appId: "1:174348090247:web:3a5a6c2367d59de8"
};

export default class GameLoader extends React.PureComponent {
	constructor( props ) {
		super( props );

		firebase.initializeApp(firebaseConfig);
		this.db = firebase.firestore();
	}
	render() {
		return (
			<Game />
		);
	}
}

