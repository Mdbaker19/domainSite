(() => {

    const colorKey = [
        "blue", "yellow", "darkorange", "green", "hotpink", "saddlebrown"
    ];
    const hardColorKey = [
        ...colorKey, "olivedrab", "purple", "dimgray", "lime", "tan"
    ];
    const expertKey = [
        ...hardColorKey, "cyan", "crimson", "aliceblue"
    ];

    let len = colorKey.length;

    let intervalID;
    let user;
    let mode = "Normal";
    let helpEnabled = false;
    let won = false;
    let hard = false;
    let expert = false;
    let sequence = [];
    let guessSet = [];
    let pickCount = 0;
    let count = 0;
    let time = 0;
    const easyOptionsHTML = `<span class="blue">Blue</span>, <span class="brown">Brown</span>, <span class="yellow">Yellow</span>, <span class="orange">Orange</span>, <span class="green">Green</span>, <span class="pink">Pink</span>`;
    const justHardHTML = `<span class="grey">Grey</span>, <span class="olive">Olive</span>, <span class="tan">Tan</span>, <span class="purple">Purple</span>, and <span class="lime">Lime</span>`;
    const hardOptionsAddHTML = `<span class="grey">Grey</span>, <span class="olive">Olive</span>, <span class="tan">Tan</span>, <span class="purple">Purple</span>, <span class="lime">Lime</span>`;
    const expertOptionsHTML = `<span class="cyan">Cyan</span>, <span class="crimson">Crimson</span> and <span class="aliceblue">AliceBlue</span>`;
    let optionsList = document.getElementById("optionsList");
    let list = document.getElementById("otherColors");


    let remove = document.getElementById("remove");
    let startGame = document.getElementById("newGame");
    let hardMode = document.getElementById("increaseDiff");
    const hardButtons = document.getElementsByClassName("hard");
    const expertButtons = document.getElementsByClassName("expert");
    let assert = document.getElementById("submit");
    let clear = document.getElementById("delete");
    let timer = document.getElementById("timer");
    let firstC = document.getElementsByClassName("c1");
    let secondC = document.getElementsByClassName("c2");
    let thirdC = document.getElementsByClassName("c3");
    let fourthC = document.getElementsByClassName("c4");
    let spots = document.getElementsByClassName("selectedColor");
    let leaderBoardHTML = document.getElementById("fullLeaderBoard");
    let buttonOptionsArr = [...document.querySelectorAll(".selectors")];

    let redResponses = document.getElementsByClassName("outputRed");
    let whiteResponses = document.getElementsByClassName("outputWhite");
    let buttonColors = document.getElementsByClassName("selectors");
    for(let i = 0; i < redResponses.length; i++){
        redResponses[i].style.color = "red";
    }
    for(let i = 0; i < whiteResponses.length; i++){
        whiteResponses[i].style.color = "white";
    }

    alterGameButtons(true);

    function alterGameButtons(status){
        for(let i = 0; i < buttonColors.length; i++){
            buttonColors[i].disabled = status;
        }
        assert.disabled = status;
        clear.disabled = status;
        remove.disabled = status;
    }

    function gameEnd(){
        clearInterval(intervalID);
        alterGameButtons(true);
        resetColorChoices("#000000");
        pickCount = 500;
    }

    const postURL = "https://mm-score-db-default-rtdb.firebaseio.com/leaderboard.json";
    function generateUser(name, mode, time, moves, sequence){
        let ran = ~~(Math.random() * 80000);
        return {
            name: name || `RandomUser#${ran}`,
            mode,
            time: `${time} seconds`,
            moves,
            sequence
        }
    }

    function render(userObj){
        return `<div id="gameUser">
                <h4>${userObj.name}</h4>
                <p>Game mode: ${userObj.mode}, solved in ${userObj.time} and ${userObj.moves} moves</p>
                <div id="leaderBoardSequence">
                    <p class="userSequence" id="${userObj.sequence[0]}"></p>
                    <p class="userSequence" id="${userObj.sequence[1]}"></p>
                    <p class="userSequence" id="${userObj.sequence[2]}"></p>
                    <p class="userSequence" id="${userObj.sequence[3]}"></p>
                </div>
            </div>`;
    }

    function renderSolution(arr){
        return `<div id="key"><span id="${arr[0]}"></span><span id="${arr[1]}"></span><span id="${arr[2]}"></span><span id="${arr[3]}"></span></div>`;
    }
    function runTime() {
        time++;
    }
    function trimRecord(arr){
        if(arr.length > 7){
            arr.length = 7;
        }
        return arr;
    }

    $("#help").on("click", function (){
        $("#gameHelp").fadeIn(500);
        helpEnabled = true;
        if(helpEnabled){
            $("#removeHelp").on("click", function (){
                $("#gameHelp").fadeOut(250);
                helpEnabled = false;
            });
        }
    });

    function showExtraButtons(difficultyArr) {
        for(let i = 0; i < difficultyArr.length; i++){
            difficultyArr[i].style.display = "inline-block";
        }
    }

    hardMode.addEventListener("click", function () {
        hard = true;
        mode = "Hard";
        hardMode.style.color = "#14bdeb";
        hardMode.style.background = "#0d151d";
        $("#difficultyLevel").text("Hard Mode Enabled");
        showExtraButtons(hardButtons);
        hardMode.innerText = "Expert Mode";
        list.innerHTML = `<p>Expert Mode adds: <span class="cyan">Cyan</span>, <span class="crimson">Crimson</span> and <span class="aliceblue">AliceBlue</span></p>`;
        optionsList.innerHTML = `<p id="list"><strong>Options:</strong> ${easyOptionsHTML}, ${justHardHTML}</p>`;
        hardMode.addEventListener("click", function (){
                hard = false;
                expert = true;
                hardMode.style.color = "#d61717";
                showExtraButtons(expertButtons);
                mode = "Expert";
                $("#difficultyLevel").text("Expert Mode Enabled");
                hardMode.disabled = true;
                list.style.display = "none";
                optionsList.innerHTML = `<p id="list"><strong>Options:</strong> ${easyOptionsHTML}, ${hardOptionsAddHTML}, ${expertOptionsHTML}</p>`;
            })

    });

    startGame.addEventListener("click", function () {
        time = 0;
        intervalID = setInterval(runTime, 1000);
        startGame.disabled = true;
        hardMode.disabled = true;
        startGame.style.color = "#14bdeb";
        startGame.style.background = "#0d151d";
        resetColorChoices("#16242c");
        alterGameButtons(false);

        sequence = genSequence(expert, hard);
        $("#start").text("Sequence Generated");
        $("#done").on("click", function () {
            $("#answerLocation").html(renderSolution(sequence));
            gameEnd();
        });
    });

    function genSequence(isExpert, isHard) {
        let out = [];
        if(isExpert || isHard) {
            len = isExpert ? expertKey.length : hardColorKey.length;
        }
        for(let i = 0; i < 4; i++) {
            let ran = ~~(Math.random() * len);
            out.push(expertKey[ran]);
        }
        return out;
    }

    $("#anotherRound").on("click", () => {
        window.location.reload();
    });

    clear.addEventListener("click",  () => {
        if(guessSet.length > 0) {
            guessSet.pop();
            pickCount--;
            spots[pickCount].style.backgroundColor = "#232525"
        }
    });

    let removeClickCount = 0;
    let removeCont = document.getElementById("remove-cont");
    remove.addEventListener("click", () => {
        removeClickCount++;
        removeClickCount %= 4;
        removeCont.style.display = "none";
        if (removeClickCount === 1) {
            remove.innerText = "Done";
        } else if (removeClickCount === 2) {
            removeCont.style.display = "inline-block";
            remove.innerText = "Restore";
        } else {
            remove.innerText = "Remove";
        }
        if(removeClickCount === 3) {
            // using the global len that is redefined on start up of game to determine
            // how many buttons to then re-show
            for(let i = 0; i < len; i++) {
                buttonOptionsArr[i].style.display = "inline-block";
            }
            removeClickCount++; // to have it cycle back as this is a restore of buttons, no user interaction
        }
    });

    let removeContClickCount = 0;
    removeCont.addEventListener("click", () => {
        removeContClickCount++;
        let isFirstClick = removeContClickCount % 2 !== 0;
        removeCont.innerText = isFirstClick ? "Done" : "Remove";
    });


    buttonOptionsArr.forEach(btn => btn.addEventListener("click", function() {
        if(removeClickCount === 2 && removeContClickCount % 2 !== 0) {
            this.style.display = "none";
        } else if(removeClickCount % 2 === 0) {
            if (guessSet.length < 4) {
                spots[pickCount].style.backgroundColor = this.id.toString();
                pickCount++;
                guessSet.push(this.id.toString());
            }
        } else if(removeClickCount === 1) {
            this.style.display = "none";
        }
    }));

    assert.addEventListener("click", function(){
        resetColorChoices("#16242c");
        if(count < 10) {
            assertGuess();
            count++;
        }
        guessSet = [];
        pickCount = 0;
    });

    function resetColorChoices(colorStr){
        for(let i = 0; i < spots.length; i++){
            spots[i].style.backgroundColor = colorStr;
        }
    }

    function reds(first, second, third, fourth, colorArr) {
        let red = 0;
        if (first === colorArr[0]) red++;
        if (second === colorArr[1]) red++;
        if (third === colorArr[2]) red++;
        if (fourth === colorArr[3]) red++;
        won = red === 4;
        return red + " Red";
    }

    function whites(first, second, third, fourth, colorArr) {
        let white = 0;
        let firstIsRed = first === colorArr[0];
        let secondIsRed = second === colorArr[1];
        let thirdIsRed = third === colorArr[2];
        let fourthIsRed = fourth === colorArr[3];

        if (firstIsRed) {
            colorArr = colorArr.join(" ").replace(first, "").split(" ");
        }
        if (secondIsRed) {
            colorArr = colorArr.join(" ").replace(second, "").split(" ");
        }
        if (thirdIsRed) {
            colorArr = colorArr.join(" ").replace(third, "").split(" ");
        }
        if (fourthIsRed) {
            colorArr = colorArr.join(" ").replace(fourth, "").split(" ");
        }
        [white, colorArr] = whiteCounter(first, firstIsRed, colorArr, white);
        [white, colorArr] = whiteCounter(second, secondIsRed, colorArr, white);
        [white, colorArr] = whiteCounter(third, thirdIsRed, colorArr, white);
        [white, colorArr] = whiteCounter(fourth, fourthIsRed, colorArr, white);

        return white + " White";
    }

    function whiteCounter(colorGuess, wasRed, sequence, count) {
        if (sequence.indexOf(colorGuess) !== -1 && !wasRed) {
            count++;
            sequence = sequence.join(" ").replace(colorGuess, "").split(" ");
        }
        return [count, sequence];
    }

    function assertGuess(){
        let newKey = sequence;
        let [first, second, third, fourth] = guessSet;

        $(`#${count}r`).text(reds(first, second, third, fourth, newKey));
        $(`#${count}w`).text(whites(first, second, third, fourth, newKey));

        firstC[count].innerHTML = `<p class="tableColors" id="${first}"></p>`;
        secondC[count].innerHTML = `<p class="tableColors" id="${second}"></p>`;
        thirdC[count].innerHTML = `<p class="tableColors" id="${third}"></p>`;
        fourthC[count].innerHTML = `<p class="tableColors" id="${fourth}"></p>`;
        if(won){
            gameWon();
            firstC[count].innerHTML = `<p class="tableColors winningGlow" id="${first}"></p>`;
            secondC[count].innerHTML = `<p class="tableColors winningGlow" id="${second}"></p>`;
            thirdC[count].innerHTML = `<p class="tableColors winningGlow" id="${third}"></p>`;
            fourthC[count].innerHTML = `<p class="tableColors winningGlow" id="${fourth}"></p>`;
        }
    }
    function gameWon(){
        gameEnd();
        let winningSequenceArr = Array.from($(".winningSequence"));
        timer.style.display = "block";
        timer.innerHTML = `Solved in ${time} seconds`;
        $("#leaderBoardModal").fadeIn(200);
        $("#solvedMoves").text(count + 1);
        for(let i = 0; i < winningSequenceArr.length; i++){
            winningSequenceArr[i].innerHTML = `<p class="leaderBoardButtonsDisplay" id="${sequence[i]}"></p>`;
        }
        $("#gameMode").text(mode);
        $("#post").on("click", () => {
            user = generateUser($("#name").val(), mode, time, count, sequence);
            $("#leaderBoardModal").fadeOut(200);
            addScore(user);
        });
    }

    $("#viewLeaderBoard").on("click", () => {
        const leaderBoard = $("#fullLeaderBoard");
        leaderBoard.css("display", "flex");
        leaderBoardHTML.innerHTML = `<p id="loadingScreen">Loading LeaderBoard</p><button id="closeLeaderBoard">X</button>`;
        fetchLeaderBoardData();
    });

    $("body").on("click", "#closeLeaderBoard",  () => {
        $("#fullLeaderBoard").fadeOut(300);
    });

    function fetchLeaderBoardData() {
        fetch(postURL).then(r => r.json()).then(d => {
            d = dataToArr(d);
            d = d.sort((a, b) => (parseFloat(a.time.split(" ")[0])) - (parseFloat(b.time.split(" ")[0])) > 0 ? 1 : -1);
            leaderBoardHTML.innerHTML = `<div id="leaderBoardInfo"><p>Top Scores</p><button id="closeLeaderBoard">X</button></div>`;

            const expertList = trimRecord(d.filter(d => d.mode === "Expert"));
            const hardList = trimRecord(d.filter(d => d.mode === "Hard"));
            const normalList = trimRecord(d.filter(d => d.mode === "Normal"));

            const joinedRecords = [...expertList, ...hardList, ...normalList];
            for (let i = 0; i < joinedRecords.length; i++) {
                if (typeof d[i] === "object") {
                    leaderBoardHTML.insertAdjacentHTML("beforeend", render(joinedRecords[i]));
                }
            }
        });
    }

    function dataToArr(fireBaseObjSet) {
        let out = [];
        for(const [key, value] of Object.entries(fireBaseObjSet)) {
            out.push(value);
        }
        return out;
    }

    function addScore(record) {
        fetch(postURL, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(record)
        }).then(res => {
            res.json().then(() => {
                console.log("Thanks for playing");
            })
        });
    }

})();