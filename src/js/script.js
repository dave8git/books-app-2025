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
    }

    getElements() {
      const thisBook = this;
      thisBook.dom = {};
    }

    renderBook() {
      const thisBook = this;
      const generatedHTML = templates.book(thisBook.data);
      thisBook.element = utils.createDOMFromHTML(generatedHTML);
      const booksContainer = document.querySelector('.books-list');
      booksContainer.appendChild(thisBook.element);
      console.log(thisBook.element);
    }
  }

  class BookList {
    constructor(booksData) {
      const thisBookList = this;
      thisBookList.data = booksData;
      thisBookList.renderBooklist();
    }
    renderBooklist() {
      const thisBookList =this;

      console.log(thisBookList.data);
      for (let bookData in thisBookList.data) {
        new Book(thisBookList.data[bookData].id, thisBookList.data[bookData]);
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