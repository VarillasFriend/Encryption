// function encryptAll() {
//     const h1 = document.querySelectorAll("h1"),
//         h2 = document.querySelectorAll("h2"),
//         h3 = document.querySelectorAll("h3"),
//         p = document.querySelectorAll("p"),
//         img = document.querySelectorAll("img");

//     encryptItems(h1, password);
//     encryptItems(h2, password);
//     encryptItems(h3, password);
//     encryptItems(p, password);
//     encryptItems(img, password);
// }

// function reencrypt() {
//     console.log("HOLAA");
// }

// function encryptItems(elements, password) {
//     elements.forEach((element) => {
//         element.innerText = encrypt(element.innerText, password);
//     });
// }

// function encryptImages(elements, password) {
//     elements.forEach((element) => {
//         if (element.src.value) {
//             element.src.value = encrypt(element.src.value, password);
//         } else if (element.dataset.src) {
//             element.dataset.src = encrypt(element.dataset.src, password);
//         }
//         element.dataset.title = encrypt(element.dataset.title, password);
//         element.dataset.desc = encrypt(element.dataset.desc, password);
//     });
// }
