var serial; // variable to hold an instance of the serialport library
var portName = '/dev/tty.usbmodem14601' //rename to the name of your port
var datain; //some data coming in over serial!
var xPos = 0;


function setup() {
  serial = new p5.SerialPort();       // make a new instance of the serialport library
  serial.on('list', printList);       // set a callback function for the serialport list event
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen);        // callback for the port opening
  serial.on('data', serialEvent);     // callback for when new data arrives
  serial.on('error', serialError);    // callback for errors
  serial.on('close', portClose);      // callback for the port closing
 
  serial.list();                      // list the serial ports
  serial.open(portName);              // open a serial port
  createCanvas(1200, 800);
  background(0x08, 0x16, 0x40);
}
 
// get the list of ports:
function printList(portList) {
 // portList is an array of serial port names
 for (var i = 0; i < portList.length; i++) {
 // Display the list the console:
   print(i + " " + portList[i]);
 }
}

function serverConnected() {
  print('connected to server.');
}
 
function portOpen() {
  print('the serial port opened.')
}
 
function serialError(err) {
  print('Something went wrong with the serial port. ' + err);
}
 
function portClose() {
  print('The serial port closed.');
}

inData = 0;
function serialEvent() {
  if (serial.available()) {
      inData = serial.read();
    var datastring = serial.readLine(); // readin some serial
    var newarray;
    try {
        newarray = JSON.parse(datastring); // can we parse the serial
      } catch(err) {
            //console.log(err);
    }
    if (typeof(newarray) == 'object') {
        dataarray = newarray;
    }
    console.log("got back " + datastring);
  }
}

value = 0;
function keyPressed() {
	if (keyCode === LEFT_ARROW) {
    value = 180;
    serial.write(value);
  } else if (keyCode === RIGHT_ARROW) {
    value = 0;
    serial.write(value);
  }
}

function draw() {
  background(255, 204, 0)
  ellipse(dataarray[0],dataarray[1],50,50)
}


function graphData(newData) {
  // map the range of the input to the window height:
  var yPos = map(newData, 0, 1023, 0, height);
  // draw the line in a pretty color:
  stroke(255, 0, 80);
  line(xPos, height, xPos, height - yPos);
  // at the edge of the screen, go back to the beginning:
  if (xPos >= width) {
    xPos = 0;
    // clear the screen by resetting the background:
    background(0x08, 0x16, 0x40);
  } else {
    // increment the horizontal position for the next reading:
    xPos++;
  }
}