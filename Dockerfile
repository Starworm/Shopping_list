FROM nginx
COPY dist/ShoppingList /usr/share/nginx/html
EXPOSE 80