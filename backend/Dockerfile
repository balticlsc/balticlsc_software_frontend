FROM python:3-alpine

RUN apk update
RUN apk add build-base python-dev py-pip

ENV LIBRARY_PATH=/lib:/usr/lib

RUN pip install flask
RUN pip install requests
RUN pip install Flask-PyMongo
RUN pip install Flask-APScheduler

#RUN pip install PyJWT

COPY . /app
WORKDIR /app

# Expose the Flask port
EXPOSE 5000

CMD [ "python", "-u", "./server.py" ]
