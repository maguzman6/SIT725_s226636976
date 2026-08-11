const getBookCards = (items) => {
    const books = items.data || []; // Handle when items returns data as empty.
    const bookCardList = document.createElement('div');
    bookCardList.classList.add('row');

    if (books.at(0) === null || books.length === 0) {
        const noResultsCard = document.createElement('div');
        noResultsCard.classList.add('col', 's12', 'center-align');
        noResultsCard.innerHTML = `
            <div class="card">
                <div class="card-content">
                    <span class="card-title">No Results Found</span>
                </div>
            </div>
        `;
        bookCardList.appendChild(noResultsCard);
    }
    else {
        books.forEach(book => {
            const price = typeof book.price === 'string' ? book.price : (book.price && book.price.$numberDecimal) || book.price || '';

            const bookCard = document.createElement('div');
            bookCard.classList.add('col', 's12', 'center-align');

            bookCard.innerHTML = `
            <div class="card">
                <div class="card-content">
                    <div class="row">
                        <div class="col s9">
                            <span class="card-title">${book.title} - $${price} AUD</span>
                        </div>

                        <div class="col s3 left-align">
                            <a  data-target="book-details-modal" onClick="searchBookById('${book.id}')" class="btn-floating waves-effect waves-light modal-trigger">
                                <i class="material-icons">add</i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;

            bookCardList.appendChild(bookCard);
        });
    }

    return bookCardList;
}

const loadBooks = () => {
    fetch('/api/books')
        .then(response => response.json())
        .then(data => {
            const booksContainer = document.getElementById('books-container');
            booksContainer.innerHTML = '';
            booksContainer.appendChild(getBookCards(data));
        })
        .catch(error => {
            console.error('Error fetching books:', error);
        });
};

const searchBookById = (bookId) => {
    if (bookId) {
        fetch(`/api/books/${bookId}`)
            .then(response => response.json())
            .then(data => {
                const book = data.data[0];

                const price = typeof book.price === 'string' ? book.price : (book.price && book.price.$numberDecimal) || book.price || '';
                document.getElementById('book-title').innerHTML = book.title;
                document.getElementById('book-author').innerHTML = `Author: ${book.author}`;
                document.getElementById('book-year').innerHTML = `Year: ${book.year}`;
                document.getElementById('book-genre').innerHTML = `Genre: ${book.genre}`;
                document.getElementById('book-summary').innerHTML = `Summary: ${book.summary}`;
                document.getElementById('book-price').innerHTML = `Price: $${price} AUD`;
            })
            .catch(error => {
                console.error('Error fetching book by ID:', error);
            });
    } else {
        alert('Please enter a Book ID.');
    }
};

$(document).ready(function () {
    $('.modal').modal();
});