function binarySearch(items:Array<string>, value:string){
    var startIndex  = 0,
        stopIndex   = items.length - 1,
        middle      = Math.floor((stopIndex + startIndex)/2);

    while(items[middle] != value && startIndex < stopIndex){

        //adjust search area
        if (value < items[middle]){
            stopIndex = middle - 1;
        } else if (value > items[middle]){
            startIndex = middle + 1;
        }

        //recalculate middle
        middle = Math.floor((stopIndex + startIndex)/2);
    }

    //make sure it's the right value
    return (items[middle] != value) ? 0 : 1;
}

function checkModeration(req:any,res:any,next:any){
  const fs = require("fs");
  //for some reason it is taking backend folder as the root folder
  fs.readFile("./src/lib/wordlist.json", (err:any, data:any) => {
    if(!err)
    {
      data = JSON.parse(data);
      let contents = req.body.content;
      let content = contents.split(" ");
      var flag: boolean = true;
      for (let i = 0; i < content.length; i++) {
        //  performing the binary searcing
        if (binarySearch(data.words, content[i].toUpperCase())) {
          flag = false;
          break;
        }
      }
      if (flag)
      {
        res.status(200);
        res.send("1");
      }
      else
      {
        res.status(401);
        res.send("0");
      }
    }
  })
};

export default checkModeration;