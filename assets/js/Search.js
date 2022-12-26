import gsap from 'gsap'
import Routing from '../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router.min.js';
const routes = require('./fos_js_routes.json');

export default class Search
{
    constructor()
    {
        this.handleSearchSection()
        Routing.setRoutingData(routes);
        this.setListeners()
    }

    setListeners()
    {
        // Prise en charge de l'input de recherche
        const action = document.querySelector('.search_action')
        const search = document.querySelector('.search')
        let query

        // Prise en charge de l'icône de recherche dans la navigation
        const searchIcon = document.querySelector('.display_search')
        searchIcon.addEventListener('click', () =>
        {
            this.toggleSearchSection.play(0).then(() => search.select())
        })
        // Prise en charge de la fermeture de la section de recherche
        const closeSearchButton = document.querySelector('.close_search')
        closeSearchButton.addEventListener('click', () => this.toggleSearchSection.reverse(0))

        // Récupération du texte de la recherche
        search.addEventListener('keydown', () =>
        {
            query = search.value
        })
        search.addEventListener('keyup', () =>
        {
            query = search.value
            if(search.value !== '')
            {
                this.setAjax(action, search, query)
                document.querySelector('.search_results').style.display = 'flex'
            }
            else
            {
                document.querySelector('.search_results').style.display = 'none'
            }
        })
    }

    setAjax(action, search, query)
    {
        // Envoie de la requête ajax contenant la recherche
        fetch(`${action.value}?event=${query}`,
        {
            headers:
            {
                "X-Requested-With": "XMLHttpRequest"
            }
        })
        .then(response => response.json())
        // Affichage des résultats de la recherche
        .then(({events}) => {
            this.displaySearchResults(events)
        })

    }

    displaySearchResults(results)
    {
        // Avec l'ajout des lieux dans la recherche on peut avoir 2 fois un évènement qui apparaît
        // Cette fonction permet de filtrer les résultats pour qu'on ne les ai qu'une seule fois

        const curatedResults = []
        results.map((result, index) =>
        {
            const test = curatedResults.findIndex(index => index.id == result.id)
            test < 0 ? curatedResults.push(result) : console.log('déjà dedans')
        })

        const searchResultsContainer = document.querySelector('.search_results')

        // On vide les résultats de recherche précédents
        searchResultsContainer.innerHTML = ''

        // L'HTML pour chacun des résultats trouvés
        curatedResults.map(result =>
        {
            searchResultsContainer.innerHTML += `
                <a class="search_result" href="${Routing.generate("event_page", {event: result.id})}">
                    <img src="/events/${result.cover}">
                    <div class="search_result_infos">
                        <div class="search_result_infos_main">
                            <span class="search_result_name">
                                ${result.title}
                            </span>
                            <span class="search_result_location">
                                ${result.location.name}
                            </span>   
                        </div>
                        <span class="search_result_price">
                            ${result.price}€
                        </span>
                    </div>
                </a>
            `
        })
    }

    handleSearchSection()
    {
        // Cacher la section par défaut
        gsap.set('.search_wrapper',
            {
                display:'none'
            })

        // animation pour réveler / cacher la section
        this.toggleSearchSection =
            gsap.timeline({paused: true})
            .set('.search_wrapper',
            {
                opacity:0,
                display: 'none'
            })
            .to('.search_wrapper',
            {
                opacity: 1,
                display: 'flex',
                duration: 0.3
            })
    }
}