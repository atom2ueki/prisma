FROM gcr.io/tensorflow/tensorflow:latest-gpu
MAINTAINER Tony Li <atom2ueki@gmail.com>

# Install Git
RUN \
  apt-get update && \
  apt-get install -y git && \
  git clone https://github.com/atom2ueki/neural-style.git /home/app/neural-style

# Install Nodejs
RUN \
  curl -sL https://deb.nodesource.com/setup_8.x | bash - && \
  apt-get install -y nodejs

# Create app directory
RUN mkdir -p /home/app/node-server
WORKDIR /home/app/node-server

# Install app dependencies
COPY package.json /home/app/node-server/
RUN npm install

# Bundle app source
COPY . /home/app/node-server

EXPOSE 8080
CMD [ "npm", "start" ]