function createComponent(type){

    const block = document.createElement("div");

    block.className = "builder-block";

    block.dataset.type = type;

    let html="";

    switch(type){

        case "heading":

            html="<h2>Heading</h2>";

            break;

        case "paragraph":

            html="<p>Paragraph Text</p>";

            break;

        case "button":

            html="<button class='cms-button'>Button</button>";

            break;

        case "image":

            html=`

            <div class="image-placeholder">

                <img class="cms-image"

                src=""

                style="display:none;width:100%;border-radius:8px;">

                <p>Click Properties → Choose Image</p>

            </div>

            `;

            break;

        case "divider":

            html="<hr>";

            break;

        case "spacer":

            html="<div style='height:40px'></div>";

            break;

    }

    block.innerHTML=`

    <div class="block-toolbar">

        <button class="move-up">⬆</button>

        <button class="move-down">⬇</button>

        <button class="duplicate-btn">📄</button>

        <button class="edit-btn">✏</button>

        <button class="delete-btn">🗑</button>

    </div>

    <div class="block-content">

        ${html}

    </div>

    `;

    block.addEventListener("click",function(e){

        if(e.target.closest(".block-toolbar")){

            return;

        }

        selectBlock(block);

    });

    return block;

}
function createLoadedComponent(data){

    const block = createComponent(data.type);

    switch(data.type){

        case "heading":

            block.querySelector("h2").innerText = data.text || "Heading";

            break;

        case "paragraph":

            block.querySelector("p").innerText = data.text || "Paragraph";

            break;

        case "button":

            block.querySelector(".cms-button").innerText =
            data.text || "Button";

            break;

        case "image":

            if(data.src){

                block.dataset.image = data.src;

                const img = block.querySelector(".cms-image");

                const text = block.querySelector(".image-placeholder p");

                img.src = data.src;

                img.style.display = "block";

                text.style.display = "none";

            }

            break;

    }

    return block;

}