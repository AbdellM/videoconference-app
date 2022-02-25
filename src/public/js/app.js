const socket = io();

const myFace = document.querySelector("#myFace");
const muteBtn = document.querySelector("#mute");
const cameraBtn = document.querySelector("#camera");
const cameraSelect = document.querySelector("#cameras");
const micSelect = document.querySelector("#mics");

let myStream;
let mute = true;
let camera = true;
let myPeerConnection;

// get all user camera
async function getCamera() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === "videoinput");
    const currentCamera = myStream.getVideoTracks()[0];
    cameras.forEach((camera) => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.innerText = camera.label;
      if (currentCamera.label === camera.label) {
        option.selected = true;
      }
      cameraSelect.appendChild(option);
    });
  } catch (error) {
    console.log(error);
  }
}
// get all user mic
async function getMic() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const mics = devices.filter((device) => device.kind === "audioinput");
    const currentMic = myStream.getAudioTracks()[0];
    mics.forEach((mic) => {
      const option = document.createElement("option");
      option.value = mic.deviceId;
      option.innerText = mic.label;
      if (currentMic.label === mic.label) {
        option.selected = true;
      }
      micSelect.appendChild(option);
    });
  } catch (error) {
    console.log(error);
  }
}

// Main fonction
async function getMedia(deviceIdCam, deviceIdMic) {
  const initialConstrains = {
    audio: true,
    video: { facingMode: "user" },
  };
  const cameraConstrains = {
    audio: { deviceId: { exact: deviceIdMic } },
    video: { deviceId: { exact: deviceIdCam } },
  };
  try {
    //getting the stream from the browser
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceIdCam ? cameraConstrains : initialConstrains
    );
    //giving the stream to the video
    myFace.srcObject = myStream;
    if (!deviceIdCam) {
      await getCamera();
      await getMic();
    }
  } catch (error) {
    console.log(error);
  }
}

// toggle mute btn
muteBtn.addEventListener("click", () => {
  if (!mute) {
    muteBtn.innerText = "Unmute";
    mute = true;
    myStream
      .getAudioTracks()
      .forEach((track) => (track.enabled = !track.enabled));
  } else {
    muteBtn.innerText = "Mute";
    mute = false;
    myStream
      .getAudioTracks()
      .forEach((track) => (track.enabled = !track.enabled));
  }
});

//toggle camera btn
cameraBtn.addEventListener("click", () => {
  if (!camera) {
    cameraBtn.innerText = "Camera Off";
    camera = true;
    myStream
      .getVideoTracks()
      .forEach((track) => (track.enabled = !track.enabled));
  } else {
    cameraBtn.innerText = "Camera On";
    camera = false;
    myStream
      .getVideoTracks()
      .forEach((track) => (track.enabled = !track.enabled));
  }
});

//event on changing camera
cameraSelect.addEventListener("input", () => {
  getMedia(cameraSelect.value, micSelect.value);
});

//event on changing mic
micSelect.addEventListener("input", () => {
  getMedia(cameraSelect.value, micSelect.value);
});

// show welcome first
const welcome = document.querySelector("#welcome");
const call = document.querySelector("#call");
let roomName;

async function initCall() {
  call.hidden = false;
  welcome.hidden = true;
  await getMedia();
  makeConnection();
}

call.hidden = true;
const welcomForm = welcome.querySelector("form");
// SOCKET join room
welcomForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const input = welcomForm.querySelector("input");
  await initCall();
  socket.emit("join-room", input.value);
  roomName = input.value;
  input.value = "";
});

socket.on("welcome", async () => {
  const offer = await myPeerConnection.createOffer();
  myPeerConnection.setLocalDescription(offer);
  console.log("sent the offer");
  socket.emit("offer", offer, roomName);
});

socket.on("offer", async (offer) => {
  console.log("received the offer");
  myPeerConnection.setRemoteDescription(offer);
  const answer = await myPeerConnection.createAnswer();
  myPeerConnection.setLocalDescription(answer);
  socket.emit("answer", answer, roomName);
  console.log("sent the answer");
});

socket.on("answer", async (answer) => {
  console.log("received the answer");
  myPeerConnection.setRemoteDescription(answer);
});

socket.on("ice", async (candidate) => {
  console.log("received candidate");
  myPeerConnection.addIceCandidate(candidate);
});

// RTC connection
const peersFace = document.querySelector("#peersFace");
function makeConnection() {
  myPeerConnection = new RTCPeerConnection();
  myPeerConnection.addEventListener("icecandidate", (data) => {
    socket.emit("ice", data.candidate, roomName);
  });
  myPeerConnection.addEventListener("addstream", (data) => {
    peersFace.srcObject = data.stream;
  });
  myStream
    .getTracks()
    .forEach((track) => myPeerConnection.addTrack(track, myStream));
}
