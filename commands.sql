CREATE TABLE blogs(
  id SERIAL PRIMARY KEY, 
  author text, 
  url text NOT NULL, 
  title text NOT NULL, 
  likes integer DEFAULT 0 
);


insert into blogs (author, url, title) values ('Test', 'test.com', 'Testing');
insert into blogs (author, url, title) values ('Example', 'example.com', 'Examples');