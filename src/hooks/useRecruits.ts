import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useRecruits() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecruits = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data: recruits, error: fetchErr } = await supabase
        .from("recruits")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchErr) throw fetchErr;
      setData(recruits || []);
    } catch (err) {
      setError(err.message || "데이터를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruits();
  }, []);

  return { data, loading, error, refetch: fetchRecruits };
}