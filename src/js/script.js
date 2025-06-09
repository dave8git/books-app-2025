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

  class Book {
    constructor(id, data) {

    }
  }

  class BookList {
    constructor(id, data) {
      const thisBookList = this;
      
    }
    renderBooklist()

  }
  const app = {
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
          thisApp.data.products = parsedResponse;
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