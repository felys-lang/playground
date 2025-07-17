FROM nginx:alpine

COPY ./templates /etc/nginx/templates

ARG HOST
ENV HOST=$HOST

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]