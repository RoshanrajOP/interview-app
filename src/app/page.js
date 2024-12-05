'use client';
import { useEffect, useState, useRef } from 'react';

export default function Home() {
  const videoRef = useRef(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const constraintObj = {
      video: {
        facingMode: 'user',
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    };

    // Access camera
    navigator.mediaDevices
      .getUserMedia(constraintObj)
      .then((mediaStreamObj) => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStreamObj;
          videoRef.current.play();
        }

        const recorder = new MediaRecorder(mediaStreamObj);

        recorder.ondataavailable = (event) => {
          setChunks((prevChunks) => [...prevChunks, event.data]);
        };

        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/mp4' });
          const videoURL = window.URL.createObjectURL(blob);
          // The line to update saved video is removed
          setChunks([]); // Clear chunks after stopping
        };

        setMediaRecorder(recorder);
      })
      .catch((err) => {
        console.error('Error accessing media devices:', err.name, err.message);
      });
  }, [chunks]); 
  const startRecording = () => {
    if (mediaRecorder) {
      setChunks([]); 
      mediaRecorder.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex-container">
      {/* Header Section */}
      <header className="header">
        <h1>AI-Interview</h1>
        <div className="auth-buttons">
          <button className="auth-btn">Sign In</button>
          <button className="auth-btn">Sign Up</button>
        </div>
      </header>

      {/* Main Section: Video Feed & Instructions */}
      <div className="video-and-instructions">
        {/* Left Section for Camera */}
        <div className="video-container">
          <video ref={videoRef} className="video" autoPlay muted></video>
        </div>

        {/* Right Section for Instructions */}
        <div className="instruction-container">
          <h1>Trainee Interview</h1>
          <ul>
            <li>Ensure stable internet and choose a clean, quiet location.</li>
            <li>Permission for camera, microphone, and screen sharing is required.</li>
            <li>Be in professional attire and avoid distractions.</li>
            <li>Give a detailed response, providing as much information as possible.</li>
            <li>Answer questions with examples and projects you've worked on.</li>
          </ul>
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button
              onClick={startRecording}
              disabled={isRecording}
              className="start-recording"
            >
              Start Recording
            </button>
            <button
              onClick={stopRecording}
              disabled={!isRecording}
              className="stop-recording"
            >
              Stop Recording
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
