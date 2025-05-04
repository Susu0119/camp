import { Menu, MapPin, Calendar, Users, ChevronRight, Star, X, Phone } from "lucide-react"
import { Link } from 'react-router-dom'
import { Button } from "./Button"
import { Card, CardContent } from "./card"
import { Sheet, SheetContent, SheetTrigger } from "./Sheet"
import { Badge } from "./Badge"

export default function CampingServicePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <span className="no-image w-10 h-10">
            </span>
            <span className="text-xl font-bold text-blue-700">캠핑고</span>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden border-green-700 text-green-700">
                <Menu className="w-6 h-6" />
                <span className="sr-only">메뉴 열기</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link to="#" className="text-lg font-medium hover:text-green-700 transition-colors">
                  홈
                </Link>
                <Link to="#" className="text-lg font-medium hover:text-green-700 transition-colors">
                  캠핑장 찾기
                </Link>
                <Link to="#" className="text-lg font-medium hover:text-green-700 transition-colors">
                  예약하기
                </Link>
                <Link to="#" className="text-lg font-medium hover:text-green-700 transition-colors">
                  캠핑 용품
                </Link>
                <Link to="#" className="text-lg font-medium hover:text-green-700 transition-colors">
                  커뮤니티
                </Link>
                <Link to="#" className="text-lg font-medium hover:text-green-700 transition-colors">
                  고객센터
                </Link>
              </nav>
              <div className="flex flex-col gap-2 mt-8">
                <Button className="w-full bg-green-700 hover:bg-green-800">로그인</Button>
                <Button variant="outline" className="w-full">
                  회원가입
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="#" className="text-sm font-medium hover:text-green-700 transition-colors">
              홈
            </Link>
            <Link to="#" className="text-sm font-medium hover:text-green-700 transition-colors">
              캠핑장 찾기
            </Link>
            <Link to="#" className="text-sm font-medium hover:text-green-700 transition-colors">
              예약하기
            </Link>
            <Link to="#" className="text-sm font-medium hover:text-green-700 transition-colors">
              캠핑 용품
            </Link>
            <Button className="bg-green-700 hover:bg-green-800">로그인</Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* 히어로 섹션 */}
        <section className="relative">
          <div className="relative h-[70vh] max-h-[500px]">
            <div className="no-image absolute inset-0 w-full h-full aspect-auto" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                자연 속에서 특별한 <br className="md:hidden" /> 캠핑 경험을 만나보세요
              </h1>
              <p className="text-white text-lg mb-6 max-w-md">전국 최고의 캠핑장을 한 곳에서 찾고 예약하세요</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="bg-green-700 hover:bg-green-800 text-white px-6">캠핑장 찾기</Button>
                <Button variant="outline" className="bg-white/90 hover:bg-white text-green-800 border-green-700 px-6">
                  예약 확인
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 검색 섹션 */}
        <section className="py-6 px-4">
          <div className="container mx-auto">
            <Card className="shadow-lg -mt-10 relative z-10 border-none">
              <CardContent className="p-4 sm:p-6">
                <div className="grid gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-green-700" />
                    <input
                      type="text"
                      placeholder="어디로 떠나고 싶으신가요?"
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 border rounded-md p-2">
                      <Calendar className="w-5 h-5 text-green-700 flex-shrink-0" />
                      <div className="text-sm">
                        <div className="font-medium">체크인</div>
                        <div className="text-muted-foreground">5월 3일</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 border rounded-md p-2">
                      <Calendar className="w-5 h-5 text-green-700 flex-shrink-0" />
                      <div className="text-sm">
                        <div className="font-medium">체크아웃</div>
                        <div className="text-muted-foreground">5월 5일</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 border rounded-md p-2">
                    <Users className="w-5 h-5 text-green-700" />
                    <div className="text-sm">
                      <div className="font-medium">인원</div>
                      <div className="text-muted-foreground">성인 2명, 아동 0명</div>
                    </div>
                  </div>

                  <Button className="w-full bg-green-700 hover:bg-green-800">검색하기</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 추천 캠핑장 섹션 */}
        <section className="py-8 px-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">인기 캠핑장</h2>
              <Link to="#" className="text-green-700 text-sm font-medium flex items-center">
                더보기 <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid gap-6">
              {[1, 2, 3].map((item) => (
                <Card key={item} className="overflow-hidden border-none shadow-md">
                  <div className="relative h-48">
                    <img
                      src={`/placeholder.svg?height=200&width=400&text=캠핑장${item}`}
                      alt={`추천 캠핑장 ${item}`}
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-green-700">추천</Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg">숲속의 아침 캠핑장</h3>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium ml-1">4.8</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm mb-2 flex items-center">
                      <MapPin className="w-4 h-4 mr-1 inline" /> 강원도 홍천군
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      <Badge variant="outline" className="text-xs bg-green-50">
                        계곡
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-green-50">
                        산림
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-green-50">
                        반려동물
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div>
                        <span className="text-lg font-bold text-green-700">55,000원</span>
                        <span className="text-sm text-muted-foreground">/박</span>
                      </div>
                      <Button size="sm" className="bg-green-700 hover:bg-green-800">
                        예약하기
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 카테고리 섹션 */}
        <section className="py-8 px-4 bg-green-50">
          <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-6">캠핑 스타일</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { name: "글램핑", icon: "🏕️" },
                { name: "오토캠핑", icon: "🚗" },
                { name: "카라반", icon: "🚐" },
                { name: "펜션", icon: "🏡" },
              ].map((category) => (
                <Card key={category.name} className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">{category.icon}</div>
                    <h3 className="font-medium">{category.name}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 이벤트 섹션 */}
        <section className="py-8 px-4">
          <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-6">특별 프로모션</h2>
            <div className="relative overflow-hidden rounded-lg h-48 sm:h-64">
              <img
                src="/placeholder.svg?height=300&width=800&text=주말+특가+이벤트"
                alt="주말 특가 이벤트"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex flex-col justify-center p-6">
                <Badge className="bg-red-600 mb-2 w-fit">한정 특가</Badge>
                <h3 className="text-white text-xl sm:text-2xl font-bold mb-2">주말 특별 할인 이벤트</h3>
                <p className="text-white mb-4">이번 주말, 인기 캠핑장 최대 30% 할인</p>
                <Button className="w-fit bg-white text-green-800 hover:bg-white/90">자세히 보기</Button>
              </div>
            </div>
          </div>
        </section>

        {/* 앱 다운로드 섹션 */}
        <section className="py-8 px-4 bg-green-700 text-white">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold mb-2">캠핑고 앱 다운로드</h2>
                <p className="mb-4">더 편리한 캠핑 예약과 정보를 앱에서 만나보세요</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-green-700">
                    App Store
                  </Button>
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-green-700">
                    Google Play
                  </Button>
                </div>
              </div>
              <div className="relative w-48 h-96">
                <img
                  src="/placeholder.svg?height=400&width=200&text=앱+화면"
                  alt="캠핑고 앱 화면"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 리뷰 섹션 */}
        <section className="py-8 px-4">
          <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-6">고객 리뷰</h2>
            <div className="grid gap-6">
              {[1, 2, 3].map((item) => (
                <Card key={item} className="border-none shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <span className="font-medium text-green-700">{String.fromCharCode(64 + item)}</span>
                      </div>
                      <div>
                        <div className="flex items-center mb-1">
                          <div className="font-medium mr-2">캠핑러버</div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">숲속의 아침 캠핑장</p>
                        <p className="text-sm">
                          정말 좋은 캠핑장이었어요! 시설도 깨끗하고 주변 경관도 아름다웠습니다. 직원분들도 친절하셔서
                          더욱 즐거운 시간을 보냈습니다.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-6">
              <Button variant="outline" className="border-green-700 text-green-700">
                리뷰 더보기
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* 푸터 */}
      <footer className="bg-gray-100 py-8 px-4">
        <div className="container mx-auto">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img
                  src="/placeholder.svg?height=40&width=40"
                  width={40}
                  height={40}
                  alt="캠핑고"
                  className="w-10 h-10"
                />
                <span className="text-xl font-bold text-green-700">캠핑고</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                자연 속에서 특별한 캠핑 경험을 제공하는 캠핑고입니다.
              </p>
              <div className="flex gap-4">
                <Link to="#" className="text-muted-foreground hover:text-green-700">
                  <span className="sr-only">Facebook</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </Link>
                <Link to="#" className="text-muted-foreground hover:text-green-700">
                  <span className="sr-only">Instagram</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                  </svg>
                </Link>
                <Link to="#" className="text-muted-foreground hover:text-green-700">
                  <span className="sr-only">Twitter</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4">서비스</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="#" className="text-sm text-muted-foreground hover:text-green-700">
                    캠핑장 찾기
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-sm text-muted-foreground hover:text-green-700">
                    예약하기
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-sm text-muted-foreground hover:text-green-700">
                    캠핑 용품
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-sm text-muted-foreground hover:text-green-700">
                    캠핑 팁
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">회사 정보</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="#" className="text-sm text-muted-foreground hover:text-green-700">
                    회사 소개
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-sm text-muted-foreground hover:text-green-700">
                    이용약관
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-sm text-muted-foreground hover:text-green-700">
                    개인정보처리방침
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-sm text-muted-foreground hover:text-green-700">
                    자주 묻는 질문
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">고객센터</h3>
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4 text-green-700" />
                <span className="text-sm">1544-0000</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                평일 09:00 - 18:00
                <br />
                (점심시간 12:00 - 13:00)
              </p>
              <Button variant="outline" className="w-full border-green-700 text-green-700">
                문의하기
              </Button>
            </div>
          </div>

          <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} 캠핑고. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* 모바일 하단 네비게이션 */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-20">
        <div className="grid grid-cols-5 h-16">
          {[
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              ),
              label: "홈",
            },
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              ),
              label: "검색",
            },
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                  <line x1="16" x2="16" y1="2" y2="6"></line>
                  <line x1="8" x2="8" y1="2" y2="6"></line>
                  <line x1="3" x2="21" y1="10" y2="10"></line>
                  <path d="M8 14h.01"></path>
                  <path d="M12 14h.01"></path>
                  <path d="M16 14h.01"></path>
                  <path d="M8 18h.01"></path>
                  <path d="M12 18h.01"></path>
                  <path d="M16 18h.01"></path>
                </svg>
              ),
              label: "예약",
            },
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              ),
              label: "커뮤니티",
            },
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              ),
              label: "마이페이지",
            },
          ].map((item, index) => (
            <Link
              key={index}
              href="#"
              className="flex flex-col items-center justify-center text-muted-foreground hover:text-green-700 active:text-green-700 py-2"
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 쿠키 동의 배너 */}
      <div className="fixed bottom-20 md:bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg border z-10 hidden">
        <div className="flex items-start gap-3">
          <X className="w-5 h-5 cursor-pointer flex-shrink-0" />
          <div>
            <p className="text-sm mb-3 ">
              당사는 웹사이트에서 최상의 경험을 제공하기 위해 쿠키를 사용합니다. 계속 사용하시면 쿠키 사용에 동의하는
              것으로 간주됩니다.
            </p>
            <div className="flex gap-2">
              <Button size="sm" className="bg-green-700 hover:bg-green-800">
                동의
              </Button>
              <Button size="sm" variant="outline">
                거부
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
