type User = {
    readonly id:number,
    name: string,
    birthDate: Date 
}

let user:User = {
    id:10,
    name: "Malik",
    birthDate: new Date()
};

console.log(user)