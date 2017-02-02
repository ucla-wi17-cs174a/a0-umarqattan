
var canvas;
var gl;
var points = [];
var colorIndex = 0;
var theta = 0;
var thetaLoc, vColorLoc, MvMatrixLoc, perspectiveMatrixLoc, perspectiveMatrix; 
var Identity4By4 = mat4(1); 
var displayCrossHairs = false;
var x = 0;
var y = 0;
var z =  -45;
var heading = 0;
var aspect = 0;
var fovx =  90;
var near = 0.5; 
var far = 70;
var number_cubies = 8;

var vertices_index = [

    vec3(-1, -1, 1),
    vec3(-1, -1, -1),
    vec3(1, -1, -1),
    vec3(1, 1, -1),
    vec3(1, -1, 1),
    vec3(1, 1, 1),
    vec3(-1, 1, 1),
    vec3(1, 1, -1),
    vec3(-1, 1, -1),
    vec3(-1, -1, -1),
    vec3(-1, 1, 1),
    vec3(-1, -1, 1),
    vec3(1, -1, 1),
    vec3(1, -1, -1)

];

var outline_index = [
    vec3( -1, -1,  1 ),
    vec3( -1,  1,  1 ),
    vec3( -1,  1,  1 ),
    vec3(  1,  1,  1 ),
    vec3(  1,  1,  1 ),
    vec3(  1, -1,  1 ),
    vec3(  1, -1,  1 ),
    vec3( -1, -1,  1 ),
    vec3( -1, -1,  1 ),
    vec3( -1, -1, -1 ),
    vec3( -1,  1,  1 ),
    vec3( -1,  1, -1 ),
    vec3(  1,  1,  1 ),
    vec3(  1,  1, -1 ),
    vec3(  1, -1,  1 ),
    vec3(  1, -1, -1 ),
    vec3( -1,  1, -1 ),
    vec3(  1,  1, -1 ),
    vec3(  1,  1, -1 ),
    vec3(  1, -1, -1 ),
    vec3(  1, -1, -1 ),
    vec3( -1, -1, -1 ),
    vec3( -1, -1, -1 ),
    vec3( -1,  1, -1 )
];

// 8 colors for 8 cubies
var vertexColors = [
        [ 0.0, 0.0, 0.0,   0.5 ],   // gray
        [ 1.0, 0.0, 0.0,   1.0 ],   // red
        [ 1.0, 1.0, 0.0,   1.0 ],   // yellow
        [ 0.0, 1.0, 0.0,   1.0 ],   // green
        [ 0.0, 0.0, 1.0,   1.0 ],   // blue
        [ 1.0, 0.0, 1.0,   1.0 ],   // magenta
        [ 1.0, 0.75, 0.75, 1.0 ],   // pink
        [ 0.0, 1.0, 1.0,   1.0 ]    // cyan
    ];

// BEGIN HELPER FUNCTIONS

var reset = function () 
{
    x = 0;
    y = 0;
    z = -45;
    fovx = 90;
    heading = 0;
    
    // If there is a drawCrossHairs, then remove it
    if (displayCrossHairs) {
        displayCrossHairs = !displayCrossHairs;
    }
    
};

var configureCrossHairs = function() 
{
    gl.uniform4fv(vColorLoc, [1.0, 1.0, 1.0, 1.0])
    gl.uniform1f(thetaLoc, 0);
    gl.uniformMatrix4fv(perspectiveMatrixLoc, false, flatten(ortho(-1.0 *  aspect, 1.0 *  aspect, -1.0, 1.0, 0, 1.0)));
    gl.uniformMatrix4fv(MvMatrixLoc, false, flatten(Identity4By4));
    gl.disable(gl.DEPTH_TEST);
    gl.drawArrays(gl.LINES, vertices_index.length + outline_index.length, 4);
};

