With a couple of edits to the docker-compose.yml file, we can expose Dawarich to the internet utilizing CloudFlare and their Zero Trust Tunnel service. 

This guide will assume you already have a public domain, and are using CloudFlare DNS nameservers.

Login to CloudFlare, and navigate to "Zero Trust" on the left hand menu. https://one.dash.cloudflare.com/

Click on Networks, and then the submenu "Tunnels".
Create your tunnel.

![image](https://github.com/user-attachments/assets/d763cc01-c489-495a-94cf-251a2f2e2e25)

Select cloudflared for the tunnel type on the next page. 

Give your tunnel a name, and click save tunnel. 

On the next page - we are provided with the token needed to run our connector. Click on the copy button to copy this to your clipboard. 

![image](https://github.com/user-attachments/assets/66ae10a7-8142-4183-9e14-dec65672c674)

Paste this into a text editor to remove the install commands, and be left with just the tunnel token. 

Click on the Public Hostname tab, and click "add a public hostname"
You can use any subdomain you'd like. Make sure to configure the IP address and port Dawarich is running on.

![image](https://github.com/user-attachments/assets/a960a1bd-986e-40ad-9fa9-165df5923560)


We are going to store the CloudFlare tunnel token in an .env file. 

Create a tunnel.env file, and use the following format:

```
TUNNEL_TOKEN=CLOUDFLARE_TUNNEL_TOKEN
```

![image](https://github.com/user-attachments/assets/d2ec3205-f2a5-45dc-b966-364f00f93efb)

Now - we are ready to modify our docker-compose file. 

Add this line at row 56:
```
      RAILS_APPLICATION_CONFIG_HOSTS: ""
```

Replace localhost on line 62 with ""
Replace localhost on line 63 with "subdomain.your.tld,''"

Add this line to row 112:
```
      RAILS_APPLICATION_CONFIG_HOSTS: ""
```

Replace localhost on line 118 with "subdomain.your.tld,''"
Replace localhost on line 119 with "subdomain.your.tld,''"


Add the following towards the end of the dockerfile, right above where the volumes are defined:

```
  tunnel:
   image: cloudflare/cloudflared:latest
   command: tunnel --no-autoupdate run
   networks: 
    - dawarich
   env_file: tunnel.env
   restart: always
   container_name: tunnel
   depends_on:
    - dawarich_app
```



