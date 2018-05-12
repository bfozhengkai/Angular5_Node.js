'use strict';
var express = require ("express");
var app = express();
var request = require('request');
const yelp = require('yelp-fusion');
const client = yelp.client('KH4o5PSA0mSCI5eOcg8u9iL9cB-PE0IfmMd3L42NRpq7rYqupvq8pRd_LD1lFyt5RRUdPoYi4d_5U1qgL0WuIW0KiWrTdwQ_qlCTCmAfJ2-iTV9ZaKxonlrFIkfAWnYx');

app.get("/", function(req,res){
    console.log(req.query);
    res.send("Hello");
});

app.get("/request", function(req,res){
    res.setHeader("Access-Control-Allow-Origin", "*");
    var add = req.query.request;
    req="https://maps.googleapis.com/maps/api/geocode/json?address=";
    req+= add;
    req+="&key=AIzaSyB5HpnNpiDMGXftWGmx0Fg6bfPJDfJ_WPE";
    req = req.replace(' ','+');
    console.log(req);
    request(req, function(error, response, body){
        if (error) {
            console.log("Something went wrong!");
            console.log(error);
        }
        else {
            if (response.statusCode == 200){
                res.send(body);
            }
        }
    });
});
app.get("/nearby",function (req,res) {
   res.setHeader("Access-Control-Allow-Origin", "*");
   var re= "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+req.query.lat
       +","+req.query.lng+"&radius="+req.query.radius+"&type="+req.query.type+"&keyword="+req.query.keyword+"&key=AIzaSyB5HpnNpiDMGXftWGmx0Fg6bfPJDfJ_WPE";
   console.log(re);
    request(re, function(error, response, body){
        if (error) {
            console.log("Something went wrong!");
            console.log(error);
        }
        else {
            if (response.statusCode == 200){
                res.send(body);
            }
        }
    });
});
app.get("/next_token", function(req,res){
    res.setHeader("Access-Control-Allow-Origin", "*");
    var re ="https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=" + req.query.token;
        re+="&key=AIzaSyB5HpnNpiDMGXftWGmx0Fg6bfPJDfJ_WPE";
        console.log(re);
        request(re, function(error, response, body){
            if (error) {
                console.log("Something went wrong!");
                console.log(error);
            }
            else {
                if (response.statusCode == 200){
                    res.send(body);
                }
            }
        });
});
app.get("/placeId", function(req,res){
    res.setHeader("Access-Control-Allow-Origin", "*");
    var re ="https://maps.googleapis.com/maps/api/place/details/json?placeid=" + req.query.placeId;
    re+="&key=AIzaSyB5HpnNpiDMGXftWGmx0Fg6bfPJDfJ_WPE";
    console.log(re);
    request(re, function(error, response, body){
        if (error) {
            console.log("Something went wrong!");
            console.log(error);
        }
        else {
            if (response.statusCode == 200){
                res.send(body);
            }
        }
    });
});
app.get("/yelp", function(req,res){
    res.setHeader("Access-Control-Allow-Origin", "*");
    client.businessMatch('best', {
        name: req.query.name,
        address1: req.query.address1,
        city: req.query.city,
        state: req.query.state,
        country: 'US'
    }).then(function (data) {
        console.log(data);
        res.send(data.jsonBody);
    }).catch(function(err){
        console.error(err);
        return;
    });
});

app.get("/yelpReview", function (req,res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    client.reviews(req.query.Id).then(function (data) {
        console.log(data.jsonBody);
        res.send(data.jsonBody);
    }).catch(function(err){
        console.error(err);
        return;
    });
});

app.listen(4201, process.env.IP, function(){
    console.log("Now serving your app!");
});