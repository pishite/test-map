create database if not exists map;

create table if not exists alerts (
  id int(11) unsigned not null auto_increment,
  `timestamp` int(11) default now(),
  draw_id int(11) not null,

  primary key (id)
  key id (id)
) engine=myisam;

create table if not exists draws (
  id int(11) unsigned not null auto_increment unique,
  `type` varchar (80) not null,
  coords varchar (1000) not null,

  primary key (id)
  key id (id)
) engine=myisam;