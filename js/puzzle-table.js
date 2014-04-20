/*jslint browser:true, devel:true, white:true, vars:true, eqeq:true */

var colors = ["red", "blue", "green", "yellow", "darkred", "violet"];
var background = '';
var data = [];
var donelist = [];

function addNeighbor(k)
{
    if (k.checked) {
        return;
    }
    for (var i=0; i<donelist.length; i++) {
        k.done = true;
        if (donelist[i] == k) {
            return;
        }
    }
    donelist.push(k);
}

function checkColor(k)
{
    if (k.done || k.dom.color == background) {
        k.done = true;
        k.dom.color = 'transparent';
        k.dom.style.backgroundColor = 'transparent';
        addNeighbor(k);
    }
}

function addNeighbors(t)
{
    if (t.x > 0) {
        checkColor(data[t.x-1][t.y]);
    }
    if (t.x < data.length-1) {
        checkColor(data[t.x+1][t.y]);
    }
    if (t.y > 0) {
        checkColor(data[t.x][t.y-1]);
    }
    if (t.y < data[t.x].length-1) {
        checkColor(data[t.x][t.y+1]);
    }
    t.checked = true;
}


function doColor(color)
{
    var f = document.getElementById('field');
    background = color;
    donelist=[];
    for (var i=0; i<data.length; i++) {
        for (var j=0; j<data[i].length; j++) {
            data[i][j].checked = false;
            if (data[i][j].done) {
                donelist.push(data[i][j]);
            }
        }
    }

    f.style.backgroundColor = color;
    f.color = color;
    while (donelist.length > 0) {
        var t = donelist.pop();
        addNeighbors(t);
    }
}


function colorCells(data)
{
    for (var i=0; i<data.length; i++) {
        var drow = data[i];
        if (i === 0){
            drow[0].dom.innerHTML = "start";
        }
        for (var j=0; j<drow.length; j++) {
            var c = colors[parseInt(Math.random()*colors.length)];
            drow[j].dom.style.backgroundColor = c;
            drow[j].dom.color = c;
            drow[j].done = false;
        }
    }
    var f = document.getElementById('field');
    background = data[0][0].dom.color;
    f.style.backgroundColor = background;
    data[0][0].done = true;
    data[0][0].dom.style.backgroundColor = 'transparent';
    data[0][0].dom.color = 'transparent';
    doColor(background);
}

function resetCounter()
{
    var counter = document.getElementById('counter');
    counter.innerHTML = "0";
}

function incCounter()
{
    var counter = document.getElementById('counter');
    var cur = parseInt(counter.innerHTML);
    counter.innerHTML = String(cur+1);
}

function clickCell()
{
    if (this.color != background && this.color != 'transparent') {
        incCounter();
        doColor(this.color);
    }
}
/*Modify to recieve the device width and create the appropriate puzzle*/
//function makeCells(x, y)
function makeCells()
{
    var x = window.innerWidth / 60;
    var y = x;

    //For setting the row size for desktop browsers or landscape orientation
    if (x >= 14){
       y=13;
    }

    var f = document.getElementById('field');
    data = [];
    for (var i=0; i<y; i++) {
        var row = document.createElement('tr');
        var drow = [];
        for (var j=0; j<x; j++) {
            var square = document.createElement('td');
            square.setAttribute('class', 'cell slowchange');
            square.onclick = clickCell;
            row.appendChild(square);
            drow[j] = { "dom": square, "color": '', "x": i, "y": j};
        }
        data[i] = drow;
        f.appendChild(row);
    }
    colorCells(data);
}

function clickColor()
{
    doColor(this.style.backgroundColor);
}

function resetGame()
{
    colorCells(data);
    resetCounter();
}
