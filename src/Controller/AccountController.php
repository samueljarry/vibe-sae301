<?php

namespace App\Controller;

use App\Entity\Order;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Dompdf\Dompdf;
use Dompdf\Options;

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

    #[Route('/profil/pdf/{order}', name: 'set_pdf')]
    public function setPdf(Order $order)
    {
        // Configure Dompdf according to your needs
        $pdfOptions = new Options();

        // Instantiate Dompdf with our options
        $dompdf = new Dompdf($pdfOptions);


        // Retrieve the HTML generated in our twig file
        $html = $this->renderView('account/pdf.html.twig', [
            'title' => "Welcome to our PDF Test",
            'order' => $order
        ]);

        // Load HTML to Dompdf
        $dompdf->loadHtml($html);

        // (Optional) Setup the paper size and orientation 'portrait' or 'portrait'
        $dompdf->setPaper('A4', 'portrait');

        // Render the HTML as PDF
        $dompdf->render();

        // Output the generated PDF to Browser (inline view)
        $dompdf->stream("facture.pdf", [
            "Attachment" => false
        ]);

        exit();
    }
}
