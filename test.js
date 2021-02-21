function whosPaying(names) {
    
    /******Don't change the code above*******/
        
        //Write your code here.
        // get names array length plus 1
        const nLen = names.length;
        const rNum = Math.floor(Math.random()*nLen);
        
        return names[rNum];
}


let names = ['bob', 'kelly', 'april', 'sue'];

console.log(whosPaying(names));