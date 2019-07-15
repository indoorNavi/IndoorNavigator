// i changed the code to support jquery

function CreateTableFromJson() {

  //this function reads from the beaconsinfo.json file - incomplete
    // var beacons = $.getJSON("JSON/beaconsinfo.json", 
    //     function () {
    //         console.log("success!");
    //     }
    // );

  //added coordinates
  var beacons = [
    {
      Name: "coconut",
      Identifier: "396bd51656c5208be950c6682787983f",
      //"Tags" : "0",
      UUID: "11ACF7E9-6D5A-4790-8F43-243DFE083A57",
      RSSI: "11ACF7E9-6D5A-4790-8F43-243DFE083A57",
      Coordinates :"0 , 0"
      //"Major" : "0",
      //"Minor" : "0",
    },
    {
      Name: "blueberry",
      Identifier: "a2904b520f5e0fbf8473fee567282d",
      //"Tags" : "0",
      UUID: "B6559F92-9D89-462F-8B1F-3F70CAADA912",
      RSSI: "B6559F92-9D89-462F-8B1F-3F70CAADA912",
      Coordinates :"1 , 0"
      //"Major" : "0",
      //"Minor" : "0",
    },
    {
      Name: "ice",
      Identifier: "4cf1c33762d96f5f18da9185422d4c03",
      //"Tags" : "0",
      UUID: "8912BA10-776B-4EA5-B64E-E8A3154B1F13",
      RSSI: "8912BA10-776B-4EA5-B64E-E8A3154B1F13",
      Coordinates :"0 , 1"
      //"Major" : "0",
      //"Minor" : "0",
    },
    {
      Name: "mint",
      Identifier: "f03c2b0e1d482b6cffff39ea8b80e51b",
      //"Tags" : "0",
      UUID: "4264BEA3-D32C-4029-BE05-A5FF9A43979C",
      RSSI: "4264BEA3-D32C-4029-BE05-A5FF9A43979C",
      Coordinates :"1 , 1"
      //"Major" : "0",
      //"Minor" : "0",
    }
  ];

  console.log(beacons.length);

  // create html table
  var table = "<table>";
  table += "<tr><th>" + "Name" + "</th><th>" + "Identifier" + "</th><th>" + "UUID"  + "</th><th>" + "RSSI" + "</th></tr>";

  for (var i = 0; i < beacons.length; i++) {
    var tr = "<tr><td>" + beacons[i].Name + "</td><td>" +  + "</td></tr>";  // put name in table row, parsed from beacon data
    table += tr; //add to table
}

    table += "</table>"; // close table

  var divContainer = $("#showData"); // Instead of using document.getElementById("showData"); , jQuery allows us to use $ as a shortcut for document
  divContainer.append(table); // Jquery uses append
}
