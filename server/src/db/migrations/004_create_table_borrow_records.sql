CREATE TABLE IF NOT EXISTS borrow_records(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    book_id INTEGER NOT NULL,
    borrowed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    due_date DATE NOT NULL,
    returned_date TIMESTAMPTZ,

    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(book_id) REFERENCES books(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX one_active_borrow_per_book_per_user
ON borrow_records(user_id,book_id)
WHERE returned_date IS NULL;