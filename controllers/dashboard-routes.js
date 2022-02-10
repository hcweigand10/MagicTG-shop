const router = require('express').Router();
const { User, Trip, Destination, Expenditure } = require('../models/');
const withAuth = require('../utils/auth');


// display all the trips that the user has created and their destinations
router.get('/', withAuth, async (req, res) => {
    try {
        const userData = await User.findByPk(req.session.user.id, {
            include: [Trip]
        });
        const tripData = await Trip.findAll( {
            include: [Destination],
            where: {
                userId: req.session.user.id
            }
        });
        const userRaw = userData.get({ plain: true });
        res.render('userDashboard', {
            layout: 'dashboard',
            User: userRaw
        });
    } catch(err) {
        console.log(err); 
        res.status(500).json(err);
    }
})

router.get('/trip/:id', withAuth, async (req, res) => {
    try {
        console.log(req.session.user.id)
        const tripData = await Trip.findAll({
            where: {
                userId: req.session.user.id
            },
            include: [Destination]
        })


        // need to get for each desitantion the expenditures and get the total cost that the user is going to use for the trip
        const rawTrip = await tripData[req.params.id-1].get({plain: true});

        res.render('tripView', {
            layout: 'dashboard',
            TripData: rawTrip})
    } catch(err) {
        console.log(err); 
        res.status(500).json(err);
    }
});

router.get("/trip/:id/destination/:id2", async (req, res) => {
    try {
      const destinationData = await Destination.findByPk(req.params.id2, {
        include: [Expenditure],
      });
  
      const expenditureData = await Expenditure.findAll({
        where: {
          destinationId: req.params.id2,
        },
      });
  
      const destinationRaw = destinationData.get({ plain: true });
      const expenditureRaw = expenditureData.map((expenditure) =>
        expenditure.get({ plain: true })
      );
  
      console.log(destinationRaw);
      console.log(expenditureRaw);
      res.render("destination-view", {
        laytout: "dashboard",
        destination: destinationRaw,
        // expenditure: expenditureRaw
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

// need to render expenditures based on destination that the user desires to go to 


module.exports = router;

