# prisma
build your own prisma app (backend)
prisma backend served with docker (credits to [Tensorflow](https://www.tensorflow.org/) and [neural-style](https://github.com/anishathalye/neural-style))

## Requirements
1. NVIDIA Cuda GPU
2. Linux Server with [nvidia-docker](https://github.com/NVIDIA/nvidia-docker) installed
3. [AWSS3](https://aws.amazon.com/s3/) or [Minio Server](https://github.com/minio/minio) for saving the processed image

## init setup
download [Pre-trained VGG network](http://www.vlfeat.org/matconvnet/models/beta16/imagenet-vgg-verydeep-19.mat) put into ./shared/model folder
create a folder named ./shared/output

## build docker image
