import admin from "firebase-admin";
import serviceAccount from "../serviceAccountKey/my-recipe-with-redux-and-ts-firebase-adminsdk-i6181-2ee48c4f24.json";

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const db = admin.firestore();

const migrateRecipeCount = async () => {
	const usersSnap = await db.collection("users").get();
	console.log(`users: ${usersSnap.size}`);

	for (const userDoc of usersSnap.docs) {
		const uid = userDoc.id;

		if (userDoc.data().recipeCount !== undefined) {
			console.log(`skip ${uid}`);
			continue;
		}

		const recipesSnap = await db
			.collection("recipes")
			.where("user", "==", uid)
			.get();

		const count = recipesSnap.size;

		await userDoc.ref.update({ recipeCount: count });
		console.log(`updated ${uid}: ${count}`);
	}

	console.log("done");
};

migrateRecipeCount().catch(console.error);
