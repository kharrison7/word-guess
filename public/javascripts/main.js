// This is space for any JS
let text1 = document.getElementById("wordGuess").innerHTML;
// let text3 = text1.innerHTML;
console.log("Text: "+text1);

  // for(i=0; i < text.length; i++) {
  //     if(text[i].charCodeAt(text[i]) >= 65 && text[i].charCodeAt(text[i]) <= 90)
  //     wrapNode(text[i], 'span');
  // }


  function wrapCaps() {
    console.log("function called")
    for(i=0; i < text1.length; i++) {
      // The numbers are the unicode for capital letters.
        if(text1[i].charCodeAt(text1[i]) >= 65 && text1[i].charCodeAt(text1[i]) <= 90){
          console.log("Capital: "+text1[i]);
        }
      }
   }
wrapCaps();
