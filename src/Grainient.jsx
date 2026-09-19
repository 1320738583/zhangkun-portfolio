import React, { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';
import './Grainient.css';

const hexToRgb = hex => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255] : [1, 1, 1];
};

const vertex = `#version 300 es
in vec2 position;
void main(){gl_Position=vec4(position,0.0,1.0);}`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uTimeSpeed;
uniform float uWarpStrength;
uniform float uWarpFrequency;
uniform float uWarpSpeed;
uniform float uWarpAmplitude;
uniform float uRotationAmount;
uniform float uNoiseScale;
uniform float uGrainAmount;
uniform float uGrainScale;
uniform float uContrast;
uniform float uSaturation;
uniform float uZoom;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
out vec4 fragColor;
#define S(a,b,t) smoothstep(a,b,t)
mat2 Rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}
vec2 hash(vec2 p){p=vec2(dot(p,vec2(2127.1,81.17)),dot(p,vec2(1269.5,283.37)));return fract(sin(p)*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);float n=mix(mix(dot(-1.0+2.0*hash(i),f),dot(-1.0+2.0*hash(i+vec2(1.0,0.0)),f-vec2(1.0,0.0)),u.x),mix(dot(-1.0+2.0*hash(i+vec2(0.0,1.0)),f-vec2(0.0,1.0)),dot(-1.0+2.0*hash(i+vec2(1.0)),f-vec2(1.0)),u.x),u.y);return 0.5+0.5*n;}
void main(){
  float t=iTime*uTimeSpeed;
  vec2 uv=gl_FragCoord.xy/iResolution.xy;
  float ratio=iResolution.x/iResolution.y;
  vec2 tuv=(uv-0.5)/max(uZoom,0.001);
  float degree=noise(vec2(t*0.1,tuv.x*tuv.y)*uNoiseScale);
  tuv.y/=ratio;
  tuv*=Rot(radians((degree-0.5)*uRotationAmount+180.0));
  tuv.y*=ratio;
  float amplitude=uWarpAmplitude/max(uWarpStrength,0.001);
  float warpTime=t*uWarpSpeed;
  tuv.x+=sin(tuv.y*uWarpFrequency+warpTime)/amplitude;
  tuv.y+=sin(tuv.x*(uWarpFrequency*1.5)+warpTime)/(amplitude*0.5);
  float x=tuv.x;
  vec3 layer1=mix(uColor3,uColor2,S(-0.36,0.24,x));
  vec3 layer2=mix(uColor2,uColor1,S(-0.32,0.28,x));
  vec3 col=mix(layer1,layer2,S(0.48,-0.32,tuv.y));
  float grain=fract(sin(dot(uv*max(uGrainScale,0.001),vec2(12.9898,78.233)))*43758.5453);
  col+=(grain-0.5)*uGrainAmount;
  col=(col-0.5)*uContrast+0.5;
  float luma=dot(col,vec3(0.2126,0.7152,0.0722));
  col=mix(vec3(luma),col,uSaturation);
  fragColor=vec4(clamp(col,0.0,1.0),1.0);
}`;

export default function Grainient({
  color1 = '#8ba9da',
  color2 = '#949eaf',
  color3 = '#74c1cf',
  timeSpeed = 0.16,
  warpStrength = 0.8,
  warpFrequency = 4.2,
  warpSpeed = 0.42,
  warpAmplitude = 58,
  rotationAmount = 360,
  noiseScale = 1.4,
  grainAmount = 0.055,
  grainScale = 2.1,
  contrast = 1.25,
  saturation = 0.72,
  zoom = 0.9,
  className = '',
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer;
    const isMobile = window.matchMedia('(max-width: 700px)').matches;
    const saveData = Boolean(navigator.connection?.saveData);
    const lowPower = saveData || Boolean(navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
    const maxDpr = isMobile || lowPower ? 1 : 1.25;
    try {
      renderer = new Renderer({ webgl: 2, alpha: true, antialias: false, dpr: Math.min(window.devicePixelRatio || 1, maxDpr), powerPreference: lowPower ? 'low-power' : 'default' });
    } catch {
      container.classList.add('grainient-fallback');
      return;
    }

    const gl = renderer.gl;
    const canvas = gl.canvas;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uTimeSpeed: { value: timeSpeed },
        uWarpStrength: { value: warpStrength },
        uWarpFrequency: { value: warpFrequency },
        uWarpSpeed: { value: warpSpeed },
        uWarpAmplitude: { value: warpAmplitude },
        uRotationAmount: { value: rotationAmount },
        uNoiseScale: { value: noiseScale },
        uGrainAmount: { value: grainAmount },
        uGrainScale: { value: grainScale },
        uContrast: { value: contrast },
        uSaturation: { value: saturation },
        uZoom: { value: zoom },
        uColor1: { value: new Float32Array(hexToRgb(color1)) },
        uColor2: { value: new Float32Array(hexToRgb(color2)) },
        uColor3: { value: new Float32Array(hexToRgb(color3)) },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    const setSize = () => {
      const rect = container.getBoundingClientRect();
      renderer.setSize(Math.max(1, Math.floor(rect.width)), Math.max(1, Math.floor(rect.height)));
      program.uniforms.iResolution.value[0] = gl.drawingBufferWidth;
      program.uniforms.iResolution.value[1] = gl.drawingBufferHeight;
      renderer.render({ scene: mesh });
    };
    const resizeObserver = new ResizeObserver(setSize);
    resizeObserver.observe(container);
    setSize();

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let onscreen = true;
    let pageVisible = !document.hidden;
    let mediaOpen = false;
    let motionAllowed = !reduceMotion.matches && !saveData;
    const startedAt = performance.now();
    const frameInterval = 1000 / (isMobile || lowPower ? 24 : 30);
    let lastRender = 0;
    const loop = time => {
      frame = requestAnimationFrame(loop);
      if (time - lastRender < frameInterval) return;
      lastRender = time;
      program.uniforms.iTime.value = (time - startedAt) * 0.001;
      renderer.render({ scene: mesh });
    };
    const stop = () => { if (frame) cancelAnimationFrame(frame); frame = 0; };
    const start = () => { if (onscreen && pageVisible && motionAllowed && !mediaOpen && !frame) frame = requestAnimationFrame(loop); };
    const intersectionObserver = new IntersectionObserver(([entry]) => { onscreen = entry.isIntersecting; onscreen ? start() : stop(); });
    intersectionObserver.observe(container);
    const onVisibility = () => { pageVisible = !document.hidden; pageVisible ? start() : stop(); };
    const onMotion = () => { motionAllowed = !reduceMotion.matches; motionAllowed ? start() : stop(); };
    const onMediaOpen = () => { mediaOpen = true; stop(); };
    const onMediaClose = () => { mediaOpen = false; start(); };
    document.addEventListener('visibilitychange', onVisibility);
    document.addEventListener('portfolio:media-open', onMediaOpen);
    document.addEventListener('portfolio:media-close', onMediaClose);
    reduceMotion.addEventListener('change', onMotion);
    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      document.removeEventListener('portfolio:media-open', onMediaOpen);
      document.removeEventListener('portfolio:media-close', onMediaClose);
      reduceMotion.removeEventListener('change', onMotion);
      canvas.remove();
    };
  }, [color1, color2, color3, timeSpeed, warpStrength, warpFrequency, warpSpeed, warpAmplitude, rotationAmount, noiseScale, grainAmount, grainScale, contrast, saturation, zoom]);

  return <div ref={containerRef} className={`grainient-container ${className}`.trim()} aria-hidden="true" />;
}
