<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class AccountController extends AbstractController
{
    #[Route('/profil', name: 'app_account')]
    public function index(): Response
    {
        if(!$this->getUser())
        {
            return $this->redirectToRoute('app_login', ["cart"=>true]);
        }

        $orders = $this->getUser()->getOrders();
        return $this->render('account/index.html.twig', [
            'controller_name' => 'AccountController',
            'orders' => $orders
        ]);
    }
}
