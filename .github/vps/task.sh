#!/bin/sh
# Read-only environment probe for the analytics install.
echo "=== host"; hostname; uname -m
echo "=== resources"; free -m | head -2; df -h / | tail -1; nproc
echo "=== sudo"; sudo -n true 2>/dev/null && echo SUDO_OK || echo NO_SUDO
echo "=== docker"; docker --version 2>/dev/null || echo no-docker; docker compose version 2>/dev/null || echo no-compose
echo "=== webserver"; for s in nginx caddy apache2; do printf '%s: ' $s; systemctl is-active $s 2>/dev/null || echo unknown; done
echo "=== sites"; ls /srv/sites/ 2>/dev/null
echo "=== nginx vhosts"; ls /etc/nginx/sites-enabled/ 2>/dev/null; ls /etc/nginx/conf.d/ 2>/dev/null
echo "=== caddyfile"; ls /etc/caddy/ 2>/dev/null; head -50 /etc/caddy/Caddyfile 2>/dev/null
echo "=== certs"; ls /etc/letsencrypt/live/ 2>/dev/null
echo "=== cf creds"; ls /etc/letsencrypt/renewal/ 2>/dev/null; sudo -n ls /root/.secrets 2>/dev/null; grep -rl dns_cloudflare /etc/letsencrypt/renewal/ 2>/dev/null | head -3
echo "=== listeners"; ss -tlnp 2>/dev/null | awk '{print $4}' | sort -u | head -15
echo "=== wj0 origin"; grep -rn 'proxy_pass\|reverse_proxy' /etc/nginx/sites-enabled/ /etc/caddy/Caddyfile 2>/dev/null | head -10
