import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const SIBLING_COUNT = 1;
const DOTS = "...";

function getPaginationRange(currentPage: number, totalPage: number) {
  const totalPageNumbers = SIBLING_COUNT * 2 + 5; // siblings + first + last + current + 2 dots

  if (totalPageNumbers >= totalPage) {
    return Array.from({ length: totalPage }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - SIBLING_COUNT, 1);
  const rightSiblingIndex = Math.min(currentPage + SIBLING_COUNT, totalPage);

  const showLeftDots = leftSiblingIndex > 2;
  const showRightDots = rightSiblingIndex < totalPage - 2;

  if (!showLeftDots && showRightDots) {
    const leftRange = Array.from({ length: 3 + SIBLING_COUNT * 2 }, (_, i) => i + 1);
    return [...leftRange, DOTS, totalPage];
  }

  if (showLeftDots && !showRightDots) {
    const rightRange = Array.from(
      { length: 3 + SIBLING_COUNT * 2 },
      (_, i) => totalPage - (3 + SIBLING_COUNT * 2) + 1 + i
    );
    return [1, DOTS, ...rightRange];
  }

  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, i) => leftSiblingIndex + i
  );
  return [1, DOTS, ...middleRange, DOTS, totalPage];
}

const ManagePagination = ({ meta }: any) => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPage = Number(meta?.page);
  const totalPage = Number(meta?.totalPage);

  const updatePage = (page: number) => {
    if (page < 1 || page > totalPage) return;
    const params = new URLSearchParams(location.search);
    params.set("page", page.toString());
    params.set("limit", meta.limit.toString());
    navigate(`?${params.toString()}`);
  };

  const paginationRange = getPaginationRange(currentPage, totalPage);

  return (
    <div className={`${!totalPage ? "hidden" : "flex"} items-center justify-center w-full p-4`}>
      <div className="flex items-center space-x-2 md:space-x-4">

        {/* Prev */}
        <button
          disabled={currentPage === 1 || totalPage === 1}
          onClick={() => updatePage(currentPage - 1)}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft />
        </button>

        {/* Pages */}
        {paginationRange.map((page, index) => {
          if (page === DOTS) {
            return (
              <span
                key={`dots-${index}`}
                className="flex items-center justify-center w-12 h-12 text-muted-foreground select-none"
              >
                ···
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <button
              key={page}
              onClick={() => updatePage(page as number)}
              className={`flex items-center justify-center w-12 h-12 rounded-full
                ${isActive
                  ? "bg-primary! text-white"
                  : "border border-primary! text-primary!"
                }
              `}
            >
              {page}
            </button>
          );
        })}

        {/* Next */}
        <button
          disabled={currentPage === totalPage || totalPage === 1}
          onClick={() => updatePage(currentPage + 1)}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight />
        </button>

      </div>
    </div>
  );
};

export default ManagePagination;