import type { Book } from "../types";

interface BookCardProps {
  book: Book;
  onBorrow: (book: Book) => void;
  borrowingId: number | null;
}

export default function BookCard({ book, onBorrow, borrowingId }: BookCardProps) {
  const isAvailable = book.available_copies > 0;
  const isBorrowingThis = borrowingId === book.id;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between">
      <div>
        <h3 className="font-semibold text-slate-900 leading-snug">{book.title}</h3>
        <p className="text-sm text-slate-500 mt-1">by {book.author}</p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            isAvailable ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
          }`}
        >
          {isAvailable ? `${book.available_copies} available` : "Unavailable"}
        </span>

        <button
          onClick={() => onBorrow(book)}
          disabled={!isAvailable || isBorrowingThis}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium px-3 py-1.5 rounded-lg transition"
        >
          {isBorrowingThis ? "Borrowing..." : "Borrow"}
        </button>
      </div>
    </div>
  );
}