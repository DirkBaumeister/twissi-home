<?php

namespace App\Service\Automation;

class StateStorage
{
    const STATE_SAVE_PATH = 'var' . DIRECTORY_SEPARATOR . 'automation';

    const STATE_EXTENSION = "state";

    private $projectDir;

    public function __construct($projectDir)
    {
        $this->projectDir = $projectDir;
    }

    public function getEntityState($id): bool
    {
        $file = $this->getStateFilePath($id);
        if (file_exists($file) && is_readable($file)) {
            return trim(file_get_contents($file)) === "1";
        }
        return false;
    }

    public function setEntityState(string $id, bool $state): self
    {
        $file = $this->getStateFilePath($id);
        if (is_writable($file)) {
            file_put_contents($file, $state ? "1" : "0");
        }
        return $this;
    }

    private function getStateFilePath($id)
    {
        return $this->projectDir . DIRECTORY_SEPARATOR . self::STATE_SAVE_PATH . DIRECTORY_SEPARATOR . $id . "." . self::STATE_EXTENSION;
        ;
    }
}
