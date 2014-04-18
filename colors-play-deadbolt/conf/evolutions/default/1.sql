# --- Created by Slick DDL
# To stop Slick DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table "COLOR" ("id" BIGINT GENERATED BY DEFAULT AS IDENTITY(START WITH 1) NOT NULL PRIMARY KEY,"color" VARCHAR NOT NULL);
create unique index "idx_color" on "COLOR" ("color");

# --- !Downs

drop table "COLOR";
