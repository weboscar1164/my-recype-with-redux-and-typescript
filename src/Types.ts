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
	material: Material[] | null;
	procedure: string[] | null;
}

interface Material {
	name: string;
	quantity: string;
	group: number;
}
