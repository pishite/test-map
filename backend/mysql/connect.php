<?php

class Connector
{
    static private $db;

    public function __construct()
    {
        if (self::$db)
            return;

        $this->connect();
    }

    public function close()
    {
        mysqli_close(self::$db);
    }

    public function insert($table, array $params)
    {
        if (!$params)
            return false;
        $columns = array_keys($params);

        $sql = sprintf('insert into %s (`%s`) values ("%s")',
            $table,
            join('`,`', $columns),
            join('","', $params)
        );

        $this->_query($sql);

        return mysqli_insert_id(self::$db);
    }

    public function update($table, array $params)
    {
        $sql = sprintf('update %s set coords="%s", type="%s" where id=%d',
            $table,
            json_encode($post['coords']),
            $post['type'],
            $post['id']
        );

        $this->_query($sql);

        return mysqli_affected_rows(self::$db);
    }

    public function delete($sql)
    {
        $this->_query($sql);

        return mysqli_affected_rows(self::$db);
    }

    public function select($sql)
    {
        $res = $this->_query($sql);

        return $this->_getMapResponse($res);
    }

    private function _getMapResponse($res)
    {
        $result = [];

        while (($row = mysqli_fetch_assoc($res))) {
            $result[] = $row;
        }

        return $result;
    }

    private function _query($sql)
    {
        $res = mysqli_query(self::$db, $sql);

        if (!$res || mysqli_errno(self::$db)) {
            throw new Error(mysqli_error(self::$db));
        }

        return $res;
    }

    private function connect()
    {
        self::$db = mysqli_connect("172.41.0.4", "root", "rootpassword");

        if (mysqli_connect_errno()) {
            throw new Error(mysqli_connect_error());
        }

        $res = mysqli_select_db(self::$db, 'map');

        if (!$res || mysqli_connect_errno()) {
            mysqli_query(self::$db, 'create database if not exists map;');

            mysqli_select_db(self::$db, 'map');

            mysqli_query(self::$db, '
              create table if not exists alerts (
                  id int(11) unsigned not null auto_increment,
                  createStamp int(11),
                  draw_id int(11) not null,

                  primary key (id)
                )
            ');

            mysqli_query(self::$db, '
                create table if not exists draws (
                  id int(11) unsigned not null auto_increment unique,
                  type varchar (80) not null,
                  coords varchar (1000) not null,

                  primary key (id)
                ) engine=myisam;
            ');

            $this->_getMapResponse($this->_query('show tables'));
        }
    }
}
