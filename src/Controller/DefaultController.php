<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/")
 */
class DefaultController extends AbstractController
{
    private $locale;

    public function __construct(string $locale)
    {
        $this->locale = $locale;
    }

    /**
     * @Route("/", name="default_index")
     * @Route("/events", name="default_events")
     * @Route("/automation", name="default_automation")
     * @Route("/surveillance", name="default_surveillance")
     * @Route("/settings", name="default_settings")
     */
    public function index()
    {
        return $this->render('default/index.html.twig', [
            'locale' => $this->locale
        ]);
    }
}
