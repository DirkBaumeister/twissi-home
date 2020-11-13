<?php

namespace App\Service\Gasoline;

use GuzzleHttp\Client;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;
use Symfony\Contracts\Cache\ItemInterface;

class TankerKoenigGateway implements GasolineInterface
{
    const API_URL = "https://creativecommons.tankerkoenig.de/json/prices.php";

    private $apiKey;

    private $stationID;

    public function __construct($apiKey, $stationID)
    {
        $this->apiKey = $apiKey;
        $this->stationID = $stationID;
    }

    public function getPrices(): array
    {
        if (strlen(trim($this->apiKey)) > 0 && strlen(trim($this->stationID)) > 0) {
            return $this->callApi();
        }
        return [];
    }

    private function callApi(): array
    {
        try {
            $cache = new FilesystemAdapter();
            $key = 'gasoline_station_' . $this->stationID;
            $apiKey = $this->apiKey;
            $stationID = $this->stationID;
            $result = $cache->get($key, function (ItemInterface $item) use ($apiKey, $stationID) {
                $item->expiresAfter(rand(300, 400));
                if ($apiResult = json_decode((new Client())
                    ->get(self::API_URL . '?ids=' . $stationID . '&apikey=' . $apiKey)
                    ->getBody()
                    ->getContents(), true)) {
                    if (isset($apiResult['ok']) && true === $apiResult['ok'] && isset($apiResult['prices'][$stationID])) {
                        $data = $apiResult['prices'][$stationID];
                        return [
                            'status' => "open" === $data['status'],
                            'diesel' => isset($data['diesel']) ? $data['diesel'] : 0,
                            'petrol' => isset($data['e5']) ? $data['e5'] : 0,
                            'time' => time()
                        ];
                    }
                }
                return [];
            });
            return $result;
        } catch (\Exception $e) {
            return [];
        }
    }
}
