/* -------------------------------------------------------------------------- */
/*                                 CONSTANTES                                 */
/* -------------------------------------------------------------------------- */

const MAX_PRODUCT_FOR_PAGE = 6;



/* -------------------------------------------------------------------------- */
/*                                  FUNCIONES                                 */
/* -------------------------------------------------------------------------- */

/* ----------------------------- Llamadas a API ----------------------------- */
async function getAllProducts(limit, skip) {

    try {
        const response = await fetch(`https://dummyjson.com/products/category/fragrances?limit=6&skip=0`)

        if (!response.ok)
            throw new Error(`[ERROR] - Error al intentar obtener los productos - Status Code: ${response.status}`);

        const data = await response.json();
        return data.products.map(x => toViewModel(x));
    }
    catch (error) {
        console.error(error.message);
        return null;
    }
}

async function getProductById(id) {
    try {
        const response = await fetch(`https://dummyjson.com/products/${id}`);

        if (!response.ok)
            throw new Error(`[ERROR] - El producto no esta disponible - Status Code: ${response.status}`);

        const data = await response.json();
        return toViewModel(data);
    }
    catch (error) {
        console.error(error.message);
        return null;
    }
}

/* ------------------------- Manipulacion de carrito ------------------------ */
function getkart() {
    return JSON.parse(localStorage.getItem('kart')) || [];
}

function addToKart(productItem) {
    let kart = JSON.parse(localStorage.getItem('kart')) || [];

    const existProduct = kart.some(x => x.product.id == productItem.product.id);

    if (!existProduct) {
        kart.push(productItem);
    }
    else {
        const existingItem = kart.find(x => x.product.id === productItem.product.id);
        existingItem.quantity += productItem.quantity;
    }

    localStorage.setItem('kart', JSON.stringify(kart));
    updateKartQuantity();
}

function updateKartQuantity() {
    const kartContainer = document.querySelector('.kart-container');

    const kart = JSON.parse(localStorage.getItem('kart')) || [];

    if (kart.length) {
        const quantityContainer = document.createElement('span');
        quantityContainer.id = 'kart-count';
        quantityContainer.innerText = kart.length;
        kartContainer.appendChild(quantityContainer);
    }
}


/* ------------------------- Susbcripcion a eventos ------------------------- */
function productCardEventSuscribe(productCard) {
    const quantity = productCard.querySelector('.kart-options-container input');

    productCard.querySelector('.min-btn').addEventListener('click', () => {
        if (Number(quantity.value) > 1)
            quantity.value = Number(quantity.value) - 1;
    });

    productCard.querySelector('.max-btn').addEventListener('click', () => {
        if (Number(quantity.value) < 10)
            quantity.value = Number(quantity.value) + 1;
    });

    productCard.querySelector('.kart-btn-container button').addEventListener('click', async () => {
        const id = productCard.closest('.product-card').dataset.productId;

        const productItem = {
            product: await getProductById(id),
            quantity: Number(quantity.value)
        }

        addToKart(productItem);
    });
}

function paginationButtonEventSuscribe() {

    document.getElementById('prev-page').addEventListener('click', () => {
        const currentPage = document.getElementById('page-input');
        const currentPageValue = Number(currentPage.value);

        if (currentPageValue > 1) {
            renderProducts(currentPageValue - 2);
            currentPage.value = currentPageValue - 1;
        }
    });

    document.getElementById('next-page').addEventListener('click', () => {
        const currentPage = document.getElementById('page-input');
        const currentPageValue = Number(currentPage.value);
        const productsInPage = document.querySelectorAll('.grid-products .product-card').length;
        
        if (productsInPage === MAX_PRODUCT_FOR_PAGE) {
            renderProducts(currentPageValue);
            currentPage.value = currentPageValue + 1;
        }        
    });
}


/* ------------------------------- Auxiliares ------------------------------- */
function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
    productCard.dataset.productId = product.id;
    productCard.innerHTML = `
        <div class="img-container">
            <img src=${product.images[0]} alt="">
        </div>
        <div class="description-container">
            <h2>${product.title}</h2>
            <p>${product.description}</p>
            <span>$${product.price}</span>
        </div>
        <div class="kart-options-container">
           <button class="min-btn">-</button>
           <input type="text" value="1" disabled>
           <button class="max-btn">+</button>
        </div> 
        <div class="kart-btn-container">
            <button>Agregar al carrito</button>
        </div>`;

    productCardEventSuscribe(productCard);

    return productCard;
}

async function renderProducts(numberPage) {

    const products = await getAllProducts(MAX_PRODUCT_FOR_PAGE, numberPage * MAX_PRODUCT_FOR_PAGE);

    const productsGrid = document.querySelector('.grid-products');

    productsGrid.innerHTML = '';

    products.forEach(product => {
        productsGrid.appendChild(createProductCard(product))
    });
}

function toViewModel({ id, title, brand, price, images, description }) {
    return {
        id,
        title,
        brand,
        price,
        images,
        description
    };
}



/* -------------------------------------------------------------------------- */
/*                                INICIALIZADOR                               */
/* -------------------------------------------------------------------------- */

addEventListener('DOMContentLoaded', () => {
    paginationButtonEventSuscribe();
    renderProducts(0);
});


