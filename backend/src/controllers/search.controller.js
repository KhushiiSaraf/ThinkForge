async function searchController(req, res) {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ message: 'Query is required' });
    }

    try {
        const response = await fetch('https://google.serper.dev/search', {
            method: 'POST',
            headers: {
                'X-API-KEY': process.env.SERPER_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ q: query, num: 5 })
        })

        const data = await response.json()

        if (!data.organic) {
            return res.status(200).json({ results: [] })
        }

        const results = data.organic.map(item => ({
            title: item.title,
            snippet: item.snippet,
            link: item.link,
            source: new URL(item.link).hostname.replace('www.', '')
        }))

        res.status(200).json({ results })
    } catch (error) {
        console.error('Error in searchController:', error);
        res.status(500).json({ message: 'Search failed' });
    }
}

module.exports = { searchController };