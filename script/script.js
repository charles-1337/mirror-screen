// Elementos de vídeo e botões
const videoPlayer = document.getElementById('videoPlayer');
const camera = document.getElementById('camera');
const startScreenShareButton = document.getElementById('startScreenShare');
const startCameraButton = document.getElementById('startCamera');
const takeScreenshotButton = document.getElementById('takeScreenshot');
const takePhotoButton = document.getElementById('takePhoto');
const photoContainer = document.getElementById('photoContainer');

// Ouvintes de eventos para os botões
startScreenShareButton.addEventListener('click', compartilharTela);
startCameraButton.addEventListener('click', compartilharCamera);
takeScreenshotButton.addEventListener('click', capturarTela);
takePhotoButton.addEventListener('click', () => {
    // Lógica para tirar foto
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = camera.videoWidth;
    canvas.height = camera.videoHeight;
    ctx.drawImage(camera, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/png');
    downloadFoto(imageData);
});

// Função para compartilhar tela
function compartilharTela() {
    navigator.mediaDevices.getDisplayMedia({ video: true })
        .then(stream => {
            videoPlayer.srcObject = stream;
        })
        .catch(error => {
            console.log('Erro ao compartilhar tela:', error);
        });
}

// Função para compartilhar câmera
function compartilharCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            camera.srcObject = stream;
        })
        .catch(error => {
            console.log('Erro ao compartilhar câmera:', error);
        });
}

// Função para capturar tela
function capturarTela() {
    const videoStream = videoPlayer.srcObject;
    if (!videoStream) {
        console.log('Nenhuma tela compartilhada disponível.');
        return;
    }

    const videoTrack = videoStream.getVideoTracks()[0];
    const mediaRecorder = new MediaRecorder(videoStream);
    const chunks = [];

    mediaRecorder.ondataavailable = event => {
        chunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);

        // Converter vídeo para imagem
        const video = document.createElement('video');
        video.src = url;
        video.addEventListener('loadedmetadata', () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Obtém os dados da imagem e faz o download
            const imageData = canvas.toDataURL('image/png');
            downloadFoto(imageData);
        });
    };

    mediaRecorder.start();
    setTimeout(() => {
        mediaRecorder.stop();
    }, 3000); // Defina a duração da captura de tela aqui
}

// Função para fazer o download da foto
function downloadFoto(dataUrl) {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'foto.png';
    a.click();
}
