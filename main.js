/* UI Elements */
const addBookForm = document.querySelector('#add-book-form')
const addBookButton = document.querySelector('#add-book-btn')
const title = document.querySelector('#title')
const author = document.querySelector('#author')
const pages = document.querySelector('#pages')
const isRead = document.querySelector('#isRead')
const tableBody = document.querySelector('tbody')
const deleteAllBtn = document.querySelector('#btn-delete-all')
const aboutBtn = document.querySelector("#about-btn");
const aboutBlock = document.querySelector('#about-area');


/* Form Handling */
const collectInput = () => {
    const $title = title.value
    const $author = author.value
    /* Check input */
    if ($title.length === 0 || $author.length === 0) {
        alert("Please, fill all the fields")
        return
      }
    const $pages = pages.value
    const $isRead = isRead.checked
    return new Book($title, $author, $pages, $isRead)
}

const detectBook = (clickedNode) => {
    const currentBookTitle = clickedNode.parentNode.parentNode.querySelector(':nth-child(2)').textContent
    const currentBookAuthor = clickedNode.parentNode.parentNode.querySelector(':nth-child(3)').textContent
    return [currentBookTitle, currentBookAuthor]
}

const clearForm = () => {
    title.value = "";
    author.value = "";
    pages.value = "";
    if (isRead.checked) {isRead.checked = false;}
}

const renderLibrary = () => {
    checkLocalStorage()
    tableBody.innerHTML = ''
    let count = 1
    library.books.forEach((book) => {
        const bookRow = `
        <tr class="library-row">
          <th scope="row">${count}</th>
          <td>${book.title}</td>
          <td>${book.author}</td>
          <td>${book.pages}</td>
          <td><input type="button" class="btn-${book.isRead?'read':'noread'}" value="${book.isRead?'Read':'Not Read'}"></td>
          <td><input type="button" class="btn-delete" value="Delete"></td>
        </tr>`;
        tableBody.insertAdjacentHTML('beforeend', bookRow)
        count++;
    })
}

const sort_column = (columnName, order) => {
    if (columnName === 'pages') {
        if (order === 'asc') {
            library.books.sort((a, b) => {
                return a[`${columnName}`] - b[`${columnName}`]
            })
        } else {
            library.books.sort((a, b) => {
                return b[`${columnName}`] - a[`${columnName}`]
            })
        }
    } else {
        let orderInt = 1
        order === 'asc' ? orderInt *= 1: orderInt *= -1
        library.books.sort((a, b) => {
            let fa = a[`${columnName}`].toLowerCase(),
                fb = b[`${columnName}`].toLowerCase()
        
            if (fa < fb) {
                return (-1 * orderInt)
            }
            if (fa > fb) {
                return (1 * orderInt)
            }
            return 0;
        })
    }
    updateLocalStorage()
    renderLibrary()

}


/* End of Form Handling */

/* Data Sctrucure */
class Book {
    constructor (
        title = 'Unknown',
        author = 'Unknown',
        pages = '0',
        isRead = null
        ) {
        this.title = title,
        this.author = author,
        this.pages = pages,
        this.isRead = isRead;
    }
}

class Library {
    constructor () {
        this.books = [];
    }

    addBook(newBook) {
        if (!this.isInLibrary(newBook)) {
            this.books.push(newBook)
        }
    }

    remove(title, author) {
        this.books = this.books.filter((book) => (
            (book.title.toLowerCase() != title.toLowerCase()) &&
            (book.title.toLowerCase() != author.toLowerCase())))
    }

    getBook(title, author) {
        return this.books.find((book) => (book.title === title && book.author === author))   
    }

    isInLibrary(newBook) {
        return this.books.some((book) => ((book.title.toLowerCase() == newBook.title.toLowerCase()) && (book.author.toLowerCase() === newBook.author.toLowerCase())))
    }
    cleanLibrary() {
        this.books = [];
    }
}

const fillDefaultLibrary = () => {
    library.addBook(new Book('Harry Potter and the Philosopher\'s Stone', 'J. K. Rowling', 223, true));
    library.addBook(new Book('And Then There Were None', 'Agatha Christie', 272, false));
}
/* End of Data Sctrucure */

/* Local storage */
  const resetLibrary = () => {
    localStorage.clear()
    library.cleanLibrary()
    tableBody.innerHTML = ''
}

const updateLocalStorage = () => {
    localStorage.setItem("library", JSON.stringify(library.books));
}

const checkLocalStorage = () => {
    const books = JSON.parse(localStorage.getItem('library'))
    if (books) {
        library.books = JSON.parse(localStorage.getItem("library"))
    } else {
        fillDefaultLibrary()
        updateLocalStorage()
        renderLibrary()
    }
  }
/* Emd of Local storage */

/* Event Listeners */
document.addEventListener('click', (e) => {
    if (e.target.id === 'btn-delete-all') {
        resetLibrary()
    } else if (e.target.id === 'add-book-btn') {
        const newBook = collectInput();
        clearForm()
        library.addBook(newBook);
        updateLocalStorage()
        renderLibrary();
    } else if (e.target.classList.contains('btn-delete')) {
        const [title, author] = detectBook(e.target)
        library.remove(title, author)
        updateLocalStorage()
        renderLibrary()
    } else if (e.target.classList.contains('btn-read') || e.target.classList.contains('btn-noread')) {
        const [title, author] = detectBook(e.target)
        const book = library.getBook(title, author)
        book.isRead = !book.isRead
        updateLocalStorage()
        renderLibrary()
    } else if (e.target.id === 'about-btn') {
        e.target.classList.toggle("active")
        if (aboutBlock.style.maxHeight) {
            aboutBlock.style.maxHeight = null
        } else {
            aboutBlock.style.maxHeight = aboutBlock.scrollHeight + "px"
        }
    } else if (e.target.classList.contains('fa-caret-down')) {
        const chosenTitle = e.target.parentNode.querySelector('h3').textContent.toLowerCase()
        sort_column(chosenTitle, 'asc')

        // sort table sort(columnName, asc)
        e.target.classList.remove('fa-caret-down')
        e.target.classList.add('fa-caret-up') 
    } else if (e.target.classList.contains('fa-caret-up')) {
        const chosenTitle = e.target.parentNode.querySelector('h3').textContent.toLowerCase()
        sort_column(chosenTitle, 'desc')


        // sort table sort(columnName, asc)
        e.target.classList.remove('fa-caret-up')
        e.target.classList.add('fa-caret-down') 
    } else if (e.target.classList.contains('fa-caret-right')) {
        const chosenTitle = e.target.parentNode.querySelector('h3').textContent.toLowerCase()
        sort_column(chosenTitle, 'desc')

        // sort table sort(columnName, asc)\
        e.target.classList.remove('fa-caret-right')
        e.target.classList.add('fa-caret-down')
    }
})

/* Functions */
const library = new Library()
fillDefaultLibrary(library)
renderLibrary()
