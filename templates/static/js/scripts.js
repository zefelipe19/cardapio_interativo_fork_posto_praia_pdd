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
            this.menu = res,
            console.log(res)
        ))
    }
})


const cart = () => ({
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
        return product.qtd--
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

function addInCart(product) {
    let cart = []
    if (localStorage.hasOwnProperty("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"))
    }
    let productIndex = cart.findIndex(p => p.id == product.id)
    if (productIndex) {
      console.log(cart[productIndex])
    }
    cart.push({ id: product.id, title: product.title, qtd: 1, price: parseFloat(product.price) })
    localStorage.setItem("cart", JSON.stringify(cart))
    
  }
  