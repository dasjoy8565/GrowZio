export default async function handler(req, res) {
    // শুধু GET রিকোয়েস্ট অ্যালাউ করা হবে
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // ========================================================
    // ⚙️ আপনার সুরক্ষিত এপিআই তথ্য
    // ========================================================
    const MAIN_PANEL_API_URL = "https://opsfollow.com/api/v2"; 
    const MAIN_PANEL_API_KEY = "4064b0fe1de5ba250a1ac632a008955f"; 
    // ========================================================

    try {
        const apiData = new URLSearchParams();
        apiData.append("key", MAIN_PANEL_API_KEY);
        apiData.append("action", "services"); // মেইন প্যানেল থেকে সব সার্ভিসের লিস্ট চাওয়া হচ্ছে

        const apiResponse = await fetch(MAIN_PANEL_API_URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: apiData
        });

        if (!apiResponse.ok) {
            return res.status(500).json({ error: 'Failed to fetch from OpsFollow' });
        }

        const servicesList = await apiResponse.json();
        return res.status(200).json(servicesList);

    } catch (error) {
        console.error("Fetch services error:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
