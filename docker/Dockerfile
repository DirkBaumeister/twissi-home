FROM php:7.4-cli AS builder

RUN apt-get update && apt-get install -y gnupg2

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -

RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

RUN apt-get update && apt-get install -y git \
                                         wget \
                                         zip \
                                         yarn

ARG SSH_PRIVATE_KEY
RUN mkdir /root/.ssh/
RUN echo "${SSH_PRIVATE_KEY}" > /root/.ssh/id_rsa
RUN chmod 600 /root/.ssh/id_rsa

RUN touch /root/.ssh/known_hosts

ARG GIT_URL

ARG GIT_PORT

RUN ssh-keyscan -p $GIT_PORT $GIT_URL >> /root/.ssh/known_hosts

RUN mkdir /code

ARG GIT_COMMIT

ARG GIT_REPO

RUN cd /code && git clone $GIT_REPO .

COPY files/composer-install.sh /tmp/.

RUN chmod +x /tmp/composer-install.sh && /tmp/composer-install.sh

ENV APP_ENV "prod"

RUN cd /code && composer install --no-dev

ARG REACT_APP_WEATHER_CITY

RUN cd /code && yarn install && yarn encore prod

RUN rm -rf /code/node_modules

FROM php:7.4-apache-buster

COPY files/000-default.conf /etc/apache2/sites-available/.

RUN docker-php-ext-install pdo pdo_mysql && docker-php-ext-enable pdo pdo_mysql

RUN a2enmod headers

COPY --from=builder /code /var/www/html

RUN chown www-data: -R /var/www/html