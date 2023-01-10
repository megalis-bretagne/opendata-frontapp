FROM nginx:stable
RUN rm /etc/nginx/conf.d/default.conf

COPY --chown=nginx:root ./nginx /etc/nginx/

COPY --chown=nginx:root dist/opendata-app /usr/share/nginx/html/

#envsubst to perform the variable substitution on nginx startup
CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/settings.template.json > /usr/share/nginx/html/assets/settings.json && exec nginx -g 'daemon off;'"]
