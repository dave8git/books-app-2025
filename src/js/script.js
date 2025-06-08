{
  'use strict';
  const select = {
    templateOf: {
      bookList: '#template-book',
    },
  };

  const settings ={
    db: {
      url: '//localhost:3131',
      books: 'books',
    }
  };

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