<?php

namespace App\Service\Automation;

use PhpMqtt\Client\MQTTClient;

class Mqtt implements AutomationInterface
{
    private $stateStorage;

    private $mqtt;

    private $automationEntities;

    private $commandTopic;

    public function __construct(StateStorage $stateStorage, MQTTClient $mqtt, array $automationEntities, string $commandTopic)
    {
        $this->stateStorage = $stateStorage;
        $this->mqtt = $mqtt;
        $this->automationEntities = $automationEntities;
        $this->commandTopic = $commandTopic;
    }

    public function getAutomationEntities(): array
    {
        $data = [];
        foreach ($this->automationEntities as $key => $automationEntity) {
            $automationEntity['state'] = $this->stateStorage->getEntityState($automationEntity['id']);
            $data[$key] = $automationEntity;
        }
        return $data;
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
