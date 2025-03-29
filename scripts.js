document.addEventListener('DOMContentLoaded', function() {
    // Exit button confirmation
    const exitBtn = document.querySelector('.exit-btn');
    if (exitBtn) {
        exitBtn.addEventListener('click', function(e) {
            if (!confirm('Are you sure you want to exit?')) {
                e.preventDefault();
            }
        });
    }

    // Calculate capacity when cover image is selected
    const coverImageInput = document.getElementById('cover_image');
    if (coverImageInput) {
        coverImageInput.addEventListener('change', calculateCapacity);
    }

    // Initialize Socket.IO for progress updates
    initializeSocketIO();
});

function calculateCapacity() {
    const coverImageInput = document.getElementById('cover_image');
    const capacityDisplay = document.getElementById('capacity_display') || document.getElementById('capacity_value');
    
    if (coverImageInput && coverImageInput.files.length > 0) {
        const file = coverImageInput.files[0];
        const img = new Image();
        
        img.onload = function() {
            const width = this.width;
            const height = this.height;
            const capacityBits = width * height * 3;
            const capacityKB = (capacityBits / 8) / 1024;
            
            if (capacityDisplay) {
                if (capacityDisplay.id === 'capacity_display') {
                    capacityDisplay.textContent = `Maximum capacity: ${capacityKB.toFixed(2)} KB`;
                } else {
                    capacityDisplay.textContent = `${capacityKB.toFixed(2)} KB`;
                }
            }
        };
        
        img.src = URL.createObjectURL(file);
    }
}

function validateFileSize() {
    const coverImage = document.getElementById('cover_image')?.files[0];
    const hiddenFile = document.getElementById('hidden_file')?.files[0];
    const capacityValue = document.getElementById('capacity_value')?.textContent;
    
    if (coverImage) {
        const coverImageSizeKB = coverImage.size / 1024;
        if (coverImageSizeKB < 1) {
            alert("Error: The cover image is too small. Minimum size is 1 KB.");
            return false;
        }
    }
    
    if (hiddenFile && capacityValue) {
        const capacityKB = parseFloat(capacityValue);
        const hiddenFileSizeKB = hiddenFile.size / 1024;
        
        if (hiddenFileSizeKB > capacityKB) {
            alert(`Error: The selected file size (${hiddenFileSizeKB.toFixed(2)} KB) exceeds the maximum capacity (${capacityKB.toFixed(2)} KB).`);
            return false;
        }
    }
    
    return true;
}

function initializeSocketIO() {
    const socket = io();
    
    socket.on('progress_update', function(data) {
        const progress = data.progress;
        const progressElement = document.getElementById('progress');
        const progressText = document.getElementById('progress-text');
        
        if (progressElement) {
            progressElement.style.width = `${progress}%`;
        }
        
        if (progressText) {
            progressText.innerText = `${progress}%`;
        }
    });
}

function startProgress() {
    const progressContainer = document.getElementById('progress-container');
    if (progressContainer) {
        progressContainer.style.display = 'block';
    }
}