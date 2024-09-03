const axios = require("axios");
const User = require("../Models/User");


    User.findById("66d3903c31c9b2b87f5ae8a9").select('-_id').then((data)=>{
    console.log(finalData);})

    // Send the finalData to the recommendation endpoint
    // const response = await axios.post("http://localhost:3000/recommend", finalData);
    // console.log(response.data);
  


// axios.post("http://localhost:3000/recommend", data).than((res)=>{
//     console.log(res.data)
// }).catch((err)=>{
//     console.log(err)
// })