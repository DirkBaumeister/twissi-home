<?php

namespace App\Controller;

use App\Service\Automation\AutomationInterface;
use App\Service\Calendar\CalendarInterface;
use App\Service\Weather\WeatherInterface;
use App\Service\Automation\StateStorage;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Finder\Finder;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api")
 */
class ApiController extends AbstractController
{
    private $automation;

    private $calendar;

    private $weather;

    private $photoPath;

    public function __construct(AutomationInterface $automation, CalendarInterface $calendar, WeatherInterface $weather, $photoPath)
    {
        $this->automation = $automation;
        $this->calendar = $calendar;
        $this->weather = $weather;
        $this->photoPath = $photoPath;
    }

    /**
     * @Route("/events", name="api_events")
     */
    public function events()
    {
        return $this->json($this->calendar->getEvents());
    }

    /**
     * @Route("/automation", name="api_automation")
     */
    public function automation()
    {
        return $this->json($this->automation->getAutomationEntities());
    }

    /**
     * @Route("/automation/trigger", name="api_automation_trigger", methods={"POST"})
     */
    public function automation_trigger(Request $request)
    {
        $this->automation->controlEntity($request->get('id'), $request->get('state'));
        return $this->json(['result' => true]);
    }

    /**
     * @Route("/automation/external_state_set/{id}/{state}", name="api_automation_external_state_set", methods={"GET"})
     */
    public function automation_external_state_set(StateStorage $stateStorage, $id, $state)
    {
        $stateStorage->setEntityState($id, $state);
        return $this->json(['result' => true]);
    }

    /**
     * @Route("/weather/forecast", name="api_weather_forecast")
     */
    public function weather_forecast(Request $request)
    {
        return $this->json($this->weather->getWeatherForecastData($request));
    }

    /**
     * @Route("/weather/weather", name="api_weather_today")
     */
    public function weather_today(Request $request)
    {
        return $this->json($this->weather->getWeatherTodayData($request));
    }

    /**
     * @Route("/photos", name="api_photos")
     */
    public function photos()
    {
        $data = [];
        foreach ((new Finder())->files()->in($this->photoPath)->name('screensaver*.jpg') as $photo) {
            $data[] = '/photos/' . $photo->getFilename();
        }
        return $this->json($data);
    }
}
