module.exports = function (message, data) {
    let response = {
        "meta": {
            "code": 200,
            "message": message,
            "success": 1
        },
        "response": {
            data
        }
    }
    return response
}