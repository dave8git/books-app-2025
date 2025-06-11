{
  'use strict';
  const select = {
    templateOf: {
      book: '#template-book',
    },
    containerOf: {
      bookList: '.books-list',
    },
    element: {
      book: '.book__image',
    },
    selectors: {
      filters: '.filters',
    },
  };

  const settings ={
    db: {
      url: '//localhost:3131',
      books: 'books',
    }
  };

  const templates = {
    book: Handlebars.compile(document.querySelector(select.templateOf.book).innerHTML),
  };

  class Book {
    constructor(id, data) {
      const thisBook = this;
      thisBook.id = id;
      thisBook.data = data;
      thisBook.renderBook();
      thisBook.getElements();
    }

    getElements() {
      const thisBook = this;
      thisBook.dom = {};
      thisBook.dom.bookImage = thisBook.element.querySelector(select.element.book);
    }

    renderBook() {
      const thisBook = this;
      const generatedHTML = templates.book(thisBook.data);
      thisBook.element = utils.createDOMFromHTML(generatedHTML);
      const booksContainer = document.querySelector(select.containerOf.bookList);
      booksContainer.appendChild(thisBook.element);
    }
  }

  class BookList {
    constructor(booksData) {
      const thisBookList = this;
      thisBookList.data = booksData;
      thisBookList.favoriteBooks = new Set();
      thisBookList.filters = new Set();
      thisBookList.books = [];
      thisBookList.renderBooklist();
      thisBookList.initActions();
    }

    renderBooklist() {
      const thisBookList = this;
      for (let bookData in thisBookList.data) {
        thisBookList.books.push(new Book(thisBookList.data[bookData].id, thisBookList.data[bookData]));
      }
    }

    initActions() {
      const thisBookList = this;
      const booksContainer = document.querySelector(select.containerOf.bookList);
      const filters = document.querySelector(select.selectors.filters);
      booksContainer.addEventListener('click', 
        function(e) { 
          const bookImage = e.target.closest('.book__image');
          bookImage.classList.toggle('favorite');
          const bookId = bookImage.getAttribute('data-id');
          thisBookList.addToFavorites(bookId);
        }
      );
      filters.addEventListener('change', (e) => {
        const target = e.target;
        if (target.name === 'filter' && target.type === 'checkbox') {
          const isChecked = target.checked;
          const value = target.value;
          // console.log('value', value);
          // console.log(e.target);
          if(thisBookList.filters.has(value)) {
            thisBookList.filters.delete(value);
          } else if (isChecked && !thisBookList.favoriteBooks.has(value)) {
            thisBookList.filters.add(value);
          }
          thisBookList.hideBooks();
        }
      });
    }

    hideBooks() {
      const thisBookList = this;

      for (const book of thisBookList.books) {
        let shouldBeHidden = false;
        for (const filter of thisBookList.filters) {
          if(!book.data.details[filter]) {
            shouldBeHidden = true;
            break;
          }
        }
        if (shouldBeHidden) {
          book.dom.bookImage.classList.add('hidden');
        } else {
          book.dom.bookImage.classList.remove('hidden');
        }
      }
    }

    addToFavorites(id) {
      const thisBookList = this;
      if(thisBookList.favoriteBooks.has(id)) {
        thisBookList.favoriteBooks.delete(id);
      } else {
        thisBookList.favoriteBooks.add(id);
      }
    }
  }

  const app = {
    initBookList: function() {
      const thisApp = this;
      thisApp.bookList = new BookList(thisApp.data.books);
    },
    initData: function(){
      const thisApp = this;
      thisApp.data = {};
      const url = settings.db.url + '/' + settings.db.books;
      fetch(url)
        .then(function(rawResponse){
          return rawResponse.json();
        })
        .then(function(parsedResponse){
          console.log('parsedResponse', parsedResponse);
          thisApp.data.books = parsedResponse;
          thisApp.initBookList();
        }).catch(function(error){
          console.error(error);
        });
    },

    init: function() {
      const thisApp = this;
      console.log('*** App starting ***');
      thisApp.initData();
    }
  };
  app.init();
}