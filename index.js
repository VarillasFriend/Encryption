// This class adds onclick and onkeydown properties to an element
// to make it clickable and accesible easily

class Clicker {
    constructor(element, action, parameters = null) {
        this.element = element;
        this.action = action;
        this.parameters = parameters;

        this.createClick = function () {
            element.onclick = function () {
                action(parameters);
            };

            element.onkeydown = function (event) {
                if (event.keyCode == 32 || event.keyCode == 13) {
                    event.preventDefault();
                    action(parameters);
                }
            };
        };
    }
}

// lazyload() changes the data-src value of an image to src to
// load it lazily

let lazyLoadThrottleTimeout;
let displayed = false;

function lazyLoad() {
    if (displayed) {
        const lazyLoadImages = document.querySelectorAll("img.lazy");
        if (lazyLoadThrottleTimeout) {
            clearTimeout(lazyLoadThrottleTimeout);
        }

        width = "44";
        height = "44";
        lazyLoadThrottleTimeout = setTimeout(function () {
            lazyLoadImages.forEach((img) => {
                if (
                    img.parentElement.offsetTop <
                    window.innerHeight + window.pageYOffset + 400
                ) {
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
}

document.addEventListener("scroll", lazyLoad);
window.addEventListener("resize", lazyLoad);
window.addEventListener("orientationChange", lazyLoad);

// encrypt() encrypts a string with AES and returns it as a
// string

function encrypt(message = "", key = "") {
    var message = CryptoJS.AES.encrypt(message, key);
    return message.toString();
}

// decrypt() denrypts a string with AES and returns it as a
// string

function decrypt(message = "", key = "") {
    var code = CryptoJS.AES.decrypt(message, key);
    var decryptedMessage = code.toString(CryptoJS.enc.Utf8);

    return decryptedMessage;
}

// Variable declarations

const encryptedPassword =
        "U2FsdGVkX18eIVxBabE9hdG9cJy0NiBeN30QkHonimgm5wz1JsAkv3iykRaJd97x",
    input = document.querySelector("#input"),
    submit = document.querySelector(".submit"),
    content = document.querySelector("#content"),
    inputHolder = document.querySelector(".input-holder"),
    images = document.querySelectorAll("#img-holder img"),
    showImage = document.querySelector("#show-image"),
    all = document.getElementById("all"),
    theme = document.querySelector("#theme"),
    root = document.querySelector(":root"),
    svg = document.querySelector("#svg"),
    body = document.querySelector("body");

let n = 4,
    n1 = 4,
    start,
    authenticated = false;

// testPassword() compares the password from the user to an
// encrypted password and if they are the same, it calls other
// functions

function testPassword(password) {
    if (!password) {
        password = document.querySelector("#input").value;
    }

    if (decrypt(encryptedPassword, password) == password && password) {
        authenticated = true;

        window.requestAnimationFrame(animateLock);
        setTimeout(() => submitForm(password, true), 400);

        sessionStorage.setItem("password", password);
    } else {
        animateInput();
    }
}

// animateLock() makes the animation that makes the svg-lock
// "open" itself when the password is right

function animateLock(timestamp) {
    if (start === undefined) start = timestamp;
    const elapsed = timestamp - start;

    n = 4 - Math.min(0.005 * elapsed, 2);
    n1 = 4 + Math.min(0.005 * elapsed, 2);
    svg.attributes.d.value = `M8 11v-${n1}a4 4 0 0 1 8 0v${n}`;

    if (elapsed < 400) {
        window.requestAnimationFrame(animateLock);
    }
}

// submitForm() calls other functions if the password was right

function submitForm(password, animation) {
    if (authenticated) {
        displayContent(animation);
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
    }
}

// displayContent() displays the content with an animation when
// submitForm() calls it

function displayContent(animation) {
    if (animation) {
        inputHolder.classList.add("disappear");
        content.classList.add("appear");
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;

        setTimeout(() => (inputHolder.style.display = "none"), 500);
        setTimeout(() => (displayed = true), 400);
    } else {
        inputHolder.classList.add("quick-disappear");
        content.classList.add("quick-appear");
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;

        inputHolder.style.display = "none";
        displayed = true;
    }
}

// decryptItems() decrypts the contents of every element on a list

function decryptItems(elements, password) {
    elements.forEach((element) => {
        element.innerText = decrypt(element.innerText, password);
    });
}

// decryptImages() decrypts the data-title, data-desc and data-src
// attributes of every element on a list, and in case it has a src
// value, it decrypts that, making it compatible with lazyLoad()

function decryptImages(elements, password) {
    elements.forEach((element) => {
        if (element.src) {
            element.src = decrypt(element.dataset.src, password);
        }
        if (element.dataset.src) {
            element.dataset.src = decrypt(element.dataset.src, password);
        }
        element.dataset.title = decrypt(element.dataset.title, password);
        element.dataset.desc = decrypt(element.dataset.desc, password);
    });
}

// If the inputed password was wrong, testPassword calls
// animateInput(), which will play an animation on the input

function animateInput() {
    input.classList.add("wrong");
    input.onanimationend = function (event) {
        input.classList.remove("wrong");
    };
}

submitClicker = new Clicker(submit, testPassword);
submitClicker.createClick();

// When enter is pressed on the input, testPassword() gets
// called

input.onkeydown = function (event) {
    if (event.keyCode == 13) {
        testPassword();
    }
};

// When an image gets clicked, showImg() gets called

images.forEach((image) => {
    image.onclick = function (event) {
        showImg(image, event);
    };
});

// showImg() displays an image and its title and description

function showImg(image, event) {
    // The showImage div changes to have another HTML inside, with
    // the img, title and desdc
    showImage.innerHTML = `<img src='${image.src}'> <div id='show-image-description'> <h1>${image.dataset.title}</h1> <p>${image.dataset.desc}</p> <svg xmlns="http://www.w3.org/2000/svg" id="close" class='icon' tabindex='0' width="30" height="30" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg> </div>`;
    showImage.classList.add("show");

    // Background gets blurred
    all.style.filter = "blur(10px)";

    closeClicker = new Clicker(document.querySelector("#close"), stopShowImg);
    closeClicker.createClick();

    all.onclick = function (event2) {
        if (event2 != event) {
            stopShowImg();
        }
    };
}

// The HTML contents of the showImage div get cleared, the
// background gets unblurred

function stopShowImg() {
    showImage.innerHTML = "";
    showImage.classList.remove("show");
    all.style.filter = "blur(0px)";
}

// changeTheme changes CSS root variables so that colors
// will change

function changeTheme(save) {
    body.classList.toggle("dark-theme");
    body.classList.toggle("light-theme");

    // if true gets passed as an argument, the theme selection
    // is remembered by the browser the next time the user enters
    // the site
    if (save) {
        localStorage["theme"] =
            localStorage["theme"] == "dark" ? "light" : "dark";
    }
}

themeClicker = new Clicker(theme, changeTheme, true);
themeClicker.createClick();

function setTransitionsToNormal() {
    document.querySelectorAll("*").forEach(function (element) {
        element.style.transition = "color 1s, background-color 1s";
    });
    document.querySelector("#content").style.transition = "opacity 0.5s";
    document.querySelector(".input-holder").style.transition = "opacity 0.5s";
}

// When the user enters the site, this checks weather there was
// a theme saved by the user

if (localStorage["theme"] == "light") {
    document.querySelectorAll("*").forEach(function (element) {
        element.style.transition = "color 0s, background-color 0s";
    });
    changeTheme(false);

    // Without the setTimeout, when the user enters the site, there will
    // be a transition changing from dark to light
    setTimeout(() => setTransitionsToNormal(), 0);
}

if (sessionStorage.getItem("password")) {
    authenticated = true;
    submitForm(sessionStorage.getItem("password"), false);
}

function iOS() {
    return (
        [
            "iPad Simulator",
            "iPhone Simulator",
            "iPod Simulator",
            "iPad",
            "iPhone",
            "iPod",
        ].includes(navigator.platform) ||
        // iPad on iOS 13 detection
        (navigator.userAgent.includes("Mac") && "ontouchend" in document)
    );
}

if (iOS) {
    body.style.transition = "color 0.3s, background-color 0.3s";
}

// console.log(
//     encrypt(
//         "<a href='https://www.youtube.com/watch?v=cICYAVc0ANU'>Soy Caillouuuuuuuu.</a>",
//         "VcDM63Ek!W9*Qzw$"
//     )
// );
