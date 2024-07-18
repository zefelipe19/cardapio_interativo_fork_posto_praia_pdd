const data = document.currentScript.dataset
const apiUrl = '/api/v1/'

const getMenu = () => ({
    init() {
        this.getProducts()
    },
    menu: [],
    async getProducts() {
        await fetch(apiUrl + 'list_menu')
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
        if (productIndex >= 0) {
            let productInCart = cart[productIndex]
            productInCart.qtd++

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
    async getPromoProducts() {
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
    async getCategories() {
        await fetch(apiUrl + 'category')
        .then(res => res.json())
        .then(res => (this.allCategories = res))
    },
    menu: [],
    async getProducts() {
        await fetch(apiUrl + 'list_all_menu')
        .then(res => res.json())
            .then(res => (
                this.menu = res
            ))
        },
    newCategoryModel: {
        title: ''
    },
    async createNewCategory() {
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
            this.menu.unshift(res),
            this.allCategories.push(res),
            this.newCategoryModel.title = ''
        ))
    },
    
    async createNewProduct() {
        let newProductData = new FormData()
        let productImage = document.querySelector("#productImage").files[0]
        let productModel = {
            category_id: document.querySelector('#idCategory').value ? Number(document.querySelector('#idCategory').value) : 0,
            title: document.querySelector("#productTitle").value ? document.querySelector("#productTitle").value : "",
            price: document.querySelector("#productPrice").value ? document.querySelector("#productPrice").value : 0,
            promotional_price: document.querySelector("#productPromocionalPrice").value ? document.querySelector("#productPromocionalPrice").value : null,
            description: document.querySelector('#productDescription').value ? document.querySelector('#productDescription').value : null,
            is_active: document.querySelector("#productIsActive") ? Boolean(document.querySelector("#productIsActive").checked) : false,
            is_promo: document.querySelector('#productIsPromo') ? Boolean(document.querySelector('#productIsPromo').checked) : false
        }
        
        newProductData.append('image', productImage)
        newProductData.append('payload', JSON.stringify(productModel))
    
        await fetch(apiUrl + 'product', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: newProductData
        })
        .then(res => {
            if (!res.ok) {
                console.log(res)
                throw new Error("não foi possivel criar o produto")
            } 
            return res.json()
        })
        .then(res => (
            console.log(res),
            window.alert(`${res.title} foi criado`), 
            this.getProducts()
        ))
        .catch(error => (
            window.alert(`${error}`)
        ))
    
    },
    async deleteProduct(product_id) {
    await fetch(apiUrl + `product/${product_id}`, {
        method: 'DELETE',
    })
    .then(res => res.json())
    .then(res => (
        window.alert(res.message),
        this.menu.map((category) => {
            category.products.map((product, prodIndex) => {
                    if (product.id == product_id) {
                        category.products.splice(prodIndex, 1)
                    }
                })
            })
        ))
    },
    async updateProduct(product) {
        let productId = product.id
        let productData = product
        delete productData.id
        delete productData.category
        delete productData.image

        let newProductImage = document.querySelector(`#productImage${productId}`).files[0] ? document.querySelector(`#productImage${productId}`).files[0] : ''
        let updateProductData = new FormData()

        updateProductData.append('image', newProductImage)
        updateProductData.append('payload', JSON.stringify(productData))

        await fetch(apiUrl + `product/${productId}`, {
            method: 'POST',
            body: updateProductData
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Não foi possível salvar as alterações")
            }
            return res.json()
        })
        .then(res => (
            this.getProducts()  
        ))
        .catch(error => (
            window.alert(`${error}`)
        ))
    }
})
