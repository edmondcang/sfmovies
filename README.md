# Demo

http://sfmovies.projectdemos.tk/?search=San%20Francisco

# Description

It simply gives you markers on a map showing locations where the movie was filmed after you give it a movie name.

# Problems and Solutions

The [film locations data](https://data.sfgov.org/Arts-Culture-and-Recreation-/Film-Locations-in-San-Francisco/yitu-d5am) provided by [DataSF](http://www.datasf.org/) contain no geolocation information (latitude and longitude). This makes it very hard to locate the points on the map with only an address provided. To solve this problem, I used [node-geocoder](https://github.com/nchaulet/node-geocoder) to query geolocation information of each address where a movie is filmed.

Since it communicates with geoinfo provider through API and API calling is expensive, it caches the results so they can be reused.

# Trade-offs

I didn't normalise the data but import them directly to MongoDB for simplicity's sake. The best practise would be to take out the Location field and store them in a separate table. This resulted in extra handlings on coding level.

# TODOs

* Loading indicator: Redux might be the best choice
* Error handling: connection failures, timeout etc.
* Show movie details

# Development

## Dependencies

This is a full stack project. For the sake of simplicity and quick development, I used [React Starter Kit](https://github.com/kriasoft/react-starter-kit) as the boilerplate for this project.

To develope, you need to install the following dependencies

* Node
* Yarn
* MongoDB

## Preparing the data

1. Download data from
   https://data.sfgov.org/Culture-and-Recreation/Film-Locations-in-San-Francisco/yitu-d5am

2. Import the data to DB

```
$ mongoimport -d sfmovies -c movies --type csv \
  --file Film_Locations_in_San_Francisco.csv --headerline
```
