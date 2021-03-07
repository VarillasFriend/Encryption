const lazyLoadImages = document.querySelectorAll("img.lazy");
let lazyLoadThrottleTimeout;

function lazyLoad() {
    if (lazyLoadThrottleTimeout) {
        clearTimeout(lazyLoadThrottleTimeout);
    }

    lazyLoadThrottleTimeout = setTimeout(function () {
        lazyLoadImages.forEach(function (img) {
            if (defineElementOffset(img, 0)) {
                img.src = img.dataset.src;
                img.classList.remove("lazy");
            }
        });
        if (lazyLoadImages.length == 0) {
            document.removeEventListener("scroll", lazyLoad);
            window.removeEventListener("resize", lazyLoad);
            window.removeEventListener("orientationChange", lazyLoad);
        }
    }, 20);
}

function defineElementOffset(element, change) {
    const scrollTop = window.pageYOffset;

    if (element.offsetTop < window.innerHeight + scrollTop - change) {
        return true;
    } else {
        return false;
    }
}

document.addEventListener("scroll", lazyLoad);
window.addEventListener("resize", lazyLoad);
window.addEventListener("orientationChange", lazyLoad);
window.addEventListener("DOMContentLoaded", lazyLoad);

function encrypt(message = "", key = "") {
    var message = CryptoJS.AES.encrypt(message, key);
    return message.toString();
}

function decrypt(message = "", key = "") {
    var code = CryptoJS.AES.decrypt(message, key);
    var decryptedMessage = code.toString(CryptoJS.enc.Utf8);

    return decryptedMessage;
}

function testPassword() {
    const password = document.querySelector("#input").value;

    if (decrypt(encryptedPassword, password) == password && password) {
        authenticated = true;

        submitForm(password);
    } else {
        animateInput();
    }
}

function submitForm(password) {
    if (authenticated) {
        time_before = new Date();
        time_before = time_before.getTime();

        window.requestAnimationFrame(animateSVG);
        setTimeout(() => displayContent(), 600);
        document.body.style.overflowY = "hidden";
        content.style.display = "block";

        const h1 = content.querySelectorAll("h1"),
            h2 = content.querySelectorAll("h2"),
            h3 = content.querySelectorAll("h3"),
            p = content.querySelectorAll("p"),
            img = content.querySelectorAll("img");

        decryptItems(h1, password);
        decryptItems(h2, password);
        decryptItems(h3, password);
        decryptItems(p, password);
        decryptImages(img, password);

        lazyLoad();

        time_after = new Date();
        time_after = time_after.getTime();

        console.log(time_after - time_before);
    }
}

function displayContent() {
    inputHolder.classList.add('disappear');
    content.classList.add('appear')

    inputHolder.onanimationend = function (event) {
        input.style.display = 'none';
    };
    
    document.body.style.overflowY = "scroll";
}

function decryptItems(elements, password) {
    elements.forEach((element) => {
        element.innerText = decrypt(element.innerText, password);
    });
}

function decryptImages(elements, password) {
    elements.forEach((element) => {
        if (element.src.value) {
            element.src.value = decrypt(element.src.value, password);
        } else if (element.dataset.src) {
            element.dataset.src = decrypt(element.dataset.src, password);
        }
        element.dataset.title = decrypt(element.dataset.title, password);
        element.dataset.desc = decrypt(element.dataset.desc, password);
    });
}

const encryptedPassword =
        "U2FsdGVkX18eIVxBabE9hdG9cJy0NiBeN30QkHonimgm5wz1JsAkv3iykRaJd97x",
    input = document.querySelector("#input"),
    submit = document.querySelector(".submit"),
    content = document.querySelector("#content"),
    inputHolder = document.querySelector(".input-holder"),
    images = document.querySelectorAll("#img-holder img"),
    showImage = document.querySelector("#show-image"),
    all = document.getElementById("all");

let authenticated = false;

input.onkeydown = function (event) {
    if (event.keyCode == 13) {
        testPassword();
    }
};

submit.onclick = function () {
    testPassword();
};

images.forEach((image) => {
    image.onclick = function (event) {
        showImg(image, event);
    };
});

function showImg(image, event) {
    showImage.innerHTML = `<img src='${image.src}'> <div id='show-image-description'> <h1>${image.dataset.title}</h1> <p>${image.dataset.desc}</p> <svg xmlns="http://www.w3.org/2000/svg" id="close" class='icon' width="30" height="30" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg> </div>`;
    showImage.classList.add("show");

    all.style.filter = "blur(10px)";

    document.querySelector("#close").onclick = function () {
        stopShowImg();
    };

    all.onclick = function (event2) {
        if (event2 != event) {
            stopShowImg();
        }
    };
}

function stopShowImg() {
    showImage.innerHTML = "";
    showImage.classList.remove("show");
    all.style.filter = "blur(0px)";
}

const svg = document.querySelector("#svg");
let n = 4,
    n1 = 4;
let start;

function animateSVG(timestamp) {
    if (start === undefined) start = timestamp;
    const elapsed = timestamp - start;

    n = 4 - Math.min(0.005 * elapsed, 2);
    n1 = 4 + Math.min(0.005 * elapsed, 2);
    svg.attributes.d.value = `M8 11v-${n1}a4 4 0 0 1 8 0v${n}`;

    if (elapsed < 400) {
        window.requestAnimationFrame(animateSVG);
    }
}

function animateInput() {
    input.classList.add("wrong");
    input.onanimationend = function (event) {
        input.classList.remove("wrong");
    };
}

// console.log(
//     encrypt(
//         "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.4itrffpKjIUD1NP4HCECqwHaEj%26pid%3DApi&f=1",
//         "VcDM63Ek!W9*Qzw$"
//     )
// );
