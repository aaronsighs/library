let storage = window.localStorage;
let myLibary = JSON.parse(storage.getItem("myBookLibary") || "[]")


sideBtn = document.querySelector(".side-banner-btn")
sideForm = document.querySelector(".side-banner")




const Book = {

    init: function(title, author, cover, pages, read) {

        this.read = read ? true : false
        this.title = title;
        this.author = author;
        this.cover = cover;
        this.pages = pages;
        this.curPage = this.read ? pages : 0;
        this.id = String(Date.now());
        return this
    },

    changePage: function(newPage) {
        if (newPage > this.pages || newPage < 0) {
            return false
        }
        this.curPage = newPage
        if (!this.read && Number(this.pages) === Number(this.curPage)) {
            this.read = true;
        } else if (this.read && this.pages != this.curPage) {
            this.read = false;
        }
        return true

    },
    toggleRead: function() {
        this.read = !this.read;
        this.changePage((this.read ? 1 : 0) * this.pages);
    }


}




myLibary.forEach(book => drawBook(book));

updateStats()

const cat = {

}






function addBookToLibrary(data) {

    let currBook = Object.create(Book).init(data.get("title"),
        data.get("author"),
        data.get("cover-art"),
        Number(data.get("pages")),
        data.get("read") === "on"
    );
    currBook.changePage(currBook.curPage);


    drawBook(currBook)
    myLibary.push(currBook)

    storage.setItem("myBookLibary", JSON.stringify(myLibary));
    updateStats();


}


function drawBook(currBook) {
    let shelf = document.querySelector("#book-shelf");
    newBook = bookLayout(currBook)


    shelf.appendChild(newBook)

    if (window.innerWidth >= 1000) {
        close()
    }

}


function updateStatsDict() {
    let pagesRead = 0;
    let booksRead = 0;
    let booksStarted = 0;
    let bookCount = storage.length;
    for (var i = 0, len = bookCount; i < len; i++) {
        let book = JSON.parse(localStorage.getItem(localStorage.key(i)))
        pagesRead += book.curPage;
        booksRead += book.read ? 1 : 0;
        booksStarted += book.curPage > 0 ? 1 : 0;

    }
    let booksUnf = bookCount - booksRead;
    document.querySelectorAll("label")[4].innerText = `Pages Read: ${pagesRead}`
    document.querySelectorAll("label")[1].innerText = `Books Read: ${booksRead}`
    document.querySelectorAll("label")[0].innerText = `Book Count: ${bookCount}`
    document.querySelectorAll("label")[2].innerText = `Books Unfinished: ${booksUnf}`
    document.querySelectorAll("label")[3].innerText = `Books Started: ${booksStarted}`

}

function updateStats() {

    document.querySelectorAll("label")[4].innerText = `Pages Read: ${getPagesRead()}`
    document.querySelectorAll("label")[1].innerText = `Books Read: ${getBooksRead()}`
    document.querySelectorAll("label")[0].innerText = `Book Count: ${myLibary.length}`
    document.querySelectorAll("label")[2].innerText = `Books Unfinished: ${myLibary.length-getBooksRead()}`
    document.querySelectorAll("label")[3].innerText = `Books Started: ${getBooksStarted()}`

}


function getBooksRead() {
    return myLibary.filter(o => o.read).length

}

function getBooksStarted() {
    return myLibary.filter(o => o.curPage > 0).length
}


function getPagesRead() {
    return myLibary.reduce((a, c) => +a + +c.curPage, 0)
}

function getBookIndex(id) {
    return myLibary.findIndex(o => o.id === id)
}

function deleteBookDict(id) {
    document.querySelector("#book-shelf").removeChild(document.querySelector(`#book${id}`))
    storage.removeItem(id)
    updateStats()


}

function deleteBook(id) {
    myLibary = myLibary.filter(o => o.id !== id)
    document.querySelector("#book-shelf").removeChild(document.querySelector(`#book${id}`))
    storage.setItem("myBookLibary", JSON.stringify(myLibary))

}

function close() {
    sideForm.classList.remove("semi-hidden")
    sideBtn.classList.remove("hidden");
    sideBtn.classList.remove("semi-hidden")
    sideForm.classList.add("hidden")

}


function bookLayout(currentBook) {


    bk = document.createElement("div");
    bk.classList.add("book")
    bk.id = "book" + currentBook.id
    bk.style.backgroundImage = `url("${currentBook.cover}")`
    bk.style.backgroundSize = "cover";
    bk.style.backgroundRepeat = "no-repeat"

    let check = document.createElement("i")
    check.classList.add("isDone")
    check.classList.add("bi")
    check.classList.add("bi-check-circle-fill")
    if (currentBook.read) {
        check.classList.add("clicked");
    }
    check.name = myLibary.length - 1

    wrp = document.createElement("div")

    wrp.classList.add("book-wrapper")
    drawBookInfo(currentBook, wrp)



    check.addEventListener("click", e => {
        let book = myLibary[getBookIndex(currentBook.id)]
        Object.setPrototypeOf(book, Book)
        book.toggleRead()
        if (book.read) {
            updatePageNum(currentBook.id, book.pages);
        } else {
            updatePageNum(currentBook.id, 0)
        }



    });
    bk.append(check);
    bk.appendChild(wrp)
    return bk
}


