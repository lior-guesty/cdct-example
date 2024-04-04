import express from 'express';

const app = express();



const DB = {
    10 : {
        "id": 10,
        "name": "doggie",
        "category": {
          "id": 1,
          "name": "Dogs"
        },
        "photoUrls": [
          `/assets/10.jpg`
        ],
        "tags": [
          {
            "id": 0,
            "name": "terrier"
          }
        ],
        "status": "available"
      }
    , 20 : {
        "id": 20,
        "name": "mitzy",
        "category": {
          "id": 2,
          "name": "Cats"
        },
        "photoUrls": [
          `/assets/20.jpg`
        ],
        "tags": [
          {
            "id": 0,
            "name": "thunder"
          }
        ],
        "status": "available"
      }
}

//This is essentially all the querying mechanism for the sample. Imagine an actual DB query implemented here.
const findPetByID = (id) => DB[id]

app.get('/api/v3/pet/:id', (req, res) => {
    const petID = req.params.id
    let pet = findPetByID(petID)
    res.send(pet);
});

const server = app.listen(3001, () => {
    console.log('Server is running on port 3001');
});

export default server;
