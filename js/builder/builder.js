const canvas = document.getElementById("canvas");
let currentPageId = null;
document.querySelectorAll(".component").forEach(component => {

    component.addEventListener("dragstart", (e) => {

        e.dataTransfer.setData(
            "type",
            component.dataset.type
        );

    });

});

canvas.addEventListener("dragover", (e) => {

    e.preventDefault();

});

canvas.addEventListener("drop", (e) => {

    e.preventDefault();

    const type = e.dataTransfer.getData("type");

    const empty = document.querySelector(".empty-message");

    if (empty) empty.remove();

    canvas.appendChild(createComponent(type));

});
// ==========================
// SAVE PAGE
// ==========================

document.getElementById("saveBtn").onclick = async function () {

    let pageName;

    // If editing an existing page
    if (currentPageId) {

        const response = await fetch("/page/" + currentPageId);

        const result = await response.json();

        if (!result.success) {

            alert("Unable to load page information.");

            return;

        }

        pageName = result.page.page_name;

    }

    // If creating a new page
    else {

        pageName = prompt("Enter Page Name");

        if (!pageName) return;

    }


    // ==========================
    // Collect Builder Blocks
    // ==========================

    const blocks = [];

    document.querySelectorAll(".builder-block").forEach(block => {

        const type = block.dataset.type;

        const data = {
            type
        };

        if (type === "heading") {

            data.text =
                block.querySelector("h2").innerText;

        }

        else if (type === "paragraph") {

            data.text =
                block.querySelector("p").innerText;

        }

        else if (type === "button") {

            data.text =
                block.querySelector(".cms-button").innerText;

        }

        else if (type === "image") {

            data.src =
                block.dataset.image || "";

        }

        blocks.push(data);

    });


    // ==========================
    // Save Page
    // ==========================

    const response = await fetch("/save-page", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            pageId: currentPageId,

            pageName: pageName,

            layout: blocks

        })

    });


    const result = await response.json();


    // ==========================
    // IMPORTANT FIX
    // ==========================

    if (result.success) {

        /*
         * For a newly created page,
         * the backend must return the new page ID.
         */

        if (result.pageId) {

            currentPageId = result.pageId;

        }

        alert(result.message);

    }

    else {

        alert(result.message);

    }

};
document.getElementById("loadBtn").onclick = async function () {

    const response = await fetch("/pages/list");

    const pages = await response.json();

    if (pages.length === 0) {

        alert("No pages found.");

        return;

    }

    let list = "Enter Page ID\n\n";

    pages.forEach(page => {

        list += page.id + " : " + page.page_name + "\n";

    });

    const id = prompt(list);

    if (!id) return;

    const pageResponse = await fetch("/page/" + id);

    const result = await pageResponse.json();

    if (!result.success) {

        alert("Page not found");

        return;

    }

    currentPageId = result.page.id;

    canvas.innerHTML = "";

    const layout = JSON.parse(result.page.layout_json);

    layout.forEach(item => {

        canvas.appendChild(createLoadedComponent(item));

    });

    alert("Page Loaded Successfully");
};
document.getElementById("newBtn").onclick = function(){

    currentPageId = null;

    canvas.innerHTML =

    '<div class="empty-message">Drag components here</div>';

    alert("New Page Started");

};
// ==========================
// Auto Load Page When Editing
// ==========================

window.onload = async function () {

    const params = new URLSearchParams(window.location.search);

    const pageId = params.get("page");

    if (!pageId) return;

    const response = await fetch("/page/" + pageId);

    const result = await response.json();

    if (!result.success) {

        alert("Unable to load page.");

        return;

    }

    currentPageId = result.page.id;

    canvas.innerHTML = "";

    const layout = JSON.parse(result.page.layout_json);

    layout.forEach(item => {

        canvas.appendChild(createLoadedComponent(item));

    });
};
document.getElementById("previewBtn").onclick = function () {

    if (!currentPageId) {

        alert("Please load or save a page first.");

        return;

    }

    window.open(

        "/preview/" + currentPageId,

        "_blank"

    );

};
document.getElementById("publishBtn").onclick = function () {

    if (!currentPageId) {

        alert("Please load or save a page first.");

        return;

    }

    window.location =

        "/publish/" + currentPageId;

};