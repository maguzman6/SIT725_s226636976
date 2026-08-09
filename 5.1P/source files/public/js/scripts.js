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
                    <p>There are no books matching this ID.</p>
                </div>
            </div>
        `;
        bookCardList.appendChild(noResultsCard);
    }
    else {
        books.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.classList.add('col', 's12', 'center-align');

            bookCard.innerHTML = `
            <div class="card">
                <div class="card-content">
                    <span class="card-title">${book.title}</span>
                    <p><strong>Author:</strong> ${book.author}</p>
                    <p><strong>Year:</strong> ${book.year}</p>
                    <p><strong>Genre:</strong> ${book.genre}</p>
                    <p><strong>Summary:</strong> ${book.summary}</p>
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
            const resultsContainer = document.getElementById('results-container');
            resultsContainer.innerHTML = '';
            resultsContainer.appendChild(getBookCards(data));
        })
        .catch(error => {
            console.error('Error fetching books:', error);
        });
};

const searchBookById = () => {
    const bookId = document.getElementById('bookId').value;
    if (bookId) {
        fetch(`/api/books/${bookId}`)
            .then(response => response.json())
            .then(data => {
                const resultsContainer = document.getElementById('results-container');
                resultsContainer.innerHTML = '';
                resultsContainer.appendChild(getBookCards(data));
            })
            .catch(error => {
                console.error('Error fetching book by ID:', error);
            });
    } else {
        alert('Please enter a Book ID.');
    }
};