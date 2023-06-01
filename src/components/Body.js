import React, { useRef, useEffect, useState } from 'react';
import './Body.css'; // Import custom CSS file for styling
import { collection, addDoc } from "firebase/firestore";
import {db,storage} from '../Firebase/Firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const Body = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const formRef = useRef(null);

  // State variables to store form data
  const [name, setName] = useState('');
  const [birthSign, setBirthSign] = useState('');
  const [photoUrlstate, setPhotoUrl] = useState(''); 
  const [file, setFile] = useState("");
  const [percent, setPercent] = useState(0);
  const [newBlob,setNewBlob] = useState();

  const getCameraStream = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
    // Remove the following two lines which display the video on the screen
    videoRef.current.srcObject = stream;
    videoRef.current.play();
  } catch (error) {
    console.error('Error accessing camera:', error);
  }
};


  const capturePhoto = () => {
    const canvas = canvasRef.current;
  const context = canvas.getContext('2d');
  // Instead of drawing the video on the canvas, you can directly capture a photo from the camera
  const photoWidth = canvas.width;
  const photoHeight = canvas.height;
  context.drawImage(videoRef.current, 0, 0, photoWidth, photoHeight);
  const photoUrl = canvas.toDataURL('image/png');
    setPhotoUrl(photoUrl);

    // Create a new image element to display the captured photo
    const img = new Image();
    img.src = photoUrl;
    // Add the image element to the UI
    const photoContainer = document.getElementById('photo-container');
    photoContainer.innerHTML = ''; // Clear previous photos
    photoContainer.appendChild(img);
    console.log(img)

    fetch(photoUrl)
    .then(res => res.blob())
    .then(blob => {
      // blob is the converted Blob object
      // You can use this blob for further processing or uploading to storage

      setNewBlob(blob);

    })
    .catch(error => console.error('Error converting dataURL to Blob:', error));

  };

  useEffect(() => {
    if (newBlob) {
      // Perform actions with the updated newBlob state here
      console.log(newBlob);
    }
  }, [newBlob]);

  useEffect(() => {
    getCameraStream();

    return () => {
      videoRef.current.srcObject = null;
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    // You can perform form submission logic here, e.g. send data to server, etc.
    console.log('Form data:', { name, birthSign });
    
  };


function handleFileChange(e) {
  setFile(e.target.files[0]); // Update file state with the selected file
}

  const handleUpload = async () => {
    const storageRef = ref(storage, `/files/${name}`);
    const uploadTask = uploadBytesResumable(storageRef, newBlob);
  
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setPercent(percent);
      },
      (err) => console.log(err),
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          console.log(url);
  
          // Add data to Firestore
          const docRef = await addDoc(collection(db, "User-Data"), {
            Name: name,
            BirthSign: birthSign,
            url: url
          });
          console.log("Document written with ID: ", docRef.id);
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      }
    );
  };
  


  return (
    <div className="container">
      <div className="video-container">
        <video ref={videoRef} className="video" />
        <canvas ref={canvasRef} width={640} height={480} className="canvas" />
        <button onClick={capturePhoto} className="capture-button">
          Capture Photo
        </button>
        <div id="photo-container" className="photo-container"></div>
      </div>

      <div className="form-container">
        <form ref={formRef} onSubmit={handleSubmit}>
          <h2 className="form-title">Form</h2>
          <label htmlFor="name" className="form-label">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
          />
          <br />
          <label htmlFor="birthSign" className="form-label">
            Birth sign:
          </label>
          <input
            type="text"
            id="birthSign"
            name="birthSign"
            value={birthSign}
            onChange={(e) => setBirthSign(e.target.value)}
            className="form-input"
          />
          <br />

          <button type="submit" className="form-button">
            Submit
          </button>
          <center>
           <input type="file" onChange={handleFileChange} accept="/image/*" />
          <button onClick={handleUpload}>Upload</button>
          </center>
        </form>
      </div>
    </div>
  );
};

export default Body;
