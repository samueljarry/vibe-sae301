<?php

namespace App\Controller;

use App\Entity\Order;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Mime\Email;

class CartController extends AbstractController
{
    #[Route('/panier', name: 'app_cart')]
    public function index(): Response
    {
        return $this->render('cart/index.html.twig', [
            'controller_name' => 'CartController',
        ]);
    }

    #[Route('/panier/paiement', name:'cart_confirm')]
    public function confirmCart(Request $request) : Response
    {
        // Récupération du cookie panier
        $cart = json_decode($request->cookies->get('cart'), true);

        // Redirection si non connectés ou panier vide
        if(!$this->getUser())
        {
            return $this->redirectToRoute('app_login');
        }
        if($cart == [])
        {
            return $this->redirectToRoute('app_home');
        }

        return $this->render('cart/confirmation.html.twig', [
            'controller_name' => 'CartController',
        ]);
    }

    #[Route('/confirmation_paiement', name:'cart_payment')]
    public function payCart(Request $request, EntityManagerInterface $entityManager, MailerInterface $mailer) : Response
    {
        // Récupération cookie et des infos du formulaire de la page de confirmation
        $cart = json_decode($request->cookies->get('cart'), true);
        $getForm = $request->request->all();

        // Redirection si non connectés ou panier vide
        if(!$this->getUser())
        {
            return $this->redirectToRoute('app_login');
        }
        if($cart == [])
        {
            return $this->redirectToRoute('app_home');
        }

        // Définition du prix de la commande
        $orderPrice = 0;
        foreach($cart as $article)
        {
            $orderPrice += $article['quantity'] * $article['price'];
        }

        // Récupération de l'entité order et création d'une instance
        $user = $this->getUser();
        $order = new Order;
        $order
            ->setUser($user)
            ->setEvents($cart)
            ->setPrice($orderPrice)
            ->setFirstName($getForm['first_name'])
            ->setLastName($getForm['last_name'])
            ->setAddress($getForm['address'])
            ->setPostalCode($getForm['postal_code'])
            ->setCity($getForm['city'])
            ->setDate(new \DateTime('now', new \DateTimeZone('Europe/Paris')));

        // Envoi et sauvegarde de la commande dans la base de données
        $entityManager->persist($order);
        $entityManager->flush();

        $email = (new Email())
            ->from('mmi21c10@mmi-troyes.fr')
            ->to($user->getEmail())
            //->cc('cc@example.com')
            ->bcc('samuel.jarry@etudiant.univ-reims.fr')
            ->subject('Validation de votre commande')
            ->text('Merci de votre commande chez Vibe')
            ->html('<p>See Twig integration for better HTML integration!</p>');

        $mailer->send($email);


        return  $this->redirectToRoute('app_thanks');
    }

    #[Route('/merci_de_votre_commande', name: 'app_thanks')]
    public function thanksForYourOrder(): Response
    {
        return $this->render('cart/fin.html.twig', [
            'controller_name' => 'CartController',
        ]);
    }
}
