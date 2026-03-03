import { useEffect, useState } from "react";

export const usePagination = <T,>(
	items: T[],
	itemsPerPage: number,
	initialPage: number = 1,
) => {
	const [currentPage, setCurrentPage] = useState(initialPage);

	// items が変わったときにページが範囲外なら補正
	useEffect(() => {
		const totalPages = Math.ceil(items.length / itemsPerPage);
		if (totalPages === 0) return;
		if (currentPage > totalPages) {
			setCurrentPage(totalPages);
		}
	}, [items]);

	//総ページ数を計算
	const totalPages = Math.ceil(items.length / itemsPerPage);

	//ページネーションのためのインデックス計算
	const indexOfLastRecipe = currentPage * itemsPerPage;
	const indexOfFirstRecipe = indexOfLastRecipe - itemsPerPage;
	const currentItems = items.slice(indexOfFirstRecipe, indexOfLastRecipe);

	// ページ変更した場合にcurrentPageに現在のページ番号を渡す
	const handlePageChange = (pageNumber: number) => {
		setCurrentPage(pageNumber);
	};

	return {
		currentItems, // 現ページにおいて表示するリスト一覧
		totalPages, // 総ページ数
		currentPage, // 現在ページ
		handlePageChange, // ページ変更のための関数
	};
};
