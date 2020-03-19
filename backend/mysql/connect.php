<?php

class Connect
{
    static private $db;

    public function __construct()
    {
        if (self::$db)
            return $this;

        $this->connection();

        return $this;
    }

    public function close()
    {
        mysqli_close(self::$db);
    }

    protected function _insert(array $params)
    {
        if (!$params)
            return false;

        $columns = array_keys($params);
        $params = array_map([$this, '_injection'], $params);

        $sql = sprintf('insert into %s (`%s`) values ("%s")',
            $this->table,
            join('`,`', $columns),
            join('","', $params)
        );

        $this->_query($sql);

        return mysqli_insert_id(self::$db);
    }

    protected function _insert_many(array $params)
    {
        if (!$params)
            return false;

        $columns = array_keys(reset($params));
        $values = [];

        foreach ($params as $row) {
            $values[] = '("' . join('","', array_map([$this, '_injection'], $row)) . '")';
        }

        unset($params);

        $sql = sprintf('insert into %s (`%s`) values %s',
            $this->table,
            join('`,`', $columns),
            join(',', $values)
        );

        $this->_query($sql);

        return mysqli_affected_rows(self::$db);
    }

    protected function _update(array $params, $id = null)
    {
        if (!$params)
            return false;

        $id = is_null($id) ? $params['id'] : $id;
        $setColumns = [];

        foreach ($params as $key => $value) {
            $setColumns[] = sprintf('`%s`="%s"', $key, $this->_injection($value));
        }

        $sql = sprintf('update %s set %s where id=%d',
            $this->table,
            join(',', $setColumns),
            $id
        );

        $this->_query($sql);

        return mysqli_affected_rows(self::$db);
    }

    protected function _delete($id)
    {
        $sql = sprintf('delete from %s where id=%d', $this->table, $id);

        $this->_query($sql);

        return mysqli_affected_rows(self::$db);
    }

    protected function _select($sql)
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

    private function connection()
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
                  createStamp int(13),
                  draw_id int(11) not null,
                  coords varchar (1000) not null,

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

    private function _injection($value, $s = '"') {
        return str_replace($s, '\\' . $s, $value);
    }
}
