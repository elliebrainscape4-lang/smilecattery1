/*==================================================
 Smile Cattery at Lightwood
 script.js
==================================================*/

/* ==========================================
   CAT OF THE WEEK
   Pulled live from the Google Form responses sheet.
   Staff update the cat by filling in the form —
   nothing here needs to be touched.
========================================== */

// Published CSV link for your "Cat of the Week" Google Sheet
const CAT_SHEET_CSV_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQkncTck63DcRq0OD90XuwoG5yq8QV7C6VdgHj8UUG23KfTcXockDhvOfwrjcBFXNgMJiR2hbWfnYAD/pub?output=csv";

// Fallback shown if the sheet can't be reached (e.g. offline)
const FALLBACK_CAT = {
    name: "Bella",
    photo: "images/cat-week.jpg",
    description:
        "Bella has loved relaxing in her heated suite and watching the birds from her window this week.",
    facebook: "https://www.facebook.com/smilecatterysheffield/?locale=en_GB"
};

let catOfWeek = FALLBACK_CAT;

/* --- Minimal CSV parser (handles quoted commas) --- */
function parseCSV(text) {
    const rows = [];
    let row = [];
    let field = "";
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];

        if (inQuotes) {
            if (char === '"' && text[i + 1] === '"') {
                field += '"';
                i++;
            } else if (char === '"') {
                inQuotes = false;
            } else {
                field += char;
            }
        } else {
            if (char === '"') {
                inQuotes = true;
            } else if (char === ",") {
                row.push(field);
                field = "";
            } else if (char === "\n") {
                row.push(field);
                rows.push(row);
                row = [];
                field = "";
            } else if (char === "\r") {
                // ignore
            } else {
                field += char;
            }
        }
    }

    if (field.length || row.length) {
        row.push(field);
        rows.push(row);
    }

    return rows;
}

/* --- Convert a Google Drive file link into a directly-displayable image URL --- */
function toDirectDriveImage(url) {
    if (!url) return "";

    const idMatch = url.match(/[-\w]{25,}/); // Drive file IDs are long alphanumeric strings

    if (idMatch) {
        return `https://drive.google.com/thumbnail?id=${idMatch[0]}&sz=w1000`;
    }

    return url; // not a Drive link — use as-is
}

/* --- Fetch the latest form submission and apply it --- */
async function loadCatOfWeek() {
    try {
        const response = await fetch(CAT_SHEET_CSV_URL, { cache: "no-store" });

        if (!response.ok) throw new Error("Could not fetch sheet");

        const text = await response.text();
        const rows = parseCSV(text);

        if (rows.length < 2) throw new Error("No submissions yet");

        const headers = rows[0].map(h => h.trim().toLowerCase());
        const latest = rows[rows.length - 1]; // most recent submission

        const get = (label) => {
            const index = headers.findIndex(h => h.includes(label));
            return index !== -1 ? latest[index]?.trim() : "";
        };

        const name = get("name") || FALLBACK_CAT.name;
        const description = get("description") || FALLBACK_CAT.description;
        const photoRaw = get("photo");
        const photo = photoRaw ? toDirectDriveImage(photoRaw) : FALLBACK_CAT.photo;

        catOfWeek = {
            name,
            description,
            photo,
            facebook: FALLBACK_CAT.facebook
        };
    } catch (err) {
        console.warn("Cat of the Week: using fallback —", err.message);
        catOfWeek = FALLBACK_CAT;
    }

    applyCatOfWeek();
}

function applyCatOfWeek() {
    const catName = document.getElementById("catName");
    const catPhoto = document.getElementById("catPhoto");
    const catDescription = document.getElementById("catDescription");
    const facebookButton = document.getElementById("facebookButton");
    const homeCat = document.getElementById("homeCatPhoto");
    const homeCatName = document.getElementById("homeCatName");

    if (catName) catName.textContent = catOfWeek.name;
    if (catPhoto) {
        catPhoto.src = catOfWeek.photo;
        catPhoto.alt = catOfWeek.name;
    }
    if (catDescription) catDescription.textContent = catOfWeek.description;
    if (facebookButton) facebookButton.href = catOfWeek.facebook;
    if (homeCat) {
        homeCat.src = catOfWeek.photo;
        homeCat.alt = catOfWeek.name;
    }
    if (homeCatName) homeCatName.textContent = catOfWeek.name;
}

loadCatOfWeek();


/* ==========================================
   PAGE NAVIGATION
========================================== */

const pages = document.querySelectorAll(".page");
const navLinks = document.querySelectorAll("#navigation a");
const pageButtons = document.querySelectorAll("[data-page]");

function showPage(pageName){

    pages.forEach(page=>{
        page.classList.remove("active-page");
    });

    const current=document.getElementById(pageName);

    if(current){
        current.classList.add("active-page");
    }

    navLinks.forEach(link=>{

        link.classList.remove("active");

        if(link.dataset.page===pageName){

            link.classList.add("active");

        }

    });

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

}

/* Navigation links */

pageButtons.forEach(button=>{

    button.addEventListener("click",function(e){

        e.preventDefault();

        showPage(this.dataset.page);

        navigation.classList.remove("open");

    });

});


/* ==========================================
   MOBILE MENU
========================================== */

const menuButton=document.getElementById("menuButton");
const navigation=document.getElementById("navigation");

if(menuButton){

    menuButton.addEventListener("click",()=>{

        navigation.classList.toggle("open");

    });

}


/* ==========================================
   LIGHTBOX
   (Only if you still use image galleries)
========================================== */

const galleryImages=document.querySelectorAll(".gallery-item img");

if(galleryImages.length){

    const lightbox=document.createElement("div");

    lightbox.id="lightbox";

    lightbox.innerHTML="<img>";

    document.body.appendChild(lightbox);

    const lightboxImage=lightbox.querySelector("img");

    galleryImages.forEach(image=>{

        image.addEventListener("click",()=>{

            lightboxImage.src=image.src;

            lightbox.classList.add("show");

        });

    });

    lightbox.addEventListener("click",()=>{

        lightbox.classList.remove("show");

    });

}


/* ==========================================
   BACK TO TOP BUTTON
========================================== */

const backButton=document.createElement("button");

backButton.id="backTop";

backButton.innerHTML="↑";

document.body.appendChild(backButton);

window.addEventListener("scroll",()=>{

    if(window.scrollY>250){

        backButton.classList.add("show");

    }else{

        backButton.classList.remove("show");

    }

});

backButton.addEventListener("click",()=>{

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});


/* ==========================================
   FOOTER YEAR
========================================== */

const year=document.getElementById("year");

if(year){

    year.textContent=new Date().getFullYear();

}
