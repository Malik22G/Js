let rand_num = parseInt(prompt("Entre a number: "));

while(!rand_num){
    rand_num = parseInt(prompt("Entre a valid number: "));
}
let num = Math.floor(Math.random()*rand_num) +1;

let guess = prompt("Entre your guess:");
let count = 1;


while(parseInt(guess) !==num){
    if(guess ==='q'){
        break;
    }   
    if(guess<num){
       guess =  prompt("Too low guess again");
    }
    if(guess>num){
        guess= prompt("Too High guess again");
    }
    count++;
}
console.log(`Yeah it took you ${count} gusses.`);