// Abre y cierra el boton de jugar
document.getElementById("openJugar").onclick = function() {
    document.getElementById("jugar").style.display = "block";
    window.location.href ="EcoSort.html";
};

document.getElementById("closeJugar").onclick = function() {
    document.getElementById("jugar").style.display = "none";
};

// Abre y cierra el boton de aprende
document.getElementById("openAprende").onclick = function() {
    document.getElementById("aprende").style.display = "block";
};

document.getElementById("closeAprende").onclick = function() {
    document.getElementById("aprende").style.display = "none";
};

// Abre y cierra el boton de créditos
document.getElementById("openCreditos").onclick = function() {
    document.getElementById("creditos").style.display = "block";
};

document.getElementById("closeCreditos").onclick = function() {
    document.getElementById("creditos").style.display = "none";
};

// Manejo de los su pop ups
const openBasurero = document.querySelectorAll(".openBasurero");
const closeBasurero = document.querySelectorAll(".closeBasurero");

openBasurero.forEach(button => {
    button.onclick = function() {
        const target = this.getAttribute("data-target");
        document.getElementById(target).style.display = "block";
    };
});

closeBasurero.forEach(button => {
    button.onclick = function() {
        this.parentElement.style.display = "none";
    };
});
