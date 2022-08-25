var stovemap = L.map('StoveMap').setView([20.5937, 78.9629], 5);
//attribution
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

//tiles used to create map
const tileURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileURL, {
    attribution
});
tiles.addTo(stovemap);

//icons of stove
var StoveIconOn = L.icon({
    iconUrl: 'StoveIconOn.png',
    iconSize: [20, 40],
    iconAnchor: [10, 40],
    popupAnchor: [0, -40]
});
var StoveIconOff = L.icon({
    iconUrl: 'StoveIconOff.png',
    iconSize: [20, 40],
    iconAnchor: [10, 40],
    popupAnchor: [0, -40]
});

//API Information to pull stove data from
//const API = ''

//stove data 
var stovepoint = [
    [827136871263916, "Stove 2", 21.1702, 72.8311, "9/11/20", "12:31", 23, 66, 4, 62, "On"],
    [12345678, "Stove 2", 19.9975, 73.7898, "9/11/20", "12:31", 34, 66, 4, 62, "Off"],
    [983242312, "Stove 2", 19.0760, 72.8777, "9/11/20", "12:31", 23, 66, 4, 62, "On"],
    [01923798341, "Stove 2", 12.2958, 76.6394, "9/11/20", "12:31", 23, 66, 4, 62, "Off"],
    [469723497234, "Stove 2", 22.7196, 75.8577, "9/11/20", "12:31", 23, 66, 4, 62, "On"],
    [08326423, "Stove 2", 23.2599, 77.4126, "9/11/20", "12:31", 23, 66, 4, 62, "Off"],
    [62197391231, "Stove 2", 12.9716, 77.5946, "9/11/20", "12:31", 23, 66, 4, 62, "Off"],
    [5432749, "Stove 2", 13.0827, 80.2707, "9/11/20", "12:31", 23, 66, 4, 62, "On"],
    [782391312, "Stove 2", 28.7041, 77.1025, "9/11/20", "12:31", 23, 66, 4, 62, "Off"],
    [09872304, "Stove 2", 17.6868, 83.2185, "9/11/20", "12:31", 23, 66, 4, 62, "On"],
    [7283479874082, "Stove 2", 17, 75, "9/11/20", "12:31", 23, 66, 4, 62, "On"],

];

//Function to pull and map stove data using mqtt

async function PullData() {
    //const response = await fetch(API);
    //const data = await response.json();
    //info = data.information;
    info = [827136871263916, "Stove 2", 17, 75, "9/11/20", "12:31", 8686868686886, 66, 4, 62, "On"]
    for (var k = 0; k <= stovepoint.length; k++) {
        // add new data to array
        if (k == stovepoint.length) {
            stovepoint.push(info);
            break;
        }
        // update existing data in array
        else if (stovepoint[k][0] == info[0]) {
            stovepoint[k].length = 0;
            stovepoint[k].push.apply(stovepoint[k], info);
            break;
        }
        //compare new stove with the next stove in array
        else {
            continue;
        }
    }

    //iterations of mapping each stove location and data
    for (var i = 0; i < stovepoint.length; i++) {
        //Status On
        if (stovepoint[i][10] == "On") {
            marker = new L.marker([stovepoint[i][2], stovepoint[i][3]], {
                    icon: StoveIconOn,
                    title: stovepoint[i][1],
                })
                .addTo(stovemap)
                .bindPopup("Serial Number: " + String(stovepoint[i][0]));
        }
        //Status Off
        else {
            marker = new L.marker([stovepoint[i][2], stovepoint[i][3]], {
                    icon: StoveIconOff,
                    title: stovepoint[i][1],
                })
                .addTo(stovemap)
                .bindPopup("Serial Number: " + String(stovepoint[i][0]));
        }
    }
}

//function to search stoves
function SearchSerial() {
    var SN = document.getElementById("SerialNumber").value;
    for (var j = 0; j < stovepoint.length; j++) {
        if (stovepoint[j][0] == SN) {
            stovemap.flyTo([stovepoint[j][2], stovepoint[j][3]], 16, {
                animate: true,
                duration: 2
            });
            document.getElementById("SN").innerHTML = "Serial Number: " + String(stovepoint[j][0]);
            document.getElementById("STN").innerHTML = "Stove Number:  " + String(stovepoint[j][1]);
            document.getElementById("LA").innerHTML = "Latitude:  " + String(stovepoint[j][2]);
            document.getElementById("LO").innerHTML = "Longitude:  " + String(stovepoint[j][3]);
            document.getElementById("D").innerHTML = "Date:  " + String(stovepoint[j][4]);
            document.getElementById("T").innerHTML = "Time:  " + String(stovepoint[j][5]);
            document.getElementById("BT").innerHTML = "Start Temperature(°C):  " + String(stovepoint[j][6]);
            document.getElementById("ET").innerHTML = "Stop Temperature(°C):  " + String(stovepoint[j][7]);
            document.getElementById("TWH").innerHTML = "Total Working Hours:  " + String(stovepoint[j][8]);
            document.getElementById("ECE").innerHTML = "Estimated Carbon Emissions(%):  " + String(stovepoint[j][9]);
            document.getElementById("S").innerHTML = "Status:  " + String(stovepoint[j][10]);
            break;
        }
    }
}

//scale 
L.control.scale({
    maxWidth: 240,
    metric: true,
    position: 'bottomleft'
}).addTo(stovemap);

//Actication of necessary functions(Pulling and Refreshing Data)
PullData();
setInterval(PullData, 6000);