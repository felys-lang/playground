FROM nginx:alpine

COPY ./templates /etc/nginx/templates

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]