// api/keep-alive.js
export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            // Supabase 프로젝트 URL (루트 REST 엔드포인트)에 요청을 보내 상태 유지
            // Vercel 환경변수에서 URL과 Key를 가져옵니다.
            const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
            const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

            if (!url || !key) {
                console.error('Supabase URL or Key is missing.');
                return res.status(500).json({ status: 'error', message: 'Missing environment variables.' });
            }

            const response = await fetch(`${url}/rest/v1/`, {
                method: 'GET',
                headers: {
                    apikey: key,
                    Authorization: `Bearer ${key}`
                }
            });

            if (response.ok) {
                console.log('Supabase keep-alive ping successful.');
                return res.status(200).json({ status: 'success', message: 'Supabase pinged successfully!' });
            } else {
                console.error(`Failed to ping Supabase: ${response.status} ${response.statusText}`);
                return res.status(response.status).json({ status: 'error', message: 'Failed to ping Supabase' });
            }
        } catch (error) {
            console.error('Error pinging Supabase:', error);
            return res.status(500).json({ status: 'error', message: 'Internal server error while pinging.' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
