export interface InitialUserState {
	user: null | {
		uid: string;
		photo: string;
		email: string;
		displayName: string;
	};
}

export interface InitialRecipeState {
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
