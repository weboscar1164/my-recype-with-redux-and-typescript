const functions = require("firebase-function");
const admin = require("firebase-admin");
admin.initializeApp();

exports.setAdminClaims = functions.https.oncall(
	async (data: any, context: any) => {
		if (context.auth.token.admin !== true) {
			throw new functions.https.HttpsError(
				"failed-precondition",
				"This function must be called by an admin"
			);
		}

		// カスタムクレームを設定
		const uid = data.uid;
		await admin.auth().setCustomUserClaims(uid, { admin: true });

		return { message: `admin claims set for user ${uid}` };
	}
);
