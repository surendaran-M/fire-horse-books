import React, { useEffect, useState } from "react";
import { getAllBooks } from "../services/api.jsx";
import BookCard from "../components/BookCard";
import SearchFilter from "../components/SearchFilter";
import { useNavigate, useSearchParams } from "react-router-dom";

function Home() {
  const [books, setBooks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  useEffect(() => {
    let cancelled = false;

    getAllBooks()
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data) ? data : [];
        setBooks(list);
        setFiltered(list);
        setError("");
      })
      .catch(() => {
        if (cancelled) return;
        setError("⚠️ Failed to load books.");
        setBooks([]);
        setFiltered([]);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return (
    <div className="container" style={{textAlign: "center", marginTop: "40px"}}>
      <div className="loading"></div>
      <p>Loading books...</p>
    </div>
  );
  
  if (error) return (
    <div className="container">
      <div className="status-error">{error}</div>
    </div>
  );

  return (
    <div className="container">
      <div className="home-header">
        <h2>📚 Discover Your Next Book</h2>
        <p className="home-subtitle">Browse our collection of 50+ curated books</p>
      </div>
      
      <SearchFilter books={books} onFilter={setFiltered} initialQuery={initialQuery} />
      
      {filtered.length === 0 ? (
        <div className="no-books-found">
          <div className="no-books-icon">🔍</div>
          <h3>No books found</h3>
          <p>Try adjusting your search criteria or browse all books</p>
          <button 
            className="btn primary" 
            onClick={() => {
              setFiltered(books);
              navigate("/");
            }}
          >
            Show All Books
          </button>
        </div>
      ) : (
        <>
          <div className="books-grid">
            {filtered.map((book) => (
              <BookCard 
                key={book.id} 
                book={book} 
                onClick={() => navigate(`/book/${book.id}`)}
              />
            ))}
          </div>
          
          <div className="results-footer">
            <p>Showing {filtered.length} of {books.length} books</p>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;