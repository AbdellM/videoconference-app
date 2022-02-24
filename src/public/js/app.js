const socket = io();

const myFace = document.querySelector("#myFace");
const muteBtn = document.querySelector("#mute");
const cameraBtn = document.querySelector("#camera");
const cameraSelect = document.querySelector("#cameras");
const micSelect = document.querySelector("#mics");

let myStream;
let mute = true;
let camera = true;

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
    console.log(myStream.getAudioTracks());

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

getMedia();
// const welcome = document.querySelector("#welcome");
// const form = welcome.querySelector("form");

// form.addEventListener("submit", (event) => {
//   event.preventDefault();
//   const input = form.querySelector("input");
//   socket.emit("room", { payload: input.value });
//   input.value = "";
// });
