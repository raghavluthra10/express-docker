## About this repo

this repo shows my journey of learning how to use docker and containorize application.

# make a Dockerfile

`touch Dockerfile`

# make a docker image using the docker file

`docker build -t docker-sample .`

-  In the above command, "docker build" is the command to build the image.
-  "-t" is the arguement that gives it a tag name. in this case, tag ame is "docker-sample".
-  The "." in the end represents that we need to run the Dockerfile which is present in the current directory.

# run the docker image

`docker run -dp 8000:8000 docker-sample`

-  the above command says to run the docker image with the name "docke-sample" in the detached mode and create a mapping of host's port to the container's port.
-  by mapping, we mean that as we have mentioned the app to run on port 8000 inside the container, with the help of "-p" we are saying that show that port 8000 (which is running inside the container) on our localhosts port 8000. with this we will be able to view/interact with our application on our browser.
