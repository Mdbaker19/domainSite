(() => {

  const canvas = document.getElementById('canvas');
  const pointHtml = document.getElementById('shipScore');
  const hpHtml = document.getElementById('shipHp');
  let points = 0;
  let playerHp = 20;

  function isColliding(obj1, obj2) {
    return (
      obj1.x < obj2.x + obj2.w &&
      obj1.x + obj1.w > obj2.x &&
      obj1.y < obj2.y + obj2.h &&
      obj1.y + obj1.h > obj2.y
    );
  }

  function ran() {
    let out = Math.random().toFixed(3).toString();;
    let opts = 'abcdefghijklmnoprstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-_=+[]{};":.,<>/?';
    for(let i = 0; i < 18; ++i) {
      out += opts[Math.floor(Math.random() * (opts.length - 1))];
    }
    out += Math.random().toFixed(5).toString();
    return out;
  }
  

  function Bullet(x, y) {
    this.x = x;
    this.y = y;
    this.w = 10;
    this.h = 12;
    this.id = ran();
    this.draw = () => {
      const i = new Image();
      i.src = 'bullet.png';
      ctx.drawImage(i, this.x, this.y);
    };

    this.update = () => {
      this.move();
      if (this.y < 0) {
        return this.id;
      }
      this.draw();
      return null;
    };

    this.move = () => {
      this.y -= 10;
    };
  }

  function Enemy(x, y) {
    this.x = x;
    this.y = y;
    this.w = 26;
    this.h = 14;
    this.id = ran();
    this.draw = () => {
      const ib = new Image();
      ib.src = 'bad.png';
      ctx.drawImage(ib, this.x, this.y);
    };

    this.update = () => {
      this.move();
      if (this.y > Math.max(2400, canvas.height)) {
        return this.id;
      }
      this.draw();
      return null;
    };

    this.move = () => {
      this.y += 2;
    };
  }

  function Ship(x, y) {
    this.x = x;
    this.y = y;
    this.w = 56;
    this.h = 50;
  }

    const cards = [
        {
            description: 'Hello there, its my site for my creations and sharing details and such.\n' +
                '            Site is deployed with AWS Amplify hosting a standard HTML/CSS/JS website -_-\n' +
                '            Went to Code up in \'20-\'21. I have worked in a few different development positions in AWS with Lambdas in Node, React, Spring, Java, JS, Angular, proprietary languages. I have a background in the auto industry. \n' +
                '             I enjoy building custom hardware projects with Pi Pico and Python for loved ones and remaking classic games to the best of my ability in Haxe Flixel.',
            title: 'About me'
        },
        {
            description: "Web Mastermind Built in vanilla JS CSS HTML and Jquery. User leader board posted to AWS Dynamo DB",
            link: "mm.html",
            linkText: "Play",
            image: './webmm.png'
        },
        {
            description: "My Github",
            link: "https://github.com/Mdbaker19",
            linkText: "See my Github",
            image: './gh.png'
        }
    ];

    let elements = '';
    for (let i = 0; i < cards.length; i++) {
        elements += genCard(cards[i], i === 0);
    }
    document.getElementById("cards").insertAdjacentHTML("afterbegin", elements);


    function genCard(data, basic) {
        if (basic) {
            return `
              <div class="row">
                <div class="col s12 m7 l5 offset-m2 offset-l3" style=opacity:.6>
                  <div class="card blue-grey darken-1">
                    <div class="card-content white-text">
                      <span class="card-title">${data.title}</span>
                      <p>${data.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            `
        }
        return `
          <div class="row">
            <div class="col s12 m7 l5 offset-m2 offset-l3" style=opacity:.6>
              <div class="card">
                <div class="card-image">
                  <img src="${data.image}">
                </div>
                <div class="card-content">
                  <p>${data.description}</p>
                </div>
                <div class="card-action">
                  <a href="${data.link}">${data.linkText}</a>
                </div>
              </div>
            </div>
          </div>
            `;
    }



    const ctx = canvas.getContext('2d');

    const playerShip = new Ship();

    const enemies = [];
    const bullets = [];

    const img = new Image();
    img.src = 'ship.png';
    let mx = 0;
    let my = 0;

    img.onload = function() {
      draw();
    };

    img.onerror = function() {
      console.error('Image failed to load.');
    };

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    window.addEventListener('mousemove', (e) => {
      mx = e.clientX - (playerShip.w / 2);
      my = e.clientY - (playerShip.h / 2);
      playerShip.x = mx;
      playerShip.y = my;
    });

    window.addEventListener('click', (e) => {
      console.log('clicking')
      let xc = mx;
      if (Math.random() > .5) {
        xc += Math.floor(playerShip.w * .8);
      }
      bullets.push(new Bullet(xc, my));
    });

    function doBullets() {
      for (let i = bullets.length - 1; i > 0; --i) {
        let bullet = bullets[i];
        let id = bullet.update();
        if (id) {
          bullets.splice(i, 1);
          return;
        }
         else {
          for (let e = enemies.length - 1; e > 0; --e) {
            if (isColliding(enemies[e], bullet)){
              enemies.splice(e, 1);
              bullets.splice(i, 1);
              points++;
              return;
            }
          }
        }
      }
    }

    function doEnemies() {
      for (let i = enemies.length - 1; i > 0; --i) {
        let enemy = enemies[i]
        let id = enemy.update();
        if (id) {
          enemies.splice(i, 1);
          return;
        } else {
          if (isColliding(playerShip, enemy)) {
            enemies.splice(i, 1);
            playerHp--;
            playerHp = Math.max(0, playerHp);
            return;
          }
        }
      }
    }

    setInterval(() => {
      enemies.push(new Enemy(Math.floor(Math.random() * canvas.width), 0));
    }, 1600);

    function draw() {
      ctx.fillStyle = '#375661';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      if (playerHp <= 0) {
        ctx.globalAlpha = 0.2;
      }
      ctx.drawImage(img, mx, my);
      ctx.globalAlpha = 1.0

      doEnemies();
      doBullets();

      pointHtml.innerText = points;
      hpHtml.innerText = playerHp

      requestAnimationFrame(draw);
    }

})();
