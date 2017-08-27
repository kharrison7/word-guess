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
          finishedWord[i] = `<span class='capital'>${text1[i]}</span>`;
          console.log("Html is: "+finishedWord[i]);
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

// The following was an attempt to validate the input.
// This gives a custom error message if a non-letter character is inputted.
let anInput = document.getElementById("item");
let letterCheck = document.forms["myForm"]["guess"].value;

anInput.addEventListener("input", function (event) {
  console.log("Event Listened: "+letterCheck);
  // All letters A through z.
  let compare=/^[a-zA-Z]+$/;
      if (letterCheck.match(compare)){
        alert("Must input a letter");
       return false;
      }
});
