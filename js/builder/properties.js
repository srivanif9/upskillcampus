const properties = document.querySelector(".properties");

let selectedBlock = null;

function selectBlock(block){

    document.querySelectorAll(".builder-block")

    .forEach(b=>b.classList.remove("selected"));

    block.classList.add("selected");

    selectedBlock = block;

    updateProperties();

}

function updateProperties(){

    if(!selectedBlock){

        properties.innerHTML=`

        <h2>Properties</h2>

        <p>Select a component.</p>

        `;

        return;

    }

    const type=selectedBlock.dataset.type;

    if(type==="image"){

        properties.innerHTML=`

        <h2>Image</h2>

        <input

        type="file"

        id="imageFile"

        accept="image/*">

        <br><br>

        <button id="uploadBtn">

        Upload Image

        </button>

        `;

        document

        .getElementById("uploadBtn")

        .onclick=uploadImage;

        return;

    }

    let value="";

    if(type==="heading"){

        value=selectedBlock.querySelector("h2").innerText;

    }

    else if(type==="paragraph"){

        value=selectedBlock.querySelector("p").innerText;

    }

    else if(type==="button"){

        value=selectedBlock

        .querySelector(".cms-button")

        .innerText;

    }

    properties.innerHTML=`

    <h2>${type.toUpperCase()}</h2>

    <label>Text</label>

    <input

    id="propText"

    value="${value}">

    <br><br>

    <button id="applyBtn">

    Apply

    </button>

    `;

    document

    .getElementById("applyBtn")

    .onclick=function(){

        const txt=

        document

        .getElementById("propText")

        .value;

        if(type==="heading"){

            selectedBlock

            .querySelector("h2")

            .innerText=txt;

        }

        else if(type==="paragraph"){

            selectedBlock

            .querySelector("p")

            .innerText=txt;

        }

        else if(type==="button"){

            selectedBlock

            .querySelector(".cms-button")

            .innerText=txt;

        }

    };

}

async function uploadImage(){

    const file=document
    .getElementById("imageFile")
    .files[0];

    if(!file){

        alert("Choose an image");

        return;

    }

    const formData=new FormData();

    formData.append("image",file);

    try{

        const response=await fetch("/upload-image",{

            method:"POST",

            body:formData

        });

        const data=await response.json();

        if(data.success){

            selectedBlock.dataset.image=data.imageUrl;

            const img=

            selectedBlock.querySelector(".cms-image");

            const text=

            selectedBlock.querySelector(".image-placeholder p");

            img.src=data.imageUrl;

            img.style.display="block";

            text.style.display="none";

            alert("Image Uploaded Successfully");

        }

        else{

            alert(data.message);

        }

    }

    catch(err){

        console.log(err);

        alert("Upload Failed");

    }

}
