/*jslint browser:true, devel:true, white:true, vars:true, eqeq:true */

//define the table cell width
var CELLWIDTH = 60;
//candidate colors
var colors = ["red", "blue", "green", "yellow", "darkred", "violet"];
//save the background color.
var background = '';
//save the info of each cell. include dom(html dom of the cell), color, x, y
var data = [];
//act as a stack to save the flooded cell and neighbors being flooded.
var donelist = [];

// add neighbor to
function addNeighbor(k) {
    if (k.checked) {
        //if k is checked, it's already in the donelist.
        return;
    }
    for (var i = 0; i < donelist.length; i++) {
        //k.done = true;
        if (donelist[i] == k) {
            //k is already in donelist
            return;
        }
    }
    donelist.push(k);
}

//if cell's color is the same as background, treat it as neighbor
//and change the color to transparent and set the dom style.
function checkColor(k) {
    if (k.done || k.dom.color == background) {
        k.done = true;
        k.dom.color = 'transparent';
        k.dom.style.backgroundColor = 'transparent';
        addNeighbor(k);
    }
}

//check cell color on left right up down side
function addNeighbors(t) {
    if (t.x > 0) {
        checkColor(data[t.x - 1][t.y]);
    }
    if (t.x < data.length - 1) {
        checkColor(data[t.x + 1][t.y]);
    }
    if (t.y > 0) {
        checkColor(data[t.x][t.y - 1]);
    }
    if (t.y < data[t.x].length - 1) {
        checkColor(data[t.x][t.y + 1]);
    }
    //imply t is in donelist and being checked.
    t.checked = true;
}

//called by colorCells() and clickCell() to render the cell.
function doColor(color) {
    var f = document.getElementById('field');
    background = color;
    donelist = [];
    //set checked attribute to false, add flooded cell to done list.
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
            data[i][j].checked = false;
            if (data[i][j].done) {
                donelist.push(data[i][j]);
            }
        }
    }
    //set the table's background color and save the color.
    f.style.backgroundColor = color;
    f.color = color;
    //find the cell's neighbors with the color and set color.
    while (donelist.length > 0) {
        var t = donelist.pop();
        addNeighbors(t);
    }
}

//initiate the cells' color, prepare the start cell on left top.
//parameter data store all the cells' info, each item stores a row of table.
function colorCells(data) {
    var drow;
    for (var i = 0; i < data.length; i++) {
        drow = data[i];
        if (i === 0) {
            //the game start from top left.
            drow[0].dom.innerHTML = "start";
        }
        for (var j = 0; j < drow.length; j++) {
            //create random color and set each array items' dom attribute.
            var c = colors[parseInt(Math.random() * colors.length)];
            drow[j].dom.style.backgroundColor = c;
            drow[j].dom.color = c;
            //indicate the cell hasn't been played with (not flooded)
            drow[j].done = false;
        }
    }
    var f = document.getElementById('field');
    background = data[0][0].dom.color;
    //set the table's background color as the start cell's.
    f.style.backgroundColor = background;
    //indicate the start cell has been flooded
    data[0][0].done = true;
    data[0][0].dom.style.backgroundColor = 'transparent';
    data[0][0].dom.color = 'transparent';
    doColor(background);
}

/*Modify to receive the device width and create the appropriate puzzle*/
//function makeCells(x, y)
//x cols, y rows table
function makeCells() {
    var x = Math.floor(window.innerWidth / CELLWIDTH);
    var y = x;

    //For setting the row size for desktop browsers or landscape orientation
    if (x >= 10) {
        y = 10;
    }

    var f = document.getElementById('field');
    data = [];      //save the info of each cell.
    var row, drow, square;
    for (var i = 0; i < y; i++) {
        row = document.createElement('tr');
        drow = [];
        for (var j = 0; j < x; j++) {
            square = document.createElement('td');
            // maybe we can change the aspect of the square/cell here.
            square.setAttribute('class', 'cell slowchange');
            square.onclick = clickCell;
            row.appendChild(square);
            drow[j] = {
                "dom": square,
                "color": '',
                "x": i,
                "y": j
            };
        }
        data[i] = drow;
        f.appendChild(row);
    }
    colorCells(data);
}

// reset the counter to 0.
function resetCounter() {
    var counter = document.getElementById('counter');
    counter.innerHTML = "0";
}

// increase counter by 1.
function incCounter() {
    var counter = document.getElementById('counter');
    var cur = parseInt(counter.innerHTML);
    counter.innerHTML = String(cur + 1);
}

// event handler when click the cells.
function clickCell() {
    if (this.color != background && this.color != 'transparent') {
        incCounter();
        doColor(this.color);
    }
}

// set the color to background color, NOT used.
function clickColor() {
    doColor(this.style.backgroundColor);
}

function resetGame() {
    colorCells(data);
    resetCounter();
}

//initiate game GUI
document.addEventListener('DOMContentLoaded', function() {
    var d = document.getElementsByTagName('div')[0];
    //set the table align center
    d.style.padding = Math.floor(window.innerWidth % CELLWIDTH / 2) + 'px';
    makeCells();
    var start = document.getElementsByClassName('button')[0];
    start.addEventListener('click', resetGame);
});