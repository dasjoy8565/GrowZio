export default async function handler(req, res) {
    // শুধু POST রিকোয়েস্ট অ্যালাউ করা হবে
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // ========================================================
    // ⚙️ আপনার আসল সিক্রেট এপিআই তথ্য (সম্পূর্ণ নিরাপদ)
    // ========================================================
    const MAIN_PANEL_API_URL = "https://opsfollow.com/api/v2"; 
    const MAIN_PANEL_API_KEY = "4064b0fe1de5ba250a1ac632a008955f"; 
    // ========================================================

    try {
        const { service, link, quantity } = req.body;

        if (!service || !link || !quantity) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        // SMM API Standard Format অনুযায়ী ডাটা রেডি করা
        const apiData = new URLSearchParams();
        apiData.append("key", MAIN_PANEL_API_KEY);
        apiData.append("action", "add");
        apiData.append("service", service);
        apiData.append("link", link);
        apiData.append("quantity", quantity.toString());

        // OpsFollow মেইন প্যানেলে রিকোয়েস্ট পাঠানো
        const apiResponse = await fetch(MAIN_PANEL_API_URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: apiData
        });

        const result = await apiResponse.json();

        // মেইন প্যানেল থেকে সফল অর্ডার আইডি আসলে
        if (result && result.order) {
            return res.status(200).json({ 
                success: true, 
                orderId: result.order 
            });
        } else {
            return res.status(400).json({ 
                success: false, 
                error: result.error || 'Main panel rejected the order' 
            });
        }

    } catch (error) {
        console.error("Backend server error:", error);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}
