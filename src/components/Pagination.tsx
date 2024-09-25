import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "./Pagination.scss";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (pageNumber: number) => void;
	maxPageNumberToShow?: number;
}

const Pagination = ({
	currentPage,
	totalPages,
	onPageChange,
	maxPageNumberToShow = 5,
}: PaginationProps) => {
	const handlePageChange = (newPage: number) => {
		const validPage = Math.max(1, Math.min(newPage, totalPages)); // 誤って設定されたページ数以外の数字が入らないように監視
		onPageChange(validPage);
	};

	const renderPageNumbers = () => {
		const pageNumbers: number[] = [];
		for (let i = 1; i <= totalPages; i++) {
			pageNumbers.push(i);
		}

		if (totalPages <= maxPageNumberToShow) {
			return pageNumbers.map((number) => (
				<button
					key={number}
					className={`paginationButton ${
						number === currentPage ? "paginationActive" : "paginationInactive"
					}`}
					onClick={() => onPageChange(number)}
				>
					{number}
				</button>
			));
		}
		const pages = [];
		const startPage = Math.max(1, currentPage - 2);
		const endPage = Math.min(totalPages, currentPage + 2);

		// 必要に応じて最初のページと省略記号を追加
		if (startPage > 1) {
			pages.push(
				<button
					key={1}
					onClick={() => onPageChange(1)}
					className="paginationButton paginationInactive"
				>
					1
				</button>
			);
			if (startPage > 2) {
				pages.push(<span key="start-ellipsis">...</span>);
			}
		}

		// ページ番号を追加
		for (let i = startPage; i <= endPage; i++) {
			pages.push(
				<button
					key={i}
					onClick={() => onPageChange(i)}
					className={`paginationButton ${
						i === currentPage ? "paginationActive" : "paginationInactive"
					}`}
					disabled={i === currentPage}
				>
					{i}
				</button>
			);
		}

		// 必要に応じて最後のページと省略記号を追加
		if (endPage < totalPages) {
			if (endPage < totalPages - 1) {
				pages.push(<span key="end-ellipsis">...</span>);
			}
			pages.push(
				<button
					key={totalPages}
					onClick={() => onPageChange(totalPages)}
					className="paginationButton paginationInactive"
				>
					{totalPages}
				</button>
			);
		}

		return pages;
	};

	return (
		<div className="pagination">
			<div
				className={`paginationChangepage ${
					currentPage !== 1 ? "paginationChangepageActive" : ""
				}`}
				onClick={() => handlePageChange(currentPage - 1)}
			>
				<ArrowBackIosNewIcon />
			</div>
			{renderPageNumbers()}

			<div
				className={`paginationChangepage ${
					currentPage !== totalPages ? "paginationChangepageActive" : ""
				}`}
				onClick={() => handlePageChange(currentPage + 1)}
			>
				<ArrowForwardIosIcon />
			</div>
		</div>
	);
};

export default Pagination;
