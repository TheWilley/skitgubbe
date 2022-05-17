// sleep time expects milliseconds
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function makemove() {
    sleep(1020).then(() => {
        var cards = document.getElementById("player2").childNodes;
        cards[Math.floor(Math.random() * cards.length)].childNodes[0].click();
        console.log(cards[Math.floor(Math.random() * cards.length)].childNodes[0]);
    })
};