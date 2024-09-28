// import './style.css';

// import { initializeApp } from 'firebase/app';
// import { getFirestore, collection, doc, setDoc, onSnapshot, getDoc, updateDoc } from 'firebase/firestore';

// // Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCOYMDbCzWqVkpy1KKqbNPFMHcxABLVu_4",
//   authDomain: "intbud.firebaseapp.com",
//   projectId: "intbud",
//   storageBucket: "intbud.appspot.com",
//   messagingSenderId: "804866743985",
//   appId: "1:804866743985:web:7f3d94530c7a6518854c90",
//   measurementId: "G-5PVB3WLWZG"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const firestore = getFirestore(app);

// const servers = {
//   iceServers: [
//     {
//       urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
//     },
//   ],
//   iceCandidatePoolSize: 10,
// };

// const pc = new RTCPeerConnection(servers);
// let localStream = null;
// let remoteStream = null;

// // HTML elements
// const webcamButton = document.getElementById('webcamButton');
// const webcamVideo = document.getElementById('webcamVideo');
// const callButton = document.getElementById('callButton');
// const callInput = document.getElementById('callInput');
// const answerButton = document.getElementById('answerButton');
// const remoteVideo = document.getElementById('remoteVideo');
// const hangupButton = document.getElementById('hangupButton');


// const webcamButtonNew = document.getElementById('webcamButtonNew');
// const micButtonNew = document.getElementById('micButtonNew');
// const hangupButtonNew = document.getElementById('hangupButtonNew');
// const webcamImage = document.getElementById('webcamImage');

// // 1. Setup media sources
// webcamButton.onclick = async () => {
//   localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//   remoteStream = new MediaStream();

//   // Push tracks from local stream to peer connection
//   localStream.getTracks().forEach((track) => {
//     pc.addTrack(track, localStream);
//   });

//   // Pull tracks from remote stream, add to video stream
//   pc.ontrack = (event) => {
//     event.streams[0].getTracks().forEach((track) => {
//       remoteStream.addTrack(track);
//     });
//   };

//   webcamVideo.srcObject = localStream;
//   remoteVideo.srcObject = remoteStream;

// callButton.disabled = false;
// answerButton.disabled = false;
//   webcamButton.disabled = true;
// };


// // //jojo's code
// // let isCameraOn = false; // Track if the camera is on
// // let isMicOn = false; // Track if the mic is on

// // let localVideoStream = null; // For video track only
// // let localAudioStream = null; // For audio track only

// // webcamButtonNew.onclick = async () => {  
// //   callButton.disabled = false;
// //   answerButton.disabled = false;
// //   if (!isCameraOn) {
// //     // If camera is off, enable video track
// //     if (!localVideoStream) {
// //       localVideoStream = await navigator.mediaDevices.getUserMedia({ video: true });
// //     }
// //     webcamImage.src = "images/camera-svgrepo-com.svg";
// //     // Display video
// //     webcamVideo.srcObject = localVideoStream;

// //     // Add video track to peer connection (ensure previous video track is removed)
// //     const videoTrack = localVideoStream.getVideoTracks()[0];
// //     const videoSender = pc.getSenders().find(s => s.track?.kind === 'video');
// //     if (videoSender) {
// //       pc.removeTrack(videoSender);  // Remove previous video track
// //     }
// //     pc.addTrack(videoTrack, localVideoStream);  // Add new video track

// //     isCameraOn = true; // Update camera state
// //   } else {
// //     // Camera is on, stop video tracks and remove from peer connection
// //     localVideoStream.getTracks().forEach((track) => {
// //       track.stop();
// //       webcamImage.src = "images/camera-slash-svgrepo-com.svg";
// //     });
// //     localVideoStream = null; // Clear the video stream
// //     webcamVideo.srcObject = null;

// //     const videoSender = pc.getSenders().find(s => s.track?.kind === 'video');
// //     if (videoSender) {
// //       pc.removeTrack(videoSender);  // Remove previous video track
// //     }

// //     isCameraOn = false; // Update camera state
// //   }
// // };

// // micButtonNew.onclick = async () => {
// //   if (!isMicOn) {
// //     // If mic is off, enable audio track
// //     if (!localAudioStream) {
// //       localAudioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
// //     }
    

// //     // Add audio track to peer connection (ensure previous audio track is removed)
// //     const audioTrack = localAudioStream.getAudioTracks()[0];
// //     const audioSender = pc.getSenders().find(s => s.track?.kind === 'audio');
// //     if (audioSender) {
// //       pc.removeTrack(audioSender);  // Remove previous audio track
// //     }
// //     pc.addTrack(audioTrack, localAudioStream);  // Add new audio track

// //     isMicOn = true; // Update mic state
// //   } else {
// //     // Mic is on, stop audio tracks and remove from peer connection
// //     localAudioStream.getTracks().forEach((track) => {
// //       track.stop();
// //     });
// //     localAudioStream = null; // Clear the audio stream

// //     const audioSender = pc.getSenders().find(s => s.track?.kind === 'audio');
// //     if (audioSender) {
// //       pc.removeTrack(audioSender);  // Remove previous audio track
// //     }

// //     isMicOn = false; // Update mic state
// //   }
// // };




// // 2. Create an offer
// callButton.onclick = async () => {
//   // Reference Firestore collections for signaling
//   const callDoc = doc(collection(firestore, 'calls'));
//   const offerCandidates = collection(callDoc, 'offerCandidates');
//   const answerCandidates = collection(callDoc, 'answerCandidates');

//   callInput.value = callDoc.id;

//   // Get candidates for caller, save to db
//   pc.onicecandidate = (event) => {
//     if (event.candidate) {
//       setDoc(doc(offerCandidates), event.candidate.toJSON());
//     }
//   };

