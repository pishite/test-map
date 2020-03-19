<?php

include_once 'core/response.php';
include_once 'core/response.php';
include_once 'mysql/connect.php';
include_once 'mysql/draw.php';
include_once 'mysql/alert.php';

$response = new Response();

switch ($response->route()) {
    case 'draw':
        $draw = new Draw();
        $response->statusCode(200);

        switch (true) {
            case $response->isMethod('get'):
                $response->data( $draw->select() );
                break;

            case $response->isMethod('put'):
                $response->data( $draw->update($response->post()) );
                break;

            case $response->isMethod('post'):
                $response->data( $draw->insert($response->post()) );
                break;

            case $response->isMethod('delete'):
                $response->data( $draw->delete($response->post()) );
                break;

            default:
                $response->statusCode(404);
        }


        break;

    case 'alert':
        $draw = new Alert();
        $response->statusCode(200);

        switch (true) {
            case $response->isMethod('post'):
                $response->data( $draw->insert($response->post()) );
                break;

            case $response->isMethod('get'):
                $response->data( $draw->select() );
                break;

            default:
                $response->statusCode(404);
        }


        break;
}

$response->sendAnswer();
