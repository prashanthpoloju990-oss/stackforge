import { supabase } from "./supabase";

export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<boolean> {
  try {
    const now = new Date();
    
    // Prune expired rate limits asynchronously in the background to prevent DB bloat
    supabase
      .from("RateLimit")
      .delete()
      .lt("resetTime", now.toISOString())
      .then(({ error }) => {
        if (error) {
          console.error("[RATE-LIMIT] Failed to prune expired entries:", error);
        }
      });

    // Fetch the rate limit record for the given key
    const { data: record, error } = await supabase
      .from("RateLimit")
      .select("*")
      .eq("key", key)
      .maybeSingle();

    if (error) {
      console.error("[RATE-LIMIT] Supabase fetch error:", error);
      // In case of DB error, fail-open to not block legitimate users
      return true;
    }

    if (!record) {
      // Key does not exist, create it
      const resetTime = new Date(Date.now() + windowMs);
      const { error: insertErr } = await supabase
        .from("RateLimit")
        .insert([
          {
            key,
            count: 1,
            resetTime: resetTime.toISOString(),
          },
        ]);

      if (insertErr) {
        console.error("[RATE-LIMIT] Supabase insert error:", insertErr);
      }
      return true;
    }

    const resetTime = new Date(record.resetTime);

    if (now > resetTime) {
      // Window expired, reset count and set new resetTime
      const newResetTime = new Date(Date.now() + windowMs);
      const { error: updateErr } = await supabase
        .from("RateLimit")
        .update({
          count: 1,
          resetTime: newResetTime.toISOString(),
        })
        .eq("key", key);

      if (updateErr) {
        console.error("[RATE-LIMIT] Supabase update error:", updateErr);
      }
      return true;
    }

    if (record.count >= limit) {
      // Limit exceeded
      return false;
    }

    // Increment count within the active window
    const { error: incrementErr } = await supabase
      .from("RateLimit")
      .update({
        count: record.count + 1,
      })
      .eq("key", key);

    if (incrementErr) {
      console.error("[RATE-LIMIT] Supabase increment error:", incrementErr);
    }
    return true;
  } catch (err) {
    console.error("[RATE-LIMIT] Unexpected error:", err);
    return true; // Fail-open
  }
}
