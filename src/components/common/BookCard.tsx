import React, { useState } from 'react';
import { Book as BookIcon, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { Book } from '../../types';

interface BookCardProps {
  book: Book;
  onViewDetails: (book: Book) => void;
  onAction?: (book: Book) => void;
  actionLabel?: string;
  showAdminControls?: boolean;
  onEdit?: (book: Book) => void;
  onDelete?: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onViewDetails,
  onAction,
  actionLabel,
  showAdminControls = false,
  onEdit,
  onDelete,
}) => {
  const [imgError, setImgError] = useState(false);
  const isAvailable = book.availableCopies > 0;

  return (
    <div className="group flex flex-col bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Visual Cover Header */}
      <div className="relative h-48 w-full bg-slate-900 overflow-hidden flex items-center justify-center">
        {book.coverImage && !imgError ? (
          <img
            src={book.coverImage}
            alt={book.title}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full p-4 flex flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 text-white">
            <div className="flex items-center justify-between text-xs text-sky-300/80">
              <span className="font-mono tracking-wider">{book.category}</span>
              <BookIcon className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <p className="text-sm font-semibold line-clamp-2 leading-tight text-white mb-1">
                {book.title}
              </p>
              <p className="text-xs text-slate-300 line-clamp-1">{book.author}</p>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              ISBN: {book.isbn}
            </div>
          </div>
        )}

        {/* Availability Badge */}
        <div className="absolute top-2.5 right-2.5">
          {isAvailable ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold bg-emerald-500/90 backdrop-blur-xs text-white rounded shadow-xs">
              <CheckCircle2 className="w-3 h-3" />
              {book.availableCopies} Available
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold bg-rose-600/90 backdrop-blur-xs text-white rounded shadow-xs">
              <AlertCircle className="w-3 h-3" />
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5 font-medium">
            <span>{book.category}</span>
            <span aria-hidden="true">·</span>
            <span>{book.publicationYear}</span>
          </div>

          <h4
            onClick={() => onViewDetails(book)}
            className="text-base font-semibold text-slate-900 group-hover:text-sky-700 transition-colors line-clamp-2 cursor-pointer leading-snug"
            title={book.title}
          >
            {book.title}
          </h4>

          <p className="text-xs text-slate-600 mt-1 line-clamp-1">
            By <span className="font-medium text-slate-700">{book.author}</span>
          </p>

          <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
            {book.description}
          </p>
        </div>

        {/* Footer info & actions */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Copies: <strong className="text-slate-800">{book.availableCopies}</strong> / {book.totalCopies}</span>
            <span className="truncate max-w-[120px]" title={book.publisher}>{book.publisher}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewDetails(book)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Info className="w-3.5 h-3.5" />
              Details
            </button>

            {onAction && actionLabel && (
              <button
                disabled={!isAvailable && actionLabel.toLowerCase().includes('issue')}
                onClick={() => onAction(book)}
                className={`flex-1 inline-flex items-center justify-center py-1.5 px-3 text-xs font-semibold rounded-lg transition-colors ${
                  !isAvailable && actionLabel.toLowerCase().includes('issue')
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-sky-700 hover:bg-sky-800 text-white shadow-xs'
                }`}
              >
                {actionLabel}
              </button>
            )}

            {showAdminControls && (
              <div className="flex items-center gap-1.5">
                {onEdit && (
                  <button
                    onClick={() => onEdit(book)}
                    className="p-1.5 text-xs text-slate-600 hover:text-sky-700 hover:bg-sky-50 rounded-md transition-colors"
                    title="Edit Book"
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(book)}
                    className="p-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                    title="Delete Book"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
