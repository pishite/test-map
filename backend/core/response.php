<?php

class Response
{
    protected $path = [];

    protected $post = [];

    protected $method = '';

    protected $response = [
        'status' => 404
    ];

    public function __construct()
    {
        $this->path = substr($_SERVER['REQUEST_URI'], strpos($_SERVER['REQUEST_URI'], '?') + 1);
        $this->path = array_values(array_diff(explode('/', $this->path), ['']));
        $this->method = $_SERVER['REQUEST_METHOD'];
        $this->post = file_get_contents('php://input');
        $this->post = json_decode($this->post, true);
    }

    public function isMethod($method)
    {
        return strtolower($this->method) === strtolower($method);
    }

    public function method()
    {
        return $this->method;
    }

    public function post()
    {
        return $this->post;
    }

    public function route()
    {
        return $this->path[0];
    }

    public function statusCode($status = 200) {
        $this->response['status'] = $status;
    }

    public function data($data) {
        $this->response['data'] = $data;
    }

    public function sendAnswer() {
        http_response_code($this->response['status']);

        if (array_key_exists('data', $this->response)) {
            header('Content-Type:application/json');
            echo json_encode($this->response['data']);
            echo PHP_EOL;
            exit();
        }
    }
}