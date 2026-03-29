//Comunicación con el server con AJAX y Axios
let apiURL="https://api.imgflip.com/get_memes";

function getURL(){
    return apiURL;
}

async function solicarProductosServer() {
    try {
        // Be careful with CORS Ajax Request! https://stackoverflow.com/questions/45975135/access-control-origin-header-error-using-axios
        var url=getURL();
        //https://developers.google.com/books/docs/v1/getting_started

        const resp = await axios.get(url);
        const data=await resp.data;
        return data.data.memes;
    } catch (err) {
        // Handle Error Here
        console.error(err);
        return ""
    }
}

export {solicarProductosServer};