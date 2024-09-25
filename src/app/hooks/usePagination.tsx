import { useState } from "react";

export const usePagination = <T,>(items: T[], itemsPerPage: number) => {
	const [currentPage, setCurrentPage] = useState(1);

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
