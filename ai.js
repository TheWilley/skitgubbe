var i = 0;

// sleep time expects milliseconds
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function compareArrays(array1, array2) {
    var i = array1.length;
    while (i--) {
        if (array1[i] !== array2[i]) return false;
    }
    return true
}

function makemove() {
    if(currentPlayer == player2) {
        if (i < player2.hand.length - 1) {
            sleep(300).then(() => {
                // Create original array
                var hand = player2.hand;
    
                // This array will reference the hand of player 2
                var cards = hand;
    
                // This one will reference player 2 ONCE, thus we can compare them after
                var cards2 = [...hand];
    
                document.getElementById("player2").childNodes[i].childNodes[0].click();
                if (compareArrays(cards, cards2)) {
                    makemove()
                    i++;
                } else {
                    i = 0;
                }
            })
        } else {
            document.getElementById("stack").click();
            i = 0;
            makemove();
        }
    }
};