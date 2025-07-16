```shell
docker build -t felysneko/felys-web:latest --build-arg NEXT_PUBLIC_API=https://exec.felys.dev/api web
docker push felysneko/felys-web:latest

docker build -t felysneko/felys-api:latest api
docker push felysneko/felys-api:latest

docker build -t felysneko/felys-nginx:latest nginx
docker push felysneko/felys-nginx:latest
```

```yaml
services:
  web:
    image: felysneko/felys-web:latest
    restart: always
    networks:
      - nginx

  api:
    image: felysneko/felys-api:latest
    restart: always
    networks:
      - nginx

  nginx:
    image: felysneko/felys-nginx:latest
    restart: always
    environment:
      - HOST=exec.felys.dev
    ports:
      - 80:80
      - 443:443
    networks:
      - nginx
    volumes:
      - ./felys.dev.pem:/etc/ssl/certs/felys.dev.pem:ro
      - ./felys.dev.key:/etc/ssl/private/felys.dev.key:ro
      - /dev/null:/etc/nginx/conf.d/default.conf

networks:
  nginx:
    name: nginx
```
