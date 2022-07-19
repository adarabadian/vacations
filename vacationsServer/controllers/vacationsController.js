const express = require("express");
const router = express.Router();
const vacationsLogic = require("../logic/vacationsLogic");
const multer = require('multer');
const fs = require('fs');


router.get("/", async (request, response, next) => {
    try {
        // callback for vacationsLogic > getAllVacations
        const allVacations = await vacationsLogic.getAllVacations(request);

        // return all vacations
        response.json(allVacations);
    }

    catch (error) {
        next(error);
    }
});



router.post("/addToFavorites", async (request, response, next) => {
    let vacationId = request.body.vacationId;

    try {
        // callback for vacationsLogic > addToFavorits
        await vacationsLogic.addToFavorites(vacationId, request);

        response.json()
    }
    catch (error) {
        next(error);
    }
});



router.post("/removeFromFavorites", async (request, response, next) => {
    let vacationId = request.body.vacationId;

    try {
        // callback for vacationsLogic > removeFromFavorites
        await vacationsLogic.removeFromFavorites(vacationId, request);

        response.json()
    }
    catch (error) {
        next(error);
    }
});


router.post("/addNewVacation", async (request, response, next) => {
    let vacation = request.body;

    try {
        // callback for vacationsLogic > addNewVacation
        const vacationId = await vacationsLogic.addNewVacation(vacation, request);

        // return vacationID from DB
        response.json(vacationId)
    }
    catch (error) {
        next(error);
    }
});

router.post("/deleteVacation/:id", async (request, response, next) => {
    let vacationId = request.params.id;

    try {
        // callback for vacations logic > delete vacations
        let pictureForDelete = await vacationsLogic.deleteVacation(vacationId, request);
        
        // callback for delete picture function
        deletePicture(pictureForDelete);

        response.json()
    }
    catch (error) {
        next(error);
    }
});

router.post("/editVacation", async (request, response, next) => {
    let vacation = request.body;

    try {
        // callback for vacationsLogic > editVacation
        await vacationsLogic.editVacation(vacation, request);

        response.json()
    }
    catch (error) {
        next(error);
    }
});


// MULTER
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
})
let upload = multer({ storage: storage }).single('file');

// multer upload pic function
router.post('/upload', function (request, response) {
    upload(request, response, function (error) {
        const hostUrl = "https://adar-vacations.herokuapp.com/";

        if (error instanceof multer.MulterError) {
            console.log(error);
            return;
        } 
        else if (error) {
            console.log(error);
            return;
        }
        if (request.body.fileToDelete != undefined) {
            request.body.fileToDelete = request.body.fileToDelete.slice(hostUrl.length,request.body.fileToDelete.length);
            deletePicture(request.body.fileToDelete);
        }

        if(request.file.filename != undefined){
            request.file.filename = hostUrl + request.file.filename;
        }
        
        return response.status(200).send(request.file);
    })
});


//Multer Delete function
async function deletePicture (pictureForDelete) {
    fs.unlinkSync("./uploads/" + pictureForDelete);
    console.log("File deleted");
}

module.exports = router;