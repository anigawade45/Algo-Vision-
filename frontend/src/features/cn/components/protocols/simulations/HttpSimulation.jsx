import React, { useState, useEffect } from 'react';
import {
  Server,
  Laptop,
  ArrowRight,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Send,
  Check
} from 'lucide-react';

export function HttpSimulation() {
  const [method, setMethod] = useState('GET'); // GET, POST, PUT, DELETE
  const [path, setPath] = useState('/index.html');
  const [requestBody, setRequestBody] = useState('{"username": "Ritesh", "role": "admin"}');
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  // Available sample paths for quick selection
  const samplePaths = [
    { label: 'Home Page (GET)', method: 'GET', path: '/index.html' },
    { label: 'User List (GET)', method: 'GET', path: '/api/users' },
    { label: 'Create Post (POST)', method: 'POST', path: '/api/posts' },
    { label: 'Update Profile (PUT)', method: 'PUT', path: '/api/user/101' },
    { label: 'Delete Item (DELETE)', method: 'DELETE', path: '/api/item/42' },
    { label: 'Missing Route (404)', method: 'GET', path: '/unknown-page' }
  ];

  // Dynamic status code & response calculation
  const getResponseData = () => {
    if (path === '/index.html') {
      return {
        status: 200,
        statusText: 'OK',
        type: 'text/html',
        body: '<!DOCTYPE html><html><body><h1>Welcome to AlgoVision!</h1><p>Status: Online</p></body></html>'
      };
    } else if (path === '/api/users') {
      return {
        status: 200,
        statusText: 'OK',
        type: 'application/json',
        body: '[\n  {"id": 1, "name": "Alice"},\n  {"id": 2, "name": "Bob"},\n  {"id": 3, "name": "Charlie"}\n]'
      };
    } else if (method === 'POST') {
      return {
        status: 201,
        statusText: 'Created',
        type: 'application/json',
        body: '{\n  "success": true,\n  "message": "Resource created successfully",\n  "id": 9482\n}'
      };
    } else if (method === 'PUT') {
      return {
        status: 200,
        statusText: 'OK',
        type: 'application/json',
        body: '{\n  "success": true,\n  "message": "Resource updated successfully"\n}'
      };
    } else if (method === 'DELETE') {
      return {
        status: 200,
        statusText: 'OK',
        type: 'application/json',
        body: '{\n  "success": true,\n  "message": "Resource permanently removed"\n}'
      };
    } else {
      return {
        status: 404,
        statusText: 'Not Found',
        type: 'text/plain',
        body: 'Error 404: The requested resource "' + path + '" was not found on this server.'
      };
    }
  };

  const responseData = getResponseData();

  const totalSteps = 5;

  const stepsInfo = [
    {
      step: 1,
      title: 'Client Prepares HTTP Request',
      action: `Client browser builds ${method} request for ${path} with Host & User-Agent headers.`,
      packetPos: 'client'
    },
    {
      step: 2,
      title: 'HTTP Request in Transit',
      action: `Request payload traveling across TCP connection to web server: ${method} ${path} HTTP/1.1`,
      packetPos: 'transit-to-server'
    },
    {
      step: 3,
      title: 'Web Server Processing',
      action: `Server validates headers, routes path "${path}", queries backend database / static files.`,
      packetPos: 'server'
    },
    {
      step: 4,
      title: 'HTTP Response in Transit',
      action: `Server returns HTTP ${responseData.status} ${responseData.statusText} with Content-Type: ${responseData.type}`,
      packetPos: 'transit-to-client'
    },
    {
      step: 5,
      title: 'Client Receives & Renders Response',
      action: `Browser parses HTTP ${responseData.status} payload and renders web content to the user viewport.`,
      packetPos: 'client-done'
    }
  ];

  // Auto-advance simulation timer
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= totalSteps) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1800);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleNext = () => {
    setIsPlaying(false);
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    setIsPlaying(false);
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(1);
  };

  const handleSelectSample = (sample) => {
    setMethod(sample.method);
    setPath(sample.path);
    setCurrentStep(1);
    setIsPlaying(false);
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-5 sm:p-7 shadow-sm space-y-6">
      {/* Top Header & Method Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Interactive HTTP Request-Response Simulation
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Select an HTTP method and path to trace the complete client-to-server request and response pipeline.
          </p>
        </div>

        {/* Quick Sample Selector */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-[11px] font-mono text-slate-400 uppercase font-bold mr-1">Presets:</span>
          {samplePaths.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectSample(s)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                method === s.method && path === s.path
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Request Builder Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800">
        <div className="md:col-span-3">
          <label className="text-[11px] font-mono uppercase font-bold text-slate-400 block mb-1.5">
            HTTP Method
          </label>
          <div className="grid grid-cols-4 gap-1 font-mono text-xs font-bold">
            {['GET', 'POST', 'PUT', 'DELETE'].map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMethod(m);
                  setCurrentStep(1);
                }}
                className={`py-2 rounded-lg transition-all ${
                  method === m
                    ? m === 'GET'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : m === 'POST'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : m === 'PUT'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-rose-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-5">
          <label className="text-[11px] font-mono uppercase font-bold text-slate-400 block mb-1.5">
            Target Request Path
          </label>
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-800 dark:text-slate-200">
            <span className="text-slate-400">http://api.algovision.dev</span>
            <input
              type="text"
              value={path}
              onChange={(e) => {
                setPath(e.target.value);
                setCurrentStep(1);
              }}
              className="flex-1 bg-transparent font-bold outline-none text-indigo-600 dark:text-indigo-400"
              placeholder="/index.html"
            />
          </div>
        </div>

        <div className="md:col-span-4 flex items-end">
          <button
            onClick={() => {
              setCurrentStep(1);
              setIsPlaying(true);
            }}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-mono font-bold shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Simulate Request ({method})</span>
          </button>
        </div>
      </div>

      {/* Step Prominent Action Banner */}
      <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-mono text-xs font-extrabold shadow-sm">
            Step {currentStep} / {totalSteps}
          </span>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              {stepsInfo[currentStep - 1].title}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              {stepsInfo[currentStep - 1].action}
            </p>
          </div>
        </div>

        {/* Step Playback Controls */}
        <div className="flex items-center gap-1.5 self-end sm:self-center">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer disabled:cursor-not-allowed"
            title="Previous Step"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold font-mono flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentStep === totalSteps}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer disabled:cursor-not-allowed"
            title="Next Step"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
            title="Reset Simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Visual Animation Canvas: Client <---> Server */}
      <div className="relative rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 min-h-[260px] flex items-center justify-between text-white overflow-hidden shadow-inner">
        {/* Wire Background Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

        {/* Client Side (Host/Browser) */}
        <div className={`relative z-10 flex flex-col items-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 ${
          currentStep === 1 || currentStep === 5
            ? 'bg-indigo-950/80 border-indigo-500 shadow-lg shadow-indigo-500/20 scale-105'
            : 'bg-slate-800/80 border-slate-700 opacity-90'
        }`}>
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
            <Laptop className="w-6 h-6" />
          </div>
          <div className="text-center">
            <span className="text-xs font-bold block text-white">Client (Browser)</span>
            <span className="text-[10px] font-mono text-indigo-400">192.168.1.100:54321</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-700">
            User Agent
          </span>
        </div>

        {/* Transmission Channel / Moving Packet */}
        <div className="flex-1 mx-4 sm:mx-8 relative flex flex-col items-center justify-center">
          {/* Connection Line */}
          <div className="w-full h-1 bg-slate-800 rounded-full relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-indigo-500 via-teal-500 to-indigo-500 animate-pulse opacity-40"></div>
          </div>

          {/* Animated Packet */}
          {currentStep === 2 && (
            <div className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center animate-bounce">
              <div className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-mono text-[11px] font-bold shadow-lg flex items-center gap-1.5">
                <span>{method}</span>
                <span className="text-indigo-200">{path}</span>
                <ArrowRight className="w-3 h-3 text-white" />
              </div>
              <span className="text-[9px] font-mono text-indigo-400 mt-1">HTTP Request Packet</span>
            </div>
          )}

          {currentStep === 4 && (
            <div className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center animate-bounce">
              <div className={`px-3 py-1 rounded-lg font-mono text-[11px] font-bold shadow-lg flex items-center gap-1.5 ${
                responseData.status < 400 ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
              }`}>
                <ArrowLeft className="w-3 h-3 text-white" />
                <span>{responseData.status}</span>
                <span className="text-white/80">{responseData.statusText}</span>
              </div>
              <span className="text-[9px] font-mono text-emerald-400 mt-1">HTTP Response Packet</span>
            </div>
          )}

          {/* Static Flow Indicators */}
          <div className="w-full flex justify-between text-[10px] font-mono text-slate-500 mt-3">
            <span>Port 54321 (Ephemeral)</span>
            <span>TCP Handshake: Established</span>
            <span>Port 80 (HTTP)</span>
          </div>
        </div>

        {/* Server Side */}
        <div className={`relative z-10 flex flex-col items-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 ${
          currentStep === 3
            ? 'bg-emerald-950/80 border-emerald-500 shadow-lg shadow-emerald-500/20 scale-105'
            : 'bg-slate-800/80 border-slate-700 opacity-90'
        }`}>
          <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
            <Server className="w-6 h-6" />
          </div>
          <div className="text-center">
            <span className="text-xs font-bold block text-white">HTTP Web Server</span>
            <span className="text-[10px] font-mono text-emerald-400">93.184.216.34:80</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-700">
            Nginx / Apache
          </span>
        </div>
      </div>

      {/* Detailed Request/Response Payload Inspector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {/* Request Inspection */}
        <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 text-slate-300 space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-[11px] font-bold text-indigo-400 uppercase flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5" />
              <span>HTTP Request Headers & Payload</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-bold">
              {method}
            </span>
          </div>

          <pre className="text-[11px] text-slate-300 leading-relaxed overflow-x-auto">
            <span className="text-emerald-400">{method}</span> {path} HTTP/1.1{'\n'}
            Host: api.algovision.dev{'\n'}
            User-Agent: Mozilla/5.0 (AlgoVision-Engine){'\n'}
            Accept: application/json, text/html{'\n'}
            Connection: keep-alive
            {(method === 'POST' || method === 'PUT') && (
              <>
                {'\n'}Content-Type: application/json{'\n'}
                Content-Length: {requestBody.length}{'\n\n'}
                <span className="text-amber-300">{requestBody}</span>
              </>
            )}
          </pre>
        </div>

        {/* Response Inspection */}
        <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 text-slate-300 space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-[11px] font-bold text-emerald-400 uppercase flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>HTTP Response Headers & Body</span>
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
              responseData.status < 400
                ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                : 'bg-rose-950 text-rose-300 border-rose-800'
            }`}>
              {responseData.status} {responseData.statusText}
            </span>
          </div>

          <pre className="text-[11px] text-slate-300 leading-relaxed overflow-x-auto">
            HTTP/1.1 <span className={responseData.status < 400 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>{responseData.status} {responseData.statusText}</span>{'\n'}
            Date: {new Date().toUTCString()}{'\n'}
            Server: AlgoVision-Edge/2.0{'\n'}
            Content-Type: {responseData.type}{'\n'}
            Content-Length: {responseData.body.length} bytes{'\n\n'}
            <span className="text-teal-300">{responseData.body}</span>
          </pre>
        </div>
      </div>

      {/* Small Step Progress Event Log */}
      <div className="rounded-2xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 p-4 space-y-2">
        <h5 className="text-[11px] font-mono uppercase font-bold text-slate-400">
          Simulation Event Pipeline Log
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs font-mono">
          {stepsInfo.map((s) => (
            <div
              key={s.step}
              className={`p-2.5 rounded-xl border transition-all ${
                currentStep > s.step
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
                  : currentStep === s.step
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-400 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 opacity-60'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold mb-0.5">
                {currentStep > s.step ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : currentStep === s.step ? (
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                )}
                <span>Step {s.step}</span>
              </div>
              <p className="text-[10px] truncate leading-tight">{s.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HttpSimulation;
