export const tagPresets = [
    {
        label: "감성 가득, 별빛 글램핑",
        filters: {
            featureList: ["NIGHT_VIEW_SPOT"],
            campgroundTypes: ["GLAMPING"],
        }
    },
    {
        label: "여름방학, 아이들과 함께",
        filters: {
            // featureList: ["KIDS_ALLOWED", "WATER_ACTIVITIES", "PRIVATE_SHOWER", "WIFI", "CONVENIENCE_STORE"],
            featureList: ["KIDS_ALLOWED", "WATER_ACTIVITIES", "PRIVATE_SHOWER"], // 조건 완화
        }
    },
    {
        label: "댕댕이와 여름 휴가",
        filters: {
            featureList: ["PET_ALLOWED", "WATER_ACTIVITIES"],
        }
    },
    {
        label: "오션뷰 감성 차박",
        filters: {
            featureList: ["SEA", "CAMPFIRE_ALLOWED"],
            campgroundTypes: ["AUTO"],
        }
    },
    {
        label: "도심 속 가벼운 감성 캠프닉",
        filters: {
            featureList: ["CITY_VIEW", "PUBLIC_BBQ"],
            campgroundTypes: ["GLAMPING"],
        }
    },

];