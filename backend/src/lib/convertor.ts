const fs:any = require('fs')


const ip:object = fs.readFile('badwords.list','utf-8',(err:object,data:string)=>{
  if(!err)
  {
    let arr:Array<string> = data.split('\n');
    arr.sort();
    for(let i:any =0;i<arr.length;i++)
    {
      if(arr[i] == ""){
        arr[i] ='-';
        continue;
      }
      arr[i]  = ((arr[i].replace('\r','')).trim()).toUpperCase();
    }
    //converting the wordlist into json format
    const final:object = {
      words:arr
    }
    //stringifying the final word
    const res:string = JSON.stringify(final);
    //writing the stringified JSON format to a file;
    const op:object = fs.writeFile("wordlist.json",(res:any,err:any)=>{
      if(!err){
        console.log("file written successfully");
      }
    })
  }
});