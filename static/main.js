// Configuración básica de Phaser
const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE, // Cambia a RESIZE para que no esté centrado verticalmente
        width: 1920,
        height: 1080,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }, // Gravedad para que los desechos caigan
            debug: false
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

// Iniciar el juego
let game = new Phaser.Game(config);

// Preload: carga los assets (gráficos) necesarios
function preload() {
    this.load.image('background', 'path/to/background.png');
    this.load.image('trash', 'path/to/trash.png'); // Imagen de basura
    this.load.image('container1', 'path/to/container1.png'); // Contenedor 1
    this.load.image('container2', 'path/to/container2.png'); // Contenedor 2
    this.load.image('container3', 'path/to/container3.png'); // Contenedor 3
    this.load.image('container4', 'path/to/container4.png'); // Contenedor 4
    this.load.image('container5', 'path/to/container5.png'); // Contenedor 5
    this.load.image('container6', 'path/to/container6.png'); // Contenedor 6
}

// Create: inicializa los objetos en la escena
function create() {
    // Fondo centrado en la parte superior
    this.add.image(config.width / 2, config.height / 2, 'background');

    // Contenedores en la parte inferior (6 en total)
    containers[0] = this.physics.add.staticImage(200, 800, 'container1');
    containers[1] = this.physics.add.staticImage(500, 800, 'container2');
    containers[2] = this.physics.add.staticImage(800, 800, 'container3');
    containers[3] = this.physics.add.staticImage(1100, 800, 'container4');
    containers[4] = this.physics.add.staticImage(1400 , 800, 'container5');
    containers[5] = this.physics.add.staticImage(1700, 800, 'container6');

    // Crear el objeto de basura
    trash = this.physics.add.sprite(800, 50, 'trash');
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

// Update: se ejecuta en cada frame, maneja las interacciones
function update() {
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
    if (cursors.down.isDown) {
        trash.setVelocityY(300);  // Acelerar la caída
    }
}

// Función para verificar si la basura cae en el contenedor correcto
function matchContainer(trash, container) {
    // Lógica para detectar si es el contenedor correcto
    // Si la basura cae en el contenedor adecuado, aumenta la puntuación
    // Si no, restar vida o manejarlo de alguna otra forma
    score += 10;  // Sumar puntos por acierto
    scoreText.setText('Puntuación: ' + score);

    // Volver a generar basura desde arriba después de un acierto
    trash.y = 50;
    // Array con posicione especificas
    const posicionesX = [200,500,800,1100,1400,1700]
    const IndiceAleatorio = Phaser.Math.Between(0,posicionesX.length -1); // Posición aleatoria
    trash.x = posicionesX[IndiceAleatorio];
}
