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
            debug: false // Me permite ver la hitbox de los objetos 
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Variables globales
let lives = 3;   // Cantidad de vidas
let livesText;   // Texto de vidas
let pauseMenu, resumeButton, mainMenuButton, restartButton;
let trash;       // Objeto de desecho
let cursors;     // Teclas para mover los desechos
let containers = [];  // Array para almacenar los contenedores
let score = 0;   // Puntuación del juego
let scoreText;   // Texto de puntuación
let movingRight = false;
let movingLeft = false;
let canCollide = true;
var puedeApretarAbajo= true;
var velocidad =600;
const posicionesX = [200, 500, 800, 1100, 1400, 1700];
let imagenestrash = ['desechoPapel','desechoPlastico','desechoVidrio','desechoPeligroso','desechoOrganico','desechoGeneral']; //Arreglo que guardara las imagenes para poder randomizarlas


// Iniciar el juego
let game = new Phaser.Game(config);

// Preload: carga los assets (gráficos) necesarios
function preload() {
    this.load.image("background", 'sprites/background.png');
     
    //Imagen del boton del menú
    this.load.image('menú', 'sprites/menú.png');

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

    // Fondo centrado en la parte superior, la imagen esta en comentario porque ocupa mucho espacio por ahora
    const fondo = this.add.image(0,0, "background").setOrigin(0); 
    fondo.setDisplaySize(this.scale.width, this.scale.height);
    // Contenedores en la parte inferior (6 en total)
    // Crear los contenedores en la parte inferior (6 en total)
    containers[0] = this.physics.add.staticImage(200, 870, 'contenedorPapel').setDisplaySize(260,400);
    containers[1] = this.physics.add.staticImage(500, 870, 'contenedorPlastico').setDisplaySize(260,400);
    containers[2] = this.physics.add.staticImage(800, 870, 'contenedorVidrio').setDisplaySize(260,400);
    containers[3] = this.physics.add.staticImage(1100, 870, 'contenedorPeligroso').setDisplaySize(260,400);
    containers[4] = this.physics.add.staticImage(1400, 870, 'contenedorOrganico').setDisplaySize(260,400);
    containers[5] = this.physics.add.staticImage(1700, 870, 'contenedorGeneral').setDisplaySize(260,400);
    
    
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

    // Mostrar la puntuación y vida en pantalla
    scoreText = this.add.text(16, 16, 'Puntuación: 0', { fontSize: '32px', fill: '#fff' });
    livesText = this.add.text(16, 56, 'Vidas: ' + lives, { fontSize: '32px', fill: '#fff' }); 

    // Crear el botón del menú
    pauseButton = this.add.image(1820, 80, 'menú')
    .setDisplaySize(80, 80)
    .setOrigin(0.5)
    .setInteractive()
    .setDepth(10)  // Asegura que esté sobre todos los demás elementos
    .on('pointerdown', () => {
        if (this.scene.isPaused()) {
            pauseMenu.setVisible(false);
            this.scene.resume();
        } else {
            pauseMenu.setVisible(true);
        }
    }); 

// Crear el menú de menú (inicialmente oculto)
pauseMenu = this.add.group();

// Fondo semitransparente
let background = this.add.rectangle(1800, 270, 400, 250, 0x000000, 0.5)
.setDepth(9);  // Fondo del menú en un nivel alto
pauseMenu.add(background);

// Botón de Reanudar
resumeButton = this.add.text(1770, 220, 'Reanudar', { fontSize: '32px', fill: '#FFF' })
.setOrigin(0.5)
.setInteractive()
.setDepth(100)  // Nivel superior
.on('pointerdown', () => {
    pauseMenu.setVisible(false);
    this.scene.resume();  // Reanuda la escena
});
pauseMenu.add(resumeButton);

// Botón de Reiniciar Nivel
restartButton = this.add.text(1760, 270, 'Reiniciar Nivel', { fontSize: '32px', fill: '#FFF' })
.setOrigin(0.5)
.setInteractive()
.setDepth(100)
.on('pointerdown', () => {
    lives = 3;
    livesText.setText('Vidas: '+ lives);
    this.scene.restart();  // Reinicia el nivel actual
});
pauseMenu.add(restartButton);

// Botón de Regresar al menú principal
mainMenuButton = this.add.text(1770, 330, 'Menú Principal', { fontSize: '32px', fill: '#FFF' })
.setOrigin(0.5)
.setInteractive()
.setDepth(100)
.on('pointerdown', () => {
    this.scene.stop();  // Detiene el nivel actual
    window.location.href = 'EcoSort/index.html';  // Redirige a la URL deseada
});
pauseMenu.add(mainMenuButton);

// Oculta el menú de menú al inicio
pauseMenu.setVisible(false);

// Detecta tecla de menú
this.input.keyboard.on('keydown-ESC', () => {
if (this.scene.isPaused()) {
    pauseMenu.setVisible(false);
    this.scene.resume();
} else {
    pauseMenu.setVisible(true);
}
});

}



