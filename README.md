# media-network/media-api
Serverless REST API for Media CDN

```
$ docker-compose up -d
$ docker exec -it media.api bash
$ npm i
$ npm start
```

**Note:**  
The `vm.max_map_count` setting should be set permanently in /etc/sysctl.conf:
```
vm.max_map_count=262144
```

Read more: https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html#docker-cli-run-prod-mode
