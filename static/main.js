// Configuración básica de Phaser

var config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT, // Cambia a FIT para que se reescale automaticamente en cualquier dispositivo
        autoCenter: Phaser.Scale.autoCenter,
        width: 1920, //ancho de pantalla
        height: 1080, // alto de pantalla
    },
    physics: {
        default: 'arcade', //Tipo de fisica a usar
        arcade: {
            gravity: { y: 300 }, // Gravedad para que los desechos caigan
            debug: true // Me permite ver la hitbox de los objetos 
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Variables globales
let trash;       // Objeto de desecho
let cursors;     // Teclas para mover los desechos
let containers = [];  // Array para almacenar los contenedores
let score = 0;   // Puntuación del juego
let scoreText;   // Texto de puntuación
let movingRight = false;
let movingLeft = false;
let imagenestrash = ['desechoPapel','desechoPlastico','desechoVidrio','desechoPeligroso','desechoOrganico','desechoGeneral']; //Arreglo que guardara las imagenes para poder randomizarlas


// Iniciar el juego
let game = new Phaser.Game(config);

// Preload: carga los assets (gráficos) necesarios
function preload() {
    this.load.image("background", ".//sprites/background.png");
     
    //Imagen del boton regresar
    this.load.image('regresar', 'sprites/regresar.png');

    //Imagenes de los contenedores
    this.load.image('contenedorPapel', 'sprites/contenedorPapel.png'); // Contenedor de papel
    this.load.image('contenedorPlastico', 'sprites/contenedorPlastico.png'); // Contenedor de plástico
    this.load.image('contenedorVidrio', 'sprites/contenedorVidrio.png'); // Contenedor de vidrio
    this.load.image('contenedorPeligroso', 'sprites/contenedorPeligroso.png'); // Contenedor de metal
    this.load.image('contenedorOrganico', 'sprites/contenedorOrganico.png'); // Contenedor orgánico
    this.load.image('contenedorGeneral', 'sprites/contenedorGeneral.png'); // Contenedor de residuos generales

    //Imagenes de los diferentes desechos
    this.load.image('desechoPapel','sprites/desechoPapel.png') // Desecho de papel
    this.load.image('desechoPlastico','sprites/desechoPlastico.png') // Desecho de plástico
    this.load.image('desechoVidrio','sprites/desechoVidrio.png') // Desecho de vidrio
    this.load.image('desechoPeligroso','sprites/desechoPeligroso.png') // Desecho de peligros
    this.load.image('desechoOrganico','sprites/desechoOrganico.png') // Desecho de materia organica
    this.load.image('desechoGeneral','sprites/desechoGeneral.png') // Desechos en general
}

// Create: inicializa los objetos en la escena
function create() {
    
        // Crear botón interactivo en la parte superior derecha
    const volver = this.add.image(1800, 70, 'regresar').setInteractive().setDisplaySize(100, 80);
    
    volver.on('pointerdown', () => {
        // Redirigir a la página principal
        window.location.href = "/Interfaz-principal/EcoSort.html";
    });


    // Fondo centrado en la parte superior, la imagen esta en comentario porque ocupa mucho espacio por ahora
    //this.add.image(0,0, "background"); 

    // Contenedores en la parte inferior (6 en total)
    // Crear los contenedores en la parte inferior (6 en total)
    containers[0] = this.physics.add.staticImage(200, 870, 'contenedorPapel').setDisplaySize(260,400);
    

    containers[1] = this.physics.add.staticImage(500, 870, 'contenedorPlastico').setDisplaySize(260,400);
    containers[2] = this.physics.add.staticImage(800, 870, 'contenedorVidrio').setDisplaySize(260,400);
    containers[3] = this.physics.add.staticImage(1100, 870, 'contenedorPeligroso').setDisplaySize(260,400);
    containers[4] = this.physics.add.staticImage(1400, 870, 'contenedorOrganico').setDisplaySize(260,400);
    containers[5] = this.physics.add.staticImage(1700, 870, 'contenedorGeneral').setDisplaySize(260,400);
    

    const posicionesX = [200, 500, 800, 1100, 1400, 1700];
    const IndicePosicionAleatorio = Phaser.Math.Between(0, posicionesX.length - 1);
    const IndiceImagenAleatorio = Phaser.Math.Between(0, imagenestrash.length - 1);

    // Crear el objeto de basura
    trash = this.physics.add.sprite(posicionesX[IndicePosicionAleatorio], 50, imagenestrash[IndiceImagenAleatorio]);
    trash.setDisplaySize(120, 120);
    trash.setSize(80,80);
    trash.setVelocityY(400);
    trash.setCollideWorldBounds(true); // Para que no salga de la pantalla

    // Detectar colisiones entre la basura y los contenedores
    for (let i = 0; i < containers.length; i++) {
        this.physics.add.collider(trash, containers[i], matchContainer, null, this);
    }

    // Teclado para mover la basura
    cursors = this.input.keyboard.createCursorKeys();

    // Mostrar la puntuación en pantalla
    scoreText = this.add.text(16, 16, 'Puntuación: 0', { fontSize: '32px', fill: '#fff' });
}
var puedeApretarAbajo= true;
var velocidad =600;
// Update: se ejecuta en cada frame, maneja las interacciones
function update() {

    trash.setDisplaySize(120, 120);
    trash.setSize(80,80);
    // Mover la basura a la derecha
    if (cursors.right.isDown && !movingRight) {
        movingRight = true; // Establece que ya se ha movido a la derecha
        if (trash.x >= 200 && trash.x < 500)
            trash.x = 500; 
        else if (trash.x >= 500 && trash.x < 800)
            trash.x = 800;
        else if (trash.x >= 800 && trash.x < 1100)
            trash.x = 1100;
        else if (trash.x >= 1100 && trash.x < 1400)
            trash.x = 1400;
        else if (trash.x >= 1400 && trash.x < 1700)
            trash.x = 1700;
    } else if (cursors.right.isUp) {
        movingRight = false; // Resetea el estado cuando la tecla se suelta
    }

    // Mover la basura a la izquierda
    if (cursors.left.isDown && !movingLeft) {
        movingLeft = true; // Establece que ya se ha movido a la izquierda
        if (trash.x <= 1700 && trash.x > 1400)
            trash.x = 1400; 
        else if (trash.x <= 1400 && trash.x > 1100)
            trash.x = 1100; 
        else if (trash.x <= 1100 && trash.x > 800)
            trash.x = 800;
        else if (trash.x <= 800 && trash.x > 500)
            trash.x = 500;
        else if (trash.x <= 500 && trash.x > 200)
            trash.x = 200;
    } else if (cursors.left.isUp) {
        movingLeft = false; // Resetea el estado cuando la tecla se suelta
    }

    // Hacer que la basura baje más rápido cuando presionas la tecla abajo
    if (cursors.down.isDown && puedeApretarAbajo) {
        trash.setVelocityY(velocidad + 300); // Aumenta la velocidad solo una vez
        puedeApretarAbajo = false;
    } else if (!cursors.down.isDown) {
        puedeApretarAbajo = true; // Permitir volver a presionar hacia abajo
        trash.setVelocityY(velocidad + 300); // Reestablece la velocidad al soltar la tecla abajo
    }
}

let canCollide = true;
// Función para verificar si la basura cae en el contenedor correcto
function matchContainer(trash, container) {
    if( !canCollide) return;
     // Sumar puntos por acierto
     const puntosObtenidos = calcularPuntos(trash, container);
    
     if (score  + puntosObtenidos < 0) 
         score = 0;
     else 
         score += puntosObtenidos;
     
     scoreText.setText('Puntuación: ' + score);
    if (container.texture && container.texture.key) {
        console.log("Container clave: " + container.texture.key);
    } else {
        console.error("El contenedor no está definido correctamente:", container);
        return; // Salir de la función si el contenedor no es válido
    }

    // Lógica para detectar si es el contenedor correcto
    trash.y = 50;
    const posicionesX = [200, 500, 800, 1100, 1400, 1700];
    const IndiceAleatorio = Phaser.Math.Between(0, posicionesX.length - 1);
    trash.x = posicionesX[IndiceAleatorio];
    const IndiceImagenAleatorio = Phaser.Math.Between(0, imagenestrash.length - 1);
    trash.setTexture(imagenestrash[IndiceImagenAleatorio]);
    trash.setDisplaySize(120, 120);
    trash.setSize(80,80);

   canCollide = false;
   setTimeout(() => {canCollide = true; }, 1000);
}


function calcularPuntos(trash, container) {
    let puntos = 0;

    // Log de las texturas para depuración
    console.log("Container: " + container.texture.key + ", Trash: " + trash.texture.key);

    if (container.texture.key === 'contenedorPapel' && trash.texture.key === 'desechoPapel') {
        puntos += 10;
    } else if (container.texture.key === 'contenedorPlastico' && trash.texture.key === 'desechoPlastico') {
        puntos += 10;
    } else if (container.texture.key === 'contenedorVidrio' && trash.texture.key === 'desechoVidrio') {
        puntos += 10;
    } else if (container.texture.key === 'contenedorOrganico' && trash.texture.key === 'desechoOrganico') {
        puntos += 10;
    } else if (container.texture.key === 'contenedorPeligroso' && trash.texture.key === 'desechoPeligroso') {
        puntos += 10;
    } else if (container.texture.key === 'contenedorGeneral' && trash.texture.key === 'desechoGeneral') {
        puntos += 10;
    } else {
        puntos -= 10; // Solo se restan puntos si no hay coincidencia
    }

    // Log de puntos calculados
    console.log("Puntos calculados: " + puntos);
    return puntos;
}

