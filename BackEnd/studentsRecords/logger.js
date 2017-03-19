/**
 * Created by Abdelkader on 2015-03-18.
 */
module.exports = function(request, response, next) {
    let start = +new Date();
    let url = request.url;
    let method = request.method;

    response.on('finish', function() {
        let duration = +new Date() - start;
        let message = method + ' to ' + url + '\ntook ' + duration + ' ms \n';
        console.log (message);
    });
    next();
};
