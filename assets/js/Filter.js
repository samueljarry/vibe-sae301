export default class Filter
{
    constructor()
    {
        const eventsPage = document.querySelector('.events_section.events')

        if(eventsPage)
        {
            // récupération de tous les évènements et on set les filtres de base
            this.events = document.querySelectorAll('.event_container')
            this.categoryName = 'Tout'
            this.price = 100
            this.location = "toutes"

            this.setListeners()
        }
    }

    setListeners()
    {
        // Filtrer par catégories
        const categories = document.querySelectorAll('.category_filter')
        categories.forEach(category =>
        {
            const categoryName = category.querySelector('.category_name').innerText
            category.addEventListener('click', () =>
            {
                this.categoryName = categoryName
                this.applyFilters(this.categoryName, this.price, this.location)
            })
        })

        // Filtre par prix
        const price = document.querySelector('.price_filter')
        price.addEventListener('change', () =>
        {
            this.price = parseInt(price.value)
            document.querySelector('.max_price').innerText = `${this.price}€`
            this.applyFilters(this.categoryName, this.price, this.location)
        })

        // Filtre par salle
        const location = document.querySelector('.filter_location')
        location.addEventListener('change', () =>
        {
            this.location = location.value
            this.applyFilters(this.categoryName, this.price, this.location)
        })
    }

    applyFilters(category, price, location)
    {
        let resultats = 0

        this.events.forEach(event =>
        {
            const eventCategory = event.querySelector('.event_category').innerText
            const eventPrice = parseInt(event.querySelector('.event_price').value)
            const eventLocation = event.querySelector('.event_location_hidden').value

            if(category === 'Tout' && eventPrice < price && location === 'toutes')
            {
                event.style.display = 'block'
                resultats += 1
            }
            else if(eventCategory !== category && category !== 'Tout' || eventPrice > price)
            {
                event.style.display = 'none'
            }
            else if(location !== 'toutes' && location !== eventLocation)
            {
                event.style.display = 'none'
            }
            else
            {
                event.style.display = 'block'
                resultats += 1
            }
        })

        if(resultats === 0)
        {
            document.querySelector('.no_results').innerText = `Oups, pas de résultats pour votre recherche.`
            document.querySelector('.no_results').style.display = 'flex'
        }
        else
        {
            document.querySelector('.no_results').innerText = ``
            document.querySelector('.no_results').style.display = 'none'
        }
    }
}