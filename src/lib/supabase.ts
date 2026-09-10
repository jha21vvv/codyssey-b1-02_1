import { createClient } from "@supabase/supabase-js";
//데이터가 저장된 서버의 고유 주소와 키를 들고와서. Row Level Security(RLS) 정책에 의존하는 BaaS 특유의 보안 모델을 따릅니다.

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
// 연결을 만드는 것
// 싱글톤(Singleton) 인스턴스 공유: **createClient**를 통해 초기화된 단일 supabase 객체는 애플리케이션 전역에서 공유됩니다. 
// 이는 불필요한 인스턴스 생성을 방지하여 리소스를 최적화하고, 모든 데이터 스트림이 단일 통로를 거치게 함으로써 유지보수 일관성을 보장
// 쉽게 설명하면 사무실 복도 한가운데에 딱 한 대의 최고급 복합기(createClient로 만든 supabase 객체)만 설치해 둡니다. 홈 페이지든, 목록 페이지든, 등록 폼이든 데이터를 주고받아야 할 때는 누구나 그 한 대의 복합기에 줄을 서서 같이 공유해서 사용합니다.
//접속 통로를 딱 1개만 만들어 두니 컴퓨터 메모리나 네트워크 연결을 낭비하지 않고 가볍게 작동. 모든 페이지를 일일이 수정할 필요 없이 그 단 하나의 supabase 설정 파일만 고치면 회사 전체가 한 번에 적용됩니다. 또한 로그인 세션이나 연결 상태도 하나의 통로로 공유되므로 꼬이지 않습니다
export const supabase = createClient(supabaseUrl, supabaseAnonKey);