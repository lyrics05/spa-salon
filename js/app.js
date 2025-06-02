// Modal functions
const crearCita = document.querySelector("#cita_crear");
const divModalCita = document.querySelector("#modal-cita");
const btn_cerraModal = document.querySelector("#cerrar-modal");
const formulario = document.querySelector("#contact-form")

crearCita.addEventListener("click", mostrarModalCita);
btn_cerraModal.addEventListener("click", closeModal);

function mostrarModalCita(e) {
    e.preventDefault();
    divModalCita.classList.add("active");
}

function closeModal(e) {
    e.preventDefault();
    divModalCita.classList.remove("active");
}

// EmailJS Initialization
document.addEventListener("DOMContentLoaded", function() {
    emailjs.init("bBGhfBvDXufkgjeVw"); // Tu User ID
    
    document.getElementById("contact-form").addEventListener("submit", function(event) {
        event.preventDefault();
        
        // Validación
        const nombre = document.querySelector("#name").value;
        const email = document.querySelector("#email").value;
        const message = document.querySelector("#message").value;
        
        if([nombre, email, message].some(v => v.trim() == "")) {
            showStatusMessage("Todos los campos son obligatorios", "error");
            return;
        }
        
        if(!validarEmail(email)) {
            showStatusMessage("El email no es válido", "error");
            return;
        }
        
        // Envío del formulario
        emailjs.sendForm("service_u30wc2h", "template_c4uuogc", this)
            .then(function() {
                showStatusMessage("Mensaje enviado te Contactaremos lo Antes Posible", "success");
                
            }, function(error) {
                console.error("Error:", error);
                showStatusMessage("Error al enviar el mensaje", "error");
            });

          formulario.reset()
    });
});

// Helper functions
function validarEmail(email) {
    const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
    return regex.test(email);
}

function showStatusMessage(message, type) {
    // Eliminar mensajes anteriores si existen
    const existingMessage = document.getElementById("status-message");
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Crear nuevo mensaje
    const p = document.createElement("p");
    p.id = "status-message";
    p.textContent = message;
    p.classList.add(type);
    
    // Insertar después del formulario
    const form = document.getElementById("contact-form");
    form.parentNode.insertBefore(p, form.nextSibling);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        p.remove();
    }, 5000);
}

// Swiper initialization
var swiper = new Swiper(".swiper", {
    effect: "cube",
    grabCursor: true,
    cubeEffect: {
        shadow: true,
        slideShadows: true,
        shadowOffset: 20,
        shadowScale: 0.94,
    },
    pagination: {
        el: ".swiper-pagination",
    },
});