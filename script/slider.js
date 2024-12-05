setTimeout(() => {
    const productContainers = [...document.querySelectorAll('.product-container')];
    const nxtBtn = [...document.querySelectorAll('.nxt-btn')];
    const preBtn = [...document.querySelectorAll('.pre-btn')];

    productContainers.forEach((item, i) => {
        let containerDimensions = item.getBoundingClientRect();
        let containerWidth = containerDimensions.width;

        console.log("Container width:", containerWidth);

        nxtBtn[i].addEventListener('click', () => {
            item.scrollLeft += containerWidth;
            console.log("next item");
        });

        preBtn[i].addEventListener('click', () => {
            item.scrollLeft -= containerWidth;
            console.log("previous item");
        });
    });
}, 100);
