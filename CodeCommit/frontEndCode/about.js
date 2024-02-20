var returnData;
function getData(){
    const data = null;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    
    xhr.addEventListener('readystatechange', function () {
        if (this.readyState === this.DONE) {
            returnData = (JSON.parse(this.responseText));
            console.log(returnData['classes'][0]);
            loadData();
        }
    });
    
    xhr.open('GET', 'https://omgvamp-hearthstone-v1.p.rapidapi.com/info');
    xhr.setRequestHeader('X-RapidAPI-Key', 'f4986cc134msh2a96992e9eef59ap103bbfjsn5e2cad384a71');
    xhr.setRequestHeader('X-RapidAPI-Host', 'omgvamp-hearthstone-v1.p.rapidapi.com');
    
    xhr.send(data);
}
function loadData(){

    team = document.getElementById("team");
    teamNum = document.createElement("h3");
    teamNum.innerHTML = returnData['classes'][0];
    team.appendChild(teamNum);

    version = document.getElementById("version");
    versionNum = document.createElement("h3");
    versionNum.innerHTML = returnData['classes'][1];
    version.appendChild(versionNum);

    release = document.getElementById("release");
    releaseNum = document.createElement("h3");
    releaseNum.innerHTML = returnData['classes'][2];
    release.appendChild(releaseNum);

    prodName = document.getElementById("name");
    nameNum = document.createElement("h3");
    nameNum.innerHTML = returnData['classes'][3];
    prodName.appendChild(nameNum);

    desc = document.getElementById("desc");
    descNum = document.createElement("h3");
    descNum.innerHTML = returnData['classes'][4];
    desc.appendChild(descNum);

}