document.addEventListener("click", function(e){

    const block = e.target.closest(".builder-block");

    if(!block) return;

    // Delete
    if(e.target.classList.contains("delete-btn")){

        block.remove();

        properties.innerHTML =
        "<h2>Properties</h2><p>Select a component.</p>";

        return;

    }

    // Duplicate
    if(e.target.classList.contains("duplicate-btn")){

        const clone = block.cloneNode(true);

        block.after(clone);

        attachBlockEvents(clone);

        return;

    }

    // Move Up
    if(e.target.classList.contains("move-up")){

        const prev = block.previousElementSibling;

        if(prev){

            block.parentNode.insertBefore(block, prev);

        }

        return;

    }

    // Move Down
    if(e.target.classList.contains("move-down")){

        const next = block.nextElementSibling;

        if(next){

            block.parentNode.insertBefore(next, block);

        }

        return;

    }

});

// Attach click events to duplicated blocks
function attachBlockEvents(block){

    block.addEventListener("click", function(e){

        if(e.target.closest(".block-toolbar")){

            return;

        }

        selectBlock(block);

    });

}