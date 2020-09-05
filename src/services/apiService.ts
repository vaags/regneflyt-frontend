
export async function getData(endpoint: string) {
    const response = await fetch(endpoint)
    const jsonResponse = await response.json()

    console.log('api get response', jsonResponse)

    return jsonResponse
}

export async function postData(endpoint: string, data: object) {
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
}