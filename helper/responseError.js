module.exports = function (message) {
    let response = {
        "meta": {
            "code": 400,
            "message": message,
            "success": 0
        }
    }
    return response
}