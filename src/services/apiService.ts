
export async function getData(endpoint: string) {
    try {
        const response = await fetch(endpoint)

        if (response.ok) {
            const jsonResponse = await response.json()
            console.log('api get response', jsonResponse)
            return jsonResponse

        } else {
            console.error('api returned error for GET request')
            return null
        }
    } catch (error) {
        console.error(error)
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

        if (response.ok) {
            const jsonResponse = await response.json()

            console.log('api post response', jsonResponse)

            return jsonResponse

        } else {
            console.error('api returned error for POST request')
        }
    } catch (error) {
        console.error(error)
        return null
    }
}