// Update: se ejecuta en cada frame, maneja las interacciones
function update() {
    trash.setDisplaySize(170, 170);
    trash.setSize(100, 100);

    //Mejorar la redundancia de if
    // Solo permite movimiento si las teclas están habilitadas
    if (cursors.right.enabled) 
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
        } else if (cursors.right.isUp) 
            movingRight = false; // Resetea el estado cuando la tecla se suelta
        
    

    if (cursors.left.enabled) {
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
    }

    if (cursors.down.enabled) {
        // Hacer que la basura baje más rápido cuando presionas la tecla abajo
        if (cursors.down.isDown && puedeApretarAbajo) {
            trash.setVelocityY(velocidad + 300); // Aumenta la velocidad solo una vez
            puedeApretarAbajo = false;
        } else if (!cursors.down.isDown) {
            puedeApretarAbajo = true; // Permitir volver a presionar hacia abajo
            trash.setVelocityY(velocidad - 300); // Reestablece la velocidad al soltar la tecla abajo
        }
    }
}



// Función para verificar si la basura cae en el contenedor correcto
function matchContainer(trash, container) {
    if (!canCollide) return;

    const puntosObtenidos = calcularPuntos(trash, container);
    if (puntosObtenidos > 0) 
        score += puntosObtenidos;
     else {
        // Resta una vida si la basura no coincide con el contenedor
        lives--;
        livesText.setText('Vidas: ' + lives);
        if (lives <= 0) {
            lives = 0;
            gameOver.call(this); // Llama a la función para finalizar el juego
            return;
        }
    }
    
    // Actualiza el texto de puntuación
    scoreText.setText('Puntuación: ' + score);

    // Reposiciona la basura en la parte superior con una imagen aleatoria
    trash.y = 50;
    const IndiceAleatorio = Phaser.Math.Between(0, posicionesX.length - 1);
    trash.x = posicionesX[IndiceAleatorio];
    const IndiceImagenAleatorio = Phaser.Math.Between(0, imagenestrash.length - 1);
    trash.setTexture(imagenestrash[IndiceImagenAleatorio]);

    canCollide = false;
    setTimeout(() => { canCollide = true; }, 1000);
}

function calcularPuntos(trash, container) {
    let puntos = 0;

   
    
    //Mejorar la redundancia de if
    if (container.texture.key === 'contenedorPapel' && trash.texture.key === 'desechoPapel') 
        puntos += 10;
     else if (container.texture.key === 'contenedorPlastico' && trash.texture.key === 'desechoPlastico') 
        puntos += 10;
     else if (container.texture.key === 'contenedorVidrio' && trash.texture.key === 'desechoVidrio') 
        puntos += 10;
     else if (container.texture.key === 'contenedorOrganico' && trash.texture.key === 'desechoOrganico') 
        puntos += 10;
     else if (container.texture.key === 'contenedorPeligroso' && trash.texture.key === 'desechoPeligroso') 
        puntos += 10;
     else if (container.texture.key === 'contenedorGeneral' && trash.texture.key === 'desechoGeneral') 
        puntos += 10;
     else 
        puntos -= 10; // Solo se restan puntos si no hay coincidencia
    

   
    return puntos;
}

// Función para terminar el juego cuando las vidas llegan a 0
function gameOver() {
    // Desactiva las entradas del teclado
    cursors.left.enabled = false;
    cursors.right.enabled = false;
    cursors.down.enabled = false;

    // Muestra el texto de Game Over
    this.add.text(960, 440, 'Game Over', { fontSize: '64px', fill: '#ff0000' }).setOrigin(0.5);

    // Botón para reiniciar el juego (recarga la página)
    const restartButton = this.add.text(960, 520, 'Reiniciar', { fontSize: '32px', fill: 'black' })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => {
            location.reload(); // Para recargar la página
        });

    // Botón para ir a la página principal
    const mainMenuButton = this.add.text(960, 580, 'Menú Principal', { fontSize: '32px', fill: 'black' })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => {
            window.location.href = 'EcoSort/index.html'; // Redirige a la página del menú principal
        });
}

