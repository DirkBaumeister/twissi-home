<?php

namespace App\Service\Automation;

use GuzzleHttp\Client;

class HomeAssistant implements AutomationInterface
{
    private $stateStorage;

    private $apiUrl;

    private $apiKey;

    private $automationEntities;

    private $client;

    public function __construct(StateStorage $stateStorage, string $apiUrl, string $apiKey, array $automationEntities)
    {
        $this->stateStorage = $stateStorage;
        $this->apiUrl = $apiUrl;
        $this->apiKey = $apiKey;
        $this->automationEntities = $automationEntities;
        $this->client = new Client();
    }

    public function getAutomationEntities(): array
    {
        $this->updateStates();
        $data = [];
        foreach ($this->automationEntities as $key => $automationEntity) {
            $automationEntity['state'] = $this->stateStorage->getEntityState($automationEntity['id']);
            $data[$key] = $automationEntity;
        }
        return $data;
    }

    public function controlEntity($id, bool $state): bool
    {
        try {
            $response = $this->client->post($this->apiUrl . '/api/services/light/' . ($state ? 'turn_on' : 'turn_off'), [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->apiKey,
                    'Accept'        => 'application/json',
                ],
                'json' => [
                    'entity_id' => 'light.' . $id
                ]
            ]);
            if ($response->getStatusCode() === 200) {
                if (false !== $data = json_decode($response->getBody()->getContents(), true)) {
                    if (isset($data[0]['state'])) {
                        $this->stateStorage->setEntityState($id, $data[0]['state'] === 'on');
                        return true;
                    } else {
                        sleep(1);
                        $this->updateStates();
                        return true;
                    }
                }
            }
        } catch (\Exception $e) {
        }
        return false;
    }

    public function updateStates(): void
    {
        try {
            $response = $this->client->get($this->apiUrl . '/api/states', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->apiKey,
                    'Accept'        => 'application/json',
                ]
            ]);
            if ($response->getStatusCode() === 200) {
                if ($data = json_decode($response->getBody()->getContents(), true)) {
                    foreach ($data as $item) {
                        foreach ($this->automationEntities as $key => $automationEntity) {
                            if ("light.".$automationEntity['id'] === $item['entity_id']) {
                                $this->stateStorage->setEntityState($automationEntity['id'], $item['state'] === 'on');
                            }
                        }
                    }
                }
            }
        } catch (\Exception $e) {
        }
    }

    public function getStateStorage(): StateStorage
    {
        return $this->stateStorage;
    }
}
