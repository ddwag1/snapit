const phantom = require('phantom');
const moment = require('moment');

let snapIt = function(website, platform, url, name, cookies) {

    return new Promise(function(resolve, reject) {

        const today = moment().format('YYYY-MM-DD'); // format = 2016-04-20
        const hour = moment().format('HH-hA'); // format = 12PM
        
        let height;
        let width;

        let phantomInstance;
        let page;

        const createPage = function(phantomInstanceX) {
            phantomInstance = phantomInstanceX; // TODO get rid of the side effect.
            return phantomInstance.createPage();
        };

        const setCookiesAndOpen = function(pageX) {
            page = pageX; // TODO get rid of the side effect.
            cookies.map(cookie => {
                pageX.addCookie(cookie);
            });
            return pageX.open(url);
        };

        const kitchenSink = function(status) {
            

            if (platform === 'desktop'){
                console.log('   This is a desktop URL.');
                width = 1300;
                height = 1000;
                
                page.property("viewportSize", {width: width, height: height});
            }
            if (platform === 'mobile'){
                console.log('   This is a mobile URL.');
                width = 375;
                height = 667;
            
                page.property("viewportSize", {width: width, height: height});

            }

            // **if the website has no default backgroundColor, make it white.**
            // console.log("the bg colour is " + document.body.style.backgroundColor);
            // if (!document.body.style.backgroundColor){
            //     console.log("No set background colour, forcing white.")
            //     document.body.style.backgroundColor = "white";
            // }
            
            console.log("\n" + name + "\n");
            
            if (!name == ''){
                name = '-' + name;
            }

            // taking screenshot for abovefold
            page.property("clipRect", {top: 0, left: 0, width: width, height: height});
            
            page.render('public/screenshots/' + website + '/' + today + '/' + hour +'/' + platform + '/' + website + name + '-' + platform + '-' + hour + '-abovefold.png');
            
            console.log('   Finished ' + platform + ' abovefold for ' + website);

            // taking screenshot for fullpage
            page.property("clipRect", {top: 0, left: 0, width: 0, height: 0});
            page.render('public/screenshots/' + website + '/' + today + '/' + hour + '/' + platform + '/' + website + name + '-' + platform + '-' + hour + '-full.png');
            
            console.log('   Finished ' + platform + ' fullpage for ' + website);

            // example: /websitename/2016-04-20/1300-1PM/mdot/websitename-mdot-1300-1PM-abovefold.png
            // example: /websitename/2016-11-25/0700-7AM/desktop/websitename-desktop-0700-7AM-fullscreen.png
            console.log('\nCOMPLETED Screenshots for ' + website + ' - ' + platform + '.\n ');
        }

        const completed = function(){
            console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n');
            phantomInstance.exit();
            resolve('Done ' + website + ' ' + name);
        }

        const error = function(){
            phantomInstance.exit();
            reject(error);
        }

        phantom.create()
            .then( createPage )
            .then( setCookiesAndOpen )
            .then( kitchenSink )
            .then( completed )
        .catch( error );
    });
};

module.exports = {
    send: snapIt
}
