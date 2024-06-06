import React, { useEffect, useState } from "react";

interface RecipeImageProps {
	src: string;
	alt: string;
}

const RecipeImage: React.FC<RecipeImageProps> = ({ src, alt }) => {
	const [loaded, setLoaded] = useState<boolean>(false);

	useEffect(() => {
		const img = new Image();
		img.src = src;
		img.onload = () => setLoaded(true);
	}, [src]);

	return <img src={src} alt={alt} className={loaded ? "loaded" : ""} />;
};

export default RecipeImage;
