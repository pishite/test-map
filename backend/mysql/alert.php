<?php

class Alert extends Connector
{
    public function insert($post)
    {
        $sql = sprintf('insert into alert (coords, type) values ("%s", "%s")',
            json_encode($post['coords']),
            $post['type']
        );

        return ['id' => parent::insert($sql)];
    }

    public function update($post)
    {
        $sql = sprintf('update draws set coords="%s", type="%s" where id=%d',
            json_encode($post['coords']),
            $post['type'],
            $post['id']
        );

        return ['count' => parent::update($sql)];
    }

    public function delete($post)
    {
        $sql = sprintf('delete from draws where id=%d', $post['id']);

        return ['count' => parent::delete($sql)];
    }
}