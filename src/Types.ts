import { Timestamp } from "firebase/firestore";

// ユーザー情報
export interface InitialUserState {
	user: null | {
		uid: string;
		photo: string;
		email: string;
		displayName: string;
	};
}

// レシピ
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

// 材料
export interface MaterialState {
	name: string;
	quantity: string;
	group: number;
}

// お気に入り
export interface FavoriteState {
	recipeId: string;
	recipeName: string;
	createdAt: string;
}

// 一覧として取得するアイテム
export interface RecipeListItem {
	recipeName: string;
	recipeImageUrl: string;
	recipeId: string;
	favoriteCount: number;
	isPublic: number;
	user: string;
}
