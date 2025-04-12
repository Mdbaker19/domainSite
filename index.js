(() => {

    console.log("hello there");

    const cards = [
        {
            description: "First Google link",
            link: "https://google.com",
            linkText: "Go to google"
        },
        {
            description: "My Github",
            link: "https://github.com/Mdbaker19",
            linkText: "Go to Git"
        },
        {
            description: "Second link to google",
            link: "https://google.com",
            linkText: "Go to google"
        },
        {
            description: "Github link project",
            link: "https://github.com",
            linkText: "Go to Git"
        }
    ];

    let elements = '';
    for (let i = 0; i < cards.length; i++) {
        elements += genCard(cards[i]);
    }
    document.getElementById("cards").insertAdjacentHTML("afterbegin", elements);


    function genCard(data) {
        return `
          <div class="row">
            <div class="col s12 m7">
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

})();
