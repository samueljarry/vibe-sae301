import gsap from 'gsap'

export default class Cart
{
    constructor()
    {
        this.setCart()
        if(document.querySelector('.event_reservation_wrapper'))
        {
            this.setListeners()
            this.setReservationModal()
        }
    }

    getCookie(cookieName)
    {
        if(document.cookie.length == 0) return document.cookie = `cart=[]; path=/`;

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
        this.articles

        this.liste.length > 0 ? this.articles = JSON.parse(this.liste) : this.articles = Array()
        this.updateNbArticles()
    }

    updateCart()
    {
        const { id, name, price, quantity } =
        {
            id: document.querySelector('.reservation_id').value,
            name: document.querySelector('.reservation_title_name').innerText,
            price: document.querySelector('.reservation_price_default').value,
            quantity: parseInt(document.querySelector('.reservation_tickets_number').value)
        }

        const increaseQty = (index, quantity) =>
        {
            this.articles[index].quantity += quantity

            document.cookie = `cart=${JSON.stringify(this.articles)}; path=/`
            this.updateNbArticles()
        }

        const addToCart = (id, name, price, quantity) =>
        {
            this.articles.push(
                {
                    id,
                    name,
                    price,
                    quantity
                })

            document.cookie = `cart=${JSON.stringify(this.articles)}; path=/`
            this.updateNbArticles()
        }

        // On récupère l'index du cookie qui contient notre article s'il est déjà présent dedans
        const articleIndex = this.articles.findIndex(index => index.id == id)

        // Si l'article est déjà présent dans le cookie on augmente simplement sa quantité, sinon on l'ajoute
        articleIndex >= 0 ? increaseQty(articleIndex, quantity) : addToCart(id, name, price, quantity)
    }

    updateNbArticles()
    {
        let nbArticles = 0
        const panier = document.querySelector('.panier')

        this.articles.forEach(article => nbArticles += article.quantity)
        panier.innerHTML = nbArticles
    }

    setListeners()
    {
        // Affichage Modale de réservation
        const reservationButton = document.querySelectorAll('.reservation_button')
        reservationButton.forEach(button =>
        {
            button.addEventListener('click', () => this.toggleReservationModal())
        })

        // Bouton + / - modale de réservation
        const places = document.querySelector('.reservation_tickets_number')
        const prix = parseInt(document.querySelector('.reservation_price_default').value)
        const boutonMoins = document.querySelector('.reservation_minus')
        const boutonPlus = document.querySelector('.reservation_plus')
        const spanPrix = document.querySelector('.reservation_add_to_cart')
        const closeModal = document.querySelector('.close_reservation_modal')
        closeModal.addEventListener('click', () => this.modalAnimation.reverse(0))

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
        boutonAjout.addEventListener('click', () => this.updateCart())
    }

    setReservationModal()
    {
        gsap.timeline()
        .set('.reservation_modal',
        {
            display:'none',
            y: '110%'
        })
    }

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
}