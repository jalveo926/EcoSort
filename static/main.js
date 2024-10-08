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
            gravity: { y: 500 }, // Gravedad para que los desechos caigan
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
    this.load.image("background", ".//sprites/background.png");
    this.load.image('trash', 'sprites/trash.png'); // Imagen de basura
    this.load.image('contenedorPapel', 'sprites/contenedorPapel.png'); // Contenedor de papel
    this.load.image('contenedorPlastico', 'sprites/contenedorPlastico.png'); // Contenedor de plástico
    this.load.image('contenedorVidrio', 'sprites/contenedorVidrio.png'); // Contenedor de vidrio
    this.load.image('contenedorMetal', 'sprites/contenedorMetal.png'); // Contenedor de metal
    this.load.image('contenedorOrganico', 'sprites/contenedorOrganico.png'); // Contenedor orgánico
    this.load.image('contenedorGeneral', 'sprites/contenedorGeneral.png'); // Contenedor de residuos generales
}

// Create: inicializa los objetos en la escena
function create() {
    
    // Fondo centrado en la parte superior, la imagen esta en comentario porque ocupa mucho espacio por ahora
    //this.add.image(0,0, "background"); 

    // Contenedores en la parte inferior (6 en total)
    // Crear los contenedores en la parte inferior (6 en total)
    containers[0] = this.physics.add.staticImage(200, 800, 'contenedorPapel').setDisplaySize(150, 150);
    containers[0].setSize(150, 150); // Ajustar la hitbox

    containers[1] = this.physics.add.staticImage(500, 800, 'contenedorPlastico').setDisplaySize(150, 150);
    containers[1].setSize(150, 150); // Ajustar la hitbox

    containers[2] = this.physics.add.staticImage(800, 800, 'contenedorVidrio').setDisplaySize(290,290);
    containers[2].setSize(200, 200); // Ajustar la hitbox

    containers[3] = this.physics.add.staticImage(1100, 800, 'contenedorMetal').setDisplaySize(150, 150);
    containers[3].setSize(150, 150); // Ajustar la hitbox

    containers[4] = this.physics.add.staticImage(1400, 800, 'contenedorOrganico').setDisplaySize(150, 150);
    containers[4].setSize(150, 150); // Ajustar la hitbox

    containers[5] = this.physics.add.staticImage(1700, 800, 'contenedorGeneral').setDisplaySize(150, 150);
    containers[5].setSize(150, 150); // Ajustar la hitbox



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
