document.addEventListener('DOMContentLoaded', function() {
    console.log('Document loaded');
    
    const cameraButton = document.getElementById('camera-button');
    const uploadButton = document.querySelector('.upload-button');
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const capturedImage = document.getElementById('captured-image');
    const uploadedImage = document.getElementById('uploaded-image');
    const generatedImage = document.getElementById('generated-image');
    const fileInput = document.getElementById('file-input');
    const textBox = document.getElementById('text-box');
    const generateButton = document.getElementById('submit-text');
    const displayText = document.getElementById('display-text');

    cameraButton.addEventListener('click', async function() {
        console.log('Camera button clicked');
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            video.style.display = 'block';
            video.play();
            video.addEventListener('click', captureImage, { once: true });
        } catch (error) {
            console.error('Error accessing webcam: ', error);
        }
    });

    function captureImage() {
        console.log('Capture image button clicked');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        capturedImage.src = dataUrl;
        capturedImage.style.display = 'block';
        imagePath = dataUrl;
        stream.getTracks().forEach(track => track.stop());
        video.style.display = 'none';
    }

    fileInput.addEventListener('change', function() {
        console.log('File input changed');
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                uploadedImage.src = e.target.result;
                uploadedImage.style.display = 'block';
                imagePath = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    uploadButton.addEventListener('click', function() {
        console.log('Upload button clicked');
        fileInput.click();
    });

    generateButton.addEventListener("click", function() {
        const userInput = textBox.value;
        if (userInput.trim() === "") {
            alert("Please enter your idea.");
            return;
        }

        // Make the image visible
        generatedImage.style.display = "block";
    });
});
