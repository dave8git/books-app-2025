{
  'use strict';
  const select = {
    templateOf: {
      book: '#template-book',
    },
    containerOf: {
      bookList: '.books-list',
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
      thisBook.initActions();
    }

    getElements() {
      const thisBook = this;
      thisBook.dom = {};
      thisBook.dom.bookImage = thisBook.element.querySelector('.book__image');
    }

    renderBook() {
      const thisBook = this;
      const generatedHTML = templates.book(thisBook.data);
      thisBook.element = utils.createDOMFromHTML(generatedHTML);
      const booksContainer = document.querySelector(select.containerOf.bookList);
      booksContainer.appendChild(thisBook.element);
    }

    initActions() {
      const thisBook = this;
      thisBook.dom.bookImage.addEventListener('click', (event) => {
        event.preventDefault();
        thisBook.dom.bookImage.classList.toggle('favorite');
        thisBook.announce();
      });
    }

    announce() {
      const thisBook = this;
      console.log('announce');
      const event = new CustomEvent('liked', {
        bubbles: true,
        detail: {
          id: thisBook.id
        }
      });
      thisBook.element.dispatchEvent(event);
    }
  }

  class BookList {
    constructor(booksData) {
      const thisBookList = this;
      thisBookList.data = booksData;
      thisBookList.favoriteBooks = new Set();
      thisBookList.renderBooklist();
      thisBookList.initActions();
    }

    renderBooklist() {
      const thisBookList = this;

      //console.log(thisBookList.data);
      for (let bookData in thisBookList.data) {
        // console.log('data', thisBookList.data[bookData].id, thisBookList.data[bookData]);
        new Book(thisBookList.data[bookData].id, thisBookList.data[bookData]);
      }
    }

    initActions() {
      const thisBookList = this;
      const booksContainer = document.querySelector(select.containerOf.bookList);
      booksContainer.addEventListener('liked', (e) => {thisBookList.addToFavorites(e.detail);});
    }

    addToFavorites(detail) {
      const thisBookList = this;
      if(thisBookList.favoriteBooks.has(detail.id)) {
        thisBookList.favoriteBooks.delete(detail.id);
      } else {
        thisBookList.favoriteBooks.add(detail.id);
      }
      console.log('thisBookList.favoriteBooks', thisBookList.favoriteBooks);
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