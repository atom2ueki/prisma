# prisma

![neural-cover](https://s3.atom2ueki.com/neural-style/neural-cover.jpg)

this is a concept of how you can build a nodejs api with tensorflow to making your own prisma app (backend)
prisma backend served with docker (credits to [Tensorflow](https://www.tensorflow.org/) and [neural-style](https://github.com/anishathalye/neural-style))

## Requirements
1. NVIDIA Cuda GPU
2. Linux Server with [nvidia-docker](https://github.com/NVIDIA/nvidia-docker) installed
3. [AWSS3](https://aws.amazon.com/s3/) or [Minio Server](https://github.com/minio/minio) for saving the processed image

## init setup
- download [Pre-trained VGG network](http://www.vlfeat.org/matconvnet/models/beta16/imagenet-vgg-verydeep-19.mat) put into ./shared/model folder
- create a folder named `output` under project `./shared/`

## build docker image
navigate to the root folder of this project
```
nvidia-docker build -t atom2ueki/prisma:edge .
```

## run docker
```
nvidia-docker run -d --name prisma -p 8080:8080 -v {PATH_TO_THIS_PROJECT}/shared:/home/app/node-server/shared -e "MINIO_ENDPOINT=$MINIO_ENDPOINT" -e "MINIO_ACCESS_KEY=$MINIO_ACCESS_KEY" -e "MINIO_SECRET_KEY=$MINIO_SECRET_KEY" atom2ueki/prisma:edge
```
## use postman test this api
- post url: http://localhost:8080/prisma
- parameters
  - source_img: jepg image file
  - style: String ( pick anyone from this array ['cosa', 'picasso', 'pop', 'prisma', 'scream', 'starry', 'wave'] )

![neural-cover](https://s3.atom2ueki.com/neural-style/neural-sample.jpg)
