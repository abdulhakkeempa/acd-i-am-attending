window.onload = generateShareMessage;


function validateImage() {
    const imageInput = document.getElementById('imageUpload');
    const file = imageInput.files[0];
    
    if (file && file.size > 2 * 1024 * 1024) { // Check if the file is greater than 2MB
        alert("Please upload an image smaller than 2MB.");
        imageInput.value = ""; // Clear the input
    }
}

function generatePoster() {

    if (!document.getElementById('name').value) {
        alert("Please enter your name.");
        return;
    }

    if (!document.getElementById('designation').value) {
        alert("Please enter your designation.");
        return;
    }

    if (!document.getElementById('company').value) {
        alert("Please enter your company name.");
        return;
    }

    if (!document.getElementById('imageUpload').files[0]) {
        alert("Please upload your photo.");
        return;
    }

    const canvas = document.getElementById('posterCanvas');
    const ctx = canvas.getContext('2d');
    const imageInput = document.getElementById('imageUpload');
    const image = new Image();
    const background = new Image();

    background.src = 'assets/bg/template-v4.png'; 

    background.onload = function() {
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        image.onload = function() {
            const size = 400;
            const x = 714;
            const y = 326;

            let srcX = 0, srcY = 0, srcWidth = image.width, srcHeight = image.height;

            if (image.width > image.height) {
                srcX = (image.width - image.height) / 2;
                srcWidth = image.height;
            } else {
                srcY = (image.height - image.width) / 2;
                srcHeight = image.width;
            }


            const centerX = x + (size / 2); 

            ctx.font = "bold 26px Amazon Ember";
            ctx.fillStyle = "#FFFFFF"; 
            ctx.textAlign = "center"; 
            ctx.fillText(document.getElementById('name').value, centerX, 775);
            ctx.font = "500 26px Amazon Ember";
            ctx.fillText(document.getElementById('designation').value, centerX, 810);
            ctx.fillText(document.getElementById('company').value, centerX, 845);
            ctx.save();
            ctx.beginPath();
            ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(image, srcX, srcY, srcWidth, srcHeight, x, y, size, size);
            ctx.restore();

            const gradient = ctx.createLinearGradient(x, y, x + size, y + size);
            gradient.addColorStop(0, '#ff5757');
            gradient.addColorStop(1, '#8c52ff');
            ctx.beginPath();
            ctx.arc(x + size / 2, y + size / 2, size / 2 + 5, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.lineWidth = 10;
            ctx.strokeStyle = gradient;
            ctx.stroke();

            canvas.style.display = "block";
            document.getElementById('downloadBtn').style.display = "inline-block";
            document.getElementById('shareBtn').style.display = "inline-block";
            document.getElementById('downloadBtn').href = canvas.toDataURL("image/png");
        };

        const file = imageInput.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            image.src = e.target.result;
        };
        reader.readAsDataURL(file);

        document.getElementById('instruction-box').style.display = "block";

    };

    
}

async function sharePoster() {
    const canvas = document.getElementById('posterCanvas');
    
    canvas.toBlob(async (blob) => {
        if (!blob) {
            alert('Unable to generate poster for sharing.');
            return;
        }

        const file = new File([blob], 'generated_poster.png', { type: 'image/png' });

        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'Generated Poster',
                    text: document.getElementById('shareText').value,
                    files: [file]
                });
                console.log('Poster shared successfully');
            } else {
                alert('Your browser does not support file sharing.');
            }
        } catch (error) {
            alert('Sharing failed. Please try again or use a different browser.');
        }
    }, 'image/png');
}

const messages = [
    "Excited to attend AWS Community Day Kochi 2024! 🎉\n\nCan’t wait to connect with fellow cloud enthusiasts on December 14th at Holiday Inn Kochi. It’s going to be a day packed with learning, networking, and all things AWS! 🚀\n\nSee you there? 👋",
    
    "On December 14th at Holiday Inn Kochi, I’ll be joining cloud pros and enthusiasts for a day of insights, networking, and AWS fun! Can’t wait to learn and connect. 🚀\n\nWill you be there? 👋",
    
    "Looking forward to an inspiring day at Holiday Inn Kochi on December 14th with the amazing AWS community. Ready to dive into all things cloud and connect with you all! 🌐\n\nLet’s make it memorable! 🙌"
];


const hashtags = [
    "#aws", 
    "#awscloud", 
    "#acdkochi24", 
    "#acdkochi", 
    "#awsugkochi", 
    "#awsusergroups", 
    "#awscommunityday", 
    "#awscommunity", 
    "#awscommunitybuilders", 
    "#awsheroes"
];

function generateShareMessage() {
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    const hashtagsText = hashtags.join(" ");
    
    const fullMessage = `${randomMessage} ${hashtagsText}`;
    
    document.getElementById('shareText').value = fullMessage;
}


function copyShareText() {
    const shareText = document.getElementById('shareText');
    shareText.select();
    document.execCommand("copy");
    alert("Text copied to clipboard!");
}
