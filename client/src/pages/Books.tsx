import { useEffect, useState } from "react";
import axios from "axios";
import { search, borrowed as getBorrowed } from "../api/library";
import { borrowBook, returnBook } from "../api/borrowReturn";
import type { Book, ApiError } from "../types";
import BookCard from "../components/BookCard";

interface BorrowedItem {
  book_title: string;
  book_author: string;
  borrow_date: string;
}

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchKey, setSearchKey] = useState<"title" | "author">("title");
  const [searchTerm, setSearchTerm] = useState("");
  const [booksLoading, setBooksLoading] = useState(true);
  const [booksError, setBooksError] = useState("");

  const [borrowedList, setBorrowedList] = useState<BorrowedItem[]>([]);
  const [borrowedLoading, setBorrowedLoading] = useState(true);

  const [borrowingId, setBorrowingId] = useState<number | null>(null);
  const [returningTitle, setReturningTitle] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function getErrorMessage(err: unknown, fallback: string) {
    if (axios.isAxiosError<ApiError>(err)) {
      return err.response?.data?.error ?? fallback;
    }
    return fallback;
  }

  function showMessage(type: "success" | "error", text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }

  async function loadBooks(key: "title" | "author", term: string) {
    setBooksLoading(true);
    setBooksError("");
    try {
      // no "list all" endpoint on the backend — "%" matches every row via SQL LIKE
      const res = await search(key, term.trim() === "" ? "%" : term.trim());
      setBooks(res.data);
    } catch (err) {
      setBooks([]);
      setBooksError(getErrorMessage(err, "No books found"));
    } finally {
      setBooksLoading(false);
    }
  }

  async function loadBorrowed() {
    setBorrowedLoading(true);
    try {
      const res = await getBorrowed();
      setBorrowedList(res.data);
    } catch {
      setBorrowedList([]); // backend errors when the list is empty — treat as empty, not a failure
    } finally {
      setBorrowedLoading(false);
    }
  }

  useEffect(() => {
    loadBooks("title", "");
    loadBorrowed();
  }, []);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    loadBooks(searchKey, searchTerm);
  }

  async function handleBorrow(book: Book) {
    setBorrowingId(book.id);
    try {
      await borrowBook(book.title, book.author);
      showMessage("success", `Borrowed "${book.title}"`);
      await Promise.all([loadBooks(searchKey, searchTerm), loadBorrowed()]);
    } catch (err) {
      showMessage("error", getErrorMessage(err, "Could not borrow this book"));
    } finally {
      setBorrowingId(null);
    }
  }

  async function handleReturn(item: BorrowedItem) {
    setReturningTitle(item.book_title);
    try {
      await returnBook(item.book_title, item.book_author);
      showMessage("success", `Returned "${item.book_title}"`);
      await Promise.all([loadBooks(searchKey, searchTerm), loadBorrowed()]);
    } catch (err) {
      showMessage("error", getErrorMessage(err, "Could not return this book"));
    } finally {
      setReturningTitle(null);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {message && (
        <div
          className={`mb-6 text-sm rounded-lg px-4 py-2.5 border ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-red-50 border-red-200 text-red-600"
          }`}
        >
          {message.text}
        </div>
      )}

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Your Borrowed Books</h2>
        {borrowedLoading ? (
          <p className="text-sm text-slate-400">Loading...</p>
        ) : borrowedList.length === 0 ? (
          <p className="text-sm text-slate-400">You haven't borrowed any books yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {borrowedList.map((item) => (
              <div
                key={`${item.book_title}-${item.book_author}`}
                className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-slate-900 text-sm">{item.book_title}</p>
                  <p className="text-xs text-slate-500">by {item.book_author}</p>
                </div>
                <button
                  onClick={() => handleReturn(item)}
                  disabled={returningTitle === item.book_title}
                  className="bg-slate-900 hover:bg-slate-700 disabled:opacity-40 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition"
                >
                  {returningTitle === item.book_title ? "Returning..." : "Return"}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Browse Books</h2>
        <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-6">
          <select
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value as "title" | "author")}
            className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="title">Title</option>
            <option value="author">Author</option>
          </select>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search by ${searchKey}...`}
            className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
          >
            Search
          </button>
        </form>

        {booksLoading ? (
          <p className="text-sm text-slate-400">Loading books...</p>
        ) : booksError ? (
          <p className="text-sm text-slate-400">{booksError}</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {books.map((book) => (
              <BookCard key={book.id} book={book} onBorrow={handleBorrow} borrowingId={borrowingId} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}