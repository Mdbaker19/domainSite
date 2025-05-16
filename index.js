(() => {

    console.log("hello there");

    const cards = [
        {
            description: 'Hello there, its my site for my creations and sharing details and such.\n' +
                '            Site is deployed with AWS Amplify hosting a standard HTML/CSS/JS website -_-\n' +
                '            Went to Code up in \'20-\'21. I have worked in a few different development positions in AWS with Lambdas in Node, React, Spring, Java, JS, Angular, proprietary languages. I have a background in the auto industry. \n' +
                '             I enjoy building custom hardware projects with Pi Pico and Python for loved ones and remaking classic games to the best of my ability in Haxe Flixel.',
            title: 'About me'
        },
        {
            description: "Web Mastermind",
            link: "https://mdbaker19.github.io/MasterMind-project/",
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
                <div class="col s12 m7 l5 offset-m2 offset-l3">
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
            <div class="col s12 m7 l5 offset-m2 offset-l3">
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



    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const pos = [];

    window.addEventListener('mousemove', (e) => {
      pos.push({ x: e.clientX, y: e.clientY });
      if (pos.length > 100) pos.shift(); // keep last 100 points
    });

    function draw() {
      ctx.fillStyle = '#add8e6';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < pos.length; i++) {
        const { x, y } = pos[i];
        ctx.fillStyle = `rgba(0,0,0,${i / pos.length})`; // fade tail
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(draw);
    }
    draw();

})();
