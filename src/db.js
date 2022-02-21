import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';


const firebaseConfig = {
	apiKey: "AIzaSyAclLIP1KzABj7LDojGZ5UaQ62xMSzmR8c",
	authDomain: "connect-numbers.firebaseapp.com",
	databaseURL: "https://connect-numbers.firebaseio.com",
	projectId: "connect-numbers",
	storageBucket: "connect-numbers.appspot.com",
	messagingSenderId: "174348090247",
	appId: "1:174348090247:web:3a5a6c2367d59de8"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
export default db;