//   // Create offer
//   const offerDescription = await pc.createOffer();
//   await pc.setLocalDescription(offerDescription);

//   const offer = {
//     sdp: offerDescription.sdp,
//     type: offerDescription.type,
//   };

//   await setDoc(callDoc, { offer });

//   // Listen for remote answer
//   onSnapshot(callDoc, (snapshot) => {
//     const data = snapshot.data();
//     if (!pc.currentRemoteDescription && data?.answer) {
//       const answerDescription = new RTCSessionDescription(data.answer);
//       pc.setRemoteDescription(answerDescription);
//     }
//   });

//   // When answered, add candidate to peer connection
//   onSnapshot(answerCandidates, (snapshot) => {
//     snapshot.docChanges().forEach((change) => {
//       if (change.type === 'added') {
//         const candidate = new RTCIceCandidate(change.doc.data());
//         pc.addIceCandidate(candidate);
//       }
//     });
//   });

//   hangupButton.disabled = false;
// };

// // 3. Answer the call with the unique ID
// answerButton.onclick = async () => {
//   const callId = callInput.value;
//   const callDoc = doc(firestore, 'calls', callId);
//   const answerCandidates = collection(callDoc, 'answerCandidates');
//   const offerCandidates = collection(callDoc, 'offerCandidates');

//   pc.onicecandidate = (event) => {
//     if (event.candidate) {
//       setDoc(doc(answerCandidates), event.candidate.toJSON());
//     }
//   };

//   const callData = (await getDoc(callDoc)).data();

//   const offerDescription = callData.offer;
//   await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

//   const answerDescription = await pc.createAnswer();
//   await pc.setLocalDescription(answerDescription);

//   const answer = {
//     type: answerDescription.type,
//     sdp: answerDescription.sdp,
//   };

//   await updateDoc(callDoc, { answer });

//   onSnapshot(offerCandidates, (snapshot) => {
//     snapshot.docChanges().forEach((change) => {
//       if (change.type === 'added') {
//         const data = change.doc.data();
//         pc.addIceCandidate(new RTCIceCandidate(data));
//       }
//     });
//   });
// };


import '../landing/styles.css';

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, onSnapshot, getDoc, updateDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOYMDbCzWqVkpy1KKqbNPFMHcxABLVu_4",
  authDomain: "intbud.firebaseapp.com",
  projectId: "intbud",
  storageBucket: "intbud.appspot.com",
  messagingSenderId: "804866743985",
  appId: "1:804866743985:web:7f3d94530c7a6518854c90",
  measurementId: "G-5PVB3WLWZG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

const pc = new RTCPeerConnection(servers);
let localStream = null;
let remoteStream = null;

// HTML elements
const webcamButton = document.getElementById('webcamButton');
const webcamVideo = document.getElementById('webcamVideo');
const callButton = document.getElementById('callButton');
const callInput = document.getElementById('callInput');
const answerButton = document.getElementById('answerButton');
const remoteVideo = document.getElementById('remoteVideo');
const hangupButton = document.getElementById('hangupButton');

// 1. Setup media sources
webcamButton.onclick = async () => {
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  remoteStream = new MediaStream();

  // Push tracks from local stream to peer connection
  localStream.getTracks().forEach((track) => {
    pc.addTrack(track, localStream);
  });

  // Pull tracks from remote stream, add to video stream
  pc.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };

  webcamVideo.srcObject = localStream;
  remoteVideo.srcObject = remoteStream;

  callButton.disabled = false;
  answerButton.disabled = false;
  webcamButton.disabled = true;
};

// 2. Create an offer
callButton.onclick = async () => {
  // Reference Firestore collections for signaling
  const callDoc = doc(collection(firestore, 'calls'));
  const offerCandidates = collection(callDoc, 'offerCandidates');
  const answerCandidates = collection(callDoc, 'answerCandidates');

  callInput.value = callDoc.id;

  // Get candidates for caller, save to db
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      setDoc(doc(offerCandidates), event.candidate.toJSON());
    }
  };

  // Create offer
  const offerDescription = await pc.createOffer();
  await pc.setLocalDescription(offerDescription);

  const offer = {
    sdp: offerDescription.sdp,
    type: offerDescription.type,
  };

  await setDoc(callDoc, { offer });

  // Listen for remote answer
  onSnapshot(callDoc, (snapshot) => {
    const data = snapshot.data();
    if (!pc.currentRemoteDescription && data?.answer) {
      const answerDescription = new RTCSessionDescription(data.answer);
      pc.setRemoteDescription(answerDescription);
    }
  });

  // When answered, add candidate to peer connection
  onSnapshot(answerCandidates, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const candidate = new RTCIceCandidate(change.doc.data());
        pc.addIceCandidate(candidate);
      }
    });
  });

  hangupButton.disabled = false;
};

// 3. Answer the call with the unique ID
answerButton.onclick = async () => {
  const callId = callInput.value;
  const callDoc = doc(firestore, 'calls', callId);
  const answerCandidates = collection(callDoc, 'answerCandidates');
  const offerCandidates = collection(callDoc, 'offerCandidates');

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      setDoc(doc(answerCandidates), event.candidate.toJSON());
    }
  };

  const callData = (await getDoc(callDoc)).data();

  const offerDescription = callData.offer;
  await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

  const answerDescription = await pc.createAnswer();
  await pc.setLocalDescription(answerDescription);

  const answer = {
    type: answerDescription.type,
    sdp: answerDescription.sdp,
  };

  await updateDoc(callDoc, { answer });

  onSnapshot(offerCandidates, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const data = change.doc.data();
        pc.addIceCandidate(new RTCIceCandidate(data));
      }
    });
  });
};
