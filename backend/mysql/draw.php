<?php

class Draw extends Connector
{
    public function insert($post)
    {
        $post['coords'] = json_encode($post['coords']),

        return ['id' => parent::insert('draws', $post)];
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