import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyCS7FRBL56cr75AFZbyIyI4BGGBa1z1B1Q",
	authDomain: "my-recipe-with-redux-and-ts.firebaseapp.com",
	projectId: "my-recipe-with-redux-and-ts",
	storageBucket: "my-recipe-with-redux-and-ts.appspot.com",
	messagingSenderId: "1097527782135",
	appId: "1:1097527782135:web:4d194e6ec968f8a88741f2",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage();

// 複数ユーザーによるログインを設定
provider.setCustomParameters({
	prompt: "select_account",
});

export { auth, provider, db, storage };
