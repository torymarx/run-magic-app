import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDistance() {
    const { data: userData, error: err1 } = await supabase
        .from('records')
        .select('*')
        .eq('user_id', '70d740fe-0157-41eb-b7c1-4ade45976293');

    if (err1) {
        console.error('Error fetching all records:', err1);
        return;
    }

    const offset = new Date().getTimezoneOffset() * 60000;
    const anchorDateStr = new Date(new Date().getTime() - offset).toISOString().split('T')[0];

    // BioPerformanceChart Logic
    const bioDist = userData
        .filter(r => r.date >= '2026-01-01' && r.date <= anchorDateStr)
        .reduce((acc, curr) => acc + (parseFloat(curr.distance?.toString() || "0")), 0);

    // Coach Report Logic
    const coachDist = userData.reduce((sum, r) => sum + (r.distance || 0), 0);

    console.log(`Anchor Date Str: ${anchorDateStr}`);
    console.log(`BioPerformanceChart Total: ${bioDist}`);
    console.log(`Coach Report Total: ${coachDist}`);
}

checkDistance();
