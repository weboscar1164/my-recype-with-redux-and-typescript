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
	user?: string;
	createdAt?: Timestamp | null;
	updatedAt?: Timestamp;
}

export interface InitialRecipeState {
	isPublic: number;
	recipeName: string | null;
	recipeImageUrl: string | null;
	comment: string | null;
	serves: number;
	materials: MaterialState[] | null;
	procedures: string[] | null;
	favoriteCount?: number;
	recipeId?: string;
	user?: string;
	userDisprayName?: string;
	createdAt?: Timestamp | null;
	updatedAt?: Timestamp;
}

export interface MaterialState {
	name: string;
	quantity: string;
	group: number;
}

export interface FavoriteState {
	recipeId: string;
	recipeName: string;
	createdAt: string;
}

export interface RecipeListItem {
	recipeName: string;
	recipeImageUrl: string;
	recipeId: string;
	favoriteCount: number;
}
