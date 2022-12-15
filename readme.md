## About this repo

this repo shows my journey of learning how to use docker and containorize application.

## how to use this app.

this is a simple express js server. it is connected to a postgres database.

this database is connected from postgres running inside docker container.

to setup the database, do the following:

`pnpm install`

1. download docker and install.

2. open terminal and run
   ` docker pull postgres`
   ^ will pull postgres image from docker registery.

3. start a container with the newly downloaded postgres image. enter the following command in the exact order (even though i have read that docker options order does not matter, but it didn't work for my in any other sequence.)
   `docker run --name some-postgres -p 4321:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=password -d postgres`

^ to understand the above command:

-  we are first setting the name of the new container with "--name" option to "some-postgres".
-  mapping the containers 5432 port to localhost's 4321 port so that we can access it from the exposed port. this is done with "-p" option.
-  setting the ENV variables of the postgres database with "-e" to "root" as the postgres user and "password" as the postgres password.
-  "-d" means to run this command in detached mode.
-  "postgres" in the end is the name of the image.

Once you do this. you will have postgres database running inside your container, which is exposed to our localhost on port 4321.

to enter the terminal inside container that has our database running, do the following:

`docker ps `

^ will list running containers. grab the Container ID and then run:
`docker exec -it <container_id> bash`

^ this will give us an entry inside containers terminal, where we can run bash commands.

do `psql root`
and this should connect you to root database.

Now that we have our postgres database running inside contianer and exposed on port 4321. its time to connect it to our express server app.

we will be using Knes.js as query builder.

Since our database is empty, lets add some migration files to add a table and then we will seed the database with some initial data, so we can make some queries.

Do the following:

1. first, we'll make a knex file for basic database configuration.
   `knexfile --init`

2. edit the knexfile.js and copy past this in the development option.

client: "pg",
connection: {
port: 4321,
host: "localhost",
user: "root",
database: "root",
password: "password",
}

Ideally, we should never expose these variables publically and store them inside .env file. but since this is not anything serious and just for my personal use, i am keeping it this way.

3. make the migration file:
   `knex migrate:make init`

4. edit the migration file. you can copy the code from "./migrations/init file". it creates a basic users table.

5. `knex migrate:latest` to run the migration file.

6. make some initial entries. to make seed file enter `knex seed:make init`.

7. copy the data from "./seeds/init.js". this enters 2 entries in "users" table. run `knex:seed run`.

And we are all set up with the initial setup.

express server running locally + postgres database running inside docker container. both connected.

I have already written a small GET api in "./index.js" file. enter "http://localhost:8000" on your browser and you should see express fetching data from database and showing it on the browser as a response.

NOTE: i have not made the database data persistent with the help of volumes as of now. will be doing it in the next few commits.

## persisting data

to make sure that our data is persisted i.e. if we delete the container and start a new one, it should retain data that we inserted into the former container.

for that, first we'll delete the existing container (this is optional, but if you do it you will get a better clarity of how things are actually working).

run `docker rm <container_id>`

^ this will delete the container and all the data as well.

Now, we'll start a new container but this time we'll add a volume to it.

`docker run --name v-postgres -p 4321:5432 -v data:/var/lib/postgresql/data -e POSTGRES_USER=root -e POSTGRES_PASSWORD=password -d postgres`

^ Notice that this command is same as we used earlier for starting a container, the only difference being that we have added "-v data:/var/lib/postgresql/data". This basically tells us to add a named volume and store the data that is usually stored inside containers "/var/lib/postgresql/data" dir inside "data" dir. "data" dir will be stored inside of docker host, so now even if we delete the container, we will not loose tha data.

To start the container, do the following steps in projects dir:

1. `knex migrate:latest` to make "users" table.
2. `knex seed:run` to add new data to "users" table.
3. `pnpm run dev` to start express server.

Everything is up and running, go to "http://localhost:8000" and you should see the response there.

You can try deleting the container and creating a new one again, make sure you add the same path for volume with the same dir on docker host.
