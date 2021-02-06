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

    private $theme;

    private $screensaverTimeout;

    private $screensaverPhotoDuration;

    private $screensaverToDayModeHour;

    private $screensaverToNightModeHour;

    public function __construct(string $locale, string $theme, int $screensaverTimeout, int $screensaverPhotoDuration, int $screensaverToDayModeHour, int $screensaverToNightModeHour)
    {
        $this->locale = $locale;
        $this->theme = $theme;
        $this->screensaverTimeout = $screensaverTimeout;
        $this->screensaverPhotoDuration = $screensaverPhotoDuration;
        $this->screensaverToDayModeHour = $screensaverToDayModeHour;
        $this->screensaverToNightModeHour = $screensaverToNightModeHour;
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
            'theme' => $this->theme,
            'screensaverTimeout' => $this->screensaverTimeout,
            'screensaverPhotoDuration' => $this->screensaverPhotoDuration,
            'screensaverToDayModeHour' => $this->screensaverToDayModeHour,
            'screensaverToNightModeHour' => $this->screensaverToNightModeHour
        ]);
    }
}
