/* -------------------------------------------------------------------------- */
/*                                 CONSTANTES                                 */
/* -------------------------------------------------------------------------- */

const MAX_PRODUCT_FOR_PAGE = 6;

// Base de datos de jabones de aloe vera
const jabonesDB = [
    {
        id: 1,
        title: "Jabón de Aloe Vera Puro",
        brand: "Natural Aloe",
        price: 4.99,
        images: ["../img/jabon-aloe1.jpg"],
        description: "Jabón artesanal hecho con 100% aloe vera puro. Hidrata y suaviza la piel."
    },
    {
        id: 2,
        title: "Jabón de Aloe Vera y Miel",
        brand: "Natural Aloe",
        price: 5.99,
        images: ["../img/jabon-aloe-miel.jpg"],
        description: "Combinación de aloe vera y miel natural. Perfecto para pieles sensibles."
    },
    {
        id: 3,
        title: "Jabón Exfoliante de Aloe Vera",
        brand: "Natural Aloe",
        price: 6.50,
        images: ["../img/jabon-exfoliante.jpg"],
        description: "Con partículas de semillas de albaricoque para una exfoliación suave."
    },
    {
        id: 4,
        title: "Jabón de Aloe Vera y Lavanda",
        brand: "Natural Aloe",
        price: 5.50,
        images: ["../img/jabon-lavanda.jpg"],
        description: "Aloe vera mezclado con aceite esencial de lavanda para relajar la piel."
    },
    {
        id: 5,
        title: "Jabón de Aloe Vera y Carbón Activado",
        brand: "Natural Aloe",
        price: 7.25,
        images: ["../img/jabon-carbon.jpg"],
        description: "Ideal para pieles grasas, ayuda a controlar el exceso de sebo."
    },
    {
        id: 6,
        title: "Jabón de Aloe Vera y Avena",
        brand: "Natural Aloe",
        price: 6.00,
        images: ["../img/jabon-avena.jpg"],
        description: "Suaviza y calma la piel irritada, gracias a las propiedades de la avena."
    },
    {
        id: 7,
        title: "Jabón de Aloe Vera y Caléndula",
        brand: "Natural Aloe",
        price: 6.75,
        images: ["../img/jabon-calendula.jpg"],
        description: "Perfecto para pieles con tendencia a irritaciones y rojeces."
    },
    {
        id: 8,
        title: "Jabón de Aloe Vera y Romero",
        brand: "Natural Aloe",
        price: 6.25,
        images: ["../img/jabon-romero.jpg"],
        description: "Estimula la circulación y revitaliza la piel cansada."
    },
    {
        id: 9,
        title: "Jabón de Aloe Vera y Coco",
        brand: "Natural Aloe",
        price: 7.00,
        images: ["../img/jabon-coco.jpg"],
        description: "Nutre en profundidad y deja un agradable aroma tropical."
    },
    {
        id: 10,
        title: "Jabón de Aloe Vera y Té Verde",
        brand: "Natural Aloe",
        price: 5.75,
        images: ["../img/jabon-te-verde.jpg"],
        description: "Antioxidante, protege la piel de los radicales libres."
    }
];

/* -------------------------------------------------------------------------- */
/*                                  FUNCIONES                                 */
/* -------------------------------------------------------------------------- */

/* ----------------------------- Obtener productos ----------------------------- */
async function getAllProducts(limit, skip) {
    try {
        // Simulamos una llamada asíncrona con un retraso de 0 ms
        return new Promise(resolve => {
            // Paginación manual
            const startIndex = skip;
            const endIndex = skip + limit;
            const paginatedProducts = jabonesDB.slice(startIndex, endIndex);
            resolve(paginatedProducts);
        });
    }
    catch (error) {
        console.error(error.message);
        return null;
    }
}

async function getProductById(id) {
    try {
        return new Promise(resolve => {
            const product = jabonesDB.find(p => p.id === id);
            resolve(product);
        });
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
    // Eliminar contador existente si hay
    const existingCount = document.getElementById('kart-count');
    if (existingCount) existingCount.remove();

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
        const id = Number(productCard.closest('.product-card').dataset.productId);

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
            renderProducts((currentPageValue - 2) * MAX_PRODUCT_FOR_PAGE);
            currentPage.value = currentPageValue - 1;
        }
    });

    document.getElementById('next-page').addEventListener('click', () => {
        const currentPage = document.getElementById('page-input');
        const currentPageValue = Number(currentPage.value);
        const productsInPage = document.querySelectorAll('.grid-products .product-card').length;
        
        if (productsInPage === MAX_PRODUCT_FOR_PAGE) {
            renderProducts(currentPageValue * MAX_PRODUCT_FOR_PAGE);
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
            <img src=${product.images[0]} alt="${product.title}">
        </div>
        <div class="description-container">
            <h2>${product.title}</h2>
            <p>${product.description}</p>
            <span>$${product.price.toFixed(2)}</span>
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

async function renderProducts(skip) {
    const products = await getAllProducts(MAX_PRODUCT_FOR_PAGE, skip);

    const productsGrid = document.querySelector('.grid-products');

    productsGrid.innerHTML = '';

    products.forEach(product => {
        productsGrid.appendChild(createProductCard(product));
    });
}

/* -------------------------------------------------------------------------- */
/*                                INICIALIZADOR                               */
/* -------------------------------------------------------------------------- */

addEventListener('DOMContentLoaded', () => {
    paginationButtonEventSuscribe();
    renderProducts(0); // Iniciar en la primera página (skip=0)
});