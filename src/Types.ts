import { Timestamp } from "firebase/firestore";

// ユーザー情報
export interface InitialUserState {
	user: null | User;
}

export interface AuthUser {
	uid: string;
	photoURL: string;
	email: string;
	displayName: string;
}

export type Role = "guest" | "user" | "admin";

export type User = AuthUser & {
	role: Role;
};

// レシピ
export interface InitialRecipeState {
	isPublic: number;
	recipeName: string | null;
	tags?: string[];
	recipeImageUrl: string | null;
	comment: string | null;
	serves: number;
	materials: MaterialState[] | null;
	procedures: string[] | null;
	favoriteCount?: number;
	recipeId?: string;
	user?: string;
	userDisplayName?: string;
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
	createdAt?: string;
}

// 一覧として取得するアイテム
export interface RecipeListItem {
	recipeName: string;
	tags: string[];
	recipeImageUrl: string;
	recipeId: string;
	favoriteCount: number;
	isPublic: number;
	user: string;
}

//Modal
export interface ConfirmModal {
	message: string;
	isOpen: boolean;
	confirmed: boolean | null;
}

//popup
export interface Popup {
	isOpen: boolean;
	message: string;
	action: "success" | "notice" | "";
}

//suggestion
export type Suggestion = {
	word: string;
	source: "local" | "fixed" | "server";
};
