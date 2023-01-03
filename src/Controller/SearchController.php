<?php

namespace App\Controller;

use App\Repository\EventRepository;
use App\Repository\LocationRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class SearchController extends AbstractController
{

    #[Route('/search', name:'ajax_search')]
    public function searchResults(Request $request, EventRepository $eventRepository, LocationRepository $locationRepository)
    {
        if($request->isXmlHttpRequest())
        {
            $events = $eventRepository->findByTitle($request->get('event'));
            $locations = $locationRepository->findByName($request->get('event'));

            $eventArray = [];

            foreach($events as $event)
            {
                array_push($eventArray,
                [
                    "title" => $event->getTitle(),
                    "location" => $event->getLocation(),
                    "price" => $event->getPrice(),
                    "cover" => $event->getCover(),
                    "date" => $event->getDate(),
                    "path" => $event->getPath(),
                    "id" => $event->getId()
                ]);
            }

            foreach($locations as $location)
            {

                array_push($eventArray, ...$location->getEvents());
            }

            return new JsonResponse([
                'events' => $eventArray
            ]);
        }
        else
        {
            return $this->redirectToRoute('app_home');
        }
    }
}