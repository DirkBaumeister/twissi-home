<?php


namespace App\Service\Weather;

use Symfony\Component\HttpFoundation\Request;

interface WeatherInterface
{
    public function getWeatherForecastData(Request $request): array;

    public function getWeatherTodayData(Request $request): array;

    public function getApiData(Request $request, string $endpoint): array;
}
