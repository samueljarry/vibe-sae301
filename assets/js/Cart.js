import gsap from 'gsap'

export default class Cart
{
    constructor()
    {
        this.setCart()

        // Ne se lance que si on est sur la page de réservation
        if(document.querySelector('.event_reservation_wrapper'))
        {
            this.setReservationListeners()
            this.setReservationModal()
        }

        // Ne se lance que si on est sur le panier
        if(document.querySelector('.cart_wrapper'))
        {
            this.displayCart()
        }

        // Ne se lance que si on est à la page de confirmation du panier
        if(document.querySelector('.confirmation_wrapper'))
        {
            this.displayConfirmationCart()
        }

        // Si la commande est passée, alors on vide le panier
        if(document.querySelector('.thanks_for_your_order'))
        {
            this.articles = []
            document.cookie = `cart=${JSON.stringify(this.articles)}; path=/`

            this.updateNbArticles()
        }
    }

    getCookie(cookieName)
    {
        if(document.cookie.length === 0)
        {
            return document.cookie = `cart=[]; path=/`
        }

        let cookies = document.cookie.split("; "); //separe chaque parametre contenu dans le cookie

        let output
        cookies.forEach(cookie =>
        {
            const row = cookie.split("=");

            row[0] === cookieName ? output = row[1] : output = null
        })
        return output
    }

    setCart()
    {
        this.liste = this.getCookie('cart')
        this.articles = []

        this.liste.length > 0 ? this.articles = JSON.parse(this.liste) : this.articles = Array()
        this.updateNbArticles()
    }

    // Récupérer les données de l'articles
    // puis déterminer si on doit l'ajouter à l'array ou augmenter sa qté
    updateCart()
    {
        const { id, name, price, quantity, cover, date, location, ticket } =
        {
            id: document.querySelector('.reservation_id').value,
            name: document.querySelector('.reservation_title').innerText,
            price: document.querySelector('.reservation_price_default').value,
            quantity: parseInt(document.querySelector('.reservation_tickets_number').value),
            cover: document.querySelector('.reservation_img').src,
            date: document.querySelector('.reservation_date span').innerText,
            location: document.querySelector('.reservation_location').innerText,
            ticket: document.querySelector('.reservation_ticket_icon').src
        }

        const increaseQty = (index, quantity) =>
        {
            this.articles[index].quantity += quantity

            document.cookie = `cart=${JSON.stringify(this.articles)}; path=/`
            this.updateNbArticles()
        }

        const addToCart = (id, name, price, quantity, cover, date, location, ticket) =>
        {
            this.articles.push(
                {
                    id,
                    name,
                    price,
                    quantity,
                    cover,
                    date,
                    location,
                    ticket
                })

            document.cookie = `cart=${JSON.stringify(this.articles)}; path=/`
            this.updateNbArticles()
        }

        // On récupère l'index du cookie qui contient notre article s'il est déjà présent dedans
        const articleIndex = this.articles.findIndex(index => index.id == id)

        // Si l'article est déjà présent dans le cookie on augmente simplement sa quantité, sinon on l'ajoute
        articleIndex >= 0 ? increaseQty(articleIndex, quantity) : addToCart(id, name, price, quantity, cover, date, location, ticket)
    }

    // Changer le nombre d'articles à l'icône panier
    updateNbArticles()
    {
        let nbArticles = 0
        const panier = document.querySelector('.panier')

        this.articles.forEach(article => nbArticles += article.quantity)
        panier.innerHTML = nbArticles
        if(nbArticles > 0)
        {
            panier.style.display = 'flex'
        }
        else
        {
            panier.style.display = 'none'

            // Afficher la modale informant que le panier est vide sur la page panier
            if(document.querySelector('.cart_total_wrapper'))
            {
                document.querySelector('.cart_total_wrapper').style.display = 'none'
                document.querySelector('.cart_articles_section').style.display = 'none'
                document.querySelectorAll('.cart_checkout').forEach(dom => dom.style.display = 'none')
                document.querySelector('.cart_is_empty').style.display = 'flex'
            }
        }
    }

