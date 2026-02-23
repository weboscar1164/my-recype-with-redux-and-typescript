import admin from "firebase-admin";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const serviceAccount = require("../serviceAccountKey/my-recipe-with-redux-and-ts-firebase-adminsdk-i6181-2ee48c4f24.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const migrateRecipeCount = async () => {
	const usersSnap = await db.collection("users").get();

	for (const userDoc of usersSnap.docs) {
		const uid = userDoc.id;

		if (userDoc.data().recipeCount !== undefined) continue;

		const recipesSnap = await db
			.collection("recipes")
			.where("user", "==", uid)
			.get();

		await userDoc.ref.update({
			recipeCount: recipesSnap.size,
		});

		console.log(uid, recipesSnap.size);
	}

	console.log("done");
};

migrateRecipeCount().catch(console.error);
