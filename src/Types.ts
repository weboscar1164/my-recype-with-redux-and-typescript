import { Timestamp } from "firebase/firestore";

export interface InitialUserState {
	user: null | {
		uid: string;
		photo: string;
		email: string;
		displayName: string;
	};
}

export interface UpdateRecipeState {
	isPublic: number;
	recipeName: string | null;
	recipeImageUrl: string | null;
	comment: string | null;
	serves: number;
	materials: MaterialState[] | null;
	procedures: string[] | null;
	user: string;
	createdAt: Timestamp | null;
	updatedAt: Timestamp;
}

export interface InitialRecipeState {
	isPublic: number;
	recipeName: string | null;
	recipeImage: string | null;
	comment: string | null;
	serves: number;
	materials: MaterialState[] | null;
	procedures: string[] | null;
}

export interface MaterialState {
	name: string;
	quantity: string;
	group: number;
}
