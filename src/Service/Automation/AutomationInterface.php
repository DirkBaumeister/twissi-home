<?php

namespace App\Service\Automation;

interface AutomationInterface
{
    public function getAutomationEntities(): array;

    public function controlEntity($id, bool $state): bool;

    public function getStateStorage(): StateStorage;

    public function updateStates(): void;
}
