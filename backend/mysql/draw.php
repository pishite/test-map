<?php

class Draw extends Connect
{
    public $table = 'draws';

    public function insert($post)
    {
        $post['coords'] = json_encode($post['coords']);

        return ['id' => parent::_insert($post)];
    }

    public function update($post)
    {
        $post['coords'] = json_encode($post['coords']);

        return ['count' => parent::_update($post)];
    }

    public function delete($post)
    {
        return ['count' => parent::_delete($post['id'])];
    }

    public function select()
    {
        $sql = sprintf('select * from %s', $this->table);

        $result = parent::_select($sql);

        foreach ($result as $k => $v) {
            $v['coords'] = json_decode($v['coords'], true);
            $result[$k] = $v;
        }

        return $result;
    }
}
