<?php

namespace App\Config;

use App\Service\Automation\AutomationInterface;

interface ConfigInterface
{
    public function getService(): AutomationInterface;
}
