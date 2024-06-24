const data = document.currentScript.dataset
const apiUrl = '/api/v1/'

const getMenu = () => ({
    init() {
        this.getProducts()
    },
    menu: [],
    async getProducts() {
        await fetch(apiUrl +'list_menu')
            .then(res => res.json())
            .then(res => (
                this.menu = res
            ))
    },
    addInCart(product) {
        let cart = []
        if (localStorage.hasOwnProperty("cart")) {
            cart = JSON.parse(localStorage.getItem("cart"))
        }
        let productIndex = cart.findIndex(p => p.id === product.id)
        if (productIndex >= 0){
            let productInCart = cart[productIndex]
            productInCart.qtd ++
            
        } else {
            cart.push({ id: product.id, title: product.title, qtd: 1, price: parseFloat(product.price) })
        }
        localStorage.setItem("cart", JSON.stringify(cart))
    }
})


const getCart = () => ({
    init() {
        this.getProducts()
    },
    products: [],
    getProducts() {
        let cart = JSON.parse(localStorage.getItem("cart"))
        return this.products = cart
    },
    reduceOrRemove(product) {
        let productIndex = this.products.findIndex(p => p.id == product.id)
        if (product.qtd <= 1) {
            this.products.splice(productIndex, 1)
        }
        product.qtd--
        localStorage.setItem("cart", JSON.stringify(this.products)) 
        return this.getProducts()
    },
    addProductQtd(product) {
        product.qtd++
        localStorage.setItem("cart", JSON.stringify(this.products)) 
        return this.getProducts()
    },
    clearCart() {
        if (localStorage.hasOwnProperty("cart")) {
            let cart = JSON.parse(localStorage.getItem("cart"))
            cart = []
            localStorage.setItem("cart", JSON.stringify(cart))
            return this.getProducts()
        }
    },
})


const getPromos = () => ({
    init() {
        this.getPromoProducts()
    },
    promoProducts: [],
    async getPromoProducts () {
        await fetch(apiUrl + 'list_promos')
        .then(res => res.json())
        .then(res => (this.promoProducts = res))
    }
})


const adminAria = () => ({
    init() {
        this.getCategories(),
        this.getProducts()
    },
    allCategories: [],
    async getCategories () {
        await fetch(apiUrl + 'category')
        .then(res => res.json())
        .then(res => (this.allCategories = res))
    },
    menu: [],
    async getProducts() {
        await fetch(apiUrl +'list_menu')
            .then(res => res.json())
            .then(res => (
                this.menu = res
            ))
    },
    newCategoryModel: {
        title: ''
    },
    async createNewCategory() {
        let closeModalButton = document.querySelector("#closeModalProduct")
        await fetch(apiUrl + 'category', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.newCategoryModel)
        })
        .then(res => res.json())
        .then(res => (
            window.alert(`${res.title} foi criada!`), 
            this.menu.unshift(res)
        ))
    },
    async createNewProduct() {
        let newProductData = new FormData()
        let productModel = {
            category_id: Number(document.querySelector('#idCategory').value),
            title: document.querySelector("#productTitle").value,
            price: Number(document.querySelector("#productPrice").value),
            promotional_price: Number(document.querySelector("#productPromocionalPrice").value),
            description: document.querySelector('#productDescription').value,
            image: document.querySelector("#productImage").files[0],    
            is_active: document.querySelector("#productIsActive").checked,
            is_promo: document.querySelector('#productIsPromo').checked
        }
        for (item in productModel) {
            newProductData.append(`${item}`, productModel[item])
        }
        console.log(newProductData)
        await fetch(apiUrl + 'product', {
            method: 'POST',
            body: newProductData
        })
        .then(res => res.json())
        .then(res => console.log(res))
    },
    async deleteProduct(product_id) {
        await fetch(apiUrl + `product/${product_id}`, {
            method: 'DELETE',
        })
        .then(res => res.json())
        .then(res => (
            window.alert(`O produto ${res.deleted} foi deletado permanentemente!`),
            this.menu.pop()
        ))
    }
})