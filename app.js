

let myLibary = []


storage = window.localStorage;
storage.clear()

sideBtn = document.querySelector(".side-banner-btn")
sideForm = document.querySelector(".side-banner")



class book{
    constructor(title,author,cover,pages,read){


        this.read = read ? true:false
        this.title = title;
        this.author = author;
        this.cover = cover;
        this.pages = pages;
        this.curPage = this.read ? pages:0;
        this.id = Date.now()

    }
        
}

const Book = {
    
    init : function(title,author,cover,pages,read){

        console.log(read,"here")

        this.read = read ? true:false
        this.title = title;
        this.author = author;
        this.cover = cover;
        this.pages = pages;
        this.curPage = this.read ? pages:0;
        this.id = Date.now()

        
        


        return this

    }

}


for(var i=0, len=storage.length; i<len; i++) {
    var key = localStorage.key(i);
    var value = JSON.parse(localStorage.getItem(key));

    myLibary.push(value)
    console.log(value.title)
    drawBook(value)

    
}






function addBookToLibrary(data){

    let currBook = Object.create(Book).init(data.get("title"),
                        data.get("author"),
                        data.get("cover-art"),
                        data.get("pages"),
                        data.get("read")==="on"
    );



    
    myLibary.push(currBook)

    drawBook(currBook)
    storage.setItem(String(currBook.id),JSON.stringify(currBook))
    let k = JSON.parse(storage.getItem(String(currBook.id)))
    console.log(k.id)
    //setRead(currBook,currBook.curPage)
    //updateStats()
    }


function drawBook(currBook){ 
    let shelf = document.querySelector("#book-shelf");
    newBook = bookLayout(currBook)
    

    shelf.appendChild(newBook)

        if (window.innerWidth >= 1000){
        close()
        }

}


function updateStats(){
    document.querySelectorAll("label")[4].innerText = `Pages Read: ${getPagesRead()}`
    document.querySelectorAll("label")[1].innerText = `Books Read: ${getBooksRead()}`
    document.querySelectorAll("label")[0].innerText = `Book Count: ${myLibary.length}`
    document.querySelectorAll("label")[2].innerText = `Books Unfinished: ${myLibary.length - getBooksRead()}`
    document.querySelectorAll("label")[3].innerText = `Books Started: ${getBooksStarted()}`

}


function getBooksRead(){
    return myLibary.filter( o=>o.read).length

}

function getBooksStarted(){
    return myLibary.filter( o=>o.curPage>0).length
}


function getPagesRead(){
    return myLibary.reduce((a,c)=>+a + +c.curPage,0)
}

function getBookIndex(id){
    return myLibary.findIndex( o=>o.id===id)
}

function deleteBook(id){
    let index = myLibary.findIndex( o=>o.id===id)
    document.querySelector("#book-shelf").removeChild(document.querySelectorAll(".book")[index])
    myLibary = [...myLibary.filter((o,idx)=>index!==idx)]

    updateStats()

    
}



function close(){
    sideForm.classList.remove("semi-hidden")
    sideBtn.classList.remove("hidden");
    sideBtn.classList.remove("semi-hidden")
    sideForm.classList.add("hidden")
    
}





function bookLayout(currentBook){


    bk = document.createElement("div");
    bk.classList.add("book")
    bk.style.backgroundImage = `url("${currentBook.cover}")`
    bk.style.backgroundSize="cover";
    bk.style.backgroundRepeat="no-repeat"

    let check = document.createElement("i")
    check.classList.add("isDone")
    check.classList.add("bi")
    check.classList.add("bi-check-circle-fill")
    check.name = myLibary.length-1

    wrp = document.createElement("div")

    wrp.classList.add("book-wrapper")
    bookInfo(currentBook,wrp)



    check.addEventListener("click", e=>{
        if (!e.target.classList.contains("clicked")){

        updatePageNum(currentBook,currentBook.pages);
        }else{
            updatePageNum(currentBook,0)
        }
        
        

    });






 




    bk.append(check);
    bk.appendChild(wrp)
    return bk
}