// END HELPER FUNCTIONS

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }


    for ( var i = 0; i < vertices_index.length; i++ ) {
        points.push( vertices_index[i] );        
    }

    // [4.] Draw each cube’s outline (the edges) in white so the faces are apparent 
    // (needed because there is no lighting in this assignment)

    for (var i = 0; i < outline_index.length; i++) {
        points.push ( outline_index[i]);
    }

    points.push(vec3(-0.03, 0, 0));
    points.push(vec3( 0.03, 0, 0));
    points.push(vec3( 0,-0.03, 0));
    points.push(vec3( 0, 0.03, 0));

    // [2]. Set up a WebGL capable HTML canvas able to display without error. 
    // Its size should be at least 960x540 and should have the z-buffer enabled 
    // and cleared to a black background. Implement necessary shader codes without error
    
    // Limit the view port to the width and height of the canvas
    gl.viewport( 0, 0, canvas.width, canvas.height );

    // Color the background canvas black
    gl.clearColor( 0, 0, 0, 1 );

    
    // [6.] The cubes should display in a square aspect ratio (they should not be stretched 
    // or squeezed when displayed)
     aspect = canvas.width/canvas.height;
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    

    var vBuffer = gl.createBuffer();

    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );

    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );

    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation(program, "theta"); 
    vColorLoc = gl.getUniformLocation(program, "vColor");
    MvMatrixLoc = gl.getUniformLocation(program, "MvMatrix");
    perspectiveMatrixLoc = gl.getUniformLocation(program, "perspectiveMatrix");

    // [5.] The ‘c’ key should cycle the colors between the cubes
    // [7.] Implement a simple cameraNavigator navigation system using the keyboard. 
    // Up and down arrow keys should control the position of the cameraNavigator 
    // along the Y axis (+Y is up and -Y is down by default in WebGL). 
    // Each key press should adjust position by 0.25 units.
    // [8.] The left and right arrow keys control the heading (azimuth, like twisting 
    // your neck to say 'no') of the   Each key press should rotate the 
    // heading by four (4) degrees

    // [9.] The letters i, j, k and m control forward, left, right and backward, respectively,
    // relative to the cameraNavigator's current heading. Each key press should adjust position by 
    // 0.25 units. The ‘r’ key should reset the view to the start position (recall, the 
    // start position is defined only in that all cubes are visible and the eye be positioned along the Z axis)

    // [10.] The ‘n’ and ‘w’ keys should adjust the horizontal field of view (FOV) narrower or wider. One (1) 
    // degree per key press. Keep the display of your scene square as the FOV changes

    // [11.] The ‘+’ key should toggle the display of an orthographic projection of a cross hair 
    // centered over your scene. The cross hairs themselves can be a simple set of lines 
    // rendered in white

    var CYCLE      = 'c';
    var RESET      = 'r';
    var FORWARD    = 'i';
    var BACKWARD   = 'm';
    var LEFTWARD   = 'j';
    var RIGHTWARD  = 'k';
    var NARROW     = 'n';
    var WIDE       = 'w';
    var CROSSHAIRS = '+';
    var UP         = 38;
    var DOWN       = 40;
    var LEFT       = 37;
    var RIGHT      = 39;

    window.onkeypress = function(event)
    {
        var dTheta = radians(heading);
        var dx = 0.25*Math.cos(dTheta);
        var dz = 0.25*Math.sin(dTheta);
        var key = String.fromCharCode(event.keyCode).toLowerCase();
        if (key == CYCLE)
        {
            colorIndex++;
        }
        else if (key == RESET)
        {
            reset();
        }
        else if (key == FORWARD)
        {
            z += dx; x -= dz;
        }
        else if (key == BACKWARD)
        {
            z -= dx; x += dz;
        }
        else if (key == LEFTWARD)
        {
            x += dx; z += dz;
        }
        else if (key == RIGHTWARD)
        {
            x -= dx; z -= dz;
        }
        else if (key == NARROW)
        {
            fovx -= 1;
        }
        else if (key == WIDE)
        {
            fovx += 1;
        }
        else if (key == CROSSHAIRS)
        {
            displayCrossHairs = !displayCrossHairs;
        }
        else 
        {
            return;

        }
    };

    window.onkeydown = function(event) {
        var key = event.keyCode;
        if (key == UP)
        {
            y -= 0.25;
        }
        else if (key == DOWN)
        {
            y += 0.25;
        }
        else if (key == LEFT)
        {
            heading -= 1;
        }
        else if (key == RIGHT)
        {
            heading += 1;
        }
        else
        {
            return;
        }
    }
    render();
        
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);


    // [EXTRA CREDIT 4.] Smoothly, continuously and individually rotate and scale each of the
    // cubes while the application is running. The rotation of each cube can be around any axis you choose.
    //  The rotation speed should be constant and should be 20 rpm 
      
    theta += 2.0;
    gl.uniform1f(thetaLoc, theta);

    // Update the perspective matrix using the given field of view / aspect ratio
    perspectiveMatrix = perspective( fovx /  aspect,  aspect,  near,  far);
    gl.uniformMatrix4fv(perspectiveMatrixLoc, false, flatten(perspectiveMatrix));



    // Multiply rotation matrix, about y, with the translation matrix
    var u = rotate( heading, [0, 1, 0]);
    var v = translate( x,  y,  z);
    var viewMatrix = mult(u, v);

    // [EXTRA CREDIT 1] Instance each of the eight cubes from the same geometry data

    // [3.] Display eight (8) unit cubes using a symmetric perspective projection. Each of the eight cubes should be centered 
    // at (+/- 10, +/- 10, +/- 10) from the origin. Each of the eight cubes should be drawn with a different color. 
    // You can use any colors except black or white. All eight cubes should be visible from an initial cameraNavigator position 
    // along the Z axis
    var translations = [
        translate(10, 10, 10),
        translate(10, 10, -10),
        translate(10, -10, 10),
        translate(10, -10, -10),
        translate(-10, 10, 10),
        translate(-10, 10, -10),
        translate(-10, -10, 10),
        translate(-10, -10, -10)
    ];

    for(var i = 0; i < translations.length; i++)
    {
        
        
        gl.uniformMatrix4fv(MvMatrixLoc, false, flatten(mult(viewMatrix, translations[i])));
        vColor = vertexColors[(colorIndex + i)%number_cubies];
        gl.uniform4fv(vColorLoc, vColor)


        // [EXTRA CREDIT 2]. Implement the cube geometry as a single triangle strip primitive
        gl.drawArrays( gl.TRIANGLE_STRIP, 0, vertices_index.length );
        vColor = [1, 1, 1, 1]
        gl.uniform4fv(vColorLoc, vColor);
        gl.drawArrays( gl.LINES, vertices_index.length, outline_index.length );
    }

    if(displayCrossHairs)
    {
        configureCrossHairs();
    }
    
    requestAnimFrame( render );
}


