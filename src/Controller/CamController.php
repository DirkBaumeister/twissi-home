<?php

namespace App\Controller;

use GuzzleHttp\Client;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class CamController extends AbstractController
{
    private $surveillanceIp;

    private $surveillanceUsername;

    private $surveillancePassword;


    public function __construct($surveillanceIp, $surveillanceUsername, $surveillancePassword)
    {
        $this->surveillanceIp = $surveillanceIp;
        $this->surveillanceUsername = $surveillanceUsername;
        $this->surveillancePassword = $surveillancePassword;
    }

    /**
     * @Route("/cam", name="cam_index")
     */
    public function index()
    {
        $client = new Client([
            'base_uri' => 'http://' . $this->surveillanceIp,
            'timeout'  => 2.0,
            'auth' => [$this->surveillanceUsername, $this->surveillancePassword]
        ]);
        $response = new Response($client->get('/snap.jpg')->getBody()->getContents());
        $response->headers->set('Content-Type', 'image/jpeg');
        return $response;
    }
    
    /**
     * @Route("/cam/control/{action}/{speed}", name="cam_control")
     */
    public function control($action, $speed)
    {
        $client = new Client([
            'base_uri' => 'http://' . $this->surveillanceIp,
            'timeout'  => 2.0,
            'auth' => [$this->surveillanceUsername, $this->surveillancePassword]
        ]);
        $client->get('/web/cgi-bin/hi3510/ptzctrl.cgi?-step=0&-act=' . $action . '&-speed=' . $speed);
        return $this->json(['status' => 'ok']);
    }

    /**
     * @Route("/cam/preset/{number}", name="cam_preset")
     */
    public function preset($number)
    {
        $client = new Client([
            'base_uri' => 'http://' . $this->surveillanceIp,
            'timeout'  => 2.0,
            'auth' => [$this->surveillanceUsername, $this->surveillancePassword]
        ]);
        $client->get('/web/cgi-bin/hi3510/param.cgi?cmd=preset&-act=goto&-status=1&-number=' . $number);
        return $this->json(['status' => 'ok']);
    }
}
