# syntax=docker/dockerfile:1
# Static-only starter: no build step, just serve index.html.
FROM nginx:alpine AS runner
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html /usr/share/nginx/html/index.html
EXPOSE 3000
