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

    private $screensaverTimeout;

    private $screensaverPhotoDuration;

    public function __construct(string $locale, int $screensaverTimeout, int $screensaverPhotoDuration)
    {
        $this->locale = $locale;
        $this->screensaverTimeout = $screensaverTimeout;
        $this->screensaverPhotoDuration = $screensaverPhotoDuration;
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
            'locale' => $this->locale,
            'screensaverTimeout' => $this->screensaverTimeout,
            'screensaverPhotoDuration' => $this->screensaverPhotoDuration
        ]);
    }
}
