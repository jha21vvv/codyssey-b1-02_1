import { createClient } from "@supabase/supabase-js";
//데이터가 저장된 서버의 고유 주소와 키를 들고와서
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
// 연결을 만드는 것
export const supabase = createClient(supabaseUrl, supabaseAnonKey);