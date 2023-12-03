//@ts-nocheck

"use client";

import React, { useEffect, useRef } from "react";

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(
      "Failed to compile " + type + " shader: " + gl.getShaderInfoLog(shader)
    );
  }

  return shader;
}

function createProgram(gl, vertex, fragment) {
  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(
      "Unable to initialize the program: " + gl.getProgramInfoLog(program)
    );
  }

  return program;
}

function createBuffers(gl) {
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  const positions = [
    -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const surfaceBuffer = gl.createBuffer();

  return {
    vertex: vertexBuffer,
    surface: surfaceBuffer,
  };
}

function calculateSurface(gl, buffers) {
  let width = gl.canvas.width / gl.canvas.height;
  let halfWidth = width * 0.5;

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.surface);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -halfWidth,
      -0.5,
      halfWidth,
      -0.5,
      -halfWidth,
      0.5,
      halfWidth,
      -0.5,
      halfWidth,
      0.5,
      -halfWidth,
      0.5,
    ]),
    gl.STATIC_DRAW
  );
}

function drawScene(gl, programInfo, buffers, uniforms, delta_ms) {
  gl.useProgram(programInfo.program);

  if (programInfo.attribLocations.surfacePosition != -1) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.surface);
    gl.vertexAttribPointer(
      programInfo.attribLocations.surfacePosition,
      2,
      gl.FLOAT,
      false,
      0,
      0
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.surfacePosition);
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertex);
  gl.vertexAttribPointer(
    programInfo.attribLocations.position,
    2,
    gl.FLOAT,
    false,
    0,
    0
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.position);

  gl.uniform1f(programInfo.uniformLocations.time, delta_ms / 1000);
  gl.uniform2fv(programInfo.uniformLocations.resolution, [
    gl.canvas.width,
    gl.canvas.height,
  ]);
  Object.entries(uniforms).forEach(([k, v]) => {
    gl["uniform" + v.type](
      programInfo.uniformLocations[k],
      v.get({
        gl,
        delta_ms,
      })
    );
  });

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function ShadePlane({
  vertex = `\
attribute vec3 position;
attribute vec2 surfacePosition;

void main() {
    gl_Position = vec4(position, 1.);
}\
`,
  fragment,
  initialColor = [0, 0, 0, 1],
  extraHeight = 0,
  extraWidth = 0,
  uniforms = {},
}) {
  let canvasRef = useRef();

  useEffect(() => {
    let isRunning = true;
    let gl = canvasRef.current.getContext("webgl");

    if (gl === null) {
      throw new Error("WebGL unavailable.");
    }

    // Initial color clear
    gl.clearColor(...initialColor);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let vertShader = loadShader(gl, gl.VERTEX_SHADER, vertex);
    let fragShader = loadShader(gl, gl.FRAGMENT_SHADER, fragment);
    let program = createProgram(gl, vertShader, fragShader);

    const programInfo = {
      program,
      attribLocations: {
        position: gl.getAttribLocation(program, "position"),
        surfacePosition: gl.getAttribLocation(program, "surfacePosition"),
      },
      uniformLocations: {
        time: gl.getUniformLocation(program, "time"),
        resolution: gl.getUniformLocation(program, "resolution"),
        ...Object.fromEntries(
          Object.entries(uniforms).map(([k, _v]) => {
            return [k, gl.getUniformLocation(program, k)];
          })
        ),
      },
    };

    const buffers = createBuffers(gl);

    function renderLoop(delta_ms) {
      if (!isRunning) return;
      drawScene(gl, programInfo, buffers, uniforms, delta_ms);
      requestAnimationFrame(renderLoop);
    }

    let resizeID = null;

    function doResize() {
      if (!canvasRef.current) {
        return;
      }

      let parent = canvasRef.current.parentElement;
      canvasRef.current.width = parent.offsetWidth + extraWidth;
      canvasRef.current.height = parent.offsetHeight + extraHeight;

      calculateSurface(gl, buffers);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }

    function onResize() {
      clearTimeout(resizeID);
      resizeID = setTimeout(doResize, 100);
    }

    window.addEventListener("resize", onResize);
    doResize();

    if (isRunning) renderLoop(0);

    console.log("[ShadePlane] Ready!");

    return () => {
      console.log("[ShadePlane] Cleaning up...");

      isRunning = false;
      Object.values(buffers).forEach((x) => {
        gl.deleteBuffer(x);
      });
      gl.deleteProgram(program);
      gl.deleteShader(fragShader);
      gl.deleteShader(vertShader);
    };
  }, []);

  return <canvas ref={canvasRef} />;
}

export default ShadePlane;
