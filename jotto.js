var $guessedWords   = $('.guessed-words');
var $letterBank     = $('.letter-bank');
var $guessButton    = $('.guess-button');
var $inputField     = $('input');
var $congratsScreen = $('.congrats');
var $winningWord    = $('.winning-word');
var $resetButton    = $('.again');
var $rules          = $('.rules');

var wordToGuess = '';
var toggle1Letters = [];
var toggle2Letters = [];

$resetButton.click(function() {
    $inputField.val('');
    $inputField.select();
    toggle1Letters = [];
    toggle2Letters = [];
    $('.toggle1').removeClass('toggle1'); 
    $('.toggle2').removeClass('toggle2'); 
    $guessedWords.html('');
    $congratsScreen.hide();

    wordToGuess = computerChoosesWord();
});

$rules.click(function() {
    var $individualRules = $('.rules p');
    if ($individualRules.css('display') !== 'none' ) {
        $individualRules.hide();
    }
    else {
        $individualRules.show();
    }
});

$inputField.bind('keypress', function(event) {
    if (event.which === ENTER_KEY) {
        if ($congratsScreen.css('display') === 'none' ) {
            $guessButton.click();
        }
        else {
            $resetButton.click();
        }
    }
});

function generateLetterDiv(asciiLetter) {
    var $letterDiv = $('<div>');
    $letterDiv.addClass('letter-' + asciiLetter);
    $letterDiv.addClass('letter');
    $letterDiv.html(asciiLetter);
    $letterDiv.click(function() {
        letterClick($(this));
    });
    $letterDiv.dblclick(function(e) {
        e.preventDefault();
    });

    if (toggle1Letters.indexOf(asciiLetter) !== -1) {
        $letterDiv.addClass('toggle1');
    }
    else if (toggle2Letters.indexOf(asciiLetter) !== -1) {
        $letterDiv.addClass('toggle2');
    }

    return $letterDiv;
}

function watchLetter(watchList, asciiLetter) {
    if(watchList.indexOf(asciiLetter) === -1) {
        watchList.push(asciiLetter);
    }
}

function unwatchLetter(watchList, asciiLetter) {
    var index = watchList.indexOf(asciiLetter)
    watchList.splice(index, 1);
}

function letterClick($letterDiv) {
    asciiLetter = $letterDiv.text();
    $letterDivs = $('.letter-' + asciiLetter);
    if ($letterDivs.hasClass('toggle1')) {
        $letterDivs.removeClass('toggle1');
        $letterDivs.addClass('toggle2');

        unwatchLetter(toggle1Letters, asciiLetter);
        watchLetter(toggle2Letters, asciiLetter);
    }
    else if ($letterDivs.hasClass('toggle2')) {
        $letterDivs.removeClass('toggle2');

        unwatchLetter(toggle2Letters, asciiLetter);
    }
    else {
        $letterDivs.addClass('toggle1');
        watchLetter(toggle1Letters, asciiLetter);
    }
}

$guessButton.click(function() {
    var userWord = $inputField.val();

    if (isValidWord(userWord)) {
        score = computeWordScore(userWord);
        if (score === 5) {
            $winningWord.html(userWord);
            $congratsScreen.show();
        }

        var $userWordDiv = $('<div>');
        for (var i = 0; i < userWord.length; i++) {
            var $letterDiv = generateLetterDiv(userWord[i]);
            $userWordDiv.append($letterDiv);
        }
        $userWordDiv.addClass('user-word');

        var $scoreDiv    = $('<div>');
        $scoreDiv.html(score);
        $scoreDiv.addClass('score');
        
        $guessedWords.append($userWordDiv);
        $guessedWords.append($scoreDiv);
        $guessedWords.append($('<div>'));
        
        $inputField.val('');
        $inputField.select();

        $guessedWords.scrollTop(parseInt($guessedWords.css("height")));
    }
    else {
        $inputField.select();
    }
});

function populateLetterBank() {
   for (var i = 0; i < 26; i++) {
        asciiLetter = String.fromCharCode(i + 97);
        $letterDiv = generateLetterDiv(asciiLetter);
        $letterBank.append($letterDiv);
   }
}

function computeWordScore(guessedWord) {
    var score = 0;
    var visitedLetters = [];
    for (var i = 0; i < guessedWord.length; i++){
        if (visitedLetters.indexOf(guessedWord[i]) === -1) {
            visitedLetters.push(guessedWord[i]);
        }
        else {
            continue;
        }
        if (wordToGuess.indexOf(guessedWord[i]) !== -1) {
            score++;
        }
    }
    return score;
}

function isValidWord(word) {
    word = word.replace(/ /g,'');
    word = word.toLowerCase();
    return (wordBank.indexOf(word) !== -1);
}


function pickNumberInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickWordFromWordBank() {
    var index = pickNumberInRange(0, wordBank.length -1);
    return wordBank[index];
}

function containsRepeatLetters(word) {
    var containsRepeatLetters = false;
    var visitedLetters =[];

    for (var i = 0; i < word.length; i++) {
        if (visitedLetters.indexOf(word[i]) === -1) {
            visitedLetters.push(word[i]);
        }
        else {
            containsRepeatLetters = true;
            continue;
        }
    }
    return containsRepeatLetters;
}

function computerChoosesWord() {
    do {
        var wordToGuess = pickWordFromWordBank();
    } while (containsRepeatLetters(wordToGuess));
    console.log('word:' + wordToGuess);
    return wordToGuess;
}

// Main
wordToGuess = computerChoosesWord();
populateLetterBank();
