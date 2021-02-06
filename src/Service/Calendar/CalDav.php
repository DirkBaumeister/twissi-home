<?php

namespace App\Service\Calendar;

use ICal\Event;
use ICal\ICal;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;
use Symfony\Contracts\Cache\ItemInterface;

class CalDav implements CalendarInterface
{
    private $caldavUrl;
    private $caldavUser;
    private $caldavPass;

    public function __construct($caldavUrl, $caldavUser, $caldavPass)
    {
        $this->caldavUrl = $caldavUrl;
        $this->caldavUser = $caldavUser;
        $this->caldavPass = $caldavPass;
    }

    public function getEvents(): array
    {
        $data = [];
        /** @var Event $event */
        foreach ($this->getICalData() as $event) {
            $startDate = date("d.m.Y", strtotime($event->dtstart));
            $startTime = date("H:i", strtotime($event->dtstart));
            $endDate = date("d.m.Y", strtotime($event->dtend));
            $endTime = date("H:i", strtotime($event->dtend));
            $endDateCheck = date("d.m.Y", strtotime($event->dtend . ' - 1 Day'));
            $data[] = [
                'id' => $event->uid,
                'start_date' => $startDate,
                'start_time' => $startTime,
                'end_date' => $endDate,
                'end_time' => $endTime,
                'full_day' => strpos($event->dtstart, "T") === false,
                'same_day' => $startDate === $endDateCheck,
                'summary' => $event->summary,
                'description' => $event->description
            ];
        }
        return $data;
    }

    private function getICalData()
    {
        $cache = new FilesystemAdapter();
        $result = $cache->get('caldav_data', function (ItemInterface $item) {
            $item->expiresAfter(60);
            $iCal = new ICal();
            $iCal->initUrl($this->caldavUrl, $this->caldavUser, $this->caldavPass);
            $events = $iCal->events();
            krsort($events);
            /** @var Event $event */
            foreach ($events as $key => $event) {
                if (strtotime($event->dtstart) <= time()) {
                    unset($events[$key]);
                }
            }
            return $events;
        });
        return $result;
    }
}
