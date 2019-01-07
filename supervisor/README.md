### Create log file

```
touch ~/code/www/queue-log/laravel-worker.log
```

### Reload supervisor

```
sudo supervisorctl reread

sudo supervisorctl update

sudo supervisorctl start laravel-worker:*
```