    /* Méthode page réservation */
    setReservationListeners()
    {
        // Affichage Modale de réservation
        const reservationButton = document.querySelectorAll('.reservation_button')
        let isModalActive = false
        reservationButton.forEach(button =>
        {
            button.addEventListener('click', () =>
            {
                !isModalActive ? this.toggleReservationModal() : this.modalAnimation.reverse(0)
                !isModalActive ? isModalActive = true : isModalActive = false
            })
        })

        // Bouton + / - modale de réservation
        const places = document.querySelector('.reservation_tickets_number')
        const prix = parseInt(document.querySelector('.reservation_price_default').value)
        const boutonMoins = document.querySelector('.reservation_minus')
        const boutonPlus = document.querySelector('.reservation_plus')
        const spanPrix = document.querySelector('.reservation_add_to_cart')
        const closeModal = document.querySelector('.close_reservation_modal')
        closeModal.addEventListener('click', () =>
        {
            this.modalAnimation.reverse(0)
            isModalActive = false
        })

        places.addEventListener('change', () =>
        {
            if(places.value >= 1)
            {
                changePrixTotal()
            }
            else
            {
                places.value = 1
            }
        })

        boutonMoins.addEventListener('click', () => places.value > 1 && changeNbPlaces(-1) )
        boutonPlus.addEventListener('click', () => changeNbPlaces(+1) )

        const changeNbPlaces = (methode) =>
        {
            let nbPlaces = parseInt(places.value)
            nbPlaces += methode
            places.value = nbPlaces

            changePrixTotal()
        }

        const changePrixTotal = () =>
        {
            let nbPlaces = parseInt(places.value)
            let prixTotal = prix * nbPlaces
            spanPrix.innerText = `Ajouter au panier - ${prixTotal} €`
        }


        // Ajout de l'article au panier
        const boutonAjout = document.querySelector('.reservation_add_to_cart')
        boutonAjout.addEventListener('click', () =>
        {
            this.updateCart()
            this.modalAnimation.reverse(0)
            isModalActive = false
            places.value = 1
            changePrixTotal()
        })
    }

    // Cacher la modale par défaut
    setReservationModal()
    {
        gsap.timeline()
        .set('.reservation_modal',
        {
            display:'none',
            y: '110%'
        })
    }

    // Afficher ou Cacher la modale en fonction de la méthode
    toggleReservationModal()
    {
        this.modalAnimation = gsap.timeline()
        .set('.reservation_modal',
        {
            display:'block',
        })
        .to('.reservation_modal',
        {
            y: 0
        })
    }

    /* Méthode de la page panier */

    // Afficher les articles du panier + Setup des listeners
    displayCart()
    {
        const articles = JSON.parse(this.getCookie('cart'))
        const articlesSection = document.querySelector('.cart_articles_section')

        articles.forEach(({ id, name, cover, price, quantity, location, date, ticket }) =>
        {
            articlesSection.innerHTML += `
                <div class="cart_article_wrapper">
                    <div class="cart_article_infos">
                        <div class="cart_infos_container">
                            <div>
                                <img class="cart_ticket_icon" src="${ticket}" alt="icône de ticket">
                            </div>
                            <div class="cart_infos_delete">
                                <div class="cart_infos">
                                    <strong>${name}</strong>
                                    <span>${date}</span>
                                </div>
                                <div class="delete_article">
                                    <img src="${document.querySelector('.empty_cart span img').src}" alt="icône de poubelle">
                                </div>
                            </div>
                        </div>
                        <div class="cart_tickets_qty">
                            <div class="cart_ticket_container">
                                <input type="hidden" class="cart_article_id" value="${id}">
                                <input type="hidden" class="cart_article_price" value="${price}">
                                <span class="cart_minus">-</span>
                                <input class="cart_article_tickets" type="number" value="${quantity}" min="1" max="99">
                                <span class="cart_plus">+</span>
                            </div>
                            <div class="cart_tickets_price">
                                ${price * quantity} €
                            </div>
                        </div>
                    </div>
                    <div class="cart_article_img">
                        <img src="${cover}" alt="affiche d'un évènement">
                    </div>
                </div>`
        })

        /* Listeners */

        // Retirer UNE place
        const minus = document.querySelectorAll('.cart_minus')
        minus.forEach(button => button.addEventListener('click', () => this.handleCartButtons(button, -1)))

        // Rajouter UNE place
        const plus = document.querySelectorAll('.cart_plus')
        plus.forEach(button => button.addEventListener('click', () => this.handleCartButtons(button, +1)))

        // Changer nombre de places manuellement
        const nbPlaces =  document.querySelectorAll('.cart_article_tickets')
        nbPlaces.forEach(article => article.addEventListener('change', () =>  this.setCartArticlePrice(article)))
        this.setCartTotalPrice()

        // Supprimer UN article du panier
        const delArticles = document.querySelectorAll('.delete_article img')
        delArticles.forEach(article => article.addEventListener('click', () => this.removeCartArticle(article, articlesSection)))

        // Supprimer TOUT le panier
        document.querySelector('.empty_cart').addEventListener('click', () => this.emptyCart(articlesSection))
    }

