import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "./Pagination.scss";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (pageNumber: number) => void;
}
const Pagination = ({
	currentPage,
	totalPages,
	onPageChange,
}: PaginationProps) => {
	const maxPageNumberToShow = 5;

	const handleNextPage = () => {
		if (currentPage < totalPages) {
			onPageChange(currentPage + 1);
		}
	};

	const handlePrevPage = () => {
		if (currentPage > 1) {
			onPageChange(currentPage - 1);
		}
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
		let startPage, endPage;

		if (currentPage <= 3) {
			startPage = 1;
			endPage = maxPageNumberToShow;
		} else if (currentPage + 2 >= totalPages) {
			startPage = totalPages - 4;
			endPage = totalPages;
		} else {
			startPage = currentPage - 2;
			endPage = currentPage + 2;
		}

		//最初のページと記号
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

		// Add page numbers
		for (let i = startPage; i <= endPage; i++) {
			pages.push(
				<button
					key={i}
					onClick={() => onPageChange(i)}
					className={`paginationButton ${
						i === currentPage ? "paginationActive" : "paginationInactive"
					}`}
				>
					{i}
				</button>
			);
		}

		// Add last page and ellipsis if needed
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
				onClick={handlePrevPage}
			>
				<ArrowBackIosNewIcon />
			</div>
			{renderPageNumbers()}

			<div
				className={`paginationChangepage ${
					currentPage !== totalPages ? "paginationChangepageActive" : ""
				}`}
				onClick={handleNextPage}
			>
				<ArrowForwardIosIcon />
			</div>
		</div>
	);
};

export default Pagination;
