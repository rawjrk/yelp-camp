# YelpCamp
## _The Course Project_

YelpCamp is an unpretentious Express web app built as a summary of learning from [The Web Developer Bootcamp 2022](https://www.udemy.com/course/the-web-developer-bootcamp/ "Udemy link") video course.

## Features Impemented

+ full CRUD for campgrounds
+ create/delete for campground reviews
+ images stored on a separate server
+ user authentication (login/register and keeping session)
+ user authorization
    + campgrounds could be edited/deleted by their author only
    + reviews could be deleted by their author only
    + new campgrounds could be added by logged-in users only
+ cluster map on the index page that includes data on all campgrounds added to the app
+ small map for each show page with a current campground pointed on it
+ forward geocoding (when user inputs location on the new/edit form, it's parsed and is assigned to coordinates)

## Technologies Used

**Core:**
+ [MongoDB](https://www.mongodb.com/) – database
+ [Express](https://expressjs.com/)/[Node.js](https://nodejs.org/) – server-side
+ [EJS](https://ejs.co/) – templating engine
+ [Bootstrap](https://getbootstrap.com/) – front-end

**APIs:**
+ [Cloudinary](https://cloudinary.com/) – remote images storage
+ [Mapbox](https://www.mapbox.com/) – rendering maps

**Libraries:**
+ [Mongoose](https://github.com/Automattic/mongoose) – MongoDB/Node.js middleware
+ [JOI](https://github.com/sideway/joi) – server-side data validation
+ [Multer](https://github.com/expressjs/multer) – middleware for `multipart/form-data`
+ [Passport.js](https://github.com/jaredhanson/passport) – authentication middleware
+ [Helmet.js](https://github.com/helmetjs/helmet) – implementing simple security policies
+ etc.

## YelpCamp Europe, or Why Using "EU" Badge?

To get a bit more practice, I chose to include some real data in my database. And I also wanted to make a web app more Euro-centric. (In contrast to data seeded using random US locations.) It led me to search for some campground-related data available over the internet.

### Info Source

OurBumble is a blog by one couple who traveled in a van across Europe and left records about 700+ campsites they stayed in. Their DB is available by the link below (most information dated as of 2016).

https://ourbumble.com/european-wild-camping-database

### What Excluded (compared to the source)

To prevent the web app collision, I excluded campsite records that were missing the following necessary data:

1. Site Name
1. Town/Country
1. Longitude/Latitude
1. Cost
1. Comments

It gave me 111 valid records (out of 768 from the original file).

### Worth Mentioning

Conversion from .csv to .json performed with [csv-parser](https://github.com/mafintosh/csv-parser). And I also used some modules from [Turf.js](https://github.com/Turfjs/turf) to get a new central point for my cluster map based on all campsites coordinates. Really liked these packages since I've got a smooth expirience using them. Thank you guys!

## Chronology

If you don't care, you shouldn't :)

| What Happened | Date |
|:---------------|:-----------:|
| Started Course | 04/29/2022 |
| Started Project | 06/22/2022 |
| Ended Course | 06/29/2022 |
| Ended Project Fixes | N/A |

## Links

+ Github Repo: https://github.com/rawjrk/yelp-camp
+ Heroku App: https://yelp-camp-36685.herokuapp.com