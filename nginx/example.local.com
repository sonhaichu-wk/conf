server {
    listen 80;
    #listen 443 ssl http2;
    server_name .example.local.com;
    root "/var/www/html/example/public";

    #gzip on;
    #gzip_types      text/plain text/css text/html application/xml application/javascript;
    #gzip_proxied    no-cache no-store private expired auth;
    #gzip_min_length 1000;

    index index.html index.htm index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    #location ~*  \.(jpg|jpeg|png|gif|ico|css|js|eot|otf|ttf|woff|woff2)$ {
    #   expires 7d;
    #}

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    access_log off;
    error_log  /var/log/nginx/leetee-local.com-error.log error;

    sendfile off;

    client_max_body_size 100m;

    location ~ \.php$ {
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass unix:/var/run/php/php7.2-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        

        fastcgi_intercept_errors off;
        fastcgi_buffer_size 16k;
        fastcgi_buffers 4 16k;
        fastcgi_connect_timeout 300;
        fastcgi_send_timeout 300;
        fastcgi_read_timeout 300;
    }

    location ~ /\.ht {
        deny all;
    }

    #ssl_certificate     /home/sonhaichu/cert/js-sdk.local.com+1.pem;
    #ssl_certificate_key /home/sonhaichu/cert/js-sdk.local.com+1-key.pem;
}