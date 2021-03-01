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

    // if (decrypt(encryptedPassword, password) == password && password) {
    authenticated = true;

    submitForm(password);
    // }
}

function submitForm(password) {
    if (authenticated) {
        content.style.display = 'block'
        inputHolder.style.display = 'none'
        time_before = new Date()
        time_before = time_before.getTime()

        const h1 = document.querySelectorAll("h1"),
            h2 = document.querySelectorAll("h2"),
            h3 = document.querySelectorAll("h3"),
            p = document.querySelectorAll("p"),
            img = document.querySelectorAll("img");

        decryptItems(h1, password);
        decryptItems(h2, password);
        decryptItems(h3, password);
        decryptItems(p, password);
        decryptImages(img, password)
        
        lazyLoad()

        time_after = new Date()
        time_after = time_after.getTime()

        console.log(time_after - time_before)
    }
}

function decryptItems(elements, password) {
    elements.forEach((element) => {
        element.innerText = decrypt(element.innerText, password);
    });
}

function decryptImages(elements, password) {
    elements.forEach((element) => {
        if (element.src.value) {
            element.src.value = decrypt(element.src.value, password)
        } else if (element.dataset.src) {
            element.dataset.src = decrypt(element.dataset.src, password)
        }
    });
}

const encryptedPassword = "U2FsdGVkX1/xWuctyJISodaT5oDfL7r2l19sOZm3zQ0=",
    input = document.querySelector("#input"),
    submit = document.querySelector(".submit"),
    content = document.querySelector('#content'),
    inputHolder = document.querySelector('.input-holder');

let authenticated = false;

input.onkeydown = function(event) {
    if (event.keyCode == 13) {
        testPassword()
    }
} 

submit.onclick = function() {
    testPassword()
}

// console.log(encrypt('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.TCWF-a_k7sV25RqjeKkKZgHaE2%26pid%3DApi&f=1', 'Hello World'))