function setRead(currBook,pageNum){
    let bookNum = getBookIndex(currBook.id)
    let check = document.querySelectorAll(".isDone")[bookNum];
    let checked = (check.classList.contains("clicked"))
    

    if (Number(pageNum) === Number(currBook.pages)){
        if (!checked){
            check.classList.add("clicked")
            currBook.read = true;
        }



    }else if (checked){
        check.classList.remove("clicked")
        currBook.read = false;
    }

}

function updatePageNum(currBook,pageNum){

    let bookNum = getBookIndex(currBook.id)

    if (currBook.pages < pageNum || pageNum < 0 || pageNum === currBook.curPage){
        return
    }
    currBook.curPage = pageNum;

    let prog = document.querySelectorAll(".progress-bar")[bookNum];
    prog.style.width = `${pageNum / currBook.pages *100}%`

    let pageTxt = document.querySelectorAll(".book-cnt")[bookNum]
    pageTxt.textContent = `${pageNum}/${currBook.pages}`;

    setRead(currBook,pageNum)

    updateStats()





}


function bookInfo(currBook,wrapper){
    // <i class="bi bi-x-circle-fill"></i>
     let del = document.createElement("i")
     del.classList.add("bi")
     del.classList.add("bi-x")
     del.addEventListener('click',()=>deleteBook(currBook.id))
    let title = document.createElement("p");
    title.textContent = currBook.title;
    let author = document.createElement("p");
    author.textContent = currBook.author;
    let pages = document.createElement("p");
    pages.textContent = `${currBook.curPage}/${currBook.pages}`;
    pages.classList.add("book-cnt")
    let progress = document.createElement("div");
    progress.classList.add("progress")
    progressBar = document.createElement("div")
    progressBar.classList.add("progress-bar")

    btn1 = document.createElement("button")
    btn1.classList.add("add")
    btn1.textContent = "+"
    btn1.classList.add("fancy-btn")
    btn1.addEventListener('click',e=>{
        updatePageNum(currBook,currBook.curPage+1)

    })


    btn2 = document.createElement("button")
    btn2.classList.add("sub")
    btn2.textContent = "-"
    btn2.classList.add("fancy-btn")
    btn2.addEventListener('click',e=>{
        updatePageNum(currBook,currBook.curPage-1)

    })


    progress.appendChild(progressBar);
    wrapper.appendChild(title);
    wrapper.appendChild(author);
    wrapper.appendChild(pages);
    wrapper.appendChild(progress);
    wrapper.appendChild(btn1);
    wrapper.appendChild(btn2);
    wrapper.appendChild(del);
    


}



if (window.innerWidth>1000){
    sideForm.classList.add("hidden")
}

var slideTimer = [null,null];



function slideIn(){
    clearTimeout(slideTimer[0])
    sideBtn.classList.remove("slide-out")
    sideBtn.classList.add("slide-in")
    let side = document.querySelector(".side-banner-btn .btn")
    side.classList.add("rotate")
    slideTimer[1] = setTimeout( ()=>{
        side.classList.remove("rotate")
        side.classList.add("pulsing")
    },1000)
}

function slideOut(){
    clearTimeout(slideTimer[1]);
    slideTimer[0] = setTimeout( ()=>{
        sideBtn.classList.remove("slide-in")
        sideBtn.classList.add("slide-out")
        document.querySelector(".side-banner-btn .btn").classList.remove("rotate")
        document.querySelector(".side-banner-btn .btn").classList.remove("pulsing")
        },1000);

}


sideBtn.addEventListener("mouseover",slideIn)

sideBtn.addEventListener("mouseleave",slideOut)

document.querySelector(".bi-arrow-up-left-square-fill").addEventListener('click', e=>{
    close()
})

sideBtn.addEventListener("click",e=>{
        sideForm.classList.add("form-in")
        sideBtn.classList.add("hidden");
        // sideForm.classList.add("semi-hidden")
        sideForm.classList.remove("hidden");
        
})

addBtn = document.querySelector("form")
addBtn.addEventListener("submit", e=>{
    console.log(e)
    e.preventDefault()
    const formData = new FormData(e.target)
    console.log(formData,formData.get("title"))
    addBookToLibrary(formData)
    
})







