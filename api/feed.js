import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const filePath = path.join(process.cwd(), 'data', 'feed.json'); // adjust as needed
    const rawData = fs.readFileSync(filePath);
    const items = JSON.parse(rawData);

    if (req.method === 'GET') {
        const page = parseInt(req.query.page || '1', 10);
        const size = parseInt(req.query.size || '5', 10);
        const start = (page - 1) * size;
        const paginatedItems = items.slice(start, start + size);

        res.status(200).json({
            items: paginatedItems,
            total: items.length
        });
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