function setRead(currBook, pageNum) {
    let bookNum = getBookIndex(currBook.id)
    let check = document.querySelectorAll(".isDone")[bookNum];
    let checked = (check.classList.contains("clicked"))


    if (Number(pageNum) === Number(currBook.pages)) {
        if (!checked) {
            check.classList.add("clicked")
            currBook.read = true;
        }



    } else if (checked) {
        check.classList.remove("clicked")
        currBook.read = false;
    }

}


function addPageNum(id, amount) {
    let currBook = JSON.parse(storage.getItem(id))
    updatePageNum(currBook)

}

function updatePageNum(id, pageNum) {

    let index = getBookIndex(id)

    if (index < 0) {
        return
    }
    let currBook = myLibary[index];
    Object.setPrototypeOf(currBook, Book)

    if (!currBook.changePage(pageNum)) {
        return
    }


    let prog = document.querySelector(`#book${id} .book-wrapper .progress .progress-bar`);
    prog.style.width = `${currBook.curPage / currBook.pages *100}%`

    let pageTxt = document.querySelector(`#book${id} .book-wrapper .book-cnt p`);
    pageTxt.textContent = `${currBook.curPage}/${currBook.pages}`;

    check = document.querySelector(`#book${id} .isDone`);
    if (currBook.read) {
        check.classList.add("clicked");
    } else {
        check.classList.remove("clicked");
    }


    storage.setItem("myBookLibary", JSON.stringify(myLibary));

    updateStats()





}


function drawBookInfo(currBook, wrapper) {
    let del = document.createElement("i")
    del.classList.add("bi")
    del.classList.add("bi-x")
    del.addEventListener('click', () => deleteBook(currBook.id))
    let title = document.createElement("p");
    title.textContent = currBook.title;
    let author = document.createElement("p");
    author.textContent = currBook.author;
    let pagesWrapper = document.createElement("div");
    pagesWrapper.classList.add("book-cnt")
    let pages = document.createElement("p");
    pages.textContent = `${currBook.curPage}/${currBook.pages}`;
    pagesWrapper.appendChild(pages);

    let progress = document.createElement("div");
    progress.classList.add("progress")
    progressBar = document.createElement("div")
    progressBar.classList.add("progress-bar")
    progressBar.style.width = `${currBook.curPage / currBook.pages *100}%`

    btn1 = document.createElement("button")
    btn1.classList.add("add")
    btn1.textContent = "+"
    btn1.classList.add("fancy-btn")
    btn1.addEventListener('click', e => {
        let book = myLibary[getBookIndex(currBook.id)]
        updatePageNum(currBook.id, book.curPage + 1)

    })


    btn2 = document.createElement("button")
    btn2.classList.add("sub")
    btn2.textContent = "-"
    btn2.classList.add("fancy-btn")
    btn2.addEventListener('click', e => {
        let book = myLibary[getBookIndex(currBook.id)]
        updatePageNum(currBook.id, book.curPage - 1)

    })


    progress.appendChild(progressBar);
    wrapper.appendChild(title);
    wrapper.appendChild(author);
    wrapper.appendChild(pagesWrapper);
    wrapper.appendChild(progress);
    wrapper.appendChild(btn1);
    wrapper.appendChild(btn2);
    wrapper.appendChild(del);



}



if (window.innerWidth > 1000) {
    sideForm.classList.add("hidden")
}

var slideTimer = [null, null];



function slideIn() {
    clearTimeout(slideTimer[0])
    sideBtn.classList.remove("slide-out")
    sideBtn.classList.add("slide-in")
    let side = document.querySelector(".side-banner-btn .btn")
    side.classList.add("rotate")
    slideTimer[1] = setTimeout(() => {
        side.classList.remove("rotate")
        side.classList.add("pulsing")
    }, 1000)
}

function slideOut() {
    clearTimeout(slideTimer[1]);
    slideTimer[0] = setTimeout(() => {
        sideBtn.classList.remove("slide-in")
        sideBtn.classList.add("slide-out")
        document.querySelector(".side-banner-btn .btn").classList.remove("rotate")
        document.querySelector(".side-banner-btn .btn").classList.remove("pulsing")
    }, 1000);

}


sideBtn.addEventListener("mouseover", slideIn)

sideBtn.addEventListener("mouseleave", slideOut)

document.querySelector(".bi-arrow-up-left-square-fill").addEventListener('click', e => {
    close()
})

sideBtn.addEventListener("click", e => {
    sideForm.classList.add("form-in")
    sideBtn.classList.add("hidden");
    sideForm.classList.remove("hidden");

})

addBtn = document.querySelector("form")
addBtn.addEventListener("submit", e => {
    e.preventDefault()
    const formData = new FormData(e.target)
    addBookToLibrary(formData)

})