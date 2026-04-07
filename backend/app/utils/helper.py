def format_response(data, message="success"):
    return {
        "status": "success",
        "message": message,
        "data": data
    }