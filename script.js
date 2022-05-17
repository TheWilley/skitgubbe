var deck = [];
var cards = [];
var played_cards = [];
var stage = 0;
var currentPlayer = "";
var player1;
var player2;
var suits = ["spades", "diamonds", "clubs", "hearts"];
var values = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];

/**
 * Class to create card objects
 *
 * @param {string} suit The card suit
 * @param {string} color The card color (red / black)
 * @param {string} value The value of the card 
 * @param {string} image The image
 */
class card {
    constructor(suit, color, value, image) {
        this.id = suit + value;
        this.suit = suit;
        this.color = color;
        this.value = value;
        this.image = image;
    }
}

/**
 * Class to create card objects
 *
 * @param {string} name 
 */
class player {
    constructor(name) {
        this.name = name;
        this.hand = [];
        this.table = [];
    }
}

/**
 * Previews the played cards
 */
$("#played_cards").mouseover(function() {
    var i = 0;
    var j = 0;
    $('img', $('#played_cards')).each(function() {
        if (j != 0) {
            i += 20;
            $(this).css("margin-left", i + "px")
        }
        j++;
    })
})

/**
 * Cancels preview of played cards
 */
$("#played_cards").mouseout(function() {
    var i = 0;
    $('img', $('#played_cards')).each(function() {
        $(this).css("margin", "0px")
    })
})

/**
 * Generates a set of cards
 */
function generateCards() {
    var tempcards = [];

    for (var i = 0; i < suits.length; i++) {
        for (var j = 0; j < values.length; j++) {
            if (suits[i] == "spades" || suits[i] == "clubs") {
                tempcards.push(new card(suits[i], "black", values[j], values[j] + "_of_" + suits[i]))
            } else {
                tempcards.push(new card(suits[i], "red", values[j], values[j] + "_of_" + suits[i]))
            }
        }
    }

    return tempcards;
}

/**
 * Takes a card from the deck
 */
function takeCard() {
    var card = deck.shift();
    document.getElementById("cards_left").innerHTML = "Cards: " + deck.length;
    return card;
}

/**
 * Shuffles the deck
 * 
 * @param {string} deck The array to shuffle
 * @returns {array} The shuffled deck 
 */
/*/ Source: https://stackoverflow.com/a/46545530/10223638 /*/
function shuffleCards(deck) {
    let shuffled = deck
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)

    return shuffled;
}

/**
 * Place a card on the table
 * 
 * @param {string} column 
 * @param {string} row
 * @param {object} card
 */
function placeCardOnTable(column, row, card) {
    var img = document.createElement("img");
    img.src = "resources/PNG-cards-1.3/" + card.image + ".png";
    img.className = "cards";
    img.id = card.suit + card.value;
    img.style.gridColumn = column;
    img.style.gridRow = row;
    img.player = currentPlayer;
    img.card = card;
    
    //img.addEventListener("click", useCard);

    document.getElementsByClassName("container")[0].appendChild(img);
}


function placeCardInPlayedCards(card) {
    var img = document.createElement("img");
    img.src = "resources/PNG-cards-1.3/" + card.image + ".png";
    img.className = "cards";
    img.id = card.suit + card.value;
    img.style.gridColumn = 4;
    img.style.gridRow = 3;

    document.getElementById("played_cards").appendChild(img);
}

function placeCardInStack(card) {
    var img = document.createElement("img");
    img.src = "resources/PNG-cards-1.3/" + card.image + ".png";
    img.className = "cards";
    img.id = card.suit + card.value;
    img.style.gridColumn = 1;
    img.style.gridRow = 3;

    document.getElementById("stack").appendChild(img);
}


function convertToNumber(card) {
    if (card.value == "ace") {
        return 14;
    } else if (card.value == "jack") {
        return 11;
    } else if (card.value == "queen") {
        return 12;
    } else if (card.value == "king") {
        return 13;
    } else {
        return card.value;
    }
}

function checkCard(card, action) {
    var cardValue = convertToNumber(card);

    if (played_cards.length == 0) {
        return true;
    } else if (cardValue == 10) {
        if (action == true) {
            played_cards = [];
            document.getElementById("played_cards").innerHTML = "";
        }
        return true;
    } else if (cardValue == 2) {
        return true;
    } else if (cardValue >= convertToNumber(played_cards[played_cards.length - 1])) {
        return true;
    } else {
        return false;
    }
}

