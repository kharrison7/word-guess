// This is space for any JS
let text1 = document.getElementById("wordGuess").innerHTML;
console.log("Text: "+text1);
let finishedWord = [];

  function wrapCaps() {
    console.log("function called")
    for(i=0; i < text1.length; i++) {
      // The numbers are the unicode for capital letters. charCodeAt gives unicode.
        if(text1[i].charCodeAt(text1[i]) >= 65 && text1[i].charCodeAt(text1[i]) <= 90){
          console.log("Capital: "+text1[i]);
          // text1[i].setAttribute("class", "capital");
          finishedWord[i] = `<span class='capital'>${text1[i]}</span>`;
          console.log("Html is: "+finishedWord[i]);
          // document.getElementById("wordGuess").innerHTML = `<span class='capital'>${text1[i]}</span>`;
        }
        // If the letter isn't capitalized.
        else{
          finishedWord[i] = text1[i];
        }
      }
      let total = finishedWord.join(" ");
      console.log("Total: "+total);
      document.getElementById("wordGuess").innerHTML = total;
   }
wrapCaps();
