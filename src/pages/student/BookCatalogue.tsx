import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  X, 
  Plus, 
  Trash2, 
  Edit2 
} from 'lucide-react';
import { Book } from '../../types';
import { api } from '../../services/api';
import { CATEGORIES } from '../../data/initialData';
import { BookCard } from '../../components/common/BookCard';
import { Modal } from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';

interface BookCatalogueProps {
  onNavigate: (view: string) => void;
  onSelectBookForIssue?: (book: Book) => void;
}

export const BookCatalogue: React.FC<BookCatalogueProps> = ({ onNavigate, onSelectBookForIssue }) => {
  const { role } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  
  // Modals state
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<Book | null>(null);

  // Add Book Form state
  const [isbn, setIsbn] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('Computer Science');
  const [publisher, setPublisher] = useState('');
  const [publicationYear, setPublicationYear] = useState<number>(2024);
  const [totalCopies, setTotalCopies] = useState<number>(5);
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const data = await api.books.getAll();
      setBooks(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const resetAddForm = () => {
    setIsbn('');
    setTitle('');
    setAuthor('');
    setCategory('Computer Science');
    setPublisher('');
    setPublicationYear(2024);
    setTotalCopies(5);
    setDescription('');
    setFormError(null);
  };

  const handleOpenAdd = () => {
    resetAddForm();
    setIsAddModalOpen(true);
  };

  const handleSaveAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    try {
      const newBook = await api.books.create({
        isbn: isbn.trim(),
        title: title.trim(),
        author: author.trim(),
        category: category.trim(),
        publisher: publisher.trim(),
        publicationYear: Number(publicationYear),
        totalCopies: Number(totalCopies),
        availableCopies: Number(totalCopies),
        description: description.trim(),
      });

      setIsAddModalOpen(false);
      resetAddForm();
      setFeedback({
        text: `Book "${newBook.title}" added to the catalogue successfully.`,
        type: 'success',
      });
      await loadBooks();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError('Failed to add book to catalogue.');
      }
    }
  };

  const handleDeleteBook = async () => {
    if (!deleteCandidate) return;

    try {
      await api.books.delete(deleteCandidate.id);
      setFeedback({
        text: `Book "${deleteCandidate.title}" has been deleted from catalog.`,
        type: 'success',
      });
      if (selectedBook && selectedBook.id === deleteCandidate.id) {
        setSelectedBook(null);
      }
      setDeleteCandidate(null);
      await loadBooks();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFeedback({ text: err.message, type: 'error' });
      } else {
        setFeedback({ text: 'Failed to delete book.', type: 'error' });
      }
      setDeleteCandidate(null);
    }
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || book.category === selectedCategory;

    const matchesAvailability = !onlyAvailable || book.availableCopies > 0;

    return matchesSearch && matchesCategory && matchesAvailability;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Book Catalogue</h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse available college textbooks, algorithms, database systems, and reference manuals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadBooks}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          {role === 'ADMIN' && (
            <>
              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors shadow-xs"
              >
                <Plus className="w-4 h-4" />
                Add Book
              </button>
              <button
                onClick={() => onNavigate('manage-books')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors shadow-xs"
              >
                Table View
              </button>
            </>
          )}
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-lg border text-xs flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Title, Author, or ISBN..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-700 font-medium px-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
            />
            <span>Show Available Only</span>
          </label>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs">
          <span className="text-slate-400 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider shrink-0 mr-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>
          Showing <strong className="text-slate-800">{filteredBooks.length}</strong> of{' '}
          <strong className="text-slate-800">{books.length}</strong> books in library
        </span>
        {searchQuery && (
          <span>
            Search query: <span className="font-semibold text-slate-700">"{searchQuery}"</span>
          </span>
        )}
      </div>

      {/* Grid of Books */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 bg-white rounded-xl border border-slate-200 p-4 animate-pulse space-y-3">
              <div className="h-44 bg-slate-200 rounded-lg"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-3 bg-slate-100 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-800">No matching books found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms, clearing category filters, or unchecking "Show Available Only".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setOnlyAvailable(false);
            }}
            className="mt-4 px-4 py-1.5 text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 rounded-lg hover:bg-sky-100 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onViewDetails={(b) => setSelectedBook(b)}
              showAdminControls={role === 'ADMIN'}
              onDelete={role === 'ADMIN' ? (b) => setDeleteCandidate(b) : undefined}
              onAction={
                role === 'ADMIN'
                  ? (b) => {
                      if (onSelectBookForIssue) {
                        onSelectBookForIssue(b);
                      }
                      onNavigate('issue-book');
                    }
                  : undefined
              }
              actionLabel={role === 'ADMIN' ? 'Issue Book' : undefined}
            />
          ))}
        </div>
      )}

      {/* Add Book Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Book to Library Catalog"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveAddBook} className="space-y-4 text-xs">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Book Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Modern Operating Systems"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Author(s) *</label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Andrew S. Tanenbaum"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">ISBN (Unique) *</label>
              <input
                type="text"
                required
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                placeholder="e.g. 978-0133591620"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 text-slate-800"
              >
                {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Publisher *</label>
              <input
                type="text"
                required
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                placeholder="e.g. Pearson Education"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Publication Year *</label>
              <input
                type="number"
                required
                min={1950}
                max={2030}
                value={publicationYear}
                onChange={(e) => setPublicationYear(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Total Copies *</label>
              <input
                type="number"
                required
                min={1}
                max={100}
                value={totalCopies}
                onChange={(e) => setTotalCopies(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Description / Summary</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a short synopsis or curriculum relevance..."
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg shadow-xs"
            >
              Save Book to Catalog
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <Modal
          isOpen={!!deleteCandidate}
          onClose={() => setDeleteCandidate(null)}
          title="Confirm Book Deletion"
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-700">
              Are you sure you want to delete <strong className="text-slate-900">{deleteCandidate.title}</strong> (ISBN: {deleteCandidate.isbn})?
            </p>
            <p className="text-rose-700 bg-rose-50 p-3 rounded-lg border border-rose-200 leading-relaxed">
              <strong>Database Integrity Check:</strong> The system will prevent deleting any book if active borrowed copies are currently checked out to students.
            </p>
            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteBook}
                className="px-4 py-2 font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Book Details Modal */}
      {selectedBook && (
        <Modal
          isOpen={!!selectedBook}
          onClose={() => setSelectedBook(null)}
          title="Book Details & Availability"
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-28 h-36 bg-slate-900 rounded-lg shrink-0 overflow-hidden flex items-center justify-center text-white">
                {selectedBook.coverImage ? (
                  <img
                    src={selectedBook.coverImage}
                    alt={selectedBook.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <BookOpen className="w-8 h-8 text-sky-400" />
                )}
              </div>
              <div className="space-y-1 overflow-hidden">
                <span className="text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  {selectedBook.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 leading-snug mt-1">
                  {selectedBook.title}
                </h3>
                <p className="text-xs text-slate-600">Author: <strong>{selectedBook.author}</strong></p>
                <p className="text-xs text-slate-500 font-mono">ISBN: {selectedBook.isbn}</p>
                <p className="text-xs text-slate-500">Publisher: {selectedBook.publisher} ({selectedBook.publicationYear})</p>
              </div>
            </div>

            {/* Inventory details */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Total Catalog Copies:</span>
                <span className="text-sm font-bold text-slate-900 tabular-nums">{selectedBook.totalCopies} copies</span>
              </div>
              <div>
                <span className="text-slate-500 block">Available on Shelf:</span>
                <span className={`text-sm font-bold tabular-nums ${selectedBook.availableCopies > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {selectedBook.availableCopies} available
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-1">Book Description & Syllabus Scope:</h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-lg border border-slate-100">
                {selectedBook.description}
              </p>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
              <div>
                {role === 'ADMIN' && (
                  <button
                    onClick={() => {
                      const bookToDelete = selectedBook;
                      setDeleteCandidate(bookToDelete);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Book
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedBook(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Close
                </button>
                {role === 'ADMIN' && (
                  <button
                    disabled={selectedBook.availableCopies <= 0}
                    onClick={() => {
                      const book = selectedBook;
                      setSelectedBook(null);
                      if (onSelectBookForIssue) onSelectBookForIssue(book);
                      onNavigate('issue-book');
                    }}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg text-white transition-colors ${
                      selectedBook.availableCopies > 0
                        ? 'bg-sky-700 hover:bg-sky-800'
                        : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {selectedBook.availableCopies > 0 ? 'Issue to Student' : 'Cannot Issue (0 Copies)'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
