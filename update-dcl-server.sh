#!/usr/bin/env bash
# to be run in Droplet
docker pull pablooliva/ch.ckl.st-server
docker stack rm chcklst-server
docker stack deploy -c /root/chcklst/docker-compose-srvr-prod.yml chcklst-server
