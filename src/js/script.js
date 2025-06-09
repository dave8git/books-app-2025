{
  'use strict';
  const select = {
    templateOf: {
      book: '#template-book',
    },
  };

  const settings ={
    db: {
      url: '//localhost:3131',
      books: 'books',
    }
  };

  const templates = {
    bookList: Handlebars.compile(document.querySelector(select.templateOf.book).innerHTML),
  };

  //   class Book {
  //     constructor(id, data) {

  //     }

  //     renderBook() {
  //     }
  //   }

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
        console.log(thisBookList.data[bookData].id, thisBookList.data[bookData]); // TUTAJ ZROBIĆ COŚ TAKIEGO new Book(bookdata)
      }
    //   for (let bookData of thisBookList.data.books) {
    //     console.log(bookData);
    //     // new Book(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    //   }
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