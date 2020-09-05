
export async function getData(endpoint: string) {

    try {
        const response = await fetch(endpoint)
        const jsonResponse = await response.json()

        console.log('api get response', jsonResponse)
        return jsonResponse

    } catch (error) {
        console.error('api returned error for GET request', error)
        return null
    }

}

export async function postData(endpoint: string, data: object) {
    try {
        const response = await fetch(endpoint, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        const jsonResponse = await response.json()

        console.log('api post response', jsonResponse)

        return jsonResponse
    } catch (error) {
        console.error('api returned error for POST request', error)
        return null
    }

}