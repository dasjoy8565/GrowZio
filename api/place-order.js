export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { serviceId, link, quantity } = req.body;

        // Apnar main SMM panel-er API URL abong Key ekhane boshaben
        const MAIN_SMM_API_URL = 'https://opsfollow.com/api/v2'; 
        const MAIN_SMM_API_KEY = '4064b0fe1de5ba250a1ac632a008955f'; 

        const params = new URLSearchParams();
        params.append('key', MAIN_SMM_API_KEY);
        params.append('action', 'add');
        params.append('service', serviceId);
        params.append('link', link);
        params.append('quantity', quantity);

        const apiResponse = await fetch(MAIN_SMM_API_URL, {
            method: 'POST',
            body: params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const data = await apiResponse.json();

        if (data.order) {
            return res.status(200).json({ success: true, orderId: data.order });
        } else {
            return res.status(400).json({ success: false, error: data.error || 'Failed to place order' });
        }

    } catch (error) {
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}
