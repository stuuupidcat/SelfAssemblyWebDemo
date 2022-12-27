function createAgent(ID, x, y) {
    //create an agent with the given ID.
    //and place it at the (x, y) grid cell.
    var agent = document.createElement("div");
    agent.className = "agent";
    agent.id = "agent_" + ID;
    agent.textContent = ID;
    agent.x = x;
    agent.y = y;
    document.getElementById("grid_cell_" + x + "_" + y).appendChild(agent);

    //make the agent a little smaller than the grid cell.
    agent.style.width = "70%";
    agent.style.height = "70%";

    //set the left and top margins to center the agent in the grid cell.
    agent.style.marginLeft = "15%";
    agent.style.marginTop = "15%";

    //set the text in the center of the agent.
    agent.style.textAlign = "center";
    agent.style.verticalAlign = "middle";

    if (res && res.grid_size_x < 40) {
        agent.style.fontSize = "15px";
    }
    else if (res && res.grid_size_x < 80) {
        agent.style.fontSize = "8px";
    }
    else {
        agent.style.fontSize = "0px";
    }

    //add shadow to the agent.
    agent.style.boxShadow = "0px 0px 10px 0px rgba(0,0,0,0.75)";
}



function createGrid(grid_size_x, grid_size_y) {
    //use css grid.
    //the grid has grid_size_x rows and grid_size_y columns.
    //each grid cell is 960/grid_size_x pixels wide and 960/grid_size_y pixels high.

    //create grid_size_x * grid_size_y divs and add them to the grid div.
    
    var grid_env = document.getElementById("grid_environment");
    //clear all the grid_cell and agent divs.
    grid_env.innerHTML = "";

    for (var i = 0; i < grid_size_x; i++) {
        for (var j = 0; j < grid_size_y; j++) {
            var grid_cell = document.createElement("div");
            grid_cell.className = "grid_cell";
            grid_cell.id = "grid_cell_" + i + "_" + j;
            //add shadow to the grid cell.
            //grid_cell.style.boxShadow = "0px 0px 10px 0px rgba(0,0,0,0.75)";
            if (res && res["grid_cell_" + i + "_" + j]) {
                grid_cell.style.backgroundColor = "#83c1ff";
            }

            grid_env.appendChild(grid_cell);
        }
    }

    //set grid_env x*y grid, use repeat() function.
    grid_env.style.gridTemplateColumns = "repeat(" + grid_size_y + ", 1fr)";
    grid_env.style.gridTemplateRows = "repeat(" + grid_size_x + ", 1fr)";

    //set the width and height of the grid environment.
    grid_env.style.width = "1200px";
    grid_env.style.height = "1200px";

    //set the width and height of the grid cells.
    var grid_cells = document.getElementsByClassName("grid_cell");
    for (var i = 0; i < grid_cells.length; i++) {
        grid_cells[i].style.width = (1200 / grid_size_y) + "px";
        grid_cells[i].style.height = (1200 / grid_size_x) + "px";
    }

}

function turnShapeColor(res) {
        var color;
        if (res['max_occupancy'] < 0.99999) {
            color = "#ff0000";
        }
        else {
            color = "#00ff00";
        }

        for (var i = 0; i < res.grid_size_x; i++) {
            for (var j = 0; j < res.grid_size_y; j++) {
                if (res["grid_cell_" + i + "_" + j]) {
                    var grid_cell = document.getElementById("grid_cell_" + i + "_" + j);
                    grid_cell.style.backgroundColor = color;
                }
            }
        }
        setTimeout(function () {
            for (var i = 0; i < res.grid_size_x; i++) {
                for (var j = 0; j < res.grid_size_y; j++) {
                    if (res["grid_cell_" + i + "_" + j]) {
                        var grid_cell = document.getElementById("grid_cell_" + i + "_" + j);
                        grid_cell.style.backgroundColor = "#83c1ff";
                    }
                }
            }
        }, 1000);
}

var cur_step = 0;
var res; //json_res

$(document).ready(function () {
    var cur_step = 0;

    createGrid(32, 32);
    
    createAgent(1, 16, 16);
    
    document.querySelector("#file-input").addEventListener('change', function() {
        // files that user has chosen
        var all_files = this.files;
        if(all_files.length == 0) {
            alert('Error : No file selected');
            return;
        }
    
        // first file selected by user
        var file = all_files[0];
    
        // files types allowed
        var allowed_types = [ 'text/plain' ];
        if(allowed_types.indexOf(file.type) == -1) {
            alert('Error : Incorrect file type');
            return;
        }
    
    
    
        // file validation is successfull
        // we will now read the file
    
        var reader = new FileReader();
    
        // file reading started
        reader.addEventListener('loadstart', function() {
            document.querySelector("#file-input-label").style.display = 'none'; 
        });
    
        // file reading failed
        reader.addEventListener('error', function() {
            alert('Error : Failed to read file');
        });
    
        // file read progress 
        reader.addEventListener('progress', function(e) {
            if(e.lengthComputable == true) {
                document.querySelector("#file-progress-percent").innerHTML = Math.floor((e.loaded/e.total)*100);
                document.querySelector("#file-progress-percent").style.display = 'block';
            }
        });
    
        // read as text file
        reader.readAsText(file);

        // file reading finished successfully
        reader.addEventListener('load', function(e) {
            text = e.target.result;
            res = JSON.parse(text);
            
            document.querySelector("#file-input-label").style.display = 'block';
            createGrid(res.grid_size_x, res.grid_size_y);
            cur_step = 0;
            for (var i = 0; i < res.agent_number; i++) {
                var x = res["agent_" + i][0][0];
                var y = res["agent_" + i][0][1];
                createAgent(i, x, y);
            }
        });
    });

    $("#next_step").click(function () {
        cur_step = cur_step + 1;
        if (cur_step >= res.step_number) {
            cur_step = res.step_number-1;
        }
        for (var i = 0; i < res.agent_number; i++) {
            var x = res["agent_" + i][cur_step][0];
            var y = res["agent_" + i][cur_step][1];
            var agent = document.getElementById("agent_" + i);
            agent.x = x;
            agent.y = y;
            document.getElementById("grid_cell_" + x + "_" + y).appendChild(agent);
        }
        if (cur_step == res.step_number-1) {
            turnShapeColor(res);
        }
    });

    $("#last_step").click(function () {
        //move the agents to the previous step.
        cur_step = cur_step - 1;
        if (cur_step < 0) {
            cur_step = 0;
        }
        for (var i = 0; i < res.agent_number; i++) {
            var x = res["agent_" + i][cur_step][0];
            var y = res["agent_" + i][cur_step][1];
            var agent = document.getElementById("agent_" + i);
            agent.x = x;
            agent.y = y;
            document.getElementById("grid_cell_" + x + "_" + y).appendChild(agent);
        }
    });

    $("#start").click(function () {
        //start the animation.
        interval = setInterval(function () {
            cur_step = cur_step + 1;
            if (cur_step >= res.step_number) {
                cur_step = res.step_number-1;
            }
            for (var i = 0; i < res.agent_number; i++) {
                var x = res["agent_" + i][cur_step][0];
                var y = res["agent_" + i][cur_step][1];
                var agent = document.getElementById("agent_" + i);
                agent.x = x;
                agent.y = y;
                document.getElementById("grid_cell_" + x + "_" + y).appendChild(agent);
            }
            if (cur_step == res.step_number-1) {
                turnShapeColor(res);
                clearInterval(interval);
            }
        }, 300);
    });

    $("#stop").click(function () {
        //stop the animation.
        clearInterval(interval);
    });

});