# build environment
FROM node:12.15.0-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
RUN npm install --silent
RUN npm install react-scripts@3.0.1 -g --silent
COPY . /app
RUN npm run build

# production environment
FROM nginx:1.17.8-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY etc/ssl-cert/fullchain.pem /etc/letsencrypt/live/waratah.knach.us/
COPY etc/ssl-cert/privkey.pem /etc/letsencrypt/live/waratah.knach.us/
COPY etc/nginx/nginx.conf /etc/nginx/
COPY etc/nginx/sites-enabled/* /etc/nginx/sites-enabled/
COPY etc/nginx/sites-available/* /etc/nginx/sites-available/

EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]