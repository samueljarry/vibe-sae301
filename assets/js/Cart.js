export default class Cart
{
    constructor()
    {
        this.setListeners()
    }

    setListeners()
    {
        const desktopReservationButton = document.querySelector('.reservation_button.lg')
        const responsiveReservationButton = document.querySelector('.reservation_button.sm')


        desktopReservationButton.addEventListener('click', () => console.log('dog'))
        responsiveReservationButton.addEventListener('click', () => console.log('oui'))
    }
}