

let myLibary = []


const Book = {
    
    init : function(title,author,cover,pages,read){

        this.title = title;
        this.author = author;
        this.cover = cover;
        this.pages = pages;
        this.read = read;
        


        return this

    }

}


function addBookToLibrary(data){
    myLibary.push(
    Object.create(Book).init(data.get("title"),
                        data.get("author"),
                        data.get("cover-art"),
                        data.get("pages"),
                        data.get("read")==="on"
    ));
    //call update dom with books
    drawBook(myLibary[myLibary.length-1])
}



function drawBook(){ 
    let shelf = document.querySelector("#book-shelf");
    newBook = bookLayout()

    shelf.appendChild(newBook)
}

function bookLayout(){
    let currentBook = myLibary[myLibary.length-1];
    bk = document.createElement("div");
    bk.classList.add("book")
    bk.style.backgroundImage = `url("${currentBook.cover}")`
    bk.style.backgroundSize="cover";
    bk.style.backgroundRepeat="no-repeat"
    wrp = document.createElement("div")
    wrp.classList.add("book-wrapper")
    wrp.innerText = currentBook.title
    bk.appendChild(wrp)
    return bk

}

sideBtn = document.querySelector(".side-banner-btn")
sideForm = document.querySelector(".side-banner")
console.log(sideForm,"check")

sideBtn.addEventListener("mouseover", e=>{
    console.log(e.target)
    sideBtn.classList.remove("slide-out")
    sideBtn.classList.add("slide-in")
    document.querySelector(".side-banner-btn .btn").classList.add("rotate")
})
sideBtn.addEventListener("mouseleave",e=>{
    setTimeout( ()=>{
    sideBtn.classList.remove("slide-in")
    sideBtn.classList.add("slide-out")
    document.querySelector(".side-banner-btn .btn").classList.remove("rotate")
    },370);
})

sideBtn.addEventListener("click",e=>{
    if (e.target.classList.contains("slide-in")){
        sideForm.classList.add("form-in")
        sideBtn.classList.add("hidden");
        sideForm.classList.add("semi-hidden")
        sideForm.classList.remove("hidden");
        
    }
})

addBtn = document.querySelector("form")
addBtn.addEventListener("submit", e=>{
    console.log(e)
    e.preventDefault()
    const formData = new FormData(e.target)
    console.log(formData,formData.get("title"))
    addBookToLibrary(formData)
    
})