function checkValidMoveExists() {
    for (var i = 0; i < currentPlayer.hand.length; i++) {
        if (checkCard(currentPlayer.hand[i], false) == false) {
            continue;
        } else {
            return false;
        }
    }

    return true;
}

function addCardToPlayer(player, card) {
    if (deck.length != 0) {
        var img = document.createElement("img");
        img.src = "resources/PNG-cards-1.3/" + card.image + ".png";
        img.className = "card_in_hand";
        img.id = card.suit + card.value;

        var span = document.createElement("span");
        span.className = "hand";
        span.player = player;
        span.card = card;
        span.addEventListener("mouseover", preview);
        span.addEventListener("mouseout", stopPreview);
        span.addEventListener("click", useCard);

        player.hand.push(card);
        document.getElementById(player.name).appendChild(span);

        span.appendChild(img);
    }
}

/*/ Source: https://stackoverflow.com/a/40997543/10223638 /*/
function moveToElementPosition(elementID, targetElementID, card) {
    var originalPos = $(elementID).position();
    var newPos = $(targetElementID).position();
    $(elementID).css("position", "absolute");
    $(elementID).css("left", originalPos.left);
    $(elementID).css("top", originalPos.top);

    $(elementID).animate({
        "left": newPos.left,
        "top": newPos.top,
    }, 200, function() {
        $(elementID).remove();
        // Place card
        placeCardInPlayedCards(card)
    });
}

function useCard(e) {
    var card = convertToObject(e.originalTarget.id);
    console.log(e);

    if (checkCard(card, true)) {
        // Push card into used cards
        played_cards.push(card);

        addCardToPlayer(e.currentTarget.player, takeCard());

        moveToElementPosition(e.originalTarget.parentElement, '#played_cards', card);

        var hand = e.currentTarget.player.hand;

        // Remove correct card from player
        for (const i in hand) {
            if (hand[i] == card) {
                hand.splice(i, 1)
            }
        }

        switchPlayer();
    }
}

function returnDeck(player) {
    for (var i = 0; i < played_cards.length; i++) {
        player.hand.push(played_cards[i]);
    }
}

function convertToObject(e) {
    // Used to find the object colerating to the id
    for (const i in cards) {
        if (cards[i].id == e) {
            return cards[i];
        }
    }
}

function preview(e) {
    e.target.parentElement.style.width = "58px"
}

function stopPreview(e) {
    e.target.parentElement.style.width = "23px"
}

function hideCard(card) {
    document.getElementById(card.suit + card.value).src = "resources/PNG-cards-1.3/back_of_card.jpg";
}

function unhideCard(card) {
    document.getElementById(card.suit + card.value).src = "resources/PNG-cards-1.3/" + card.image + ".png";
}

function addDeck() {
    for (var i = 0; i < deck.length; i++) {
        placeCardInStack(deck[i])
    }

    hideCard(getTopOfDeck())
}

function getTopOfDeck() {
    return deck.slice(-1)[0]
}

function initCards(player, index) {
    for (var i = 0; i <= 2; i++) {
        for (var j = 0; j < 2; j++) {
            player.table[i] = takeCard();
            placeCardOnTable(3 + i, index + 2, player.table[i])
        }
        hideCard(player.table[i]);
    }
}

function addClickListener() {
    document.getElementById("stack").addEventListener("click", function() {
        if (checkValidMoveExists()) {
            addCardToPlayer(currentPlayer, takeCard())
        }
    });
}

function switchPlayer() {
    if(currentPlayer == player1) {
        currentPlayer = player2
        makemove();
    } else {
        currentPlayer = player1;
    }

    if(currentPlayer.hand.length == 0 && deck.length == 0) {
        enabletable(true);
    } else {
        enabletable(false);
    }
}

function enabletable() {
    
}

function setup() {
    deck = shuffleCards(generateCards());
    cards = deck.slice();

    player1 = new player("player1");
    initCards(player1, 0);

    player2 = new player("player2");
    initCards(player2, 2);

    addDeck();
    addClickListener();

    currentPlayer = player1;

    for (var i = 0; i < 3; i++) {
        addCardToPlayer(player1, takeCard());
    }

    for (var i = 0; i < 3; i++) {
        addCardToPlayer(player2, takeCard());
    }
}