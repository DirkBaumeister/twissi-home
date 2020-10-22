<?php

namespace App\Service\Weather;

use GuzzleHttp\Client;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Contracts\Cache\ItemInterface;

class OpenWeatherMapGateway implements WeatherInterface
{
    const BASE_URL = "https://api.openweathermap.org/data/2.5";

    private $city;

    private $apiKey;

    public function __construct(string $city, string $apiKey)
    {
        $this->city = $city;
        $this->apiKey = $apiKey;
    }

    public function getWeatherForecastData(Request $request): array
    {
        return $this->getApiData($request, 'forecast');
    }

    public function getWeatherTodayData(Request $request): array
    {
        return $this->getApiData($request, 'weather');
    }

    public function getApiData(Request $request, string $endpoint): array
    {
        $cache = new FilesystemAdapter();
        $key = implode('_', $request->query->all()) . '_' . $endpoint;
        $result = $cache->get($key, function (ItemInterface $item) use ($request, $endpoint) {
            $query = $request->query->all();
            $query['q'] = $this->city;
            $query['appid'] = $this->apiKey;
            $item->expiresAfter(1800);
            $data = json_decode((new Client())->get(self::BASE_URL . '/' . $endpoint, [
                'query' => $query
            ])->getBody()->getContents(), true);
            $data['_last_updated'] = date("Y-m-d H:i:s");
            return $data;
        });
        return $result;
    }
}