    // Vider le panier
    emptyCart(section)
    {
        this.articles = []
        document.cookie = `cart=${JSON.stringify(this.articles)}; path=/`
        document.querySelectorAll('.cart_article_wrapper').forEach(article =>
        {
            section.removeChild(article)
        })

        this.setCartTotalPrice()
        this.updateNbArticles()
    }


    // Supprimer UN article du panier
    removeCartArticle(article, section)
    {
        const articleId = article.parentNode.parentNode.parentNode.parentNode.querySelector('.cart_article_id').value
        const arrayId = this.articles.findIndex(article => article.id === articleId)

        this.articles.splice(arrayId,  1)
        section.removeChild(document.querySelectorAll('.cart_article_wrapper')[arrayId])

        document.cookie = `cart=${JSON.stringify(this.articles)}; path=/`

        this.setCartTotalPrice()
        this.updateNbArticles()
    }

    // Prise en charge des boutons + et - pour changer le prix total individuel et la quantité des places
    handleCartButtons(button, method)
    {
        let quantitySpan =  button.parentNode.querySelector('.cart_article_tickets')
        let quantity = parseFloat(quantitySpan.value)
        const id = button.parentNode.querySelector('.cart_article_id').value

        if(quantity + method > 0)
        {
            quantity += method
            quantitySpan.value = quantity

            let price = parseFloat(button.parentNode.querySelector('.cart_article_price').value)
            const totalPrice = button.parentNode.parentNode.querySelector('.cart_tickets_price').innerHTML = `${price * quantity} €`

            /* Cookie */
            const articleIndex = this.articles.findIndex(article => article.id === id)
            this.articles[articleIndex].quantity = quantity
            document.cookie = `cart=${JSON.stringify(this.articles)}; path=/`

            this.setCartTotalPrice()
        }
    }

    // Définir le prix total individuel d'un article du panier
    setCartArticlePrice(article)
    {
        let quantity = parseFloat(article.value)
        const id = article.parentNode.querySelector('.cart_article_id').value

        if(quantity > 0)
        {
            let price = parseFloat(article.parentNode.querySelector('.cart_article_price').value)
            const totalPrice = article.parentNode.parentNode.querySelector('.cart_tickets_price').innerHTML = `${price * quantity} €`


            /* Cookie */
            const articleIndex = this.articles.findIndex(article => article.id === id)
            this.articles[articleIndex].quantity = quantity
            document.cookie = `cart=${JSON.stringify(this.articles)}; path=/`

            this.setCartTotalPrice()
        }
    }

    // Définir le prix total du panier
    setCartTotalPrice()
    {
        let prixTotal = 0
        this.articles.forEach(article => {
            prixTotal += parseFloat(article.price) * parseFloat(article.quantity)
        })

        document.querySelector('.total').innerHTML = prixTotal

        this.updateNbArticles()
    }

    /* Méthode concernant la confirmation du panier */
    displayConfirmationCart()
    {
        const articles = JSON.parse(this.getCookie('cart'))
        const articlesSection = document.querySelector('.resume_articles')
        let total = 0

        articles.forEach(({ id, name, cover, price, quantity, location, date, ticket }) =>
        {
            total += parseFloat(price) * parseFloat(quantity)
            articlesSection.innerHTML += `
                    <div class="resume_article">
                        <strong>${name}</strong>
                        <span>x${quantity} <span class="article_price">${parseFloat(price) * parseFloat(quantity)}€</span></span>
                    </div>`
        })

        document.querySelector('.resume_total').innerHTML = `<span>Total: </span><span>${total}€</span>`
    }
}