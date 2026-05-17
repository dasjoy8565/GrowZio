export default async function handler(req, res) {
    // শুধু POST রিকোয়েস্ট অ্যালাউ করা হবে
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // ========================================================
    // ⚙️ আপনার আসল সিক্রেট এপিআই তথ্য এখানে বসাবেন (সম্পূর্ণ নিরাপদ)
    // ========================================================
    const MAIN_PANEL_API_URL = "https://মেইন_প্যানেল_ইউআরএল/api/v2"; 
    const MAIN_PANEL_API_KEY = "YOUR_SECRET_API_KEY_HERE"; 
    // ========================================================

    try {
        const { service, link, quantity } = req.body;

        if (!service || !link || !quantity) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        // মেইন প্যানেলের জন্য ডাটা রেডি করা (SMM API Standard Format)
        const apiData = new URLSearchParams();
        apiData.append("key", MAIN_PANEL_API_KEY);
        apiData.append("action", "add");
        apiData.append("service", service);
        apiData.append("link", link);
        apiData.append("quantity", quantity.toString());

        // মেইন প্যানেলে রিকোয়েস্ট পাঠানো
        const apiResponse = await fetch(MAIN_PANEL_API_URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: apiData
        });

        const result = await apiResponse.json();

        // মেইন প্যানেল থেকে সফল রেসপন্স আসলে
        if (result && (result.order || result.success)) {
            return res.status(200).json({ 
                success: true, 
                orderId: result.order || 'Success' 
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
