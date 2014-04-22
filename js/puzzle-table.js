/*jslint browser:true, devel:true, white:true, vars:true, eqeq:true */

//define the table cell width
var CELLWIDTH = 60;
//candidate icons
var icons = ['sa', 'sg', 'sr', 'ta', 'tg', 'tr'];
//current icon in flooded cell
var curIcon = '';
//save the info of each cell. include dom(html dom of the cell), x, y
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
        if (donelist[i] == k) {
            //k is already in donelist
            return;
        }
    }
    donelist.push(k);
}

//if cell's icon is the same as curIcon, treat it as neighbor
//and change the dom background color to transparent.
function filterNeighbor(k) {
    if (k.done || k.dom.firstChild.src == curIcon) {
        k.done = true;
        k.dom.style.backgroundColor = 'transparent';
        addNeighbor(k);
    }
}

//check cell's neighbor on left right up down side
function addNeighbors(t) {
    if (t.x > 0) {
        filterNeighbor(data[t.x - 1][t.y]);
    }
    if (t.x < data.length - 1) {
        filterNeighbor(data[t.x + 1][t.y]);
    }
    if (t.y > 0) {
        filterNeighbor(data[t.x][t.y - 1]);
    }
    if (t.y < data[t.x].length - 1) {
        filterNeighbor(data[t.x][t.y + 1]);
    }
    //imply t is in donelist and being checked.
    t.checked = true;
}

//called by updateCells() and clickCell() to render the cell.
function changeIcon() {
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
    //find the cell's neighbors with the icon.
    while (donelist.length > 0) {
        var t = donelist.pop();
        t.dom.firstChild.src = curIcon;
        t.dom.style.backgroundColor = 'transparent';
        addNeighbors(t);
    }
}

//initiate the cells' icon, prepare the start cell on left top.
//parameter data store all the cells' info, each item stores a row of table.
function updateCells(data) {
    var drow;
    for (var i = 0; i < data.length; i++) {
        drow = data[i];
        for (var j = 0; j < drow.length; j++) {
            //create random icon and set each array items' dom attribute.
            var c = icons[parseInt(Math.random() * icons.length)];
            var img = document.createElement('img');
            img.src = 'images/' + c + '.ico';
            img.style.width = CELLWIDTH + 'px';
            img.style.height = CELLWIDTH + 'px';
            drow[j].dom.innerHTML = '';
            drow[j].dom.appendChild(img);
            //indicate the cell hasn't been played with (not flooded)
            drow[j].done = false;
        }
    }
    //indicate the start cell has been flooded
    data[0][0].done = true;
    data[0][0].dom.style.backgroundColor = 'transparent';
    curIcon = data[0][0].dom.firstChild.src;
    changeIcon();
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
    f.innerHTML = '';
    data = [];      //save the info of each cell.
    var row, drow, square;
    for (var i = 0; i < y; i++) {
        row = document.createElement('tr');
        drow = [];
        for (var j = 0; j < x; j++) {
            square = document.createElement('td');
            // maybe we can change the aspect of the square/cell here.
            square.setAttribute('class', 'cell slowchange');
            square.style.width = CELLWIDTH + 'px';
            square.style.height = CELLWIDTH + 'px';
            square.style.minWidth = CELLWIDTH + 'px';
            square.onclick = clickCell;
            row.appendChild(square);
            drow[j] = {
                "dom": square,
                "x": i,
                "y": j
            };
        }
        data[i] = drow;
        f.appendChild(row);
    }
    updateCells(data);
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
    if (this.firstChild.src != curIcon &&
        this.style.backgroundColor != 'transparent') {
        incCounter();
        curIcon = this.firstChild.src;
        changeIcon();
    }
}

// start a new game
function resetGame() {
    makeCells(data);
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