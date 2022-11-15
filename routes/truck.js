const express = require('express');
const truckAssignmentDb = require('../controller/truckAssignment');
const router = express.Router();

router.get("/getTruckingAssignment/:id", async (req, res) => {
    // let response = {
    //     "booking_id": "112",
    //     "booking_type": "test",
    //     "booking_status": "open",
    //     "truck_id": "12",
    //     "driver_id": "32",
    //     "chassis_id": "12",
    //     "is_driver_acknowledged": "12",
    //     "author_id": "11"
    // }
    // console.log('get truck_booking_assignment with booking_id: ' + req.body.booking_id);
    console.log('get truck_booking_assignment with booking_id: ' + req.params.id);
   
    try{
        // res.status(200).json(response);
        res.status(200).json(await truckAssignmentDb.getTruckAssignment(req.params.id));
    }
    catch(err){
        console.error(`Error while getting trucking assignment info`, err.message);
    }
});

module.exports = router;