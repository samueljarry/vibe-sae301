import gsap from 'gsap'
import {horizontalLoop} from "./Utils";

export default class Animations
{
    constructor() {
        this.setMarqueeAnimation()
    }

    setMarqueeAnimation()
    {
        const marqueeItems = gsap.utils.toArray('.marquee_item'),
            loop = horizontalLoop(marqueeItems, {paused: true});
        marqueeItems.forEach((marqueeItem, i) => loop.toIndex(i, {duration: 12, ease: "none", repeat: -1}))
    }
}