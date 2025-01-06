-- There are several iteration required to work fully with database 
/*
@Feature that have to be further added are 
*/
create extension if not exists pgcrypto;

create table if not exists users (
	id serial primary key,
	first_name varchar(50),
	last_name varchar(50),
	username text unique,
	email text unique not null,
	password text not null
	interests text,
	hobbies text
);
-- users_data for mapping each user with extra user data which can be set in further application usage
create table playlists(
	id serial primary key,
	user_id int not null references users(id) on delete cascade,
	name varchar(100),
	is_public boolean default false,
	created_at timestamp default current_timestamp
);
-- songs linked to specific playlist id 
create table songs (
	id serail primary key,
	playlist_id int not null references playlists(id) on delete cascade,
	title VARCHAR(200) NOT NULL,
	artist VARCHAR(100),
	url TEXT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

-- function that hashes and store the user data 
drop function if exists hash(varchar, varchar, text, text);

create or replace function hash(firstn varchar(50),lastn varchar(50),em text,pass text)
returns boolean
language plpgsql
as
$$
begin
	insert into users(first_name,last_name,username,password)
	values (firstn,lastn,em,crypt(pass,gen_salt('bf')));
	return true;
end;
$$;

-- code for authenticating user from data base itself (postgres is actually good bruh) 
create or replace function authenticate_user(email text, username text, pass text)
  returns boolean
  language plpgsql
  immutable
  returns null on null input
  as $$
  begin
    return exists (
      select 1
      from users
      where (username = username or email = email)
        and password = crypt(pass, password)
    );
  end;
  $$;