{
    'use strict';

    const select = {
        booksList: '.books-list',
        singleBook: '.book__image',
        form: '.filters',
        templates: {
            ofSingleBookHTML: '#template-book',
        }
    }

    const classFor = {
        singleBook: 'book__image',
    }

    const search = {
        attributes: {
            bookId: 'data-id',
        },
    }

    const classNames = {
        favoriteBook: 'favorite',
    }

    const templates = {
        collectionOfBooks: Handlebars.compile(document.querySelector(select.templates.ofSingleBookHTML).innerHTML),
    }

    class BooksList {
        constructor() {
            const thisBooksList = this;
            thisBooksList.favoriteBooks = [];
            thisBooksList.filters = [];

            thisBooksList.initData();
            thisBooksList.getElements();
            thisBooksList.renderLibrary();
            thisBooksList.initActions();
        }

        initData(){
            const thisBooksList = this;
            thisBooksList.data = dataSource.books;
        }

        getElements(){
            const thisBooksList = this;

            thisBooksList.dom = {};
            thisBooksList.dom.bookList = document.querySelector(select.booksList);
            thisBooksList.dom.form = document.querySelector(select.form);
        }

        renderLibrary(){
            const thisBooksList = this;

            for (let book of thisBooksList.data){
                book.ratingBgc = thisBooksList.determineRatingBgc(book.rating);
                book.ratingWidth = book.rating*10;
                const generatedHTML = templates.collectionOfBooks(book);
                const element = utils.createDOMFromHTML(generatedHTML);
                thisBooksList.dom.bookList.appendChild(element);
            }
        }

        initActions(){
            const thisBooksList = this;

            thisBooksList.dom.bookList.addEventListener('dblclick', function(event){
                event.preventDefault();
                const containerA = event.target.offsetParent;

                if (containerA.classList.contains(classFor.singleBook)){  //błąd w ćwieczeniu 4 - powinno być bez kropek po contains
                    const id = containerA.getAttribute(search.attributes.bookId);
                    containerA.classList.toggle(classNames.favoriteBook);
                    
                    const whereIsItInArray = thisBooksList.favoriteBooks.indexOf(id);
                    if (whereIsItInArray == -1){
                        thisBooksList.favoriteBooks.push(id);
                    }
                    else {
                        thisBooksList.favoriteBooks.splice(whereIsItInArray, 1);
                    }
                }
            })
            thisBooksList.dom.form.addEventListener('click', function(event){
                const clickedElement = event.target;

                if (clickedElement.tagName == 'INPUT' && clickedElement.type == 'checkbox' && clickedElement.name == 'filter'){
                    if (clickedElement.checked){
                        thisBooksList.filters.push(clickedElement.value);
                    }
                    else {
                        const whereIsItInArray = thisBooksList.filters.indexOf(clickedElement.value);
                        thisBooksList.filters.splice(whereIsItInArray, 1);
                    }
                }
                thisBooksList.filteredBooks();
            })
        }

        filteredBooks(){
            const thisBooksList = this;

            for (let book of thisBooksList.data){
                let shouldBeHidden = false;
                const bookSelector = document.querySelector('[data-id="' + book.id + '"]');

                for (let filter of thisBooksList.filters){
                    if (book.details[filter] == true){
                        shouldBeHidden = true;
                        break;
                    }
                }
                if (shouldBeHidden == true){
                    if (!bookSelector.classList.contains('hidden')){
                        bookSelector.classList.add('hidden');
                    }
                }
                else{
                    if (bookSelector.classList.contains('hidden')){
                        bookSelector.classList.remove('hidden');                        
                    }
                }
            }
        }

        determineRatingBgc(rating){
            let styleForRating;
            if (rating < 6){
                styleForRating = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
            }
            else if (rating > 6 && rating <= 8){
                styleForRating = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
            }
            else if (rating > 8 && rating <= 9){
                styleForRating = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
            }
            else if (rating > 9){
                styleForRating = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
            }
            return styleForRating;
        }
    }

    const app = new BooksList();
}