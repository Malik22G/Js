export default function Slots(values){
    const {val1,val2,val3} = values;
    if(val1===val2 && val1===val3 && val1!==null){
    return(
        <>
        <h1>{val1} {val2} {val3}</h1>
        <h2>You Win Congrats!!!</h2>
        </>
    )}
    else{
        return(
            <>
            <h2>You loose</h2>
            </>
        )
    }
} 