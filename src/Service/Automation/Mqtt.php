<?php

namespace App\Service\Automation;

use PhpMqtt\Client\MQTTClient;

class Mqtt implements AutomationInterface
{
    private $stateStorage;

    private $mqtt;

    private $automationEntities;

    private $commandTopic;

    private $externalControlUrl;

    public function __construct(StateStorage $stateStorage, MQTTClient $mqtt, array $automationEntities, string $commandTopic, string $externalControlUrl)
    {
        $this->stateStorage = $stateStorage;
        $this->mqtt = $mqtt;
        $this->automationEntities = $automationEntities;
        $this->commandTopic = $commandTopic;
        $this->externalControlUrl = $externalControlUrl;
    }

    public function getAutomationEntities(): array
    {
        $data = [];
        foreach ($this->automationEntities as $key => $automationEntity) {
            $automationEntity['state'] = $this->stateStorage->getEntityState($automationEntity['id']);
            $data[$key] = $automationEntity;
        }
        return ['entities' => $data, 'external_control' => $this->externalControlUrl ];
    }

    public function controlEntity($id, bool $state) : bool
    {
        $this->stateStorage->setEntityState($id, $state);
        $this->mqtt->connect();
        $this->mqtt->publish(sprintf($this->commandTopic, $id), $state ? "1" : "0");
        $this->mqtt->close();
        return true;
    }

    public function updateStates(): void
    {
    }

    public function getStateStorage(): StateStorage
    {
        return $this->stateStorage;
    }
}
