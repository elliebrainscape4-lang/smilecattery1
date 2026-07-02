/*==================================================
 Smile Cattery at Lightwood
 script.js
==================================================*/

/*==================================================
CAT OF THE WEEK
==================================================*/

const CAT_SHEET_CSV_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vQkncTck63DcRq0OD90XuwoG5yq8QV7C6VdgHj8UUG23KfTcXockDhvOfwrjcBFXNgMJiR2hbWfnYAD/pub?output=csv";

const FALLBACK_CAT = {

    name: "Bella",

    photo: "images/cat-week.jpg",

    description:
    "Bella has loved relaxing in her heated suite and watching the birds from her window this week.",

    facebook:
    "https://www.facebook.com/smilecatterysheffield/?locale=en_GB"

};

let catOfWeek = FALLBACK_CAT;


/*==================================================
CSV PARSER
==================================================*/

function parseCSV(text){

    const rows=[];

    let row=[];

    let field="";

    let inQuotes=false;

    for(let i=0;i<text.length;i++){

        const char=text[i];

        if(inQuotes){

            if(char === '"' && text[i+1] === '"'){

                field+='"';

                i++;

            }

            else if(char === '"'){

                inQuotes=false;

            }

            else{

                field+=char;

            }

        }

        else{

            if(char === '"'){

                inQuotes=true;

            }

            else if(char === ","){

                row.push(field);

                field="";

            }

            else if(char === "\n"){

                row.push(field);

                rows.push(row);

                row=[];

                field="";

            }

            else if(char !== "\r"){

                field+=char;

            }

        }

    }

    if(field.length || row.length){

        row.push(field);

        rows.push(row);

    }

    return rows;

}


/*==================================================
GOOGLE DRIVE IMAGE
==================================================*/

function toDirectDriveImage(url){

    if(!url) return "";

    const match=url.match(/[-\w]{25,}/);

    if(match){

        return `https://drive.google.com/thumbnail?id=${match[0]}&sz=w1000`;

    }

    return url;

}


/*==================================================
LOAD CAT
==================================================*/

async function loadCatOfWeek(){

    try{

        const response=await fetch(CAT_SHEET_CSV_URL,{

            cache:"no-store"

        });

        if(!response.ok){

            throw new Error();

        }

        const text=await response.text();

        const rows=parseCSV(text);

        const headers=rows[0].map(h=>h.trim().toLowerCase());

        const latest=rows[rows.length-1];

        const get=(label)=>{

            const index=headers.findIndex(h=>h.includes(label));

            return index!==-1 ? latest[index]?.trim() : "";

        };

        catOfWeek={

            name:get("name") || FALLBACK_CAT.name,

            photo:get("photo")
                ? toDirectDriveImage(get("photo"))
                : FALLBACK_CAT.photo,

            description:get("description") || FALLBACK_CAT.description,

            facebook:FALLBACK_CAT.facebook

        };

    }

    catch{

        catOfWeek=FALLBACK_CAT;

    }

    applyCat();

}


/*==================================================
APPLY CAT
==================================================*/

function applyCat(){

    const catName=document.getElementById("catName");
    const catPhoto=document.getElementById("catPhoto");
    const catDescription=document.getElementById("catDescription");
    const facebookButton=document.getElementById("facebookButton");

    const homeCatPhoto=document.getElementById("homeCatPhoto");
    const homeCatName=document.getElementById("homeCatName");

    if(catName){

        catName.textContent=catOfWeek.name;

    }

    if(catPhoto){

        catPhoto.src=catOfWeek.photo;

        catPhoto.alt=catOfWeek.name;

    }

    if(catDescription){

        catDescription.textContent=catOfWeek.description;

    }

    if(facebookButton){

        facebookButton.href=catOfWeek.facebook;

    }

    if(homeCatPhoto){

        homeCatPhoto.src=catOfWeek.photo;

        homeCatPhoto.alt=catOfWeek.name;

    }

    if(homeCatName){

        homeCatName.textContent=catOfWeek.name;

    }

}


/*==================================================
START
==================================================*/

loadCatOfWeek();
/*==================================================
PAGE NAVIGATION
==================================================*/

const pages = document.querySelectorAll(".page");
const navLinks = document.querySelectorAll("#navigation a");
const pageButtons = document.querySelectorAll("[data-page]");

function showPage(pageName){

    pages.forEach(page=>{

        page.classList.remove("active-page");

    });

    const currentPage=document.getElementById(pageName);

    if(currentPage){

        currentPage.classList.add("active-page");

    }

    navLinks.forEach(link=>{

        link.classList.remove("active");

        if(link.dataset.page===pageName){

            link.classList.add("active");

        }

    });

    if(navigation){

        navigation.classList.remove("open");

    }

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}


/* Navigation Buttons */

pageButtons.forEach(button=>{

    button.addEventListener("click",function(e){

        e.preventDefault();

        showPage(this.dataset.page);

    });

});


/*==================================================
MOBILE MENU
==================================================*/

const menuButton=document.getElementById("menuButton");
const navigation=document.getElementById("navigation");

if(menuButton){

    menuButton.addEventListener("click",()=>{

        navigation.classList.toggle("open");

    });

}


/*==================================================
BACK TO TOP BUTTON
==================================================*/

const backTop=document.createElement("button");

backTop.id="backTop";

backTop.innerHTML="↑";

document.body.appendChild(backTop);

window.addEventListener("scroll",()=>{

    if(window.scrollY>250){

        backTop.classList.add("show");

    }

    else{

        backTop.classList.remove("show");

    }

});

backTop.addEventListener("click",()=>{

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});


/*==================================================
FOOTER YEAR
==================================================*/

const year=document.getElementById("year");

if(year){

    year.textContent=new Date().getFullYear();

}
/*==================================================
LIGHTBOX
==================================================*/

const galleryLinks = document.querySelectorAll(".gallery-image");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");

if (galleryLinks.length && lightbox && lightboxImage && lightboxClose) {

    galleryLinks.forEach(link => {

        link.addEventListener("click", function(e){

            e.preventDefault();

            lightboxImage.src = this.href;
            lightboxImage.alt = this.querySelector("img").alt;

            lightbox.classList.add("show");

            document.body.style.overflow = "hidden";

        });

    });

    function closeLightbox(){

        lightbox.classList.remove("show");

        document.body.style.overflow = "";

        lightboxImage.src = "";

    }

    lightboxClose.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", function(e){

        if(e.target === lightbox){

            closeLightbox();

        }

    });

    document.addEventListener("keydown", function(e){

        if(e.key === "Escape"){

            closeLightbox();

        }

    });

}

/*==================================================
END OF SCRIPT
==================================================*/
