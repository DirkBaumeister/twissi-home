<?php

namespace App\Config;

use App\Service\Automation\AutomationInterface;

class AutomationConfig implements ConfigInterface
{
    private $mode;

    private $mqtt;

    private $homeAssistant;

    public function __construct($mode, AutomationInterface $mqtt, AutomationInterface $homeAssistant)
    {
        $this->mode = $mode;
        $this->mqtt = $mqtt;
        $this->homeAssistant = $homeAssistant;
    }

    public function getService(): AutomationInterface
    {
        switch ($this->mode) {
            case "mqtt":
                return $this->mqtt;
            break;
            case "home-assistant":
                return $this->homeAssistant;
            break;
        }
    }
}
