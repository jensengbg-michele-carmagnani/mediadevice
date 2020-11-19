if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").then((reg) => {
    console.log("Service worker registered.");
  });
}

window.addEventListener("load", () => {
  if ("mediaDevices" in navigator) {
    cameraSettings();
  }
});

function cameraSettings() {
  const errorMessage = document.querySelector(".video > .error");
  const startButton = document.querySelector(".video .start-stream");
  const stopButton = document.querySelector(".video .stop-stream");
  const photoButton = document.querySelector(".profile button");
  const profilePic = document.querySelector(".profile > img");
  const startRecording = document.querySelector(".video .start-recording");
  const stopRecording = document.querySelector(".video .stop-recording");
  const downloadLink = document.querySelector(".video .downloadLink");
  // .profile > p > button  --> 012, omständigt men mer specifikt
  // .profile       button  --> 011, enklare

  let stream;
  startButton.addEventListener("click", async () => {
    errorMessage.innerHTML = "";
    try {
      let md = navigator.mediaDevices;
      stream = await md.getUserMedia({ video: { width: 320, height: 320 } });

      const video = document.querySelector(".video > video");
      video.srcObject = stream;
      stopButton.disabled = false;
      photoButton.disabled = false;
      startButton.disabled = true;
      startRecording.disabled = false;
    } catch (e) {
      errorMessage.innerHTML = "Could not show camera window.";
    }
  });

  photoButton.addEventListener("click", async () => {
    errorMessage.innerHTML = "";

    if (!stream) {
      errorMessage.innerHTML =
        "Not possible to take a photo due to the inactivity of the streaming";
      return;
    }

    let tracks = stream.getTracks();
    let videoTrack = tracks[0];
    let capture = new ImageCapture(videoTrack);
    let blob = await capture.takePhoto();

    let imgUrl = URL.createObjectURL(blob);
    profilePic.src = imgUrl;
  });

  let mediaRecorder;

  startRecording.addEventListener("click", async () => {
    if (!stream) {
      errorMessage.innerHTML = "No viedo available.";
      return;
    }
    startRecording.disabled = true;
    stopRecording.disabled = false;
    mediaRecorder = new MediaRecorder(stream);
    let chunks = [];
    mediaRecorder.addEventListener("dataavailable", (event) => {
      console.log("mediarecorder.dataavailable:", event);
      const blob = event.data;
      if (blob > 0) {
        chunks.push(blob);
      }
    });

    mediaRecorder.addEventListener("stop", (event) => {
      console.log("mediaRecorder.stop:", event);
      const blob = new Blob(chunks, { type: "video/webm" });
      // WEBM-formatet fungerar i Chrome och Firefox
      // Använd gärna MP4 som fallback
      const url = URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.classList.remove("hidden");
      downloadLink.download = "recording.webm";
    });
    mediaRecorder.start();
  });
  stopRecording.addEventListener("click", async () => {
    if (mediaRecorder) {
      stopRecording.disabled = true;
      startRecording.disabled = false;
      mediaRecorder.stop();
      mediaRecorder = null;
    } else {
      errorMessage.innerHTML = "no recording to stops";
    }
  });
}
