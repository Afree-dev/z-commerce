const API_URL = "https://fakestoreapi.com/products";

let productsList = [];
let cartList = [];

(async() => {
    productsList = await fetch(API_URL).then(res => productsList = res.json())
    if(!productsList) return

    renderCards();
    globalFunction();

})()

const renderCards = () => {
    const cardParent = document.querySelector(".products-holder");
    let cardproduct = ''
    productsList.forEach(product => {
        
        cardproduct += 
        `<div class="product-card h-full p-5 bg-white border-2 rounded border-gray-200 hover:border-primary">
            <div class="relative">
                <img src=${product.image} class="product-image w-full object-contain h-60 select-none" alt="product-image" />
            </div>
            <div class="my-2">
                <span class="text-xs px-2 py-1 capitalize border border-gray-200 rounded-full leading-none">
                    ${product.category}
                </span>
            </div>
            <div>
                <h2 class="mt-4 my-4 text-base font-semibold truncate" title=${product.title}>${product.title}</h2>
                <div class="flex justify-between items-center my-2">
                    <h5 class="text-base font-bold">${product.price} USD</h5>
                    <div>Rating: <span class="font-bold">${product.rating.rate}</span></div>
                </div>
                <div class="my-4">
                    <p class="line-clamp-2 hidden">
                        <span class="text-base font-semibold">Description:</span> 
                        ${product.description}
                    </p>
                </div>
                <div class="mt-6 flex justify-between items-center">
                    <div class="flex border border-gray-200">
                        <button class="qty-dec w-9 h-9 grid place-items-center bg-white" title="Quantity Decrease">
                            <svg fill="#000000" class="w-4 h-4" viewBox="0 0 24 24" id="minus" data-name="Line Color" xmlns="http://www.w3.org/2000/svg" class="icon line-color"><line id="primary" x1="19" y1="12" x2="5" y2="12" style="fill: none; stroke: rgb(0, 0, 0); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></line></svg>
                        </button>
                        <input type="number" class="qty-nos w-9 h-9 border-l border-r border-gray-200 text-center focus:outline-none focus:ring-1 focus:ring-primary" value="1" />
                        <button class="qty-inc w-9 h-9 grid place-items-center bg-white" title="Quantity Increase">
                            <svg fill="#000000" class="w-4 h-4" viewBox="0 0 24 24" id="plus" data-name="Line Color" xmlns="http://www.w3.org/2000/svg" class="icon line-color"><path id="primary" d="M5,12H19M12,5V19" style="fill: none; stroke: rgb(0, 0, 0); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></path></svg>
                        </button>
                    </div>
                    <div>
                        <button data-productid="${product.id}" class="text-primary p-2 add-to-cart relative z-50" title="Add to cart" >
                            <svg class="fill-primary"  xmlns="http://www.w3.org/2000/svg" 
                                width="24" height="24" viewBox="0 0 52 52" enable-background="new 0 0 52 52" xml:space="preserve">
                                <g>
                                    <path d="M20.1,26H44c0.7,0,1.4-0.5,1.5-1.2l4.4-15.4c0.3-1.1-0.5-2-1.5-2H11.5l-0.6-2.3c-0.3-1.1-1.3-1.8-2.3-1.8
                                        H4.6c-1.3,0-2.5,1-2.6,2.3C1.9,7,3.1,8.2,4.4,8.2h2.3l7.6,25.7c0.3,1.1,1.2,1.8,2.3,1.8h28.2c1.3,0,2.5-1,2.6-2.3
                                        c0.1-1.4-1.1-2.6-2.4-2.6H20.2c-1.1,0-2-0.7-2.3-1.7v-0.1C17.4,27.5,18.6,26,20.1,26z"/>
                                    <circle cx="20.6" cy="44.6" r="4"/>
                                    <circle cx="40.1" cy="44.6" r="4"/>
                                </g>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
    });

    cardParent.innerHTML = cardproduct;
}

function globalFunction () {
    const decBtns = document.querySelectorAll(".qty-dec");
    const incBtns = document.querySelectorAll(".qty-inc");
    const cartBtns = document.querySelectorAll(".add-to-cart")

    decBtns.forEach(decBtn => {
        decBtn.addEventListener("click", function(e) {
            if(this.nextElementSibling.value > 1) {
                this.nextElementSibling.stepDown()
            }
        })
    })

    incBtns.forEach(incBtn => {
        incBtn.addEventListener("click", function(e) {
            if(this.previousElementSibling.value >= 1) {
                this.previousElementSibling.stepUp()
            }
        })
    })

    cartBtns.forEach(cartBtn => {
        cartBtn.addEventListener("click", function(e) {
            let currentItemId = this.getAttribute("data-productid");
            let cartItem = productsList.find((item) => {
                return item.id == currentItemId
            })
            let itemQuantity = this.parentNode.parentNode.querySelector(".qty-nos").value
            let cartUpdate = {...cartItem, quantity: itemQuantity}
            cartList.push(cartUpdate)

            if(cartList.length) {
                document.querySelector(".cart-noitem").classList.add("hidden")
            }

            notchMessage(cartItem.title, true)
            cartQtyUpdate();
            this.parentNode.parentNode.querySelector(".qty-nos").value = 1;
        })
    })

    document.querySelector(".mini-cart-icon").addEventListener("click", function(e) {
        let cart_open = document.querySelector(".cart-container");
        cart_open.classList.replace("translate-x-[2000px]", "translate-x-0")
        cart_open.classList.add("bg-black/70");
    })

    document.querySelectorAll(".close-mini-cart").forEach(item => {
        item.addEventListener("click", function(e) {
            let cart_open = document.querySelector(".cart-container");
            cart_open.classList.replace("translate-x-0", "translate-x-[2000px]")
            cart_open.classList.remove("bg-black/70");
        })
    })

}


function notchMessage(cartItemTitle, type=true) {
    const msgDiv = document.createElement("div")
    msgDiv.classList.add("container", "mx-auto", "px-4", "md:px-6,", "lg:px-8")
    let msg = ""
    msg = `
        <div class="p-2 mb-1 rounded flex justify-between items-center ${type ? "bg-green-200" : "bg-red-200"}">
            <div class="${type ? "text-green-700" : "text-red-600"}">
                <span class="font-semibold">${cartItemTitle}</span>${type ? " added to cart!" : " Removed from cart!"}
            </div>
            <button class="close-msg">
                <svg class="w-6 h-6 ${type ? "fill-green-700" : "fill-red-600"}" viewBox="-6 -6 24 24" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin" class="jam jam-close"><path d='M7.314 5.9l3.535-3.536A1 1 0 1 0 9.435.95L5.899 4.485 2.364.95A1 1 0 1 0 .95 2.364l3.535 3.535L.95 9.435a1 1 0 1 0 1.414 1.414l3.535-3.535 3.536 3.535a1 1 0 1 0 1.414-1.414L7.314 5.899z' /></svg>
            </button>
        </div>
    `
    msgDiv.innerHTML = msg;

    document.querySelector(".msgContainer").appendChild(msgDiv)

    autoRemoveNotchMsg(msgDiv);
}

function autoRemoveNotchMsg (msgDiv) {

    setTimeout(() => {
        try {
            document.querySelector(".msgContainer").removeChild(msgDiv)
        } catch {}
    }, 3000)

    document.querySelectorAll(".close-msg").forEach(item => {
        item.addEventListener("click", function(e) {
            document.querySelector(".msgContainer").removeChild(this.offsetParent.querySelector(".container"))
        })
    })

}

function cartQtyUpdate() {
    let qty = [];
    let itemCount = 0;
    cartList.forEach(item => {
        qty.push(parseInt(item.quantity));
    })

    for(let i = 0; i < qty.length; i++) {
        itemCount += qty[i]

    }

    if(itemCount >= 1) {
        let count = `
            <div class="absolute w-5 h-5 bg-primary -top-1 -right-1 rounded-full text-white grid place-items-center text-xs">${itemCount}</div>
        `
        document.querySelector(".cart-item-count").innerHTML = count;

        cartDisplay();
    }
}

function cartDisplay() {
    let cartParent = document.querySelector(".cart-parent");
    document.querySelector(".cart-count").innerHTML = cartList.length + " item in your bag"
    let cart = ``
    let totalPrice = 0;
    cartList.forEach(product => {
        cart += `
            <li class="flex gap-5 py-5 first:pt-0 last:pb-0">
                <div class="">
                    <img class="max-w-[75px] min-w-[75px] max-h-[75px] min-h-[75px] object-contain" src="${product.image}" alt="" />
                </div>
                <div class="flex-1">
                    <div class="font-semibold mb-1">${product.title}</div>
                    <div class="flex justify-between items-center gap-5">
                        <div><span class="font-semibold">Quantity:</span> ${product.quantity}</div>
                        <div class="delete-cart-item p-2" data-cart-itemid=${product.id}>
                            <svg class="w-5 h-5 fill-red" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2h4a1 1 0 1 1 0 2h-1.069l-.867 12.142A2 2 0 0 1 17.069 22H6.93a2 2 0 0 1-1.995-1.858L4.07 8H3a1 1 0 0 1 0-2h4V4zm2 2h6V4H9v2zM6.074 8l.857 12H17.07l.857-12H6.074zM10 10a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1zm4 0a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1z" fill="red"/></svg>
                        </div>
                    </div>
                </div>
            </li>
        `
    })
    cartParent.innerHTML = cart;

    checkCartdelete();

}

function checkCartdelete() {
    let cart_dlt = document.querySelectorAll(".delete-cart-item");
    
    cart_dlt.forEach(item => {
        item.addEventListener("click", function(e){
            console.log(this)
        })
    })
}