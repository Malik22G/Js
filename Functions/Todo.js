let cmd = prompt("What would you like to do: ");
let arr=[];
while(cmd!=="quit"){
    if(cmd ==="new"){
        arr.push(prompt("What do you want to add"));
        console.log(`${arr[arr.length-1]} Added to the list`);
    }
    else if(cmd ==="list"){
        console.log("*******");
        for(let index in arr){
            console.log(`${index}: ${arr[index]}`);
        }
        console.log("*******");
    }
    else if(cmd ==="delete"){
        let index = parseInt(prompt("What index would you like to delete"));
        if(!Number.isNaN(index)){
        arr.splice(index,1);
        console.log("Todo removed.");}
        else{
            console.log("Unknown index.");
        }
    }
    cmd = prompt("What would you like to do: ");
    }
    console.log("App quited succcessfully.");