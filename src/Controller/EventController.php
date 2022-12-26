<?php

namespace App\Controller;

use App\Entity\Event;
use App\Repository\CategoryRepository;
use App\Repository\EventRepository;
use App\Repository\LocationRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class EventController extends AbstractController
{
    #[Route('/evenements', name: 'app_event')]
    public function index(EventRepository $eventRepository, CategoryRepository $categoryRepository, LocationRepository $locationRepository): Response
    {
        return $this->render('event/index.html.twig', [
            'events' => $eventRepository->findAll(),
            'categories' => $categoryRepository->findAll(),
            'locations' => $locationRepository->findAll()
        ]);
    }

    #[Route('/evenements/{event}', name: 'event_page', options: ['expose' => true])]
    public function renderEventPage(Event $event) : Response
    {
        return $this->render('event/event.html.twig',
        [
            'event' => $event
        ]);
    }
}
