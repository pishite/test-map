<?php

class Alert extends Connect
{
    public $table = 'alerts';

    public function insert($post)
    {
        foreach ($post as &$v) {
            $v['coords'] = json_encode($v['coords']);
        }

        return ['count' => parent::_insert_many($post)];
    }

    public function select()
    {
        $sql = sprintf('select * from %s order by createStamp desc limit 50', $this->table);

        return parent::_select($sql);
    }
}
