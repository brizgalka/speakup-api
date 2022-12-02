class ApiError  {

    status: number;
    response: string;

    constructor(status: number, response: string) {
        this.status = status
        this.response = response
    }

    static badRequest(message: string) {
        return new ApiError(404, message)
    }

    static internal(message: string) {
        return new ApiError(500, message)
    }

    static forbidden(message: string) {
        return new ApiError(403, message)
    }
}

export default ApiError