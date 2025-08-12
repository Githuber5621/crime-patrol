import fetch from "node-fetch";
import sql from "../../../lib/supabase.js"; // pooler connection for extra queries if needed

// LOGIN CONTROLLER (already discussed)
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const authRes = await fetch(`${process.env.SUPABASE_URL}/auth/v1/token?grant_type=password`, {
            method: "POST",
            headers: {
                "apikey": process.env.SUPABASE_ANON_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const authData = await authRes.json();

        if (!authRes.ok) {
            return res.status(401).json({ error: authData.error_description || "Invalid credentials" });
        }

        // Optional: fetch extra info from Postgres
        const [profile] = await sql`
            SELECT id, email, raw_user_meta_data
            FROM auth.users
            WHERE email = ${email}
            LIMIT 1
        `;

        res.status(200).json({
            success: true,
            user: profile,
            session: authData,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// REGISTER CONTROLLER
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, email, and password are required" });
    }

    try {
        const signupRes = await fetch(`${process.env.SUPABASE_URL}/auth/v1/signup`, {
            method: "POST",
            headers: {
                "apikey": process.env.SUPABASE_ANON_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
                data: { name }, // stored in user metadata
            }),
        });

        const signupData = await signupRes.json();

        if (!signupRes.ok) {
            return res.status(400).json({
                error: signupData.msg || signupData.error_description || "Registration failed",
            });
        }

        res.status(201).json({
            success: true,
            user: signupData.user,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
