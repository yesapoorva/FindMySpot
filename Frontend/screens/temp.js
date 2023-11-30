
let data = [5,67,89,7,2,4,9,12,43,65];


function linearSearch(arr , key){

    for(let i = 0 ; i<arr.length-1 ; i++){

        if(key == arr[i])
        {
            return i
        }   
    }
    return -1
}

console.log(  linearSearch(data , 7) );



