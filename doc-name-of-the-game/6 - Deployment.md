# NGINX Config on VPS

1. `cd`
2. `sudo nano /etc/nginx/sites-available/game`
3. **Edit the file** and **comment out** or **remove the `listen 443` and SSL settings**, like this:
```nginx
server {
    listen 80;
    server_name name-of-the-game.stephanhagmann.ch;

    location / {
        proxy_pass http://127.0.0.1:5173;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```
2. **Reload NGINX**:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

3. **Run Certbot:**

```bash
sudo certbot --nginx -d name-of-the-game.stephanhagmann.ch
```

Certbot will:
- Verify the domain
- Issue a certificate
- Automatically update your config to include the SSL directives again

4. ✅ Done! Now test it:

```bash
curl -I https://name-of-the-game.stephanhagmann.ch
```
