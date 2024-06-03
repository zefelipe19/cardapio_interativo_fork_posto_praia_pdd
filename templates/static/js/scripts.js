const data = document.currentScript.dataset

const getMenu = () => ({
    init() {
        this.getMenu()
    },
    menu: [],
    async getMenu() {
        await fetch('/api/v1/list_menu')
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
            console.log("added")
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
        this.getPromoProducts(),
        console.log(this.promoProducts)
    },
    promoProducts: [],
    async getPromoProducts () {
        await fetch('/api/v1/list_promos')
        .then(res => res.json())
        .then(res => (this.promoProducts = res))
    }
})
